<template>
	<view class="container">
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
						:value="validation"
						placeholder="请输入验证码"
						maxlength="11"
						@input="inputValidation"
					/>
					<button :class="countDown == 0 ? 'get-verify' : 'get-verify-disable'" @click="getVerifyCode()">{{ verifyText }}</button>
				</view>
			</view>
			<button class="confirm-btn" @click="toRegist" :disabled="logining">注册</button>
		</view>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	export default {
		data() {
			return {
				mobile: '',
				password: '',
				validation:'',
				logining: false,
				countDown:0,
				interval:{}
			}
		},
		computed: {
			verifyText: function() {
				if (this.countDown == 0) {
					return '获取验证码';
				} else {
					return '验证码(' + this.countDown + ')';
				}
			}
		},
		methods: {
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			inputValidation(e) {
				this.validation = e.detail.value;
			},
		
			getVerifyCode(){
				let that =this
				if (utils.isNull(this.mobile)) {
					utils.showToast("手机号不能为空~")
					return;
				}
		
				var params = {
				    "username": this.mobile,
		
				};
				var shopDeliveryPriceType = 3
				this.$apis.sendRequest({
					url : "/action/user/account/cancel/getTelCode",
					data : params,
					success:function (result) {
						utils.showToast("发送成功~")
						that.countDown = 60;
						that.interval = setInterval(function() {
							if (that.countDown > 0) {
								that.countDown--;
							} else {
								that.countDown = 0;
								clearInterval(that.interval);
							}
							console.log(that.countDown)
						}, 1000);
					},
				})
			},
		
			toRegist () {
				var that = this;
				if (utils.isNull(this.mobile) || utils.isNull(this.validation)) {
					utils.showToast("请补全信息~")
					return;
				}
				var params = {
				  "username": this.mobile,
					"telCode" : this.validation
				};
				this.$apis.sendRequest({
					url : "/action/user/account/cancel",
					data : params,
					success:function (result) {
						var info = result.info;
						uni.setStorage({
							key: 'username',
							data: that.mobile
						})
						uni.navigateBack()
					},
				})
			},

		},
	}
</script>

<style scoped>
	page {
		background: #fff;
		height: 100%;
	}
	.container{
		position:relative;
		width: 100vw;
		height: 100%;
		overflow: hidden;
		background: #fff;
		box-sizing: border-box;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		padding-bottom: 40upx;
	}
	.input-content{
		padding: 0 40upx;
	}
	.input-item{
		position:relative;
		display:flex;
		align-items: center;
		padding: 0 20upx;
		background:#f8f6fc;
		height: 100upx;
		border-radius: 10upx;
		background: #fff;
		border-bottom: 1upx solid #F0F0F0;
	}
	.input-item .tit{
		height: 50upx;
		line-height: 56upx;
		font-size: 26upx;
		color: #606266;
	}
	
	.input-item input{
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #303133;
		width: 100%;
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
	.get-verify {
		font-size: 30upx;
		text-align: center;
		line-height: 54upx;
		width: 200upx;
		height: 54upx;
		background: #fff;
		border-radius: 10upx;
		margin-left: 20upx;
		font-size: 28upx;
		color: #29ADFF;
		z-index: 100;
	
	}
	.get-verify-disable {
		font-size: 30upx;
		text-align: center;
		line-height: 50upx;
		width: 180upx;
		height: 50upx;
		font-size: 24upx;
		background: rgba(178, 179, 183, 1);
		border-radius: 10upx;
		margin-left: 20upx;
		color: #FFFFFF;
	}
	.input-item button {
		position: absolute;
		right: 20upx;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
