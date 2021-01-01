<template>
	<login ref="loginRef">
		<template v-slot:loginContent="">
			<view>
				<!-- <button class="confirm-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="wxLogin1">微信登录</button> -->
				<!-- <button class="confirm-btn" lang="zh_CN" open-type="getPhoneNumber" @getPhoneNumber="getPhoneNumber">微信登录</button> -->
				<button class="confirm-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信登录</button>
				<view class="mobile-login-link" @click="showMobileLogin">手机号登录/注册</view>
			</view>
		</template>
	</login>
</template>

<script>
	import login from './login.vue'
	const utils = require('../../common/utils')
	export default{
		components: {
			login
		},
		data(){
			return{
				nickName:'',
				avatarUrl:'',
				gender:'',
				province:'',
				city:'',
				country:'',
			}
		},
		methods: {
			wxLogin1 () {
				this.$refs.loginRef.handlerWeiXinLogin()
			},
			showMobileLogin () {
				uni.navigateTo({
					url:'/pages/public/login'
				})
			},
			getPhoneNumber(e) {
				var that = this
			   if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
			   		console.log('用户拒绝提供手机号');
			   } else {
			   		console.log('用户同意提供手机号');
			   		uni.login({
			   			provider: 'weixin',
			   			success({errMsg,code}) {
			   				if (errMsg == "login:ok") {
								uni.getUserInfo({
									 provider: 'weixin',
									 success: function(res) {
									    that.userInfo = res.userInfo
									    that.nickName = res.userInfo.nickName
									    that.avatarUrl = res.userInfo.avatarUrl
									    that.gender = res.userInfo.gender //性别 0：未知、1：男、2：女
									    that.province = res.userInfo.province
									    that.city = res.userInfo.city
									    that.country = res.userInfo.country
									  }
								})
			   					that.getPhoneReq(e.detail.encryptedData, e.detail.iv)
			   				}
			   			}
			   		});
			   }
			},
			getPhoneReq(encryptedData, iv) {
			    this.judgeSessionKey()
			    this.sessionKey = uni.getStorageSync("sessionKey")
			    var that = this;
			    var params = {
			      "encryptedData": encryptedData,
			      "sessionKey": this.sessionKey,
			      "iv": iv,
			    };
			    this.$apis.sendRequest({
					url : "action/user/wx/xcx/phone/get",
					data : params,
					success:function (result) {
						console.log(result)
						var successs = result.status === 1 ? true : false;
						if (successs) {
							var info = result.info;
							console.log(info)
							if (utils.isNotNull(info)) {
							  that.bindWx(info.phoneNumber)
							} else {
							  uni.navigateTo({
							    url: 'pages/public/login',
							    fail: function (res) {
							      console.log(res)
							    }
							  })
							}
						} else {
							uni.showToast({
							  title: result.error,
							  icon: 'none',
							  duration: 1200
							})
							uni.navigateTo({
							  url: '/pages/public/login',
							  fail: function (res) {
								console.log(res)
							  }
							})
						}
					},
					complete:function () {
						that.logining = false;
					}
				});
			  },
			  bindWx: function (phoneNumber) { //绑定微信
			      var that = this;
			      that.judgeSessionKey()
			      this.wxXcxOpenId = uni.getStorageSync("wxXcxOpenId")
			      if (utils.isNull(this.wxXcxOpenId)) {
			        uni.showToast({
			          title: "微信标识不能为空",
			          icon: 'none',
			          duration: 1200
			        })
			        return;
			      }
			      if (utils.isNull(phoneNumber)) {
			        uni.showToast({
			          title: "绑定的手机号不能为空",
			          icon: 'none',
			          duration: 1200
			        })
			        return;
			      }
			      var params = {
			        "wxXcxOpenId": that.wxXcxOpenId,
			        "username": phoneNumber,
			        "signPhoto": that.avatarUrl,
			        // "telCode": that.data.telCode,
			        "isXcx": 1, // true 需要传session
			        // "password": that.data.password,
			        'name': that.nickName, //微信名称
			        'sex': that.gender,
			        'topAgent': uni.getStorageSync('sharers') || ''
			      };
			      that.$apis.sendRequest({
					url : "action/user/wxOpenId/bind",
					data : params,
					success:function (result) {
						console.log(result)
						var successs = result.status === 1 ? true : false;
						if (successs) {
							  console.log(uni.getStorageSync('sharers'))
							  console.log(result.info.token)
							  var info = result.info;
							  uni.setStorage({
							    key: 'token',
							    data: result.info.token,
							  })
							  uni.setStorage({
							    key: 'username',
							    data: result.info.username,
							  })
										  
							  uni.setStorage({
							    key: 'userInfo',
							    data: result.info,
							  })
										  
							  uni.setStorage({
							    key: 'name',
							    data: result.info.name,
							  })
							  uni.setStorage({
							    key: 'telPhone',
							    data: result.info.telPhone,
							  })
							  // uni.showToast({
							  //   title: "登录成功",
							  //   duration: 1200
							  // })
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
							  		that.$refs.loginRef.showModal('未通过成为'+ info.shopBInfo.shopName +'下员工的申请' + '。  是否继续加入店铺?')
							  	}
							  }else{
							  	setTimeout(() => {
							  		// 获取关联信息
							  		that.$refs.loginRef.getShoperbInfo()
							  	}, 800)
							  }
							 
						} else {
							uni.showToast({
							  title: result.error,
							  icon: 'none',
							  duration: 1200
							})
						}
					},
					complete:function () {
						that.logining = false;
					}
				});
			  },
			    // 判断sessionKey是否失效
			    judgeSessionKey: function () {
			      // 判断sessionKey是否失效
			      uni.checkSession({
			        success: function (res) {
			          console.log("处于登录态");
			        },
			        fail: function (res) {
			          // 获取sessionKey
			          uni.login({
						provider: 'weixin',
			            success: function (res) {
			              if (res.code) {
			                var agentId = sysConfig.singleShop.agentId;
			                var params = {
			                  code: res.code,
			                  agentId: agentId,
			                  needSessionKey: utils.isNotNull(sysConfig.module.needSessionKey) ? 1 : '',
			                };
			                this.$apis.sendRequest("action/user/wx/xcx/openId/get", params).then(res => {
			                  var successs = res.status == 1 ? true : false;
			                  if (successs) {
			                    var info = res.info;
			                    var openID = '',
			                      sessionKey = '';
			                    if (utils.isNotNull(sysConfig.module.needSessionKey) && sysConfig.module.needSessionKey) {
			                      openID = info.openid
			                      sessionKey = info.session_key
			                    } else {
			                      openID = info
			                    }
			                    //保存openid               
			                    uni.setStorageSync('wxXcxOpenId', openID);
			                    uni.setStorageSync('sessionKey', sessionKey);
			                    console.log("保存openId等")
			                  } else {
			                    uni.showToast({
			                      title: res.error,
			                      icon: 'none'
			                    })
			                  }
			                })
			              }
			            }
			          });
			        }
			      })
			    },
			
		}
	}
</script>

<style type='text/less' scoped>
	.mobile-login-link {
		width: 100%;
		text-align: center;
		font-size: 32rpx;
		color:#29ADFF;
		padding-top: 40rpx;
	}
	.confirm-btn{
		width: 670upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 4px;
		margin-top: 40upx;
		background: #04c1ab;
		color: #fff;
		font-size: 36upx;
	}
	.confirm-btn:after{
		border-radius: 100px;
		border: 1px solid #04c1ab;
	}
</style>
