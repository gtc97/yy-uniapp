<template>
	<view>
		<view class="mask"></view>
		<view v-if="type==1">
			<!--绑定微信-->
			<view class="wxbox">
				<view class="weixin">
					<image src="../static/bind_wx.png"></image>
				</view>
				<view class="tips">为了您的账号安全，请绑定微信，绑定后可快捷登录</view>
				<view class="btn" @click="eventClick">立即绑定</view>
				<view class="close" @click="close">
					<icon type="clear" size="26" />
				</view>
			</view>
		</view>
		<view v-else-if="type==2">
			<view class="redbox">
				<image src="../static/hongbao_bg.png"></image>
				<view class="wrapBox">
					<view class="tips">恭喜您升级为达人！<view>获得奖励红包</view>
					</view>
					<view class="money">￥<text>{{money}}</text></view>
					<view class="btn" @click="eventClick">收下红包</view>
				</view>
				<view class="close" @click="close">
					<icon type="clear" size="30" color="#fff" />
				</view>
			</view>
		</view>
		<view v-else-if="type==3">
			<view class="messBox">
				<view class="wrapBox">
					<view class="title">{{title}}</view>
					<view class="desc">
						<rich-text :nodes="content"></rich-text>
					</view>
					<view class="btn" @click="close">我知道了</view>
				</view>
			</view>
		</view>
		<view v-else-if="type==4">
			<view class="updateBox">
				<view class="tubiao">
					<image src="../static/ic_ar.png"></image>
				</view>
				<view class="wrapbox">
					<view class="version">发现新版本{{version}}</view>
					<view class="desc-t">本次更新内容：</view>
					<view class="desc">
						<rich-text :nodes="content"></rich-text>
					</view>
					<view class="" v-if="prg">
						<progress :percent="prg" show-info stroke-width="3" />
					</view>
					<view class="btnbox" v-if="prg">
						<view class="btnno" @click="close">取消</view>
					</view>
					<view class="btnbox" v-else>
						<view class="btnno" @click="close">暂不升级</view>
						<view class="btnUp" @click="startUpload">立即升级</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else-if="type==5">
			<view class="updateBox1">
				<image src="../static/update_bg.png"></image>
				<view class="wrapBox">
					<view class="version">发现新版本<view>v{{version}}</view>
					</view>
					<view class="desc-t">更新内容：</view>
					<view class="desc">
						<rich-text :nodes="content"></rich-text>
					</view>
					<view class="" v-if="prg">
						<progress :percent="prg" show-info stroke-width="3" />
					</view>
					<view class="btnbox">
						<view class="btnno" @click="close">暂不升级</view>
						<view class="btnUp" @click="startUpload">立即升级</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: '1'
			},
			title: {
				type: String,
				default: ''
			},
			money: {
				type: Number,
				default: 1
			},
			content: {
				type: String,
				default: ''
			},
			version: {
				type: String,
				default: ''
			},
			Download: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				prg: 0,
			};
		},
		methods: {
			close() {
				this.$emit('close');
			},
			eventClick() {
				this.$emit('eventClick');
			},
			startUpload() {
				var that = this
				console.log('下载中', that.Download)
				var dtask = plus.downloader.createDownload(that.Download, {}, function(d, status) {
					// 下载完成  
					if (status == 200) {
						plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(error) {
							uni.showToast({
								title: '安装失败',
								mask: false,
								duration: 1500
							});
							uni.hideLoading();
						})
					} else {
						uni.showToast({
							title: '更新失败',
							mask: false,
							duration: 1500
						});
						uni.hideLoading();
					}
				});
				try {
					dtask.start(); // 开启下载的任务
					that.prg = 1;
					// var showLoading = plus.nativeUI.showWaiting("正在下载"); //创建一个showWaiting对象 
					dtask.addEventListener('statechanged', function(
						task,
						status
					) {
						// 给下载任务设置一个监听 并根据状态  做操作
						switch (task.state) {
							case 1:
								// showLoading.setTitle("正在下载");
								console.log('正在下载')
								break;
							case 2:
								console.log('已连接到服务器')
								// showLoading.setTitle("已连接到服务器");
								break;
							case 3:
								that.prg = parseInt(
									(parseFloat(task.downloadedSize) /
										parseFloat(task.totalSize)) *
									100
								);
								console.log('正在下载更新' + that.prg + "%  ")
								// showLoading.setTitle("  正在下载更新" + that.prg + "%  ");
								break;
							case 4:
								plus.nativeUI.closeWaiting();
								//下载完成
								break;
						}
					});
				} catch (err) {
					plus.nativeUI.closeWaiting();
					uni.showToast({
						title: '更新失败-03',
						mask: false,
						duration: 1500
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 888;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.btn {
		width: 70%;
		margin: 20rpx auto;
		margin-top: 40rpx;
		padding: 20rpx 0px;
		text-align: center;
		background: #4884FF;
		border-radius: 34px;
		font-size: 30rpx;
		color: #fff;
	}

	//微信弹窗
	.wxbox {
		position: absolute;
		top: 20%;
		z-index: 998;
		width: 80%;
		left: 10%;
		background-color: #fff;
		border-radius: 30rpx;
		padding: 30rpx 0rpx;

		.close {
			position: absolute;
			top: 5px;
			right: 10px;
			z-index: 999;
			text-align: center;
		}

		.weixin {
			margin: 20px 0 0 0px;
			text-align: center;

			image {
				width: 100px;
				height: 100px;
			}
		}

		.tips {
			padding: 10rpx 20rpx;
			text-align: center;
			font-size: 35rpx;
			color: #333;
		}
	}

	//红包弹窗
	.redbox {
		position: absolute;
		top: 12%;
		z-index: 998;
		width: 90%;
		left: 5%;
		padding: 10rpx 0rpx;
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}

		.close {
			text-align: center;
		}

		.wrapBox {
			position: absolute;
			width: 60%;
			left: 20%;
			top: 320rpx;
			padding: 10rpx 0rpx;
			text-align: center;

			.tips {
				font-size: 35rpx;
				color: #fff;
				font-weight: bold;

				text {
					font-weight: normal;
				}
			}

			.money {
				font-size: 35rpx;
				color: #fff;
				margin-top: 30rpx;
				font-weight: bold;

				text {
					font-size: 50rpx;
				}
			}

			.btn {
				width: 80%;
				margin: 20rpx auto;
				margin-top: 40rpx;
				padding: 20rpx 0px;
				text-align: center;
				background: linear-gradient(to bottom, #FFF04D, #FFE06B);
				border-radius: 34px;
				font-size: 30rpx;
				color: #CF2A2A;
				font-weight: bold;
			}
		}
	}

	.messBox {
		position: absolute;
		top: 12%;
		z-index: 998;
		width: 80%;
		left: 10%;
		padding: 10rpx 0rpx;

		.wrapBox {
			background-color: #fff;
			border-radius: 20rpx;
			padding: 30rpx;

			.title {
				text-align: center;
				font-size: 32rpx;
				font-weight: bold;
			}

			.desc {
				height: 400rpx;
				margin-top: 20rpx;
				font-size: 30rpx;
			}
		}
	}

	.updateBox {
		position: absolute;
		top: 20%;
		z-index: 998;
		height: 300rpx;
		width: 80%;
		left: 10%;

		.tubiao {
			text-align: center;

			image {
				z-index: 999;
				width: 200rpx;
				height: 130rpx;
			}
		}

		.wrapbox {
			position: relative;
			z-index: 998;
			top: -70rpx;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 30rpx 40rpx;

			.version {
				margin-top: 50rpx;
				font-size: 35rpx;
				color: #333;
				font-weight: bold;
				text-align: center;
			}

			.desc-t {
				margin-top: 30rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}

	.updateBox1 {
		position: absolute;
		top: 15%;
		z-index: 998;
		width: 80%;
		left: 10%;
		padding: 10rpx;
		height: 700rpx;

		image {
			width: 100%;
			height: 100%;
		}

		.wrapBox {
			position: absolute;
			width: 85%;
			left: 50rpx;
			top: 40rpx;
			padding: 10rpx 20rpx;

			.version {
				font-size: 35rpx;
				color: #fff;
			}

			.desc-t {
				margin-top: 100rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}

	.desc {
		height: 230rpx;
		overflow: scroll;
		margin-top: 10rpx;
		font-size: 30rpx;
		color: #666;
		line-height: 50rpx;
	}

	.btnbox {
		display: flex;
		justify-content: space-around;
		margin: 40rpx 0rpx 20rpx 0rpx;
		margin-top: 50rpx;

		.btnno {
			padding: 10rpx 30rpx;
			background-color: #f8f8f8;
			border-radius: 10rpx;
			font-size: 30rpx;
			color: #666;
		}

		.btnUp {
			padding: 10rpx 30rpx;
			background-color: #04C1AB;
			border-radius: 10rpx;
			font-size: 30rpx;
			color: #fff;
		}
	}
</style>
