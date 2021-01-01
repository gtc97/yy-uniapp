<template>
	<view class="container">
		<!--s 自定义导航 -->
		<view class="navView">
			<view class="clearFlex nav">
				<!--				<view class="navBack">-->
				<!--					<view class="icon iconfont arrow-lift">&#xe744;</view>-->
				<!--				</view>-->
				<view class="searchView">
					<input type="text" value="" disabled @click="toSearchGoods" placeholder="输入关键词搜索" />
				</view>
			</view>
		</view>
		<view class="view_gg" v-if="hasGame">
			<image src="../../static/icon_01.png" mode="widthFix"></image>
			<!-- <text class="marquee">{{gameListStr}}</text>
			<text class="marqueeT">{{gameListStr}}</text> -->
			<view v-for="(item,index) in gameListStr" :key="index" style="height: 100%;width: 100%;overflow: hidden;position: absolute;">
				<text class="marquee" :style="[{'borederColor':item.borederColor},{'color':item.color},{'backgroundColor':item.backColor}]">{{item.title}}</text>
				<text class="marqueeT" :style="[{'borederColor':item.borederColor},{'color':item.color},{'backgroundColor':item.backColor}]">{{item.title}}</text>
			</view>
			<view class="icon iconfont " @click="closeGame">&#xe74a;</view>
		</view>
		<!--e 自定义导航 -->
		<view :class="hasGame?'classification':'classification2'">
			<scroll-view class="nav-bar" scroll-y>
				<view class="item" :class="navIndex == index ? 'active':''" v-for="(item,index) in navList" :key="index" @click="touchToTab(index)">
					{{item.name}}
				</view>
			</scroll-view>
			<view class="riht_cv">
				<view class="topNav">
					<scroll-view class="scroll_nav" scroll-x='true'>
						<view class="item" :class="scrollIndex == index ? 'active':''" v-for="(item,index) in scrollList" :key="index" @click="touchNav(index)">
							<view class="item_tv">
								<text>{{item.name}}</text>
							</view>
						</view>
					</scroll-view>
					<view class="icon iconfont" @click="touchShowScreen">&#xe7b2;</view>
					<!-- 右侧顶部展开后 -->
					<view class="box" v-if="showScreen" :style="hasGame?'top: 210rpx;':''">
						<view class="bg"></view>
						<view class="dl">
							<view class="dd" :class="scrollIndex == index ? 'on':''" v-for="(item,index) in scrollList" :key="index" @click="touchNav(index)">
								<view class="a">{{item.name}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="clearFlex view_sx">
					<view class="item" :class="screenIndex == 1 ? 'active':''" @click="touchScreen(1)">
						<view class="item_tt">
							综合
						</view>
					</view>
					<view class="item" :class="screenIndex == 2 ? 'active':''" @click="touchScreen(2)">
						<view class="item_tt">
							销量
						</view>
					</view>
					<view class="item" :class="screenIndex == 3 ? 'active':''" @click="touchScreen(3)">
						<view class="item_tt item_tt-price">
							<text>价格</text>
							<view class="right" v-if="screenIndex == 3">
								<text class="icon iconfont" v-if="showPriceIcon === 4">&#xe65e;</text>
								<text class="icon iconfont" v-if="showPriceIcon === 3">&#xe65d;</text>
							</view>
						</view>
					</view>
				</view> -->
				<scroll-view class="product-container" scroll-y @scrolltolower="clickMore()">
					<!-- 商品列表 -->
					<view class="goods" :style="hasGame?'margin-bottom:40rpx':''">
						<view class="goodsList">
							<view class="cell" v-for="(item,index) in goodsList" :key="index">
								<view class="goods_info">
									<view class="goods_img" @click="toGoodsInfo(item.id)">
										<image :src="item.imageUrl || '../../static/goodsImg.jpg' || '../../static/goodsShopImg.jpg'"></image>
										<text v-if="item.isFlashGood===1" class="tt_pp">秒杀</text>
									</view>
									<view class="goods_rv">
										<view class="name" @click="toGoodsInfo(item.id)">
											<image v-if="item.isHot===1" src="../../static/rexiao.png" mode="widthFix"></image>
											<image v-if="item.isGroupGood===1" src="../../static/taocan.png" mode="widthFix"></image>
											{{item.name}}
										</view>
										<!-- <view class="info_tt" @click="toGoodsInfo(item.id)">
											{{item.descs}}
										</view> -->
										<!-- 包装规格 -->
										<view class="info_tt" v-if="item.packSpecs" @click="toGoodsInfo(item.id)">
											{{item.packSpecs}}
										</view>
										<!-- 生产企业 -->
										<view class="info_tt" v-if="item.manufacturerName" @click="toGoodsInfo(item.id)">
											{{item.manufacturerName|stringFormat}}
										</view>
										<!-- 有效期至 -->
										<view class="tt_yxq" v-if="item.expiryTimes" @click="toGoodsInfo(item.id)">
											<text>有效期至:{{item.expiryTimes}}</text>
										</view>	
										<view class="price">
											<view @click="toGoodsInfo(item.id)">￥{{item.isFlashGood===1?item.flashPrice:item.price|numberFormat}}
												<text class="tt_yxq" style="margin-left: 10rpx;text-decoration: line-through;" v-if="item.originalPrice > (item.isFlashGood===1?item.flashPrice:item.price)">￥{{item.originalPrice|numberFormat}}</text>
											</view>
											<view class="cartView" @click="touchGoodsDetail(item)">
												<view class="icon iconfont">&#xe7b3;</view>
											</view>
										</view>
									</view>
								</view>
								<!--								<view class="clearFlex choose-amount">-->
								<!--									<view class="reduction iconfont" @click="touchReduction">&#xe8e1;</view>-->
								<!--									<input type="text" :value="num" />-->
								<!--									<view class="add iconfont" @click="touchAdd">&#xe8df;</view>-->
								<!--								</view>-->

							</view>
							<!-- <view style="margin-bottom: 100upx;" v-if="show"> -->
							<view style="margin-bottom: 100upx;" @click="clickMore">
								<!-- <view class="center" @click="clickMore">
									点击加载更多
								</view> -->
								<uni-load-more :status="loadStatus"></uni-load-more>
							</view>
						</view>
					</view>

				</scroll-view>
			</view>

		</view>
		<cartDetail :showPop="showCart" ref="cartDetail" @touchClose="touchClose"></cartDetail>

	</view>
</template>

<script>
	const utils = require('../../common/utils')

	import cartDetail from '../cartDateil/cartDateil.vue';
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components:{
			cartDetail,
			uniLoadMore
		},
		data(){
			return {
				navList:["全部","热销爆款","本周上新","疫苗","血清","诊断药品等","中药材"],
				scrollList:["全部","热销爆款","本周上新","疫苗","血清","诊断药品等","中药材"],
				goodsList:[],
				navIndex:0,
				navId: 0,
				scrollIndex:0,
				screenIndex:1,
				showScreen:false,
				num:1,
				goodsInfo:{},
				showCart:false,
				gameListStr:[],
				hasGame: false,
				// 3上箭头,4下箭头
				showPriceIcon: 3,
				// 商品排序 sortType 1 综合排序 2 销量降序 3 价格升序 4 价格降序
				sortType: 1,
				categoryId: '',
				size:10,
				pages:1,
				pagesize:10,
				loadStatus:'loading',  //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore:false,  //是否加载中
				show:false,//是否显示加载更多
			}
		},
		onLoad(option) {
			var that =this
			that.getcategoryList(0)
		},
		onShow(){
			var that =this
			// 获取活动信息
			var gameListStr = uni.getStorageSync("gameListStr")
			if (utils.isNotNull(gameListStr)){
				that.gameListStr = gameListStr
				that.hasGame = true
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			// this.$api.msg('下拉刷新');
			this.getcategoryList(0)
			this.navIndex = 0
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		//上拉触底函数
		onReachBottom(){
			console.log('上拉触底了')
			if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
				this.isLoadMore=true
				this.pages = this.pages + 1
				this.getAllGoodsByCat()
			}
		},
		methods:{
			touchToTab:function(e){
				var that = this
				that.navIndex = e
				that.navId = that.navList[e].id
				that.categoryId = that.navId;
				that.goodsList = []
				that.pages = 1
				that.getcategoryList(that.navIndex)
			},
			touchNav:function(e){
				var that = this
				that.scrollIndex = e
				if (that.scrollIndex === 0) {
					//查询分类下全部商品
					that.categoryId = that.navId
				} else {
					that.categoryId = that.scrollList[that.scrollIndex].id;
				}
				that.pages = 1
				that.goodsList = []
				that.getAllGoodsByCat()
				that.showScreen = false
			},
			touchScreen:function(e){
				var that = this
				that.screenIndex = e;
				that.sortType = e;
				if (that.sortType === 3) {
					if (that.showPriceIcon === 3) {
						that.showPriceIcon = 4
						that.sortType = 4
					} else {
						that.showPriceIcon = 3
						that.sortType = 3
					}
				}
				that.getAllGoodsByCat()
			},
			touchShowScreen:function(){
				this.showScreen = !this.showScreen
			},
			touchReduction:function(){
				if (this.num > 1) {
					this.num -= 1
				}
			},
			touchAdd:function(){
				this.num += 1
			},
			touchGoodsDetail(item){
				var that = this
				that.goodsInfo = item
				that.$refs.cartDetail.initDetail(that.goodsInfo.id);
				this.showCart = true

			},
			touchClose:function(e){
				utils.showCacheCount()
				this.showCart = false
			},
			// 获取分类
			getcategoryList(index) {
				var that = this
				var token = uni.getStorageSync("token");
				var params = {
					"token": token,
				};
				this.$apis.sendRequest({
					url: "/action/goods/category/list",
					data: params,
					success: function (result) {
						var data = result.data;
						if (utils.isNotNull(data)) {
							that.navList = data
							that.navId = data[index].id
							that.categoryId = that.navId;
							// that.getGoodsList(data[0].id)
							that.scrollList = [{id:0,name:'全部'}]
							if (utils.isNotNull(data[index].goodsCategoryVOList)) {
								for (let i = 0; i < data[index].goodsCategoryVOList.length; i++) {
									var info = data[index].goodsCategoryVOList[i]
									that.scrollList.push(info)
								}
							}
							that.getAllGoodsByCat()
						}
					}
				});
			},
			// 获取二级分类及商品
			getGoodsList(pid) {
				var that = this
				var params = {
					pId:pid,		//类别ID 必填
					isSelling:1,		//1在售  0停售（传1）
				};
				this.$apis.sendRequest({
					url: "/action/goods/pId/list",
					data: params,
					success: function (result) {
						console.log(result)
						var data = result.data;
						that.scrollList = [{id:0,name:'全部'}]
						if (utils.isNotNull(data)) {
							for (let i = 0; i < data.length; i++) {
								that.scrollList.push(data[i])
							}
						}else{
							// that.scrollList = []
							that.goodsList = []
						}
						that.scrollIndex= 0
						that.getAllGoodsByCat()
					}
				});
			},
			// 获取分类下全部商品
			getAllGoodsByCat() {
				var that = this
				var token = uni.getStorageSync("token");
				var params = {
					token: token,
					categoryId:that.categoryId,
					isSelling: 1,
					needChildGood:1,
					sortType: that.sortType,
					page:that.pages, //分页
					size:that.size, 
				};
				that.$apis.sendRequest({
					url: "/action/goods/list",
					data: params,
					success:function(result) {
						var data = result.data;
						if (utils.isNotNull(data) && data.length > 0) {
								console.log(data.length)
								console.log(result.size)
							if(result.size !== data.length){
								that.show = true
								for(var i=0;i<data.length;i++){
									that.goodsList.push(data[i])
								}
							}else{
								that.goodsList = data
							}
						}
						if (that.goodsList.length < result.size) {
							that.loadStatus = 'more'
						} else {
							that.loadStatus = 'noMore'
						}
					},
					fail: function (res) {
						console.log(res)
					},
					complete: function (res){
						that.isLoadMore = false						
						console.log(res)
					},
				});
			},
			// 点击加载更多
			clickMore(){
				var that = this
				that.pages = that.pages + 1
				that.getAllGoodsByCat()
			},
			// 去商品详情
			toGoodsInfo(id) {
				uni.navigateTo({
					url: '/pages/goodsDetail/goodsDetail?goodsId='+id
				})
			},
			// 去搜索
			toSearchGoods() {
				uni.navigateTo({
					url: '/pages/index/searchGoods'
				})
			},
			closeGame() {
				this.hasGame = false
			}
		}
	}
</script>

<style type="text/less" lang="scss">
	@import 'classification.less';
	.view_gg {
		position: fixed;
		left: 0;
		top: 100upx;
		width: 100%;
		height: 40upx;
		padding: 0 50upx;
		background-color: rgba(227,144,144,0.87);
		z-index: 999;
	}
	.view_gg image {
		position: absolute;
		left: 10upx;
		top: 50%;
		width: 30upx;
		transform: translateY(-50%);
		z-index: 99;
	}
	.view_gg text {
		display: block;
		font-size: 24upx;
		color: #fff;
		text-align: left;
		line-height: 40upx;
	}
	.view_gg .icon {
		position: absolute;
		right: 0upx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 40upx;
		color: #fff;
		z-index: 99;
	}
	/*告示栏 滚动*/
	.marquee {

		animation: marquee 20s linear infinite;

		white-space: nowrap;

		position: absolute;

	}

	.marqueeT {

		animation: marqueeT 20s linear infinite;

		white-space: nowrap;

		position: absolute;

	}

	@keyframes marquee {

		0% { left: 0; }

		100% { left: -50%;}

	}

	@keyframes marqueeT {

		0% { left: 50%; }

		100% { left: 0; }

	}
	.center{
		text-align: center;
		color: #04C1AB;
	}
</style>
