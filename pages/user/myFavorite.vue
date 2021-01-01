<template>
	<view>
		<!-- 商品列表 -->
		<view class="clearFlex goodsList">
			<view class="item" v-for="(item,index) in goodsList">
				<view class="goodsInfo" >
					<view class="goods_xx">
						<view class="goods_img" @click="toGoodsInfo(item.goodIds)">
							<image :src="item.goodsInfoVO.imageUrl" ></image>
							<text v-if="item.goodsInfoVO.isFlashGood===1" class="tt_pp" >秒杀</text>
						</view>
						<view class="goods_cv">
							<view class="clearFlex name_tc">
								<text class="rx" v-if="item.isHot===1">热销</text>
								<text class="rx" v-if="item.isGroupGood===1">套餐</text>
								{{item.goodsInfoVO.name|stringFormat}}
							</view>
							<view class="tt_zy">
								{{item.goodsInfoVO.descs|stringFormat10}}
							</view>
							<view class="tt_yxq">
								<text v-if="item.expiryTimes">有效期至:{{item.expiryTimes}}</text>
							</view>
							<view class="price_cv">
								￥{{item.goodsInfoVO.isFlashGood===1?item.goodsInfoVO.flashPrice:item.goodsInfoVO.price|numberFormat}}
								<text v-if="item.goodsInfoVO.isFlashGood===1">￥{{item.goodsInfoVO.price|numberFormat}}</text>
<!--								<text>￥{{item.goodsInfoVO.originalPrice|numberFormat}}</text>-->
							</view>
						</view>
					</view>
					<view class="cartView" @click="collectSquareShowModal(item.goodIds)">
						<image  src="../../static/b2b_ic_shoucangsselect.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	export default {
		data() {
			return {
				goodsList: [],
			}
		},
		onLoad(option) {
			this.getLikeGoods()
		},
		methods: {
			getLikeGoods() {
				var that = this;
				var token = uni.getStorageSync("token");
				var params = {
					"token": token,
					"sysAppKey": that.$sysAppKey,
				};
				this.$apis.sendRequest({
					url : "/action/user/goods/like/list",
					data : params,
					success:function (result) {
						var data = result.data;
						that.goodsList = data
					}
				})
			},
			// 取消收藏判断
			collectSquareShowModal(goodsId){
				var that = this
				// #ifdef APP-PLUS
				this.$showModal({
					concent: '您确定取消收藏该商品?',
				}).then(res=>{
					console.log(res);
					that.collectSquare(goodsId)
					//确认
				}).catch(res=>{
					//取消
					console.log(res);
				})
				// #endif
				// #ifndef APP-PLUS
				uni.showModal({
					title: '提示',
					content: '您确定取消收藏该商品?',
					confirmColor: '#04c1ab',
					success: function (res) {
						if (res.confirm) {
							that.collectSquare(goodsId)
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				// #endif
			},
			// 收藏
			collectSquare(goodsId) {
				var that = this;
				var token = uni.getStorageSync("token")
				var params = {
					"sysAppKey": this.$sysAppKey,
					"token": token,
					"shopId": this.$shopId,
					"categoryId": 1,
					"goodIds":goodsId
				};
				var url = "/action/user/goods/like/delete"
				this.$apis.sendRequest({
					url : url,
					data : params,
					success:function (result) {
						if(result.status===1) {
							that.getLikeGoods()
						}
					},
				});
			},
			// 跳转商品
			toGoodsInfo(id) {
				uni.navigateTo({
					url: "/pages/goodsDetail/goodsDetail?goodsId="+id
				})
			},

		}
	}
</script>

<style type="text/less" lang="scss">
	page{
		padding: 0;
		height: 100%;
		background-color: #f4f4f4;
	}
	.goodsList {
		padding: 0 16upx;
	}
	.goodsList .item {
		width: 50%;
		float: left;
		padding: 0 4upx;
		margin: 8upx 0;
	}
	.goodsInfo {
		background-color: #fff;
		border-radius: 10upx;
		overflow: hidden;
		/*height: 550upx;*/
		position: relative;
	}
	.goods_img {
		height: 300upx;
		padding: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;

	}
	.goods_cv {
		padding: 0 20upx;
	}
	.goods_img image {
		max-width: 100%;
		height: 250upx;
	}
	.name_tc {
		font-size: 32upx;
		color: #101010;
		height: 44upx;
		line-height: 44upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.name_tc .rx {
		font-size: 24upx;
		color: #fff;
		background-color: #fb6348;
		padding: 0 10upx 0 6upx;
		margin-right: 8upx;
	}
	.tt_zy {
		font-size: 28upx;
		color: #999;
		height: 28upx;
	}
	.tt_yxq {
		font-size: 24upx;
		color: #999;
		height: 28upx;
		margin-top: 6upx;
	}
	.price_cv {
		margin-top: 6upx;
		font-size: 32upx;
		color: #CE2525;
		font-weight: 600;
		padding-right: 76upx;
		height: 60upx;
	}
	.price_cv  text {
		font-size: 24upx;
		color: #999;
		text-decoration: line-through;
	}
	.cartView {
		position: absolute;
		bottom: 10upx;
		right: 20upx;
		width: 56upx;
		height: 56upx;
		/*border-radius: 28upx;*/
		/*background-color: #CE2525;*/
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.cartView image {
		width: 56upx;
		height: 56upx;
	}
	.cartView .icon {
		font-size: 36upx;
		color: #fff;
	}

</style>
