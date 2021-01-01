<template name="protocol-popup">
	<view v-show="showPopup">
		<view class="popup_mask"></view>
		<view class="popup_content">
			<view class="title">用户隐私政策</view>
			<view class="explain_text">
				<rich-text class="rich-text" :nodes="richTextInfo.detailContent"></rich-text>
				<view class="line">
					完整版阅读
				</view>
				<view class="link-box">
					<navigator url="/pages/userProtocol/userProtocol?type=5" class="path" hover-class="navigator-hover">《使用协议》</navigator>
					<navigator url="/pages/userProtocol/userProtocol?type=7" class="path" hover-class="navigator-hover">《隐私政策》</navigator>
				</view>
			</view>
			<view class="button-box">
				<view @click="confirm" class="continue">同意并继续</view>
				<view @click="back" class="quit">拒绝并退出</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "lyg-popup",
		data() {
			return {
				showPopup: false,
				policyStorageKey: 'has_read_privacy',
				richTextInfo: {}
			};

		},
		created: function() {
			var that = this;
			that.getRichText()
			uni.getStorage({
				key: this.policyStorageKey,
				success: (res) => {
					if (res.data) {
						that.showPopup = false;
						uni.showTabBar({})
					}
				},
				fail: function(e) {
					that.showPopup = true;
					uni.hideTabBar({});
					uni.setNavigationBarTitle({
						title:' '
					})
				}
			});
		},
		methods: {
			back() {
				this.$emit('popupState', false)
				// #ifdef APP-PLUS  
				plus.runtime.quit();
				// #endif
			},
			// 关闭弹框
			confirm() {
				this.showPopup = false;
				uni.setStorage({ 
					key: this.policyStorageKey,
					data: true
				});
				uni.showTabBar({});
				uni.setNavigationBarTitle({
					title:'登录'
				})
			},
			getRichText() {
				var that = this;
				var token = uni.getStorageSync("token")
				var params = {
					"token": token,
					"sysCustomer":that.$sysAppKey,
					"type": '4',
				};
				this.$apis.sendRequest({
					url : "https://jycloud.jinyouapp.com/api/img/admin/rich/text/info",
					data : params,
					success:function (result) {
						that.richTextInfo = result.info
					},
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.popup_mask {
		position: fixed;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		background-color: #04c1ab;
		transition-property: opacity;
		transition-duration: 0.3s;
		opacity: 1;
		z-index: 9998;
	}

	.popup_content {
		overflow: hidden;
		box-sizing: border-box;
		padding: 40upx 20upx 20upx;
		position: fixed;
		bottom: 10%;
		border-radius: 8px;
		left: 50%;
		margin-left: -40%;
		right: 0;
		min-height: 400upx;
		background: #ffffff;
		width: 80%;
		z-index: 9999;

		.title {
			text-align: center;
			font-size: 34upx;
			padding: 10upx 0 0 0;
		}

		.explain_text {
			font-size: 30upx;
			padding: 30upx 30upx 40upx 30upx;
			line-height: 38upx;
			
			.rich-text {
				height: 640upx;
				overflow: auto;
				display: block;
				margin-bottom: 20upx;
			}

			.line {
				display: block;
				text-align: center;
			}
			
			.link-box {
				display: flex;
				justify-content: center;
				align-items: center;
				line-height: 2;
				
				.path {
					color: #04c1ab;
					display: inline-block;
					text-align: center;
				}
			}
		}

		.button-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 34upx;

			view {
				text-align: center;
				margin-bottom: 20upx;
			}
			
			.continue {
				background-color: #04c1ab;
				height: 64upx;
				line-height: 64upx;
				width: 300upx;
				border-radius: 32upx;
				color: #FFFFFF;
			}
		}
	}
</style>
