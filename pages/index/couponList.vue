<template>
	<view>
		<view class="container container-p">
		  <view class="wp2">
		    <!-- m-fq05 -->
		    <view class="m-fq05">
		      <view class="ul-fq05" v-if="couponList &&couponList.length>0">
		          <view class="li s1" v-for="(item, index) in couponList" :key="index">
		            <view class="left">
		              <view class="price">¥{{item.price}}</view>
		              <view class="discount">{{item.customerType === 1 ? '全部用户' :'仅新用户'}}</view>
		            </view>
		            <view class="txt">
		              <view v-show="item.shopName" class="name" style="margin-bottom: 2upx;">{{item.shopName}}</view>
		              <view class="name">{{item.name}} （满{{item.priceRang}}元可用）</view>
		              <view class="time">有效期:{{item.vaildTime}}</view>
		              <view class="button" @tap="fetchCoupon(item)" v-if="item.isSplit === 0 && (item.totalCounts === -1 || item.totalCounts > item.splitCount)">
		                立即领取
		              </view>
					  <view class="button" v-else-if="item.isSplit === 1">
					    已领取
					  </view>
					  <view class="button" v-else>
					    领完了
					  </view>
		            </view>
		          </view>
		      </view>
				<view v-else class="empty" @click="getPlatCoupon">
					<image src="/static/empty.png" mode="aspectFit"></image>
					<view  class="empty-tips">
						空空如也,点击刷新看看!
					</view>
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
				couponList: [],
				shopId: '',
				page: 1,
				size: 20,
				isMore: false,
				loadingStatus: "noMore",
				// {price: 11,name: '优惠券(测试数据)', }
			}
		},
		onLoad () {
			this.getPlatCoupon()
		},
		methods: {
			getPlatCoupon: function  () {
				var that = this;
				var token = uni.getStorageSync("token");
				if (utils.isNull(token)){
					var url = "../public/login"
					uni.navigateTo({
						url: url
					})
					return
				}
				var params = {
					"token": token,
				};
				var recommendTem = this.couponList
				this.$apis.sendRequest({
					url : "/action/user/shop-red-packet/list",
					data : params,
					success:function (result) {
						var data = result.data;
						if (utils.isNotNull(data) && data.length > 0) {
						  if (that.page == 1) {
						    recommendTem = []
							console.log("清除")
						  }
						  if (data.length < that.size) {
							  var couponData = []
							  for (let index in data) {
							  	 var info = data[index]
							  	 info.vaildTime = utils.formatTime(info.startTime,'M/D')+'-'+utils.formatTime(info.endTime,'M/D');
							  	 couponData.push(info)
							  }
							  that.couponList = recommendTem.concat(couponData)
							  that.isMore = false  //是否还有更多数据：没有
							  that.loadingStatus = "noMore"
						  } else {
							  var couponData = []
							  for (let index in data) {
							  	 var info = data[index]
							  	 info.vaildTime = utils.formatTime(info.startTime,'M/D')+'-'+utils.formatTime(info.endTime,'M/D');
							  	 couponData.push(info)
							  }
							  that.couponList = recommendTem.concat(couponData)
							  that.isMore = true  //是否还有更多数据：没有
							  that.page = that.page + 1
							  that.loadingStatus = "loading"
						  }
						} else {
							that.couponList = that.page > 1 ? recommendTem : [],
							that.isMore = false  //是否还有更多数据：没有
							that.loadingStatus = "noMore"
						}
					},
				});
			},
			fetchCoupon: function  (item) {
				var that = this;
				var token = uni.getStorageSync("token")
				if (utils.isNull(token)) {
					var url = "../public/login"
					uni.navigateTo({
						url: url
					})
					return
				}
				var params = {
				  "token": token,
				  "redId": item.id
				};
				this.$apis.sendRequest({
					url : "/action/user/red/redpacket/rob",
					data : params,
					success:function (result) {
						utils.showToast("恭喜获取此优惠券")
						item.isSplit = 1;
					},
				});
			}
		}
	}
</script>

<style>
	.container {
	  padding: 10upx 20upx;
	}
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
	.empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100 upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;
	}
	.empty image{
		width: 240upx;
		height: 160upx;
		margin-bottom:30upx;
	}
	.empty .empty-tips {
		display: flex;
		font-size: 26upx;
		color: #C0C4CC;
	}
	.empty .navigator{
		color: #E60012;
		margin-left: 16upx;
	}
	/*m-fq05 end*/
</style>
