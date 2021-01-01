<template>
	<view class="container">
		<!-- 		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->

		<view class="wrapper">
			<view class="top">
				<image class="background" src="../../static/login/background.png" />
				<image class="logo" :src="logo" />
			</view>
			<slot name="loginContent">
				<view class="input-content">

					<view class="input-item">
						<image style="width:50upx;height: 50upx;margin-top:20upx;margin-right: 20upx" src="../../static/login/user.png" />
						<input style="margin-top: 10upx" type="number" :value="mobile" placeholder="请输入您的登录账号" maxlength="11" data-key="mobile"
						 @input="inputChange" />
					</view>
					<view class="input-item">
						<image style="width:50upx;height: 50upx;margin-top:20upx;margin-right: 20upx" src="../../static/login/pwd.png" />
						<input style="margin-top: 10upx" type="mobile" :value="password" placeholder="请输入密码" placeholder-class="input-empty"
						 maxlength="20" password data-key="password" @input="inputChange" @confirm="toLogin" />
					</view>
				</view>
				<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
				<view class="clearFlex forget-section">
					<text class="left" @click="toRegist">手机号快速注册</text>
					<text class="right" @click="toPassWordUpdate">忘记密码？</text>
				</view>
			</slot>
		</view>
		<view class="agreement">
			请仔细阅读<text @click="torichText(5)">《使用协议》</text>& <text @click="torichText(7)">《隐私政策》</text>
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
		<!-- #ifdef APP-PLUS -->
		<lyg-popup v-if="platform === 'android'"></lyg-popup>
		<view v-if="isMask">
			<popup type="4" :version="version" :content="desc" @close="closeMask()" :Download="Download"></popup>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import popup from "@/components/ge-popup.vue";
	import {
        mapMutations
    } from 'vuex';
	const utils = require('../../common/utils')
	export default{
		components: {
		    popup  
		},
		data(){
			return {
				logo:require('../../static/login/logo.png'),
				mobile: '',
				password: '',
				logining: false,
				// #ifdef APP-PLUS
				platform: '',
				isMask:false,//是否显示弹窗
				version: plus.runtime.versionCode,
				desc:'1.更新内容'
				// #endif
			}
		},
		onLoad(){
			this.getLocation()
			// #ifdef APP-PLUS
			this.platform = uni.getStorageSync('platform')
			// #endif
			// var token = uni.getStorageSync("token")
			// if(utils.isNotNull(token)) {
			// 	// 获取关联信息
			// 	this.getShoperbInfo()
			// }
			// #ifdef APP-PLUS
			console.log('打开了', uni.getSystemInfoSync().platform)
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					console.log('打开的是安卓')
					uni.setStorageSync('platform', 'android')
					this.CheckUpdate('android');
					break;
				case 'ios':
					console.log('打开的是苹果')
					uni.setStorageSync('platform', 'ios')
					this.CheckUpdate('ios');
					break;
			}
			// #endif
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
				this.logining = false
			},
			toLogin(){
				this.logining = true;
				if (utils.isNull(this.mobile) || utils.isNull(this.password)) {
					utils.showToast("请补全登录信息~")
					return;
				}
				var params = {
				    "username": this.mobile,
					"password": this.password,
				};
				this.$apis.sendRequest({
					url : "/action/shopb/login/byPassword",
					data : params,
					success:result => {
						this.loginSuccess(result) 
					},
					fail:data => {
						this.logining = false
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
						console.log(result)
						var successs = result.status === 1 ? true : false;
						if (successs) {
							if(utils.isNull(result.info)){
								// 显示弹框
								that.showModal('请加入店铺')
							}else{
								let info = result.info
								if (info.status===10) {
									utils.showModal("店铺审核中,请等待")
								}else if (info.status===1) {
									that.showModal('提交中')
								}else if (info.status===30) {
									that.showModal('新增药店:'+info.shopName+' 未通过申请,\r  原因:'+info.reason + '。  是否继续加入店铺?')
								}else if (info.status===20) {
									// utils.showModal('店铺已通过审核。')
									// 跳转首页
									uni.switchTab({
										url: '/pages/index/index'
									})
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
				const key = that.$amapKey
				var location = uni.getStorageSync("location")
				if (utils.isNull(location)){
					uni.getLocation({
						type: 'wgs84',
						success: function (res) {
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							that.loadCity(res.longitude,res.latitude)
						},
						complete: function (res) {
							console.log(res)
						}
					});
				}
			},
			loadCity: function (lo1, la1) {
				// var myAmapFun = new amapFile.AMapWX({ key: "0a647d4c9f629bf95ec5b244afbc25b2" });
				// const key = "0a647d4c9f629bf95ec5b244afbc25b2"
				var that= this
				const key = that.$amapKey
				console.log(key)
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
						console.log(res.data.regeocode)
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
						console.log(locationInfo)
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
					complete:function(res){
						console.log(res)
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
			torichText (type) {
				uni.navigateTo({
					url:'../userProtocol/userProtocol?type='+type
				})
			},
			// 处理wxLogin.vue页面的微信登录按钮的事件
			handlerWeiXinLogin () {
				console.log()
				var username = ''
				
				let openId = uni.getStorageSync('wxXcxOpenId')
				if (!openId) {
					return uni.showToast({title:"微信登录失败", icon:"none"});
				}
				let params = {
					sysAppKey: this.$sysAppKey,
					wxOpenId: openId,
					needBindAccount: 0,
				}
				this.$apis.sendRequest({
					url: '/action/user/login/byWxOpenId',
					data: params,
					success:res => {
						this.loginSuccess(res, true)
					}
				})
			},
			// 登录成功后的处理
			loginSuccess (result, isWeiXin) {
				if (result.status !== 1) {
					this.logining = false;
					return utils.showToast(result.data.error);
				}
				let info = result.info;
				if (!isWeiXin) {
					// 普通登录
					uni.setStorage({
						key: 'username',
						data: this.mobile
					})
					uni.setStorage({
						key: 'password',
						data: this.password,
					})
				}
				uni.setStorage({
					key: 'token',
					data: result.info.token,
				})
				uni.setStorage({
					key: 'userInfo',
					data: result.info,
				})
				if(utils.isNotNull(info.shopBInfo)) {
					this.logining = false;
					if (info.shopBInfo.clerkVerifyState===10) {
						utils.showModal("店铺认证中,请等待")
					}else if (info.shopBInfo.clerkVerifyState===20) {
						utils.showToastSuccess("登录成功")
						// 跳转首页
						uni.switchTab({
							url: '/pages/index/index'
						})
					}else if (info.shopBInfo.clerkVerifyState===30) {
						this.showModal('未通过成为'+ info.shopBInfo.shopName +'下员工的申请' + '。  是否继续加入店铺?')
					}
				}else{
					setTimeout(() => {
						// 获取关联信息
						this.getShoperbInfo()
					}, 800)
				}
			},

			CheckUpdate(name) {
				var that = this;
				// var version = plus.runtime.versionCode
				var version = Number(1111) 
				var url = '',
					Download = ''
				var params = {}
				if (name == 'android') {
					params = {
						typeId: 11
					}
				} else if (name == 'ios') {
					params = {
						typeId: 11
					}
				}
				that.$apis.sendRequest({
					url: "action/version/get",
					data: params,
					success: function(result) {
						var successs = result.status == 1 ? true : false;
						console.log('本次更新内容',result.info.note)
						console.log('线上版本', result.info.currVersionCode)
						console.log('本地版本', that.version)
						if (successs) {
							if(result.info.isShow){
								if (result.info.currVersionCode > version) {
									that.desc = result.info.note
									that.version = result.info.currVersion
									that.Download = result.info.updateUrl
									that.isMask = true
								}
							}
							// if (result.info.currVersionCode > that.version) {
							// 	console.log(plus.networkinfo.getCurrentType())

							// 	if (plus.networkinfo.getCurrentType() == 6) {
							// 		uni.showModal({
							// 			title: '提示',
							// 			content: '有新的版本发布，检测到您目前非Wifi连接，为节约您的流量，程序已停止自动更新，将在您连接WIFI之后重新检测更新。',
							// 			confirmText: '确认下载',
							// 			cancelText: '取消下载',
							// 			success: function(res) {
							// 				if (res.confirm) {
							// 					console.log('用户点击确定');
							// 					that.startUpload(result.info.updateUrl)
							// 					// uni.showLoading({
							// 					// 	title: '下载中',
							// 					// 	mask: true
							// 					// });
							// 				} else if (res.cancel) {
							// 					console.log('用户点击取消');
							// 					return;
							// 				}
							// 			}
							// 		});
							// 	} else if (plus.networkinfo.getCurrentType() === 3) {
							// 		uni.showModal({
							// 			title: '提示',
							// 			content: '有新的版本发布，检测到您目前为Wifi连接，程序已启动自动更新。新版本下载完成后将自动弹出安装程序。',
							// 			confirmText: '确认下载',
							// 			cancelText: '取消下载',
							// 			success: function(res) {
							// 				if (res.confirm) {
							// 					console.log('用户点击确定');
							// 					that.startUpload(result.info.updateUrl)
							// 					// uni.showLoading({
							// 					// 	title: '下载中',
							// 					// 	mask: true
							// 					// });
							// 				} else if (res.cancel) {
							// 					console.log('用户点击取消');
							// 					return;
							// 				}
							// 			}
							// 		});
							// 	}
							// }
						}
					},
				})
			},
			closeMask(){//关闭弹窗
				this.isMask = false;
			},
		},

	}
</script>

<style type='text/less'>
	@import url("login.less");
</style>
