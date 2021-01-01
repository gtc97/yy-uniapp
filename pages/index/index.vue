<template>
	<view class="container">
		<view class="headerView">
			<view class="icon_lv">
				<!-- #ifdef APP-PLUS || MP -->
				<image @click="scan" src="../../static/left-1.png" mode="widthFix"></image>
				<!-- #endif -->
			</view>

			<input type="text" value="" disabled @click="toSearchGoods" placeholder="输入关键词搜索" />
			<view class="icon_rv">
				<image src="../../static/icon-search.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="banner">
			<!--			<image class="banner_img" src="../../static/01.jpg" mode="widthFix"></image>-->
			<swiper class="carousel" circular autoplay="true" interval="6000" duration="500">
				<swiper-item v-for="(item,index) in bannerList" :key="index" class="carousel-item" @click="navToDetailPage(item.url)">
					<image :src="item.src" />
				</swiper-item>
			</swiper>
			<view class="view_gg" v-if="hasGame">
				<image src="../../static/icon_01.png" mode="widthFix"></image>
				<view v-for="(item,index) in gameListStr" :key="index" style="height: 100%;width: 100%;overflow: hidden;position: absolute;">
					<text class="marquee" :style="[{'borederColor':item.borederColor},{'color':item.color},{'backgroundColor':item.backColor}]">{{item.title}}</text>
					<text class="marqueeT" :style="[{'borederColor':item.borederColor},{'color':item.color},{'backgroundColor':item.backColor}]">{{item.title}}</text>
				</view>
				<!-- <text class="marqueeT">{{gameListStr.title}}</text> -->
				<view class="icon iconfont " @click="closeGame">&#xe74a;</view>
			</view>

		</view>
		<view class="clearFlex homeNav">
			<view class="item" v-for="(item,index) in navList" :key="index" @click="navToDetailPage(item.url)">
				<view class="icon_img">
					<image :src="item.src"></image>
				</view>
				<text class="homeNavName">{{item.name}}</text>
			</view>
		</view>
		<!-- 特价 -->
		<view class="clearFlex view_tj" v-if="actuivityList.length>0">
			<view class="col2" v-for="(item,index) in actuivityList" :key="index">
				<view class="actuivityView1" v-if="item.showType == 1">
					<img :src="item1.imageUrl" @click="toPageUrl(item1)" v-for="(item1,index1) in item.shopTypeList" :key="index1">
				</view>
				<view class="actuivityView2" v-else-if="item.showType == 2">
					<img :src="item1.imageUrl" @click="toPageUrl(item1)" v-for="(item1,index1) in item.shopTypeList" :key="index1">
				</view>
				<view class="actuivityView3" v-else-if="item.showType == 3">
					<view :class="index1===0?'img1':'img2'" v-for="(item1,index1) in item.shopTypeList" :key="index1">
						<img :src="item1.imageUrl" @click="toPageUrl(item1)" :style="index1===0?'height: 200upx;':'height: 100upx;'">
					</view>
				</view>
				<view class="actuivityView4" v-else-if="item.showType == 4">
					<img :src="item1.imageUrl" @click="toPageUrl(item1)" v-for="(item1,index1) in item.shopTypeList" :key="index1">
				</view>
			</view>
		</view>
		<!-- 商品 -->
		<view class="goodsView">
			<view class="clearFlex goodsNav">
				<view class="item" :class="goodsIndex == index ? 'active':''" v-for="(item, index) in goodsNav" :key="index" v-if="index<4"
				 @click="touchGoodTab(index)">
					<view class="name">{{item.name}}</view>
					<text>{{item.descs}}</text>
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="clearFlex goodsList">
				<view class="item" v-for="(item,index) in goodsList" :key="index">
					<view class="goodsInfo">
						<view class="goods_xx" @click="toGoodsInfo(item.id)">
							<view class="goods_img">
								<image :src="item.imageUrl || '../../static/goodsImg.jpg'"></image>
								<text v-if="item.isFlashGood===1" class="tt_pp">秒杀</text>
							</view>
							<view class="goods_cv">
								<view class="clearFlex name_tc">
									<text class="rx" v-if="item.isHot===1">热销</text>
									<text class="rx" v-if="item.isGroupGood===1">套餐</text>
									{{item.name|stringFormat}}
								</view>
								<!-- <view class="tt_zy">
                                    {{item.descs|stringFormat10}}
                                </view> -->
								<!-- 产品规格 -->
								<view class="tt_zy" v-if="item.packSpecs">
									<text>产品规格：{{item.packSpecs|stringFormat}}</text>
								</view>
								<!-- 生产厂家 -->
								<view class="tt_zy" v-if="item.manufacturerName">
									<text>生产厂家:{{item.manufacturerName|stringFormat}}</text>
								</view>
								<view class="tt_yxq" v-if="item.expiryTimes">
									<text>有效期至:{{item.expiryTimes}}</text>
								</view>
								<view class="tt_yxq">
									<!-- <text v-if="item.expiryTimes">库存:{{item.stock}}</text> -->
									<text v-if="item.stock">库存:{{item.stock}}</text>
								</view>
								<view class="price_cv">
									￥{{item.isFlashGood===1?item.flashPrice:item.price|numberFormat}}
									<!-- <text>￥{{item.originalPrice|numberFormat}}</text> -->
									<text style="margin-left: 10rpx;" v-if="item.originalPrice > (item.isFlashGood===1?item.flashPrice:item.price)">￥{{item.originalPrice|numberFormat}}</text>
									<!-- <text style="margin-left: 10rpx;" v-if="(item.originalPrice < item.price)">￥{{item.originalPrice|numberFormat}}</text> -->
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
		</view>
		<cartDetail :showPop="showCart" ref="cartDetail" @touchClose="touchClose" :goodsInfo="goodsInfo"></cartDetail>
	</view>
