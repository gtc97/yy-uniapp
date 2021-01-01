<template>
	<view>
		<view class="detail_gg">
			<view class="ql-container">
				<view class="ql-editor">
					<rich-text :nodes="richTextInfo.detailContent"></rich-text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	export default {
		data(){
			return {
				type: 5,
				richTextInfo:{}
			}
		},
		onLoad(option) {
			if (utils.isNotNull(option.type)) {
				this.type = option.type
			}
			this.setNavigationBarTitle()
			this.getRichText()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getRichText()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods:{
			// 获取富文本
			getRichText() {
				var that = this;
				var token = uni.getStorageSync("token")
				var params = {
					"token": token,
					"sysCustomer":that.$sysAppKey,
					"type": that.type,
				};
				this.$apis.sendRequest({
					url : "https://jycloud.jinyouapp.com/api/img/admin/rich/text/info",
					data : params,
					success:function (result) {
						that.richTextInfo = result.info
					},
				});
			},
			setNavigationBarTitle () {
				let title = '使用协议'
				switch (this.type) {
					case '5': title = '使用协议'; break;
					case '7': title = '隐私政策'; break;
					case '1': title = '注册协议'; break;
				}
				uni.setNavigationBarTitle({
					title: title
				})
			}
		}
	}
</script>

<style type="text/less" lang="scss">
	page {
		height: 100%;
		background-color: #eee;
	}
	.container {
		width: 100%;
		height: 120upx;
	}
	.detail_gg {
		margin-top: 12upx;
		background-color: #fff;
		padding: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.ql-container {
			font-size: 32upx;
		}
	}
	.detail_lg {
		flex: 1;
		text-align: left;
		display: flex;
		justify-content: center;
	}
</style>
