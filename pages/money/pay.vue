<template>
	<view class="app">
		<view class="price-box">
<!-- 			<text>支付金额</text>
			<text class="price">38.88</text> -->
			<view class="clearFlex li_cv">
				<view class="name">订单详情</view>
				<view class="right_tt">{{orderNo}}</view>
			</view>
			<view class="clearFlex li_cv">
				<view class="name">支付金额</view>
				<view class="right_tt price">{{totalPrice}}</view>
			</view>
		</view>

		<view class="pay-type-list">
			<view v-if="isXcx" class="type-item b-b" @click="changePayType(0)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType === 0' />
				</label>
			</view>
			<view  v-if="!isXcx" class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType === 1' />
				</label>
			</view>
 			<view v-if="!isXcx" class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType === 2' />
				</label>
			</view>
			<view  class="type-item" @click="changePayType(3)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">线下支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
				</label>
			</view>
		</view>

		<text class="mix-btn" @click="submit">确认支付</text>


	</view>
</template>

<script>
	const utils = require('../../common/utils')
	export default {
		data() {
			return {
				orderNo: "",
				totalPrice: "",
				isXcx:false,
				payType: 0,
				payTypeArr:[{name:'小程序支付',type:'wx_xcx',provider:'wxpay'},{name:'微信',type:'wx'},{name:'支付宝支付',type:'alipay'},{name:'线下',type:'arrive'}],
				orderInfo: {},
				openId: ""
			};
		},
		computed: {

		},
		onLoad(options) {
			this.orderNo = options.orderNo
			this.totalPrice = options.price
			this.openId = uni.getStorageSync('wxXcxOpenId')
		},
		onShow(){
			var that = this
			var platform = uni.getStorageSync('platform')
			if (platform === 'xcx') {
				that.payType = 0
				that.isXcx = true
			}else{
				that.payType = 2
			}
		},
		methods: {
			submit() {
				var that = this
				if (that.payType === 3){
					// 线下支付
					that.arrivePay(that.payTypeArr[that.payType].type)
				}else{
					// 正常支付
					that.getPaySign(that.payTypeArr[that.payType].type)
				}
			},
			getPaySign(payType) {
				var that = this;
				var token = uni.getStorageSync("token");
				var params = {
					"token": token,
					"orderNo": that.orderNo,
					"payType": payType,
					"sysCustomer": that.$sysAppKey,
					"orderMoney":that.totalPrice,
					"wxXcxOpenId": this.openId,
				}
				console.log(params)
				that.$apis.sendRequest({
					url : "/action/order/pay/sign",
					data : params,
					success:function (result) {
						console.log(result)
						var packa = result.package;
						var timeStamp = result.timeStamp + "";
						var nonceStr = result.nonceStr;
						var paySign = result.paySign;
						var signType = result.signType;
						// 调起微信支付宝
						if (that.payType === 0) {
							that.requestXcx(result)
						}else if (that.payType === 1){
							that.requestWx(result)
						}else if (that.payType === 2){
							that.requestAlipay(result)
						}

					},
				})
			},
			//线下支付
			arrivePay (payType) {
				var that = this;
				var token = uni.getStorageSync("token");
				var params = {
					"token": token,
					"orderNo": that.orderNo,
					"payType": payType
				};
				that.$apis.sendRequest({
					url: "/action/order/pay/arrive",
					data: params,
					success: function (result) {
						if (result.status == 0) {
							utils.showToast(result.error)
							return;
						}
						utils.showToast("支付成功")
						uni.redirectTo({
							url: '/pages/money/paySuccess'
						})
					}
				})
			},
			//调起小程序
			requestXcx(result){
				var that = this
				var packa = result.package;
				var timeStamp = result.timeStamp + "";
				var nonceStr = result.nonceStr;
				var paySign = result.paySign;
				var signType = result.signType;
				// 调起微信支付宝
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: timeStamp,
					nonceStr: nonceStr,
					package: packa,
					signType: signType,
					paySign: paySign,
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
						// 回调
						that.callback('wx_xcx')
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
						utils.showToast("支付失败")
					}
				})
			},
			//调起微信
			requestWx(result){
				var that = this
				var appid = result.appid;
				var noncestr = result.noncestr;
				var packa = result.package;
				var partnerid = result.partnerid;
				var prepayid = result.prepayid;
				var sign = result.sign;
				var timestamp = result.timestamp+ '';
				var orderInfo = JSON.stringify({
					appid: appid,
					noncestr: noncestr,
					package: packa,
					partnerid: partnerid,
					prepayid: prepayid,
					sign: sign,
					timestamp: timestamp
				})
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: orderInfo,
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
						// 回调
						that.callback('wx')
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
						utils.showToast("支付失败")
						console.log(err)
						// utils.showToast(JSON.stringify(err))
						// utils.showModal({
						//     title: '提示',
						//     content: '支付失败',
						//     success: function (res) {
						//         if (res.confirm) {
						//             console.log(err);
						//         } else if (res.cancel) {
						//             console.log('用户点击取消');
						//         }
						//     }
						// });
					}
				})
			},
			//调起支付宝
			requestAlipay(result){
				var that = this
				var orderInfo = result
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: orderInfo,
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
						// 回调
						that.callback('alipay')
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
						utils.showToast("支付失败")
					}
				})
			},

			// 支付回调
			callback(payType){
				var that = this
				var token = uni.getStorageSync("token");
				var paramCall = {
					"token": token,
					"orderNo": that.orderNo,
					"payType": payType
				};
				that.$apis.sendRequest({
					url : "/action/order/pay/callback",
					data : paramCall,
					success:function (result) {
						utils.showToast("支付成功")
						uni.redirectTo({
							url: '/pages/money/paySuccess'
						})
					},
				})
			},

			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
				uni.redirectTo({
					url: '/pages/money/paySuccess'
				})
			},
		}
	}
</script>

<style type="text/less" lang='scss'>
	@import 'pay.less';
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		/* height: 265upx; */
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 30upx;
			color: red;
			&:before{
				content: '￥';
				font-size: 30upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 30upx;

		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 30upx;
			font-size: 30upx;
			position:relative;
		}

		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}


</style>
