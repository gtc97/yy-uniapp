<template>
	<view class="container">
			<!-- 自定义导航 -->
			<!-- <view class="headView {{showNav ? 'active':''}}">
              <view style="height:{{statusBarHeight}}px;"></view>
              <view class="tobar" style="height:{{toBarHeight}}px; line-height:{{toBarHeight}}px;">
                <view class="back_btn iconfont icon-arrow-lift" style="" bindtap="touchBack"></view>
                <view class="nav_right iconfont icon-gengduo"></view>
              </view>
            </view> -->
			<!--end 自定义导航 -->
			<view class="homeCont" >
				<!--s banner广告图 -->
				<view class="banner" >
					<swiper class="swiper" indicator-dots="true" autoplay="true"  interval="3500" duration="1000">
						<block v-for="(item,index) in swipeList">
							<swiper-item>
								<view class="swiper-item">
									<image :src="item.src || '../../static/goodsImg.jpg'" ></image>
								</view>
							</swiper-item>
						</block>
					</swiper>
				</view>
				<!--e banner广告图 -->
				<!-- 价格卡片组 -->
				<sh-price v-if="goodsInfo" :detail="goodsInfo" ref="shPrice" ></sh-price>
				<view class="detail_tv1">
					<view class="h2">{{goodsInfo.name}}</view>
				</view>
				<view class="detail_tv1 detail_tv1-info">
					<view class="caigou">
						采购价:
						<text>{{goodsInfo.isFlashGood===1?goodsInfo.flashPrice:goodsInfo.price|numberFormat}}元</text><text v-if="goodsInfo.goodsUnit">/{{goodsInfo.goodsUnit}}</text>
					</view>
					<text class="info">库存：{{goodsInfo.stock}}</text>
					<text class="info">批号：{{goodsInfo.lotNumber}}</text>
				</view>
				<!-- 套餐详情 -->
				<view class="goods_xx" v-if="goodsInfo.isGroupGood === 1">
					<view class="title">
						<image class="icon_il" src="../../static/goods_xx.png" mode="widthFix"></image>
						<text>套餐详情</text>
						<text style="text-align: right;color: #f00">共{{goodsSetMealList.length}}件商品</text>
					</view>
					<view class="detail_tvs">
						<block>
							<scroll-view class="clearFlex goodsNav"  scroll-x="true">
<!--								<view  class="item"  v-for="(item, index) in goodsSetMealList"-->
<!--									   @click="toGoodsInfo(item)">-->
<!--									<view>-->
<!--										<image style="width: 70%;height: 200upx" :src="item.imageUrl" ></image>-->
<!--										x {{item.groupNumber}}-->
<!--									</view>-->
<!--									<view class="name">{{item.name}}</view>-->
<!--&lt;!&ndash;									<view class="manufacturerName">{{item.manufacturerName?item.manufacturerName:''}}</view>&ndash;&gt;-->
<!--								</view>-->
								<view class="item" v-for="(item,index) in goodsSetMealList">
									<view class="goodsInfo">
										<view class="goods_xx">
											<view class="goods_img" @click="toGoodsInfo(item.id)">
												<image :src="item.imageUrl"></image>
												<text v-if="item.isFlashGood===1" class="tt_pp" >秒杀</text>
											</view>
											<view class="goods_cv">
												<view class="clearFlex name_tc">
													<text class="rx" v-if="item.isHot===1">热销</text>
													{{item.name|stringFormat}}
												</view>
												<view class="tt_zy">
													{{item.descs|stringFormat10}} 468484654564564654
												</view>
												<view class="tt_yxq">
													<text v-if="item.expiryTimes">有效期至:{{item.expiryTimes}}</text>
												</view>
												<view class="price_cv">
													￥{{item.price|numberFormat}} x {{item.groupNumber}}
												</view>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</block>
					</view>
				</view>
				<!-- 商品信息 -->
				<view class="goods_xx" v-else>
					<view class="title">
						<image class="icon_il" src="../../static/goods_xx.png" mode="widthFix"></image>
						<text>商品信息</text>
<!--						<view class="more iconfont icon-arrow-right"></view>-->
					</view>
					<view class="detail_tvs">
						<text>商品名称：{{goodsInfo.name}}</text>
						<text>商品描述：{{goodsInfo.descs}}</text>
						<text>包装规格：{{goodsInfo.packSpecs}}</text>
						<text>生产厂家：{{goodsInfo.manufacturerName}}</text>
						<text>批准文号：{{goodsInfo.approvalNumber}}</text>
						<text>有效期至：{{goodsInfo.expiryTimes}}</text>
						<text>生产日期：{{goodsInfo.produceTimes}}</text>
						<text>件包装：{{goodsInfo.piecePackage}}</text>
					</view>
				</view>

				<!--s 配送 -->
				<view class="goods_xx">
					<view class="title">
						<image class="icon_il" src="/static/goods_ps.png" mode="widthFix"></image>
						<text>配送说明</text>
					</view>
					<view class="ps_sm">
						<view class="tc">
							{{shopInfo.descs}}
