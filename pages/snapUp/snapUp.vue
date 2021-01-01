<template>
	<view class="container">
		<!--s 自定义导航 -->
		<!-- #ifdef MP-WEIXIN-->
		<!-- <view class="navView">
			<view class="clearFlex nav">
				<view class="navBack" @click="navBack">
					<view class="icon iconfont arrow-lift">&#xe744;</view>
				</view>
				<view class="title_nav">
					<image src="../../static/title.png" mode="widthFix"></image>
				</view>
				<view class="nav_right">
					<view class="search"></view>
					<view class="navIcon"></view>
				</view>
			</view>
		</view> -->
		<!-- #endif -->
		<!--e 自定义导航 -->
		<view class="snapBg"></view>
		<view class="snapUp">
			<SZqianggou ref="qianggou" @clickItem="checkItem"></SZqianggou>
			<view class="snapList">
				<view class="goodsList" v-for="(item,index) in goodsList">
					<view class="cell">
						<view class="goodsDetail">
							<view class="goodsImg">
								<image :src="item.goodsInfoVO.imageUrl || '../../static/goodsImg.jpg'" mode="widthFix" style="width: 200upx;height:200upx;"></image>
								<text v-if="item.goodsInfoVO.isFlashGood===1" class="tt_pp">秒杀</text>
							</view>
							<view class="goods_xx">
								<view class="name">
									<text v-if="item.goodsInfoVO.isGroupGood=== 1">套餐</text>
									<text>折上折</text>
									{{item.goodsInfoVO.name}}
								</view>
								<!--								<view class="tt_yh">批发更优惠</view>-->
								<!-- 								<view class="clearFlex state_cv">
									<view class="state">
										<text>前30分钟前60件5折</text>
										<text>剩余15：21</text>
									</view>
								</view> -->
								<view class="progress_cv">
									<view class="progress-box">
										<view class="qg_num num_0">
											已抢{{item.marketCount}}件
										</view>
										<progress class="progress" :percent="item.salesRate * 100" activeColor="#04C1AB " active stroke-width="14"
										 border-radius="7" />
										<view class="progress_num">
											{{item.salesRate * 100}}%
										</view>
									</view>
								</view>
								<view class="price_cv">
									￥{{item.activityPrice|numberFormat}} <text>￥{{item.goodsInfoVO.price|numberFormat}}</text>
								</view>
							</view>
						</view>
						<view class="payBtn" v-if="clickable===1" @click="toGoods(item)">
							马上抢<text class="icon iconfont">&#xe743;</text>
						</view>
						<view class="payBtn2" v-else>
							待开抢<text class="icon iconfont">&#xe743;</text>
						</view>
					</view>
				</view>
				<!--				<view class="goodsList">-->
				<!--					<view class="cell">-->
				<!--						<view class="goodsDetail">-->
				<!--							<view class="goodsImg">-->
				<!--								<view class="tt_ms">秒杀</view>-->
				<!--								<image src="../../static/logo.png" mode="widthFix"></image>-->
				<!--							</view>-->
				<!--							<view class="goods_xx">-->
				<!--								<view class="name">-->
				<!--									<text>折上折</text>-->
				<!--									复方板蓝根颗粒-->
				<!--								</view>-->
				<!--								<view class="clearFlex state_cv">-->
				<!--									<view class="state">-->
				<!--										<text>前30分钟前60件5折</text>-->
				<!--										<text>剩余15：21</text>-->
				<!--									</view>-->
				<!--								</view>-->
				<!--								<view class="progress_cv">-->
				<!--									<view class="progress-box">-->
				<!--										<view class="qg_num num_0">-->
				<!--											已抢87件-->
				<!--										</view>-->
				<!--										<progress class="progress" percent="30" activeColor="#04C1AB " active stroke-width="14" border-radius="7" />-->
				<!--										<view class="progress_num">-->
				<!--											30%-->
				<!--										</view>-->
				<!--									</view>-->
				<!--								</view>-->
				<!--								<view class="price_cv">-->
				<!--									￥22.9 <text>￥40</text>-->
				<!--								</view>-->
				<!--							</view>-->
				<!--						</view>-->
				<!--						<view class="payBtn">-->
				<!--							马上抢 <text class="icon iconfont">&#xe743;</text>-->
				<!--						</view>-->
				<!--					</view>-->
				<!--				</view>-->

			</view>

		</view>

	</view>
