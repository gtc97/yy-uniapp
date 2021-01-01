<template>
	<view class="container">
		<view class="list">

			<view style='display:flex;justify-content: space-between;align-items:center;padding:15upx 25upx;background-color:#fff;box-shadow: 1px 1px 1px 1px rgba(234, 234, 234, 1);margin-bottom: 10px;'
				v-if="isShowRadio == 1">
				<view  style='font-size:28upx;'>不使用红包：</view>
				<label class="radio">
					<radio value="r1" :checked="noUsePack" style="transform:scale(0.7);" @click="noUseFuc"/>
				</label>
			</view>
			<view class="ul-fq05">
					<view class="li s1" v-for="(item, index) in redPackageList" :key="index" @click="selectThis(item)">
						<view class="left">
							<view class="price">¥{{item.price}}</view>
							<view class="discount">{{item.customerType === 1 ? '全部用户' :'仅新用户'}}</view>
						</view>
						<view class="txt">
							<view v-show="item.shopName" class="name" style="margin-bottom: 2upx;">{{item.shopName}}</view>
							<view class="name">{{item.name}} （满{{item.priceRang}}元可用）</view>
							<view class="time">有效期:{{item.vaildTime}}</view>
							<view class="button"  v-if="item.isUsed!==1 && !item.isFail && isShowUse">
								立即使用
							</view>
							<view class="button" v-if="item.isUsed===1">
								已使用
							</view>
							<view class="button" v-if="item.isFail">
								已过期
							</view>
						</view>
					</view>
				</view>
		</view>
	</view>
</template>

<script>
	const utils = require('../../../common/utils')
	export default{
		data(){
			return {
				isShowRadio: true,
				noUsePack: true,
				items: [{name: 'No',value: '不使用红包',checked: true}],
				redPackageList: [],
				totalGoodsMoney: 0,
				shopId: 0,
				page: 1,
				size: 50,
				// 是否显示立即使用按钮
				isShowUse: true
			}
		},
		onLoad (options) {
			this.isShowRadio = options.isShowRadio
			this.totalGoodsMoney = options.totalGoodsMoney
			// 从我的页面进入本页面不显示，立即使用按钮
			options.isShowUse && (this.isShowUse = false)
			if (utils.isNotNull(options.redPackagePrice) && options.redPackagePrice > 0) {
				this.noUsePack = false
			}
			if (options.shopId) {
				this.shopId = options.shopId
			}
			this.getRedList()
		},
		methods: {
			noUseFuc (e) {
				// console.log(e)
				this.noUsePack = true
				this.$api.prePage().alreadyCheckedRed(0, 0)
				wx.navigateBack()
			},
			selectThis (info) {
				if (this.isShowRadio) {
					var nowTime = utils.getNowTimestamp();
					var startTime = info.startTime
					var endTime = info.endTime
					// 时间处理
					if  (startTime > nowTime || endTime < nowTime) {
						utils.showToast("该红包不在使用期限内")
						return
					}
					// 价格处理
					if (this.totalGoodsMoney < info.priceRang) {
						utils.showToast("未满足红包条件")
						return
					}

					this.noUsePack = false
					this.$api.prePage().alreadyCheckedRed(info.id, info.price)
					wx.navigateBack()
				}
			},
			getRedList() {
				var that = this;
				var token = uni.getStorageSync("token");
				var params = {
					"token": token,
					"page": that.page,
					"size": that.size,
				};
				if (that.shopId !== 0) {
					params.shopId = that.shopId
				}
				this.$apis.sendRequest({
					url : "/action/user/redpacket/all/list",
					data : params,
					success:function (result) {
						var data = result.data;
						if (data.length == 0) {
							utils.showToast("您还未获取红包~")
							return
						}
						var time = utils.getNowTimestamp();  // 当前时间戳
						var newData = []
						for (var i = 0; i < data.length; i++) {
							var info = data[i]
							if (info.endTime > time) {
								info.endTimeStr = utils.formatTime(info.endTime, 'Y/M/D h:m:s');
								info.vaildTime = utils.formatTime(info.startTime,'M/D')+'-'+utils.formatTime(info.endTime,'M/D');
								newData.push(info)
							}
						 //  if (data[i].endTime < time) {
							// data[i].isFail = true
						 //  } else {
							// data[i].isFail = false
						 //  }

						}
						that.redPackageList = newData
					},
				})
			},
		}
	}
</script>

<style type="text/less">
	@import url("redPackage.less");
	/*ul-fq05*/
	.ul-fq05{

	}
	.ul-fq05 .li{
		margin-bottom: 20upx;
		overflow: hidden;
		box-shadow: 1px 1px 1px 1px rgba(234, 234, 234, 1);
		background: #fff;
		position: relative;
	}
	.ul-fq05 .li .left{
		padding-top: 36upx;
		width: 232upx;
		height: 200upx;
		display: block;
		float: left;
		text-align: center;
		background: #fd9494;
	}
	.ul-fq05 .left .price{
		margin-bottom: 16upx;
		height: 92upx;
		color: rgba(255, 255, 255, 1);
		font-size: 66upx;
		line-height: 92upx;
		font-weight: bold;
	}
	.ul-fq05 .left .discount{
		font-size: 24upx;
		color: #fff;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.ul-fq05 .txt{
		height: 200upx;
		padding-top: 22upx;
		padding-left: 32upx;
		padding-right: 18upx;
		overflow: hidden;
	}
	.ul-fq05 .txt .name{
		margin-bottom: 22upx;
		height: 40upx;
		color: rgba(16, 16, 16, 1);
		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-weight: bold;
	}
	.ul-fq05 .txt .time{
		font-size: 24upx;
		color: #fff;
		line-height: 34upx;
		color: #101010;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.ul-fq05 .txt .button{
		width: 160upx;
		height: 50upx;
		border-radius: 50upx;
		color: #fd9494;
		font-size: 24upx;
		line-height: 48upx;
		text-align: center;
		border: 1px solid #fd9494;
		position: absolute;
		right: 18upx;
		bottom: 14upx;
	}
	.ul-fq05 .li.s2 .left{
		background: #fd9494;
	}
	.ul-fq05 .li.s2 .button{
		border-color: #FD9494;
		color: #fd9494;
	}
	.ul-fq05 .li.s3 .left{
		background: #FFA622;
	}
	/*ul-fq05 end*/
</style>
