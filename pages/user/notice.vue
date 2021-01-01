<template>
	<view>
		<!-- 系统消息 -->
		<view class="content" v-if="displayType==1">
			<view class="s1" v-for="(item, index) in noticeList" :key="index">
				<view class="item">
					<view> {{item.title}}</view>
					<view style='color:#bdc1c9'>{{item.date}}</view>
				</view>
				<view class="item">
					<view style='color:#7b7b7b'> {{item.content}}</view>
				</view>
			</view>
		</view>

		<view v-else>
			<!-- 关于我们 -->
			<view class='main'>
				<image :src='xcxLogo' class='image' />
			</view>
			<!-- #ifdef APP-PLUS -->
	<!-- 		<view class='appve'>
				版本号：{{edition}}
			</view> -->
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- #endif -->
			<view class='appve'>
				版本号：{{appVersion}}
			</view>
			<view class='bottom1'>
				<view>{{appInfo.company}}</view>
				<view v-if="appInfo.copyright">{{appInfo.copyright}}</view>
			</view>
			<view class='bottom' v-if="appInfo.technicalSupport != '' && appInfo.isShowCompany">
				技术支持: {{appInfo.technicalSupport}}
			</view>

		</view>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	export default {
		data() {
			return {
				xcxLogo: "",
				appVersion: this.$appVersion,
				noticeList: [],
				appInfo: {},
				// #ifdef APP-PLUS
				edition: plus.runtime.version,
				// #endif
				displayType: 1 // 展示类型 1.系统消息 2.关于我们
			}
		},
		onLoad(option) {
			// console.log(plus)
			this.displayType = option.displayType || 2
			var title = "系统消息"
			if (this.displayType == 1) {
				this.getNotice()
			} else if (this.displayType == 2) {
				this.appInfo = uni.getStorageSync("appInfo")
				// this.appVersion = appInfo.appVersion
				title = "关于我们"
			}
			uni.setNavigationBarTitle({
				title: title
			})
		},
		methods: {
			getNotice() {
				var that = this;
				that.msgIds = ''
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
						for (let i = 0; i < data.length; i++) {
							data[i].date = utils.formatTimeYMD(data[i].createTim, 'Y.M.D');
							if (timestamped < data[i].createTim) {
								timestamped = data[i].createTim
							}
							if (i === 0) {
								that.msgIds = that.msgIds + data[i].id
							} else {
								that.msgIds = that.msgIds + ',' + data[i].id
							}
						}
						if (utils.isNotNull(that.msgIds)) {
							// 标记已读
							that.noticeRead()
						}
						uni.setStorageSync("timestamped",timestamped);
						that.noticeList = data;
					},
				});
			},
			// 标记已读
			noticeRead () {
				var that = this;
				var token = uni.getStorageSync("token");
				var params = {
					"token": token,
					"sysAppKey":this.$sysAppKey, //项目标识  必填
					"msgIds": that.msgIds
				};
				this.$apis.sendRequest({
					url: "/action/notice/read",
					data: params,
					success: function (result) {

					}
				})
			}
		}
	}
</script>

<style>
	page {
		background: #F5F5F5;
	}

	.content {}

	.content .s1 {
		margin-top: 12upx;
	}

	.content .item {
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 9upx 30upx;
		font-size: 25upx;
	}

	.content .lastitem {
		background: #fff;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		padding: 9upx 30upx;
		font-size: 25upx;
	}


	/* 关于我么 */

	.main {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}

	.main image {
		width: 160upx;
		height: 160upx;
		margin-top: 194upx;
		border-radius: 18upx;
	}

	.appve {
		font-size: 28upx;
		color: #333333;
		text-align: center;
		margin-top: 60upx;
	}

	.bottom {
		width: 100%;
		text-align: center;
		height: 47px;
		bottom: 0;
		position: fixed;
		font-size: 26upx;
	}

	.bottom1 {
		width: 100%;
		color: #333333;
		text-align: center;
		height: 83px;
		bottom: 0;
		position: fixed;
		font-size: 26upx;
	}
</style>
