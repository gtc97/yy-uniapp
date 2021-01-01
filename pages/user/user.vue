<template>
	<view class="container">
		<view class="user-section">
			<!-- <image class="bg" src="/static/user-bg.jpg"></image> -->
			<!--            <view class="yticon icon-shezhi icon_rc" @click="touchSetting"></view>-->
			<view class="clearFlex user-info-box" @click="touchSetting">
				<view class="portrait-box">
					<image class="portrait" :src="iconUrl || '/static/me/icon_head.png'"></image>
				</view>
				<view class="info-box">
					<text class="username">{{name || username}}</text>
				</view>
				<!-- <view class="phone">13600000000</view> -->
			</view>
		</view>
		<!-- 资金信息 -->
		<!--        <view class="money">-->
		<!--            <view class="clearFlex money_cv">-->
		<!--                <view class="col4" >-->
		<!--                    <view class="number">{{userWallet.money|numberFormat}}元</view>-->
		<!--                    <view class="name">我的钱包</view>-->
		<!--                </view>-->
		<!--                <view class="col4" @click="router('redPackage/redPackage?isShowRadio=0')">-->
		<!--                    <view class="number">{{redCount}}个</view>-->
		<!--                    <view class="name">我的红包</view>-->
		<!--                </view>-->
		<!--                <view class="col4">-->
		<!--                    <view class="number">0分</view>-->
		<!--                    <view class="name">我的积分</view>-->
		<!--                </view>-->
		<!--            </view>-->
		<!--        </view>-->
		<!-- 我的订单 -->
		<view class="user_cvs onTop">
			<view class="user_cont ">
				<view class="title">我的订单</view>
				<view class="clearFlex user_row">
					<view class="col3" v-for="(item,index) in myOrderIconList" :key="index" @click="toOrder(index)">
						<view class="orderRight">
							<image class="orderImage" :src="item.icon"></image>
							<text class="text1">{{item.name}}</text>
						</view>
						<span class="cart-n2" v-if="item.count && item.count>0">{{item.count}}</span>
					</view>
				</view>
			</view>
		</view>
		<!-- 我的功能 -->
		<view class="user_cvs">
			<view class="user_cont">
				<view class="title">我的功能</view>
				<view class="clearFlex user_row">
					<view class="col3" v-for="(item,index) in meList" :key="index" @click="touchMe(item)">
						<view class="orderRight">
							<image class="orderImage" :src="item.icon" mode="widthFix"></image>
							<text class="text1">{{item.name}}</text>
						</view>
						<span class="cart-n2" v-if="item.id===1&&noticeSize>0">{{noticeSize}}</span>
					</view>
				</view>
			</view>
		</view>
		<view class="user_cvs">
			<view class="user_cont">
				<view class="userList">
					<view class="cell" @click="touchQualifications">
						<view class="icon_cv">
							<image src="../../static/zizhi.png" mode="widthFix"></image>
		                </view>
						<view class="cell_tt">
							<text>店铺资质</text>
							<image src="../../static/icop-ico3.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="user_cvs">
			<view class="user_cont">
				<view class="userList">
					<view class="cell" v-for="(item,index) in lists" @click="touchOther(item)" :key="index">
						<view class="icon_cv">
							<image :src="item.icon" mode="widthFix"></image>
						</view>
						<view class="cell_tt">
							<text>{{item.name}}</text>
							<image src="../../static/icop-ico3.png" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
		</view>


	</view>