</template>

<script>
	// touchClose
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
    const utils = require('../../common/utils')
    import permision from "@/common/permission.js";
    import cartDetail from '../cartDateil/cartDateil.vue';
    export default {
        components: {
            cartDetail,
			uniLoadMore
        },
        data() {
            return {
                actuivityList: [], // 活动入口
                bannerList: [],
                swiperCurrent: 0,
                navList: [
                    {
                        name: "品牌专区",
                        src: '../../static/logo.png'
                    },
                ],
                goodsNav: [
                    {
                        id: 0,
                        name: "推荐",
                        descs: "精选好药"
                    },
                ],
                goodsList: [],
                goodsIndex: 0, // 分类选中
                recommendGoodsList: [], // 推荐商品
                goodsInfo: {},
                showCart: false,
                data: {
                    name: "测试一下",
                    text: "简单点啊"
                },
                gameListStr:[],
                hasGame: false,
				size:10,
				pages:1,
				pagesize:10,
				loadStatus:'loading',  //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore:false,  //是否加载中
            }
        },
        onLoad() {
            var that = this
            that.getLocation()
            // that.initData()

        },
        onShow() {
            var that = this
            var token = uni.getStorageSync("token")
            // 获取活动信息
            var gameListStr = uni.getStorageSync("gameListStr")
            if (utils.isNotNull(gameListStr)){
                that.gameListStr = gameListStr
            }
            utils.showCacheCount()
			that.getShopInfo()
        },
		//上拉触底函数
		onReachBottom(){  
			  if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore=true
					this.pages = this.pages + 1
					if(this.goodsIndex === 0){
						this.getRecommendGoodList()
					}else{
						this.getGoods(this.goodsNav[this.goodsIndex].id)
					}
			  }
		},
        // 下拉刷新
        onPullDownRefresh() {
            this.pages = 1
            this.initData()
            // 获取商家活动
            this.getShopInfo()
            setTimeout(function () {
                uni.stopPullDownRefresh();
            }, 1000);
        },
        onReady() {
            var that = this
            that.updataTitle()
        },
        methods: {
            initData() {
				this.pages = 1
				this.goodsList = []
                this.getBanner()
                this.getClass()
                // 获取活动入口
                this.getActuivity()
                // 获取推荐商品
                this.getRecommendGoodList()
                // 获取活动信息
            },
            getLocation: function () {
                var that = this
                var location = uni.getStorageSync("location")
                if (utils.isNull(location)) {
                    uni.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                            console.log('当前位置的经度：' + res.longitude);
                            console.log('当前位置的纬度：' + res.latitude);
                            that.loadCity(res.longitude, res.latitude)
                        }
                    });
                } else {
                    this.initData()
                }

            },
            loadCity: function (lo1, la1) {
                // var myAmapFun = new amapFile.AMapWX({ key: "0a647d4c9f629bf95ec5b244afbc25b2" });
                // const key = "0a647d4c9f629bf95ec5b244afbc25b2"
                var that = this
				const key = that.$amapKey
                var locationInfo = {}
                var city = "济南", address = "请选择位置"
                uni.request({
                    url: 'https://restapi.amap.com/v3/geocode/regeo',
                    data: {
                        key: key,
                        location: lo1 + "," + la1,
                        extensions: "all",
                        s: "rsx",
                        sdkversion: "sdkversion",
                        logversion: "logversion"

                    },
                    success: function (res) {
                        var province = res.data.regeocode.addressComponent.province,
                            city = res.data.regeocode.addressComponent.city,
                            district = res.data.regeocode.addressComponent.district;
                        if (city.length < 1) {
                            city = province
                        }
                        if (utils.isNotNull(province) && province.indexOf("省") == province.length - 1) {
                            province = province.substring(0, province.length - 1);
                        }
                        if (utils.isNotNull(city) && city.indexOf("市") == city.length - 1) {
                            city = city.substring(0, city.length - 1);
                        }
                        // if (utils.isNotNull(res.data.regeocode.formatted_address)) {
                        // 	address = res.data.regeocode.formatted_address;
                        // }
                        locationInfo = {
                            "province": utils.isNotNull(province) ? province : '',
                            "city": utils.isNotNull(city) ? city : province,
                            "district": utils.isNotNull(district) ? district : '',
                            "lat": la1,
                            "lng": lo1,
                            "address": address
                        }
                        that.address = city
                        that.city = city
                        uni.setStorageSync('location', locationInfo)
                        that.initData()
                    },
                    fail: function (res) {
                        locationInfo = {
                            "city": "济南",
                            "lng": "117.113961",
                            "lat": "36.694057"
                        }
                        utils.showToast("获取定位失败")
                        var city = "济南"
                        that.address = city
                        that.city = city
                    },
                    complete: function () {
						console.log('locationInfo--------------------',locationInfo);
                        // try{
                        // 	uni.setStorageSync('location', locationInfo)
                        // }catch(e){
                        // 	//TODO handle the exception
                        // }
                        // if (utils.isNotNull(address) && address.length > 10) {
                        // 	address = address.substring(0, 10) + '...'
                        // }

                    }
                })
            },
            touchGoodTab: function (e) {
                var that = this
				that.goodsList = []
                that.goodsIndex = e
                if (e === 0) {
                    that.goodsList = that.recommendGoodsList
                } else {
                    that.getGoods(that.goodsNav[e].id)
                }
            },
            touchGoodsDetail(item) {
                var that = this
                that.goodsInfo = item
                that.$refs.cartDetail.initDetail(that.goodsInfo.id);
                this.showCart = true
            },
            touchClose: function (e) {
                utils.showCacheCount()
                this.showCart = false
            },

            // 获取活动入口
            getActuivity() {
                var that = this
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                };
                this.$apis.sendRequest({
                    url: "/action/user/shop/actuivity/list",
                    data: params,
                    success: function (result) {
                        var data = result.data;
                        that.actuivityList = data
                    }
                });
            },
            // 获取轮播图
            getBanner() {
                var that = this
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                };
                this.$apis.sendRequest({
                    url: "/action/shop/banner/get/list",
                    data: params,
                    success: function (result) {
                        var data = result.data;
                        var bannerList = []
                        var navList = []
                        for (let i = 0; i < data.length; i++) {
                            var info = data[i];
                            var imgUrl = utils.isNotNull(info.imageUrlB) ? info.imageUrlB : info.imageUrl;
                            var link = utils.isNotNull(info.link) ? info.link : ''
                            if (utils.isNotNull(info.code)) {
                                if (info.code === "tuijian") {
                                    link = "../out/out?title=推荐有奖"
                                    bannerList.push({src: imgUrl, url: info.isLink !== 0 ? link : ''});
                                }
                            } else if (info.type === 1) {
                                bannerList.push(that.bannerTypeUtils(info, true))
                            } else {
                                navList.push(that.bannerTypeUtils(info, false))
                            }
                        }
                        that.bannerList = bannerList
                        that.navList = navList
                        console.log(that.bannerList)
                        console.log(that.navList)
                    }
                });
            },
            // 获取一级分类
            getClass: function () {
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
                        if (data.length > 0) {
                            that.goodsNav = [{id: 0, name: "推荐", descs: "精选好药"}]
                            if (utils.isNotNull(data) && data.length > 0) {
                                for (let i = 0; i < data.length; i++) {
                                    var info = data[i]
                                    var vo = {id: info.id, name: info.name, descs: info.descs}
                                    that.goodsNav.push(vo)
                                }
                            }
                        }
                    }
                });
            },
            getGoods(categoryId) {
                var that = this
                var token = uni.getStorageSync("token");
				// that.goodsList = []
                var params = {
                    "token": token,
                    categoryId: categoryId,
                    isSelling: 1,
                    needChildGood: 1,
					page: that.pages,
                };
                that.$apis.sendRequest({
                    url: "/action/goods/list",
                    data: params,
                    success: function (result) {
                        var data = result.data;
                        if (utils.isNotNull(data) && data.length > 0) {
							if(result.size !== data.length){
								for(var i=0;i<data.length;i++){
									that.goodsList.push(JSON.parse(JSON.stringify(data[i])))
								}
							}else{
								that.goodsList = data
							}
                        } else {
                            that.goodsList = []
                        }
						if (that.goodsList.length < result.size) {
							that.loadStatus = 'more'
						} else {
							that.loadStatus = 'noMore'
						}
                    },
					complete: function (res){
						that.isLoadMore = false						
						console.log(res)
					},
                });
            },

            // 获取推荐商品
            getRecommendGoodList: function () {
                var that = this
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
					"page": that.pages,
					"size": that.size,
                };
                this.$apis.sendRequest({
                    url: "/action/user/get/shop/recommend/good/list",
                    data: params,
                    success: function (result) {
						console.log(result)
                        var data = result.data;
                        if (utils.isNotNull(data) && data.length > 0) {
							if(result.totalCount !== data.length){
								for(var i=0;i<data.length;i++){
									// that.goodsList.push(JSON.parse(JSON.stringify(data[i])))
									that.recommendGoodsList.push(JSON.parse(JSON.stringify(data[i])))
								}
							}else{
								that.recommendGoodsList = data
							}
                            that.goodsList = that.recommendGoodsList
                        }
						if (that.recommendGoodsList.length < result.totalCount) {
							that.loadStatus = 'more'
						} else {
							that.loadStatus = 'noMore'
						}
                        that.goodsIndex = 0
						// that.isLoadMore = false
                    },
					complete: function (res){
						that.isLoadMore = false
						console.log(res)
					},
                });
            },
            getShopInfo() {
                var that = this
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                };
                that.$apis.sendRequest({
                    url: "/action/shop/info",
                    data: params,
                    success: function (result) {
                        var info = result.info;
                        if (utils.isNotNull(info)) {
                            uni.setStorageSync('shopInfo', info)
                            // 活动处理
							var gameListStr = ''
                            if (utils.isNotNull(info.gameList) && info.gameList.length >0) {
                                info.gameList = that.gameListUtil(info.gameList)
								gameListStr = info.gameList
                            }
							// 获取活动信息
							// gameListStr = uni.getStorageSync("gameListStr")
							if (utils.isNotNull(gameListStr)){
								that.gameListStr = gameListStr
								that.hasGame = true
								uni.setStorageSync('gameListStr', gameListStr)
							}else{
								uni.removeStorageSync('gameListStr', gameListStr)
							}
							// 标题
                            that.updataTitle()
                        }
                    }
                });
            },
            gameListUtil (gameList) {
                var gList = [];
                var gameListStr =''
                if (utils.isNotNull(gameList) && gameList.length > 0) {
                    for (let j = 0; j < gameList.length; j++) {
                        var gam = gameList[j];
                        var gRule = gam.ruleList;
                        if (utils.isNotNull(gRule) && gRule.length > 0) {
                            var image = ''
                                ,backColor = '' // 背景颜色
                                ,borederColor = '' // 边框颜色
                                ,color = ''; // 字体颜色
                            if (utils.isNotNull(gam.gameType)) {
                                switch (gam.gameType) {
                                    case 1: // 满减
                                    {
                                        backColor = '',borederColor = '#ff2a5f',color = '#ff2a5f';
                                    }
                                        break;
                                    case 2: //满赠
                                    {
                                        backColor = '#d6f1ff',borederColor = '#d6f1ff', color = '#43c0ff';
                                    }
                                        break;
                                    case 3: //首单减
                                    {
                                        backColor = '#ffe4cf', borederColor = '#ff2a5f',color = '#ff2a5f';
                                    }
                                        break;
                                    case 4: //首单赠
                                    {
                                        backColor = '#ffe4cf',borederColor = '#ff2a5f',color = '#ff2a5f';
                                    }
                                        break;
                                }
                            }
                            for (let k = 0; k < gRule.length; k++) {
                                var rul = gRule[k];
                                if (utils.isNull(rul)) {
                                    continue;
                                }
                                var rTitl = '';
                                if (utils.isNull(rul.name)) {
                                    rTitl += " " + "满" + rul.rang + "减" + rul.award + " ";
                                } else {
                                    rTitl += " " + rul.name + " ";
                                }
                                gList.push({
                                    'title': rTitl,
                                    'gameType': gam.gameType,
                                    'backColor': backColor,
                                    'borederColor': borederColor,
                                    'color': color,
                                });
                                gameListStr += rTitl + ' '
                            }
                        }
                    }
                }
                // uni.setStorageSync('gameListStr', gameListStr)
                return gList
            },
            // 轮播图Utils
            bannerTypeUtils: function (info, isBanner) {
                var dealInfo = []
                var imgUrl = info.imageUrl;
                var link = utils.isNotNull(info.link) ? info.link : ''
                var name = utils.isNotNull(info.descs) ? info.descs : ''
                switch (info.linkType) {
                    case 1: { //链接
                        link = "../view/out?url=" + info.link + "&title=" + name
                        dealInfo = {src: imgUrl, url: info.isLink !== 0 ? link : '', name: name};
                    }
                        break;
                    case 2: { //商品
                        dealInfo = {
                            src: imgUrl,
                            url: info.isLink !== 0 ? ("../goodsDetail/goodsDetail?goodsId=" + link) : "",
                            name: name
                        }
                    }
                        break;
                    case 3: { //
                        var url = ''
                        if (info.extra1 === 'lingquan') { //领券
                            url = './couponList'
                        } else if (info.extra1 === 'shoucang') { //收藏
                            url = '/pages/user/myFavorite'
                        } else if (info.extra1 === 'fenlei') { // 分类
                            url = '/pages/classification/classification'
                        }
                        dealInfo = {src: imgUrl, url: url, name: name}
                    }
                        break;
                    case 5: { //商品
                        dealInfo = {
                            src: imgUrl,
                            url: info.isLink !== 0 ? ("../goodsDetail/goodsDetail?goodsId=" + link) : "",
                            name: name
                        }
                    }
                        break;
                    case 8: { //富文本
                        dealInfo = {
                            src: imgUrl,
                            url: info.isLink !== 0 ? ("../other/richText?richId=" + info.id + "&richType=1") : "",
                            name: name
                        }
                    }

                        break;
                    default: {
                        dealInfo = {
                            src: imgUrl,
                            url: info.isLink !== 0 ? ("../group/shopList?typeId=" + link + "&name=" + "店铺列表" + "&imgUrl=" + imgUrl) : "",
                            name: name
                        }
                    }
                        break;
                }

                return dealInfo
            },
            //轮播图跳转详情页
            navToDetailPage(url) {
                uni.navigateTo({
                    url: url,
                    fail: function (res) {
                        uni.switchTab({
                            url: url
                        })
                    },
                })
            },
            // 去商品详情
            toGoodsInfo(id) {
                uni.navigateTo({
                    url: '/pages/goodsDetail/goodsDetail?goodsId=' + id
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
            },
            updataTitle() {
                var that = this
                var shopInfo = uni.getStorageSync("shopInfo")
                console.log(shopInfo)
                if (utils.isNotNull(shopInfo)) {
                   that.shopInfo = shopInfo
                    uni.setNavigationBarTitle({
                        title:shopInfo.shopName
                    })
                }else{
                    setTimeout(function () {
                        that.updataTitle()
                    },200)
                }
            },
            // 活动入口跳转详情
            toPageUrl(item){
                if(utils.isNull(item.isLink)) {
                    return
                }
                var url = ''
                if (utils.isNotNull(item.linkType)) {
                   switch (item.linkType) {
                       case 1:
                           url="../view/out?url=" + item.link + "&title=" + item.name
                           break
                       case 5:
                           url="../goodsDetail/goodsDetail?goodsId=" + item.link
                           break
                       case 11:
                           url="/pages/snapUp/snapUp"
                           break
                   }
                }
                uni.navigateTo({
                    url: url,
                    fail: function (res) {
                        uni.switchTab({
                            url: url
                        })
                    },
                })
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
                        console.log("res: " + JSON.stringify(res));
                        console.log('条码类型：' + res.scanType);
                        console.log('条码内容：' + res.result);
                        // // 获取的数据给固定方法处理
                        uni.navigateTo({
                            url:"/pages/index/searchGoods?code="+res.result
                        })
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
            },
            // #ifdef APP-PLUS
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
            },
            // #endif
        }
    }
</script>

<style type="text/less" lang="scss">
	@import 'index.less';

</style>

<style type="text/less" lang="scss">
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

</style>
