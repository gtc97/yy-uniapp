<template>
	<view class="container">
		<view class="listView">
			<view class="cell" @click="upload">
				<view class="name">
					头像
				</view>
				<image class="header" :src="info.signPhoto? info.signPhoto : '/static/me/icon_head.png'"   ></image>
			</view>
			<view class="cell">
				<view class="name">姓名</view>
				<input type="text"  v-model="info.name" />
			</view>
		</view>
		<view class="listView">
<!--			<view class="cell">-->
<!--				<view class="name">所属店铺</view>-->
<!--				<view class=" iconfont">&#xe743;</view>-->
<!--			</view>-->
<!--			<view class="cell">-->
<!--				<view class="name">职务</view>-->
<!--				<view class="radioView">-->
<!--					<label class="radio" @click="touchRadio(0)"><radio class="from-radio" value="r1" :checked="radioIndex == 0" />店长</label>-->
<!--					<label class="radio" @click="touchRadio(1)"><radio class="from-radio" value="r2" :checked="radioIndex == 1" />店员</label>-->
<!--				</view>-->
<!--			</view>-->
			<view class="cell">
				<view class="name">手机号</view>
				<view class=" iconfont" @click="toUpdatePhone(info.telPhone)" ><text class="name">{{info.telPhone}}</text>&#xe743;</view>
			</view>
			<view class="cell" @click="toPassWordUpdate">
				<view class="name">修改密码</view>
				<view class=" iconfont" >&#xe743;</view>
			</view>
			<view class="cell" @click="toUserCancellation">
				<view class="name">注销账号</view>
				<view class=" iconfont" >&#xe743;</view>
			</view>
		</view>
		<view style='clear:both'>
			<button class="btn-confirm" @click="doSubmit(1)">
				提交
			</button>
		</view>
	</view>
</template>

<script>
	const utils = require('../../../common/utils')
	import {pathToBase64, base64ToPath} from 'image-tools'
	export default{
		data(){
			return{
				radioIndex:0,
				info: {},
				array: ['女', '男'],
				index: 1,
				base64Img: '',
				isBack: false
			}
		},
		onShow() {
			var that = this
			that.getUserInfo()
		},
		methods:{
			touchRadio:function(e){
				this.radioIndex = e
			},
			// 获取用户信息
			getUserInfo () {
				var that = this;
				var token = wx.getStorageSync("token");
				var params = {
					"token": token
				};
				this.$apis.sendRequest({
					url : "/action/user/info/get",
					data : params,
					success:function (result) {
						var successs = result.status == 1 ? true : false;
						if (successs) {
							var info = result.info
							that.info = info
							that.index = info.sex=== '男' ? 1 : 0
							uni.setStorageSync("userInfo", info)
							if (that.isBack) {
								uni.navigateBack()
							}
						}
					},
				});
			},

			//提交
			doSubmit(isBack){
				var that = this
				var token = wx.getStorageSync("token");
				let info = that.info;
				// if(!info.name){
				// 	utils.showToast("请填写用户名")
				// 	return;
				// }
				if(!(/^1\d{10}$/.test(info.telPhone))){
					utils.showToast("请输入正确的手机号码")
					return;
				}
				var params = {
					"token": token,
					"sex": info.sex,
					"name": info.name,
					"signature": info.signature,
					"telPhone": info.telPhone,
				};
				if(that.base64Img) {
					params.base64Img = that.base64Img
				}
				this.$apis.sendRequest({
					url : "/action/user/info/modify",
					data : params,
					success:function (result) {
						var successs = result.status == 1 ? true : false;
						if (successs) {
							that.base64Img = ''
							if (isBack===1) {
								that.isBack = true
								that.$api.msg('保存成功');
							}
							that.getUserInfo()
						}
					},
				});
				// // 调取上页面方法
				// this.$api.prePage().ziquAddress(data)
				// uni.navigateBack()
			},
			upload() {
				var that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						pathToBase64(res.tempFilePaths[0])
								.then(base64 => {
									that.base64Img = base64
									console.log(that.base64Img)
									that.doSubmit()
								})
								.catch(error => {
									console.error(error)
								})

					},
					error: function (e) {
						console.log(e);
					},

				});

			},
			toUpdatePhone(){
				uni.navigateTo({
					url:'./userPhone?info='+ JSON.stringify(this.info)
				})
			},
			toPassWordUpdate(){
				uni.navigateTo({
					url:'/pages/public/passWordUpdate?title=修改密码'
				})
			},
			toUserCancellation () {
				uni.navigateTo({
					url:'/pages/userCancellation/userCancellation'
				})
			}
		}
	}
</script>

<style type='text/less' lang="scss">
	@import 'modifyData.less';
</style>