</template>
<script>
	const utils = require('../../common/utils')
    // const dataOption = require('../../common/dataOption')
    import {
        mapState
    } from 'vuex';

    let startY = 0, moveY = 0, pageAtTop = true;
    export default {
        data() {
            return {
                coverTransform: 'translateY(0px)',
                coverTransition: '0s',
                moving: false,
                myOrderIconList: [
                    {
                        name: '全部',
                        icon: '../../static/me/dht_icon_mine_qb.png',
                        id: 0,
                        count: 0
                    },
                    {
                        name: '待付款',
                        icon: '../../static/me/dht_icon_mine_dfk.png',
                        id: 1,
                        count: 0
                    },
                    {
                        name: '待收货',
                        icon: '../../static/me/dht_icon_mine_dsh.png',
                        id: 2,
                        count: 0
                    },
                    {
                        name: '已完成',
                        icon: '../../static/me/dht_icon_mine_dpj.png',
                        id: 3,
                        count: 0
                    }
                ],
                meList: [
                    {
                        name: '收货地址',
                        icon: '../../static/me/icon-dizhi.png',
                        id: 0
                    },
                    {
                        name: '我的消息',
                        icon: '../../static/me/icon_xiaoxi.png',
                        id: 1
                    },
                    {
                        name: '收藏商品',
                        icon: '../../static/me/souc.png',
                        id: 2
                    },
                    {
                        name: '优惠券',
                        icon: '../../static/me/hongb.png',
                        id: 3
                    },
                ],
                lists: [
                    {
                        name: '意见反馈',
                        icon: '../../static/me/icon_yijian.png',
                        id: 0
                    },
                    {
                        name: '发票信息',
                        icon: '../../static/me/fp1.png',
                        id: 1
                    },
                    {
                        name: '发票设置',
                        icon: '../../static/me/fp2.png',
                        id: 2
                    },
                    {
                        name: '联系客服',
                        icon: '../../static/me/kefu.png',
                        id: 3
                    },
                    // {
                    // 	name:'检测新版本',
                    // 	icon:'../../static/me/tuijain.png',
                    // 	id:2
                    // },
                    {
                        name: '使用协议',
                        icon: '../../static/me/xieyi.png',
                        id: 6
                    },
										{
                        name: '隐私政策',
                        icon: '../../static/me/zhengce.png',
                        id: 7
                    },
										{
                        name: '关于我们',
                        icon: '../../static/me/guanyu.png',
                        id: 4
                    },
                    {
                        name: '退出登录',
                        icon: '../../static/me/close.png',
                        id: 5
                    }
                ],
                appInfo: {},
                userWallet: {money: 0},
                redCount: 0,
                token: "",
                username: "",
                name: "",
                iconUrl: "",
                noticeSize: 0  // 消息数量
            }
        },
        onLoad() {
            this.getAppInfo()
        },
        onShow() {
            var that = this
            that.token = uni.getStorageSync("token")

            if (utils.isNotNull(that.token)) {
                this.initUser()
                var userInfo = uni.getStorageSync("userInfo")
                if (utils.isNotNull(userInfo) && typeof userInfo == 'string') {
                    userInfo = JSON.parse(userInfo)
                }
                that.username = userInfo.username
                // 获取消息
                that.getNotice()
            } else {
                that.userLogin()
            }
            uni.getStorage({
                key: "userInfo",
                success(res) {
                    var info = res.data
                    that.username = info.username
                    that.name = info.name
                    that.iconUrl = info.signPhoto
                    console.log(that.iconUrl)
                },
                fail(res) {
                    console.log(res)
                    that.username = "去登陆"
                    that.name = ""
                    that.iconUrl = ""
                }
            })

        },
        // #ifndef MP
        onNavigationBarButtonTap(e) {
            const index = e.index;
            if (index === 0) {
                this.navTo('/pages/set/set');
            } else if (index === 1) {
                // #ifdef APP-PLUS
                const pages = getCurrentPages();
                const page = pages[pages.length - 1];
                const currentWebview = page.$getAppWebview();
                currentWebview.hideTitleNViewButtonRedDot({
                    index
                });
                // #endif
                uni.navigateTo({
                    url: '/pages/notice/notice'
                })
            }
        },
        // #endif
        computed: {
            ...mapState(['hasLogin', 'userInfo'])
        },
        methods: {
            initUser() {
                this.getAppInfo()
                this.getUserWallet()
                this.getUserPacket()
                this.getOrderCount()
            },
            userLogin() {
                var that = this
                var token = ""
                try {
                    token = uni.getStorageSync("token")
                } catch (e) {
                    //TODO handle the exception
                }
                if (!token) {
                    // #ifdef MP-WEIXIN
                    uni.reLaunch({
                        url: '../public/wxLogin'
                    })
					return
                    // #endif
					uni.reLaunch({
					    url: '../public/login'
					})
                } else {
                    this.exitAPP()
                    console.log("用户信息")
                }
            },
            exitAPP() {
                var that = this
                // #ifdef APP-PLUS
                uni.$showModal({
                    concent: "确定退出登录？"
                }).then(res => {
                    uni.removeStorageSync("token")
                    uni.removeStorageSync("userInfo")
                    that.username = "去登陆"
                    that.name = ""
                    that.iconUrl = ""
                    that.userLogin()
                    //确认
                }).catch(res => {
                    //取消
                    console.log(res);
                })
                // #endif
                // #ifndef APP-PLUS
                uni.showModal({
                    title: '温馨提示',
                    content: '确定退出登录？',
                    confirmColor: '#04c1ab',
                    success: function (res) {
                        if (res.confirm) {
                            uni.removeStorageSync("token")
                            uni.removeStorageSync("userInfo")
                            that.username = "去登陆"
                            that.name = ""
                            that.iconUrl = ""
                            that.userLogin()
                        }
                    }
                });
                // #endif

            },
            toOrder(index) {
                uni.navigateTo({
                    url: '/pages/order/order?index=' + index
                })
            },
            touchMe(item) {
                console.log(item)
                if (item.id == 0) {
                    this.router('../address/address')	// 收货地址
                } else if (item.id == 1) {
                    this.router('notice?displayType=1') // 我的消息
                } else if (item.id == 2) {
                    this.router('myFavorite') // 收藏商品
                } else if (item.id == 3) {
                    this.router('redPackage/redPackage?isShowRadio= false&&isShowUse=1') // 优惠券
                }
            },


            touchOther(item) {
                if (item.id == 0) {
                    this.router('suggest')	// 意见反馈
                } else if (item.id == 1) {
                    this.router('/pages/myBill/myBill')	// 申请开票
                } else if (item.id == 2) {
                    this.router('/pages/view/shopBview?page=fpManage')	// 发票设置
                } else if (item.id == 3) {
                    utils.makePhoneCall(this.appInfo.serviceTel)	// 联系客服
                } else if (item.id == 4) {
                    this.router('notice?displayType=2')	// 关于我们
                } else if (item.id == 2) {
                    this.router('/pages/view/shopBview?page=fpManage')	// 发票设置
                } else if (item.id === 5) {
                    this.userLogin()
                } else if (item.id === 6) {// 使用协议
                    this.torichText(5)
                } else if (item.id === 7) {// 隐私政策
                    this.torichText(7)
                }
            },

            router(url) {
                var that = this;
                var token = uni.getStorageSync("token")
                if (utils.isNull(token)) {
                    url = "../public/login"
                }
                uni.navigateTo({
                    url: url
                })
            },


            getAppInfo() {
                var that = this;
                var token = uni.getStorageSync("token");
                var params = {};
                this.$apis.sendRequest({
                    url: "/action/about/us/get",
                    data: params,
                    success: function (result) {
                        var info = result.data[0]
                        // console.log("appInfo ----> "+info)
                        uni.setStorageSync('appInfo', info)
                        that.appInfo = info
                    },
                });
            },
            // 获取我的钱包
            getUserWallet() {
                var that = this;
                var token = uni.getStorageSync("token");
                if (utils.isNull(token)) {
                    that.toLogin()
                    return
                }
                var params = {
                    "token": token,
                };
                this.$apis.sendRequest({
                    url: "/action/user/wallet",
                    data: params,
                    success: function (result) {
                        var info = result.info;
                        that.userWallet = info
                    },
                });
            },

            getUserPacket() {
                var that = this;
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                    "page": 1,
                    "size": 50
                };
                this.$apis.sendRequest({
                    url: "/action/user/redpacket/all/list",
                    data: params,
                    success: function (result) {
                        var data = result.data;
                        var time = utils.getNowTimestamp();  // 当前时间戳
                        var redCount = 0
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].endTime > time) {
                                redCount++
                            }
                        }
                        that.redCount = redCount
                    },
                });
            },
            touchSetting() {
                console.log("设置")
                var url = 'modifyData/modifyData'
                uni.navigateTo({
                    // url:'/pages/address/userInfoManage'
                    url: url
                })

            },
            toLogin() {
                var url = '/pages/public/login';
                uni.navigateTo({
                    url
                })
            },
            // 获取订单数量
            getOrderCount() {
                var that = this;
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                };
                this.$apis.sendRequest({
                    url: "/action/user/order/state/count",
                    data: params,
                    success: function (result) {

                        if (result.status === 1 ) {
                            var info = result.info
                            that.myOrderIconList[1].count = info.waitingForPay
                            that.myOrderIconList[2].count = info.orderReceived
                        }
                    },
                });
            },
            // ====================================================

            /**
             * 统一跳转接口,拦截未登录路由
             * navigator标签现在默认没有转场动画，所以用view
             */
            navTo(url) {
                var that = this;
                if (!that.hasLogin) {
                    url = '/pages/public/login';
                    uni.navigateTo({
                        url
                    })
                    return
                }
                uni.navigateTo({
                    url
                })
            },

            /**
             *  会员卡下拉和回弹
             *  1.关闭bounce避免ios端下拉冲突
             *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
             *    transition设置0.1秒延迟，让css来过渡这段空窗期
             *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
             */
            coverTouchstart(e) {
                if (pageAtTop === false) {
                    return;
                }
                this.coverTransition = 'transform .1s linear';
                startY = e.touches[0].clientY;
            },
            coverTouchmove(e) {
                moveY = e.touches[0].clientY;
                let moveDistance = moveY - startY;
                if (moveDistance < 0) {
                    this.moving = false;
                    return;
                }
                this.moving = true;
                if (moveDistance >= 80 && moveDistance < 100) {
                    moveDistance = 80;
                }

                if (moveDistance > 0 && moveDistance <= 80) {
                    this.coverTransform = `translateY(${moveDistance}px)`;
                }
            },
            coverTouchend() {
                if (this.moving === false) {
                    return;
                }
                this.moving = false;
                this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
                this.coverTransform = 'translateY(0px)';
            },
            touchUser(index) {
                console.log(index)
            },
            touchService(item) {
                console.log(item.id)
                if (item.id == 3) {
                    // 我的地址
                    uni.navigateTo({
                        url: '../address/address'
                    })
                } else if (item.id == 5) {
                    // 我的红包
                    uni.navigateTo({
                        url: 'redPackage/redPackage'
                    })
                }
            },
            // 消息
            getNotice() {
                var that = this;
                var token = uni.getStorageSync("token");
                var timestamped = uni.getStorageSync("timestamped");
                timestamped = utils.isNotNull(timestamped)?Number(timestamped):0
                var params = {
                    "token": token,
                    "sysAppKey":this.$sysAppKey, //项目标识  必填
                    "timestamped": timestamped
                };
                this.$apis.sendRequest({
                    url: "/action/notice/list",
                    data: params,
                    success: function(result) {
                        var data = result.data
                        that.noticeSize = data.length;
                    },
                });
            },
						
			// 富文本页面
			torichText (type) {
				uni.navigateTo({
					url:'/pages/userProtocol/userProtocol?type='+type
				})
			},
			// 查看资质
			touchQualifications(){
				var page = 'qualification'
				uni.navigateTo({
					url:'/pages/view/shopBview?page=' + page
				})
			}

        },

    }
</script>

<style>
	.btn1 {
        width: 200 upx;
        height: 140 upx;
        background-color: white;
        color: #000;
        border-radius: 0 upx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 30 upx;
        line-height: 36 upx;
    }

    .btnImg {
        width: 56 upx;
        height: 56 upx;
    }

    .btn1::after {
        border: 0;
    }

</style>

<style type="text/less" lang='scss'>
	@import 'user.less';


</style>
