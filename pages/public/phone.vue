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
						<button :class="countDown == 0 ? 'get-verify' : 'get-verify-disable'" @click="getVerifyCode">{{ verifyText }}</button>
					</view>
					<view class="input-item">
						<input 
							type="mobile" 
							value="" 
							placeholder="请设置密码"
							placeholder-class="input-empty"
							maxlength="20"
							password 
							data-key="password"
							@input="inputChange"
							@confirm="toLogin"
						/>
					</view>
				</view>
				<button class="confirm-btn" @click="toRegistered" :disabled="logining">确定</button>
			</view>
		</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	
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
			navBack(){
				uni.navigateBack();
			},
			inputValidation(e) {
				
			},
			getVerifyCode(){
				let that =this
				that.countDown = 60;
				that.interval = setInterval(function() {
					if (that.countDown > 0) {
						that.countDown--;
					} else {
						that.countDown = 0;
						clearInterval(that.interval);
					}
				}, 1000);
			},
			toRegist(){
				// this.$api.msg('去注册');
			},
			toRegistered(){
				this.logining = true;
			}
		},

	}
</script>

<style type='text/less'>
	@import url("login.less");
</style>