<!--							济南城区-->
<!--							<text>500</text>元起配，不足起配不参与优惠并补偿运费-->
<!--							<text>15</text>元-->
						</view>
					</view>
				</view>
				<!--e 配送 -->
				<!-- 广告 -->
				<view class="detail_gg" v-if="richTextInfo.detailContent">
					<view class="ql-container">
						<view class="ql-editor">
							<rich-text :nodes="richTextInfo.detailContent"></rich-text>
						</view>
					</view>
				</view>
				<!--s 采购记录 -->
<!--				<view class="goods_xx">-->
<!--					<view class="title">-->
<!--						<image class="icon_il" src="/static/goods_cg.png" mode="widthFix"></image>-->
<!--						<text>采购记录</text>-->
<!--						<view class="tt_lj">-->
<!--							累计已采购-->
<!--							<text class="number">2437</text>盒-->
<!--						</view>-->
<!--					</view>-->
<!--					<view class="tableView">-->
<!--						&lt;!&ndash; <block> 并不是一个组件，它仅仅是一个包装元素，不会在页面中做任何渲染，只接受控制属性。 &ndash;&gt;-->
<!--						<block v-for="(item,index) in listData" >-->
<!--							<view class="table_cell">-->
<!--								<view class="td td1">{{item.name}}</view>-->
<!--								<view class="td td2">{{item.phone}}</view>-->
<!--								<view class="td td3">{{item.content}}</view>-->
<!--								<view class="td td4">{{item.date}}</view>-->
<!--							</view>-->
<!--						</block>-->
<!--					</view>-->
<!--					<view class="moreBtn">-->
<!--						查看更多-->
<!--						<text class="iconfont icon-arrow-right"></text>-->
<!--					</view>-->
<!--				</view>-->
				<!--e 采购记录 -->
			</view>
		<view class="lowViews">
			<view class="test1" @click="toCart">
				<view class="view1"><image src="../../static/b2b_ic_shopcar_black.png"></image></view>
				<view>购物车</view>
			</view>
			<view class="test1" v-if="isCollected" @click="collectSquare">
				<view><image src="../../static/b2b_ic_shoucangsselect.png"></image></view>
				<view>已收藏</view>
			</view>
			<view class="test1" v-else @click="collectSquare">
				<view class="view1"><image src="../../static/b2b_ic_shoucang.png"></image></view>
				<view>收藏</view>
			</view>
			<view  class="test2" @click="touchGoodsDetail">
				<text>加入购物车</text>
			</view>
		</view>
		<cartDetail :showPop = "showCart" ref="cartDetail"  @touchClose = "touchClose" :goodsInfo="goodsInfo"></cartDetail>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	import shPrice from './sh-price.vue';
	import cartDetail from '../cartDateil/cartDateil.vue';
	export default {
		components:{
			cartDetail,
			shPrice
		},
		data(){
			return {
				goodsId:1,
				swipeList: [],
				navList:[],
				scrollList:[],
				showScreen: [],
				screenIndex:0,
				goodsList:[],
				goodsInfo:{},
				shopInfo:{},
				listData: [{"name":"神......房", "date": "2019/01/01", "phone": "134....7787", "content": "工作内容1" },],
				isCollected: false, // 收藏
				showCart:false,
				richTextInfo:{},
				flashInfo:{},
				goodsSetMealList: []
 			}
		},
		onLoad(option) {
			var that =this
			if (utils.isNotNull(option.goodsId)) {
				that.goodsId = option.goodsId
			}
			if(utils.isNotNull(option.info)){
				var flashInfo = option.info
				if(typeof flashInfo === 'string') {
					flashInfo= JSON.parse(flashInfo)
				}
				that.flashInfo= flashInfo

			}
			that.initGoodsInfo()
			that.shopInfo = uni.getStorageSync("shopInfo");
		},
		methods:{
			initGoodsInfo () {
				var that = this
				// 获取商品信息
				that.getGoodsInfo()
				that.getGoodsLike()
				that.getRichText()
			},
			// 获取商品信息
			getGoodsInfo() {
				var that = this
				var token = uni.getStorageSync("token");
				var params = {
					"token": token,
					"shopId": this.$shopId,
					"goodsId": that.goodsId
				};
				this.$apis.sendRequest({
					url: "/action/goods/detail",
					data: params,
					success: function (result) {
						var successs = result.status == 1 ? true : false;
						if (successs) {
							var info = result.info;
							if (utils.isNotNull(info)&& utils.isNotNull(info.isFlashGood) && info.isFlashGood===1) {
								that.$refs.shPrice.getFlashSaleInfo(info)
							}
							var swipeArr = [];
							var goodsDetailArr = []
							var goodsImageArr = info.goodsImagesList;
							if (goodsImageArr.length > 0) {
								for (let i = 0; i < goodsImageArr.length; i++) {
									var imageInfo = goodsImageArr[i];
									if (imageInfo.type == 2) {
										goodsDetailArr.push({
											src: imageInfo.url
										})
									} else {
										swipeArr.push({
											src: imageInfo.url
										})
									}
								}
							} else {
								swipeArr.push({
									"src": info.imageUrl
								})
							}

							that.swipeList=swipeArr
							that.goodsDetailArr= goodsDetailArr
							that.goodsInfo= info
							if (info.isGroupGood === 1) {
								that.goodsSetMealList = info.goodsGroups
							}
							console.log("商品详情:")
							console.log(info)
							uni.setNavigationBarTitle({
								title: info.name
							})

						}
					}
				});
			},
			// 获取富文本
			getRichText() {
				var that = this;
				var token = uni.getStorageSync("token")
				if (utils.isNull(token)) {
					return
				}
				var params = {
					"token": token,
					"sysCustomer":that.$sysAppKey,
					"type": 100,
					"pid":that.goodsId
				};
				this.$apis.sendRequest({
					url : "https://jycloud.jinyouapp.com/api/img/admin/rich/text/info",
					data : params,
					success:function (result) {
						that.richTextInfo = result.info
						that.previewImgInit()
					},
				});
			},
			previewImgInit() {
				var that = this
				let content = that.richTextInfo.detailContent;
				if (content) {
					let newcontent = content && content.replace(/img/g, 'img preview="1"');
					newcontent.replace(/(^\s*)|(\s*$)/g, "");
					that.richTextInfo.detailContent = newcontent;
				}
			},
			// 是否收藏
			getGoodsLike: function  () {
				var that = this;
				var token = uni.getStorageSync("token")
				if (utils.isNull(token)) {
					return
				}
				var params = {
					"token": token,
					"shopId":that.$shopId,
					"categoryId": 1,
					"goodIds":that.goodsId
				};
				this.$apis.sendRequest({
					url : "/action/user/goods/isLike",
					data : params,
					success:function (result) {
						var isCollected = result.isLike === '0' ? false : true
						that.isCollected = isCollected
					},
				});
			},
			// 收藏
			collectSquare: function  () {
				var that = this;
				var token = uni.getStorageSync("token")
				if (utils.isNull(token)){
					var url = "../public/login"
					uni.navigateTo({
						url: url
					})
					return
				}
				var params = {
					"sysAppKey": this.$sysAppKey,
					"token": token,
					"shopId": this.$shopId,
					"categoryId": 1,
					"goodIds":that.goodsId
				};
				var url = "/action/user/goods/like/add"
				if (that.isCollected) {
					url = "/action/user/goods/like/delete"
				}
				this.$apis.sendRequest({
					url : url,
					data : params,
					success:function (result) {
						var data = result.data;
						that.isCollected = !that.isCollected
					},
				});
			},
			// 去购物车
			toCart() {
				uni.navigateTo({
					url: '../cart/cart'
				})
			},
			// 跳转商品
			toGoodsInfo(item) {
				uni.navigateTo({
					url: "/pages/goodsDetail/goodsDetail?goodsId="+item.childGoodId
				})
			},
			// 显示加入购物车
			touchGoodsDetail(){
				var that = this
				that.$refs.cartDetail.initDetail(that.goodsId);
				this.showCart = true

			},
			// 关闭加入购物车
			touchClose:function(e){
				utils.showCacheCount()
				this.showCart = false
			},
		}
	}
</script>

<style type="text/less" lang="scss">
	@import 'goodsDetail.less';
	.goodsInfo {
		background-color: #fff;
		border-radius: 10upx;
		overflow: hidden;
		//height: 550upx;
		position: relative;
	}
	.goods_img {
		width: 100%;
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
		/*overflow: hidden;*/
		//text-overflow: ellipsis;  // 文字带省略号
		text-overflow: ellipsis;
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
		color: #FF2121;
		font-weight: 600;
		height: 60upx;
	}
	.price_cv  text {
		font-size: 24upx;
		color: #999;
		text-decoration: line-through;
	}
</style>
