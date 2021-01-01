<template>
	<view class="container">
<!-- 		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="input-content">
				<view class="input-item">
					<input
						type="number"
						:value="mobile"
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="mobile"
						@input="inputChange"
					/>
				</view>
				<view class="input-item">
					<input
						type="mobile"
						:value="password"
						placeholder="请输入密码"
						placeholder-class="input-empty"
						maxlength="20"
						password
						data-key="password"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<view class="clearFlex forget-section">
				<text class="left" @click="toRegist">手机号快速注册</text>
				<text class="right" @click="toPassWordUpdate" >忘记密码？</text>
			</view>
		</view>
<!--		<view class="parties_login">-->
<!--			<view class="parties_thv">-->
<!--				<text>其他方式登录</text>-->
<!--			</view>-->
<!--			<view class="login_fs">-->
<!--				<image src="../../static/icon_wx.png" mode="widthFix"></image>-->
<!--				<view class="tt">微信</view>-->
<!--			</view>-->
<!--		</view>-->
	</view>
</template>

<script>
	import {
        mapMutations
    } from 'vuex';
	const utils = require('../../common/utils')
	export default{
		data(){
			return {
				mobile: '',
				password: '',
				logining: false
			}
		},
		onLoad(){
			this.getLocation()
			// var token = uni.getStorageSync("token")
			// if(utils.isNotNull(token)) {
			// 	// 获取关联信息
			// 	this.getShoperbInfo()
			// }
		},
		onShow() {
			if (utils.isNull(this.mobile)) {
				this.mobile = uni.getStorageSync("username")
			}
			if (utils.isNull(this.password)) {
				this.password = uni.getStorageSync("password")
			}
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			toLogin(){
				var that = this;
				that.logining = true;
				if (utils.isNull(this.mobile) || utils.isNull(this.password)) {
					utils.showToast("请补全注册信息~")
					return;
				}
				var params = {
				    "username": this.mobile,
					"password": this.password,
				};
				this.$apis.sendRequest({
					url : "/action/shopb/login/byPassword",
					// url : "/action/user/login/byPassword",
					data : params,
					success:function (result) {
						var successs = result.status === 1 ? true : false;
						if (successs) {
							var info = result.info;
							uni.setStorage({
								key: 'username',
								data: that.mobile
							})
							uni.setStorage({
								key: 'token',
								data: result.info.token,
							})
							uni.setStorage({
								key: 'userInfo',
								data: result.info,
							})
							uni.setStorage({
								key: 'password',
								data: that.password,
							})
							if(utils.isNotNull(info.shopBInfo)) {
								that.logining = false;
								if (info.shopBInfo.clerkVerifyState===10) {
									utils.showModal("店铺认证中,请等待")
								}else if (info.shopBInfo.clerkVerifyState===20) {
									utils.showToastSuccess("登录成功")
									// 跳转首页
									uni.switchTab({
										url: '/pages/index/index'
									})
								}else if (info.shopBInfo.clerkVerifyState===30) {
									that.showModal('未通过成为'+ info.shopBInfo.shopName +'下员工的申请' + '。  是否继续加入店铺?')
								}
							}else{
								setTimeout(() => {
									// 获取关联信息
									that.getShoperbInfo()
								}, 800)
							}

						}else{
							that.logining = false;
							utils.showToast(response.data.error);
						}
						// uni.navigateBack()
					},
					fail:function (data) {
						that.logining = false
					}
				})
			},

			// 获取最新的店铺B认证信息
			getShoperbInfo() {
				var that= this
				var token = uni.getStorageSync("token");
				var params = {
					"sysAppKey":that.$sysAppKey,
					"token": token,
				};
				this.$apis.sendRequest({
					url : "/action/shopb/verify/last/info",
					data : params,
					success:function (result) {
						var successs = result.status === 1 ? true : false;
						if (successs) {
							if(utils.isNull(result.info)){
								// 显示弹框
								that.showModal('请加入店铺')
							}else{
								let info = result.info
								if (info.status===10) {
									utils.showModal("店铺审核中,请等待")
								}else if (info.status===30) {
									that.showModal('新增药店:'+info.shopName+' 未通过申请,\r  原因:'+info.reason + '。  是否继续加入店铺?')
								}

							}
						} else {
							this.$toast(response.data.error);
						}
					},
					complete:function () {
						that.logining = false;
					}
				});
			},
			showModal(msg){
				var that = this
				// #ifdef APP-PLUS
				uni.$showModal({
					concent: msg
				}).then(res=>{
					// 跳转加入店铺
					that.toShopBView()
					//确认
				}).catch(res=>{
					//取消
					console.log(res);
				})
				// #endif
				// #ifndef APP-PLUS
				uni.showModal({
					title: '温馨提示',
					content: msg,
					confirmColor:'#04c1ab',
					success: function (res) {
						if (res.confirm) {
							// 跳转加入店铺
							that.toShopBView()
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				// #endif

			},
			getLocation: function () {
				var that = this
				var location = uni.getStorageSync("location")
				if (utils.isNull(location)){
					uni.getLocation({
						type: 'wgs84',
						success: function (res) {
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							that.loadCity(res.longitude,res.latitude)
						}
					});
				}
			},
			loadCity: function (lo1, la1) {
				// var myAmapFun = new amapFile.AMapWX({ key: "0a647d4c9f629bf95ec5b244afbc25b2" });
				// const key = "0a647d4c9f629bf95ec5b244afbc25b2"
				var that= this
				const key = that.$amapKey
				var locationInfo = {}
				var city = "济南", address = "请选择位置"
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo',
					data: {
						key: key,
						location: lo1 + "," + la1 ,
						extensions:"all",
						s:"rsx",
						sdkversion:"sdkversion",
						logversion:"logversion"

					},
					success: function (res) {
						var province = res.data.regeocode.addressComponent.province,
								city = res.data.regeocode.addressComponent.city,
								district = res.data.regeocode.addressComponent.district;
						if (city.length<1) {
							city = province
						}
						if (utils.isNotNull(province) && province.indexOf("省") == province.length - 1) {
							province = province.substring(0, province.length - 1);
						}
						if (utils.isNotNull(city) && city.indexOf("市") == city.length - 1) {
							city = city.substring(0, city.length - 1);
						}
						// if (utils.isNotNull(res.data.regeocode.formatted_address)) {
						// 	address = res.data.regeocode.formatted_address;
						// }
						locationInfo = {
							"province": utils.isNotNull(province) ? province : '',
							"city": utils.isNotNull(city) ? city : province,
							"district": utils.isNotNull(district) ? district : '',
							"lat": la1,
							"lng": lo1,
							"address": address
						}
						that.address = city
						that.city = city
						uni.setStorageSync('location', locationInfo)
					},
					fail: function (res) {
						locationInfo = {
							"city": "济南",
							"lng": "117.113961",
							"lat": "36.694057"
						}
						utils.showToast("获取定位失败")
						var city = "济南"
						that.address = city
						that.city = city
					},
					complete:function(){
						// try{
						// 	uni.setStorageSync('location', locationInfo)
						// }catch(e){
						// 	//TODO handle the exception
						// }
						// if (utils.isNotNull(address) && address.length > 10) {
						// 	address = address.substring(0, 10) + '...'
						// }

					}
				})
			},
			toShopBView() {
				uni.navigateTo({
					url:'/pages/view/shopBview'
				})
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist(){
				uni.navigateTo({
					url:'registered'
				})
			},
			toPassWordUpdate(){
				uni.navigateTo({
					url:'passWordUpdate'
				})
			},
			// async toLogin(){
			// 	this.logining = true;
			// 	const {mobile, password} = this;
			// 	/* 数据验证模块
			// 	if(!this.$api.match({
			// 		mobile,
			// 		password
			// 	})){
			// 		this.logining = false;
			// 		return;
			// 	}
			// 	*/
			// 	const sendData = {
			// 		mobile,
			// 		password
			// 	};
			// 	const result = await this.$api.json('userInfo');
			// 	if(result.status === 1){
			// 		this.login(result.data);
   //                  uni.navigateBack();
			// 	}else{
			// 		this.$api.msg(result.msg);
			// 		this.logining = false;
			// 	}
			// }

		},

	}
</script>

<style type='text/less'>
	@import url("login.less");
</style>
