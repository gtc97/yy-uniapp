<template>
	<view class="container">
		<view class="headerView">
			<view class="icon_lv">
				<!-- #ifdef APP-PLUS -->
				<image  @click="scan" src="../../static/left-1.png" mode="widthFix"></image>
				<!-- #endif -->
			</view>
			<input type="text" value="" v-model="searchCont"   @input="searShop($event)" placeholder="输入关键词搜索" />
			<view class="icon_rv">
				<image src="../../static/icon-search.png" mode="widthFix" @click="searShop"></image>
			</view>
		</view>
<!--		<view class="clearFlex navView">-->
<!--			<view class="yticon nav_back" style="background: url(./static/back.png) left center no-repeat; background-size: 10px auto;"-->
<!--			 @click="touchBack"></view>-->
<!--			<view class="searchView">-->
<!--				<image class="icon_search" src="../../static/sousuo.png" mode="widthFix"></image>-->
<!--				<input class="search_tt" type="text" v-model="searchCont" placeholder="输入关键字"  @confirm="searShop" />-->
<!--				<image class="icon_del" src="../../static/icon-del.png" v-if="searchText.length > 0" mode="widthFix" @click="touchDel"></image>-->
<!--				&lt;!&ndash; <view class="search_tt">输入关键字</view> &ndash;&gt;-->
<!--			</view>-->
<!--			<button class="searchBtn" type="primary" @click="searShop">搜索</button>-->
<!--		</view>-->
		<!-- 搜索历史 -->
		<view class="history_cv" v-if="goodsList.length==0">
			<!-- 搜索发现 -->
			<view class="search_fx"  v-if="hotTagList.length>0">
				<view class="clearFlex title_h1">
					<view class="h3">搜索发现</view>
					<!--<view class="change" @click="touchChange">换一批 <mIcon type="refreshempty" class="iconUni"></mIcon></view>-->
				</view>
				<view class="clearFlex view_fl">
					<view class="item" :class="selectItem == index ? 'active':''" v-for="(item,index) in hotTagList" :key="index" @click="touchItem(index)">{{item.words}}</view>
				</view>
			</view>
			<!-- 历史搜索 -->
			<view class="history" v-if="hisData.length>0">
				<view class="clearFlex title_h1">
					<view class="h3">历史搜索</view>
					<view class="change" @click="removeSearch">
						<mIcon type="trash" class="iconUni"></mIcon>
					</view>
				</view>
				<view class="clearFlex view_fl">
					<view class="item" :class="selectLs == index ? 'active':''" v-for="(item,index) in hisData" :key="index" @click="touchHistory(index)">{{item}}</view>
				</view>
			</view>
		</view>
		<!-- 商品列表 -->
		<view class="clearFlex goodsList">
			<view class="item" v-for="(item,index) in goodsList">
				<view class="goodsInfo" >
					<view class="goods_xx">
						<view class="goods_img" @click="toGoodsInfo(item.id)">
							<image :src="item.imageUrl || '../../static/goodsImg.jpg'" ></image>
						</view>
						<view class="goods_cv">
							<view class="clearFlex name_tc">
								<text class="rx" v-if="item.isHot===1">热销</text>
								<text class="rx" v-if="item.isGroupGood===1">套餐</text>
								{{item.name|stringFormat}}
							</view>
							<!-- <view class="tt_zy" v-if="item.descs">
								{{item.descs|stringFormat10}}
							</view> -->
							<!-- 产品规格 -->
							<view class="tt_zy">
							<!-- <view class="tt_zy" v-if="item.packSpecs"> -->
								<text v-if="item.packSpecs">产品规格：{{item.packSpecs|stringFormat}}</text>
							</view>
							<!-- 生产厂家 -->
							<view class="tt_zy">
							<!-- <view class="tt_zy" v-if="item.manufacturerName"> -->
								<text v-if="item.manufacturerName">生产厂家:{{item.manufacturerName|stringFormat}}</text>
							</view>
							<view class="tt_yxq">
							<!-- <view class="tt_yxq" v-if="item.expiryTimes"> -->
								<text v-if="item.expiryTimes">有效期至:{{item.expiryTimes}}</text>
							</view>
							<view class="price_cv">
								￥{{item.price|numberFormat}}
								<text style="margin-left: 10rpx;" v-if="item.originalPrice > (item.isFlashGood===1?item.flashPrice:item.price)">￥{{item.originalPrice|numberFormat}}</text>
							</view>
						</view>
					</view>
					<view class="cartView" @click="touchGoodsDetail(item)">
						<view class="icon iconfont">&#xe7b3;</view>
					</view>
				</view>
			</view>
		</view>
		<view style="margin-bottom: 100upx;">
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		<cartDetail :showPop="showCart" ref="cartDetail" @touchClose="touchClose" :goodsInfo="goodsInfo"></cartDetail>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	import permision from "@/common/permission.js";
	import mIcon from '../../components/m-icon/m-icon.vue';
	import cartDetail from '../cartDateil/cartDateil.vue';
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default{
		components:{
			mIcon,
			cartDetail,
			uniLoadMore
		},
		data() {
			return {
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				typeId:'',
				carouselList: [],
				goodsList: [],
				starIndex:4,
				starArrA:[],
				starArrB:[],
				sellCountType:1,
				select1:0,
				show_zh:false,
				list1:["综合排序","评分最高","起送价最低","配送费最低"],
				show_sx:false,
				juli:"<563.56km",
				showmt:false,
				searchText:"",
				showShop:false,
				itemList:[],
				selectItem:-1,
				selectLs:-1,
				listFl:[],
				orderType:"",
				filterStr:"",
				// loadingStatus: "loading",
				// isMore: true, //是否有更多数据
				searchCont: "",
				page: 1,
				size: 10,
				hisData: [],
				hotTagList: [],
				goodsInfo: {},
				showCart: false,
				pagesize:10,
				loadStatus:'nomore',  //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore:false,  //是否加载中
			};
		},
		onLoad(option) {
			var that = this
			that.typeId = utils.isNotNull(option.typeId) ? option.typeId : ''
			// this.getStart()
			that.hisData = uni.getStorageSync('searchHistory') || []
			if( utils.isNotNull(option.code)){
				that.searchCont = option.code
				that.searShop()
			}
			this.getLables()
		},
		//上拉触底函数
		onReachBottom(){
			console.log(13213215465)
			  if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore = true
					this.page = this.page + 1
					this.getGoodsList()
			  }
		},
		methods:{
			// 输入的内容
			search(event) {
				var that = this
				var value = event.target.value;
				that.searchCont = value;
				if(utils.isNotNull(this.searchCont)) {
					that.searShop()
				}
			},
			searShop (e) {
				console.log(e.detail.value)
				if(utils.isNotNull(e.detail.value)){
					this.searchCont = e.detail.value
				}
				if (utils.isNull(this.searchCont)) {
					this.page = 1
					this.goodsList = []
					return
				}
				this.getGoodsList()
				 //获取本地存储没值的时候给个初始值
				const index = this.hisData.findIndex(item => item ===this.searchCont)//查看vaule在Storage里有没有
				if (index >= 0) this.hisData.splice(index, 1) // 判断如果有就删掉
				this.hisData.unshift(this.searchCont) // 在数组首添加元素
				uni.setStorageSync('searchHistory', this.hisData.slice(0, 10)) // 存到Storage里面 然后选取数组的前10位
			},

			getGoodsList:function() {
				var that = this;
				var token = uni.getStorageSync('token');
				var params = {
					sysAppKey:that.$sysAppKey,//#项目标识  必填
					shopId:that.$shopId,//#店铺ID 必填
					sortType:1,//选填 排序 1 综合排序 2 价格升序 3 销量升序
					content:this.searchCont,// 内容
					page: this.page,
					size: this.size,
				};
				this.$apis.sendRequest({
					url : "/action/user/shop/category-goods/search",
					data : params,
					success:function (result) {
						var data = result.info;
						// that.goodsList = data.goods
						if(data.totalCount !== data.size){
							for(var i=0;i<data.goods.length;i++){
								that.goodsList.push(JSON.parse(JSON.stringify(data.goods[i])))
							}
						}else{
							that.goodsList = data.goods
						}
						if (that.goodsList.length < data.totalCount) {
							that.loadStatus = 'more'
						} else {
							that.loadStatus = 'noMore'
						}
					},
					complete: function (res){
						that.isLoadMore = false
						console.log(res)
					},
				})
			},

			// 历史记录删除
			removeSearch () {
				uni.removeStorageSync("searchHistory")
				this.hisData = []
			},

			touchHistory(index){
				// this.selectLs = index
				this.searchCont = this.hisData[index]
				this.getGoodsList()
			},

			touchItem(index){
				this.searchCont = this.hotTagList[index].words
				this.getGoodsList()
			},

			// 发现
			getLables: function  () {
				var that = this;
				var token = uni.getStorageSync("token")
				var location = uni.getStorageSync("location")
				if (utils.isNull(location)) {
					return;
				}
				if(!location.lng) {
					return;
				}
				var params = {
				      "sysCustomer": this.$sysAppKey,
				      "lng": location.lng,
				      "lat": location.lat,
				      "prov": location.province? location.province:'',
				      "city": location.city? location.city:'',
				      "county": location.district? location.district:'',
				    };
				this.$apis.sendRequest({
					url : "https://jycloud.jinyouapp.com/api/records/base/marketing/hot-words/list",
					data : params,
					success:function (result) {
						that.hotTagList = result.data
					},
				});
			},
			touchGoodsDetail(item){
				var that = this
				that.goodsInfo = item
				that.$refs.cartDetail.initDetail(that.goodsInfo.id);
				this.showCart = true

			},
			
			touchClose: function (e) {
			    utils.showCacheCount()
			    this.showCart = false
			},

			//详情页
			toGoodsInfo(id) {
				uni.navigateTo({
					url: '/pages/goodsDetail/goodsDetail?goodsId='+id
				})
			},
			touchBack(){
				uni.navigateBack({
					delta:1
				})
			},
			touchNav(index){
				console.log(index)
			},

			touchChange(){
				console.log("换一批")
			},
			touchDel(){
				this.searchText = "";
				this.showShop = false
			},
			async scan() {
				var that = this
				// #ifdef APP-PLUS
				let status = await this.checkPermission();

				if (status !== 1) {
					return;
				}
				// #endif
				uni.scanCode({
					scanType:["qrCode","barCode"],
					onlyFromCamera: true,
					success: (res) => {
						console.log('条码类型2：' + res.scanType);
						console.log('条码内容2：' + res.result);
						if( utils.isNotNull(res.result)){
							that.searchCont = res.result
							that.searShop()
						}
					},
					fail: (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.camera'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '需要使用您的相机，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				});
			}
			// #ifdef APP-PLUS
			,
			async checkPermission(code) {
				let status = permision.isIOS ? await permision.requestIOS('camera') :
						await permision.requestAndroid('android.permission.CAMERA');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "需要相机权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			}
			// #endif
		}
	}
</script>

<style type="text/less" lang="scss">
	@import url('index.less');

	page {
		/*padding-top: calc(var(--status-bar-height) + 44px);*/
		background-color: #f4f4f4;
	}
	// 搜索页面
	.search_fx {
		padding: 0 28upx;
		padding-top: 20upx;
	}
	.title_h1 {
		margin-bottom: 20upx;
	}
	.title_h1 .h3 {
		float: left;
		line-height: 48upx;
		font-size: 28upx;
	}
	.title_h1 .change {
		float: right;
		font-size: 24upx;
		color: #666;
		line-height: 48upx;
	}
	.title_h1 .change .iconUni {
		float: right;
	}
	.view_fl .item {
		float: left;
		line-height: 60upx;
		padding: 0 16upx;
		background-color: #e5e5e5;
		margin-right: 20upx;
		margin-bottom: 20upx;
		font-size: 24upx;
	}
	.view_fl .item.active {
		background-color:#FFEDE8;
		color:#BF6263;
	}
	.history {
		padding: 0 28upx;
		padding-top: 20upx;
	}
	.fl-list {
		padding: 0 28upx;
	}
	.shop {
		float: left;
		margin-right: 20upx;
		font-size: 24upx;
		line-height: 60upx;
		color: #292929;
	}
	.shop .name {
		float: left;
		padding: 0 20upx;
		border-radius: 6upx;
		background-color:#F2F1EF;
		margin-right: 20upx;
		font-size: 24upx;
	}
	.shop .name image {
		width: 18upx;
		margin-right: 6upx;
	}
	.fl-list {
		height: 60upx;
		white-space: nowrap;
	}
	.scoll-wrapper{
		display:flex;
		align-items: flex-start;
	}
	.fl-list .item {
		float: left;
		padding: 0 20upx;
		border-radius: 6upx;
		background-color:#F2F1EF;
		font-size: 24upx;
		margin-right: 20upx;
		font-size: 24upx;
		line-height: 60upx;
	}
	.navView {
		position: fixed;
		background-color: #fff;
		padding: 3px 7px;
		height: calc(var(--status-bar-height) + 44px);
		z-index: 9999;
		left: 0;
		top: 0;
		width: 100%;

		padding-top: calc(var(--status-bar-height) + 3px);
	}
	.nav_back {
		float: left;
		height: 38px;
		width: 30px;
	}
	.searchView {
		position: absolute;
		left: 37px;
		float: left;
		top: calc(var(--status-bar-height) + 3px);
		margin-top: 5px;
		right: 61px;
		width: auto;
	}
	.searchBtn {
		float: right;
		height: 28px;
		font-size: 26upx;
		width: 44px;
		line-height: 28px;
		margin-top: 5px;
		padding: 0;
		background-color: #FFD161;
		color: #333;
	}
	.searchBtn::after {
		display: none;
	}
	.searchView .icon_search{
		width: 26upx;
		position: absolute;
		left: 20upx;
		top: 50%;
		margin-top: 0;
		transform: translateY(-50%);
	}
	.searchView .icon_del {
		width: 26upx;
		position: absolute;
		right: 20upx;
		top: 50%;
		margin-top: 0;
		transform: translateY(-50%);
		z-index: 999;
	}
	.search_tt {
		float: left;
		padding-left: 40upx;
		font-size: 26upx;
		color: #333;
		height: 56upx;
		width: 100%;
	}


</style>
