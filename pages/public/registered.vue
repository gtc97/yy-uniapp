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
							:value="validation"
							placeholder="请输入验证码"
							maxlength="11"
							@input="inputValidation"
						/>
						<button :class="countDown == 0 ? 'get-verify' : 'get-verify-disable'" @click="getVerifyCode()">{{ verifyText }}</button>
					</view>
					<view class="input-item">
						<input
							type="mobile"
							value=""
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
				<button class="confirm-btn" @click="toRegist" :disabled="logining">注册</button>
			</view>
			<view class="agreement" id="register-agreement">
				请仔细阅读<text @click="torichText(1)">《注册协议》</text>
			</view>
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
				validation:'',
				logining: false,
				countDown:0,
				interval:{}

			}
		},
		onLoad(){

		},
	computed: {
		// inputValid: function() {
		// 	return this.account != null && (!this.needVerify || this.verify != '') && this.password != '' && this.inviteCode != '';
		// },
		// verifyValid: function() {
		// 	return this.account != '';
		// },
		verifyText: function() {
			if (this.countDown == 0) {
				return '获取验证码';
			} else {
				return '验证码(' + this.countDown + ')';
			}
		}
	},
		methods: {
			...mapMutations(['login']),

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
					url : "/action/user/register/getTelCode",
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
				if (utils.isNull(this.mobile) || utils.isNull(this.password) || utils.isNull(this.validation)) {
					utils.showToast("请补全注册信息~")
					return;
				}
				var params = {
				    "username": this.mobile,
					"password": this.password,
					"telCode" : this.validation
				};
				this.$apis.sendRequest({
					url : "/action/user/register/byTelCode",
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


			navBack(){
				uni.navigateBack();
			},
			// 富文本页面
			torichText (type) {
				uni.navigateTo({
					url:'/pages/userProtocol/userProtocol?type='+type
				})
			},

		},

	}
</script>

<style type='text/less'>
	@import url("login.less");
</style>