</template>

<script>
	const utils = require('../../common/utils')
	import SZqianggou from '@/components/SZ-qianggou/SZ-qianggou.vue'
	export default{
		components:{
			SZqianggou
		},
		data(){
			return{
				flashSaleList:[],
                goodsList:[],
				clickable:1,
				activeId: 0,
				page:1,
				size:10
			}
		},
		onLoad(){
			this.getFlashSaleList()
		},
		// 上拉触底
		onReachBottom() {
			var that = this
			that.page += 1
			that.getFlashSaleGoodsList()
		},
		methods:{
			checkItem(item,clickable){
                var that = this
				that.clickable = clickable
                that.activeId = item.id
                that.page = 1
				that.getFlashSaleGoodsList()
			},
			// 获取活动列表
			getFlashSaleList(){
				var that = this;
				var token = uni.getStorageSync("token");
				var location = uni.getStorageSync('location')
				if (utils.isNull(location)) {
					location = {
					    "city": "",
					    "lng": "",
					    "lat": ""
					}
				}
				var params = {
					"sysAppKey": this.$sysAppKey,
					"token": token,
					"shopId":that.$shopId,
					"city":location.city,
					"lat":location.lat,
					"lng":location.lng,
					"haveGoods":1
				};
				this.$apis.sendRequest({
					url: "/action/user/flash/sale/list",
					data: params,
					success: function (result) {
						var successs = result.status === 1 ? true : false;
						if (successs) {
							var data = result.data;
							that.flashSaleList = data
							if (utils.isNotNull(data) && data.length>0) {
								console.log(data)
								that.$refs.qianggou.initList(data);
							}else{
								that.showModal()
							}
						} else {
							utils.showToast(result.error)
						}
					}
				})
			},
			// 获取活动商品列表
			getFlashSaleGoodsList(){
				var that = this;
				var token = uni.getStorageSync("token");

				var params = {
					"sysAppKey": this.$sysAppKey,
					"token": token,
					"activeId":that.activeId,
					"page":that.page ,
					"size":that.size
				};
				this.$apis.sendRequest({
					url: "/action/user/flash/sale/goods/list",
					data: params,
					success: function (result) {
						var successs = result.status === 1 ? true : false;
						if (successs) {
							var data = result.data;
							if (that.page===1) {
								that.goodsList = []
							}
							if (data.length>0) {
								for (let i = 0; i < data.length; i++) {
									var info = data[i]
									info.salesRate = info.marketCount/info.goodsCount
									console.log('销售数量'+info.marketCount)
									console.log('总数量'+info.goodsCount)
									console.log('剩余数量'+info.salesRate)
									info.salesRate = info.salesRate>0 ? info.salesRate.toFixed(2) : 0
									that.goodsList.push(info)
								}
							}
						} else {
							utils.showToast(result.error)
						}
					}
				})
			},
			// 去首页
			navBack(){
				uni.navigateBack()
			},

			toGoods(info){
				console.log(info)
				uni.navigateTo({
					url: '/pages/goodsDetail/goodsDetail?isflash=1&goodsId='+info.goodsId+'&info='+JSON.stringify(info)
				})
			},
			showModal(){
				var that = this 
				uni.showModal({
					title: '提示',
					content: '暂时没有限时抢购请返回首页!',
					confirmColor:'#04c1ab',
					showCancel:false,
					success: function (res) {
						if (res.confirm) {
							// 首页
							that.navBack()
							console.log('用户点击确定');
						} else if (res.cancel) {
							that.navBack()
							console.log('用户点击取消');
						}
					}
				});
			},
		}
	}
</script>

<style type="text/less" lang="scss">
	@import 'snapUp.less';
	.uni-progress-inner-bar{
		border-radius: 14upx;
	}
</style>
