<template>
	<view class="content">
		<view class="card" style='background-color:white;'>
			<view class="d1" style='display:flex; justify-content:center;'>
				<image class="avator" :src="info.signPhoto? info.signPhoto : '/static/missing-face.png'"  @click="upload"></image>
			</view>
		</view>
		<view class="row b-b">
			<text class="tit">用户名</text>
			<input class="input" type="text" v-model="info.name"  placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="info.telPhone"  placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">个性签名</text>
			<input class="input" type="text" v-model="info.signature"  placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">性别</text>
			<picker  class="input"  @change="classChange" :value="index"   :range="array" range-key="index">
				{{info.sex}}
			</picker>
<!--			<input class="input" type="text" v-model="info.sex"  placeholder-class="placeholder" />-->
		</view>
		<button class="add-btn" @click="doSubmit(1)">保存</button>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	import {pathToBase64, base64ToPath} from 'image-tools'
	export default {
		data() {
			return {
				info: {},
				array: ['女', '男'],
				index: 1,
				base64Img: '',
				isBack: false

			}
		},
		onLoad(){
			this.getUserInfo()
		},
		methods: {
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
				// if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(info.telPhone))){
				// 	utils.showToast("请输入正确的手机号码")
				// 	return;
				// }
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
			classChange: function (e) {
				var index = e.target.value
				this.info.sex = this.array[index]
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

		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;

		.tit{
			flex-shrink: 0;
			width: 180upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			text-align: right;
			color: $font-color-dark;
		}
		text.input {
			color: #999;
		}
		text.active {
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: #dd5b50;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
	.card{
		padding: 30upx 20upx 0;
		height: 150upx;
		-webkit-background-size: 100% auto;
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-color: #fff;

	}
	.card .d1 {
		overflow: hidden;
	}
	.card .d1 .avator {
		float: left;
		display: block;
		width: 120upx;
		height: 120upx;
		border-radius: 50%;

	}

</style>
