<template>
	<view class="container">
		<!--s 点击购物车弹出详情 -->
		<view class="goodsPop" v-if="showPop">
			<view class="zhezhao" @click="touchClose"></view>
			<view class="details">
				<view class="details_sp">
					<view class="closeBtn iconfont icon-guanbi" @click="touchClose"></view>
					<view class="img_cv">
						<image :src="goodsInfo.imageUrl || '../../static/goodsImg.jpg'"></image>
					</view>
					<view class="details_xq">
						<view class="title">{{goodsInfo.name}}</view>
						<view class="price">￥{{goodsInfo.isFlashGood===1 ? goodsInfo.flashPrice : goodsMoreSpecInfo.price|numberFormat}}</view>
						<!-- 	<view class="price">￥{{goodsInfo.isFlashGood}}</view> -->
						<!-- 	<view class="price">￥{{goodsInfo.flashPrice}}</view> -->
						<!-- 	<view class="price">￥{{goodsInfo.price}}</view> -->
						<!-- <view class="price">￥{{goodsMoreSpecInfo.price}}</view> -->
						<view class="clearFlex view_ls">
							<!--			<text>零售价:￥{{goodsInfo.originalPrice|numberFormat}}</text>-->
							<!--			<text>价格:￥{{goodsInfo.price|numberFormat}}</text>-->
						</view>
						<view class="clearFlex view_kc">
							<text>库存:{{goodsInfo.stock}}</text>
							<text>起批量:{{goodsInfo.minBuyCount}}</text>
						</view>
					</view>
				</view>
				<!-- 商品属性 -->
				<view class="shuxing" v-if="goodsSpecsList&&goodsSpecsList.length>0">
					<view class="goods_sx">
						<view class="title">请选择商品属性：</view>
						<view class="clearFlex row_sx">
							<view class="item " :class="item.checked?'selected':''" v-for="(item ,index) in goodsSpecsList" @click="clickSpecsFuc(index)">{{item.name}}</view>
						</view>
					</view>
				</view>
				<!-- 商品规格 -->
				<view v-if="goodsAttrVOList&&goodsAttrVOList.length>0">
					<view class="shuxing" v-for="(item ,index) in goodsAttrVOList">
						<view class="goods_sx">
							<view class="title">{{item.name}}：</view>
							<view class="clearFlex row_sx">
								<view class="item " :class="attrItem.checked?'selected':''" v-for="(attrItem ,attrIndex) in item.goodsAttrValVOList"
								 @click="clickGoodsAttr(index,attrIndex)">
									{{attrItem.name}}
								</view>
							</view>
						</view>
					</view>
				</view>

				<!-- 购买数量 -->
				<view class="payNumber">
					<view class="name">
						购买数量
					</view>
					<!-- 多规格加减数量 -->
					<view class="clearFlex choose-amount" v-if="goodsMoreSpecInfo">
						<view class="reduction iconfont" @click="bindMinusV2()">&#xeb9b;</view>
						<input type="number" disabled :value="goodsMoreSpecInfo.num">
						<view class="add iconfont" @click="addLimitV2()">&#xeb9c;</view>
					</view>
				</view>
				<!-- 底部确认按钮 -->
				<view class="payBtn" @click="confirm">确定</view>
			</view>
		</view>
		<!--e 点击购物车弹出详情 -->
	</view>
</template>

<script>
	const utils = require('../../common/utils')

	export default{
		props:{
			// goodsInfo:{},
			showPop:false
		},
		data(){
			return{
				hasMultipleAttribute: true,
				// showPop:true,
				num:1,
				getIndex:0,
				goodsId:'',
				shopId: '',
				goodsInfo:{},
				goodsSpecsList: [],
				goodsMoreSpecInfo:{},  // 默认第一个规格
				goodsAttrVOList :[],
				attrNameStr:'', // 默认第一个属性
				attrIdStr:'',
				flashSaleInfo: {} // 活动商品详情
			}
		},
	  computed: {

	  },
		methods:{
			initDetail(goodsId){
				this.shopInfo = uni.getStorageSync('shopInfo')
				this.shopId = this.$shopId
				this.goodsId = goodsId
				this.getIndex = this.num
				this.getGoodInfo()
			},
			// 关闭
			touchClose:function(){
				utils.showCacheCount()
				// this.showPop = false,
				this.$emit('touchClose','false')
			},
			bindMinus:function(e){
				var count = 1
				if(this.goodsInfo.buyMultiple) {
					count = count*this.goodsInfo.buyMultiple
				}
				this.num -=  count
				if(this.num <= 0) {
					this.num = 0
				}


			},
			addLimit:function(e){
				var count = 1
				if(this.goodsInfo.buyMultiple) {
					count = count*this.goodsInfo.buyMultiple
				}
				this.num +=  count
			},
			 // 确定
			confirm() {
				var that = this
				var info = that.info
				var goodId = info.isMultiSpecs == 1 ? info.goodsId : info.id;
				var specsId = info.isMultiSpecs == 1 ? info.id : 0
				that.goodKey = goodId + '_' + specsId + '_' + info.attrIdStr;
				if (that.info.num === 0) {
					uni.removeStorage({
						key: that.goodKey,
						fail: function(res) {
							console.log("移除商品出错")
						}
					});

					uni.getStorage({
						key: 'goodIds' + that.shopId,
						success(res) {
							var goodIdsArr = JSON.parse(res.data);
							if (utils.isNotNull(goodIdsArr)) {
								var haveObj = false;
							}
							for (let i = 0; i < goodIdsArr.length; i++) {
								var element = goodIdsArr[i];
								if (element === that.goodKey) {
									haveObj = true;
								}
							}
							if (haveObj) {
								utils.removeByValue(goodIdsArr, that.goodKey)
								wx.setStorage({
									key: 'goodIds' + that.shopId,
									data: JSON.stringify(goodIdsArr),
								})
								if (goodIdsArr.length === 0) {
									uni.getStorage({
										key: 'shopId',
										success: function(res) {
											var shopIdsArr = JSON.parse(res.data);
											if (utils.isNotNull(shopIdsArr)) {
												var haveObj = false;
												for (let i = 0; i < shopIdsArr.length; i++) {
													var element = shopIdsArr[i];
													if (element == that.shopId) {
														haveObj = true;
													}
												}

												if (haveObj) {
													utils.removeByValue(shopIdsArr, that.shopId);
													uni.setStorage({
														key: 'shopId',
														data: JSON.stringify(shopIdsArr),
													})
												}
											}
										}
									})
								}
							}
						}
					})
				}
				else {
					// console.log(JSON.stringify(that.info))
					if (info.minBuyCount && info.num<info.minBuyCount) {
						utils.showToast("请选择不小于起批量("+info.minBuyCount+")的数量")
						return
					}
					/**
					 * 存储商品信息
					 */
					uni.setStorage({
						key: that.goodKey + "",
						data: that.info,

						fail: function(res) {
							console.log("存储商品信息fail" + JSON.stringify(res))
						}
					})
					/**
					 * 存储已加购物车的商品Id
					 */
					uni.getStorage({
						key: 'goodIds' + that.shopId,
						success: function(res) {
							var goodIdsArr = JSON.parse(res.data);
							if (utils.isNotNull(goodIdsArr)) {
								var haveObj = false;
								for (let i = 0; i < goodIdsArr.length; i++) {
									var element = goodIdsArr[i];
									if (element == that.goodKey) {
										haveObj = true;
									}
								}
								if (!haveObj) {
									goodIdsArr.push(that.goodKey);
									uni.setStorage({
										key: 'goodIds' + that.shopId,
										data: JSON.stringify(goodIdsArr),
									})
								}
							} else {
								goodIdsArr.push(that.goodKey);
								uni.setStorage({
									key: 'goodIds' + that.shopId,
									data: JSON.stringify(goodIdsArr),
								})
							}
						},
						fail: function(res) {
							uni.setStorage({
								key: 'goodIds' + that.shopId,
								data: JSON.stringify([that.goodKey]),
							})
						},
						complete() {
							that.$emit('refreshCache')
						}
					})

					/**
					 * 存储店铺信息
					 */
					uni.getStorage({
						key: 'shopId',
						success(res) {
							var shopIdsArr = []
							shopIdsArr = JSON.parse(res.data);
							if (utils.isNotNull(shopIdsArr)) {
								var haveObj = false;
								for (let i = 0; i < shopIdsArr.length; i++) {
									var element = shopIdsArr[i];
									if (element == that.shopId) {
										haveObj = true;
									}
								}
								if (!haveObj) {
									shopIdsArr.push(that.shopId);
									uni.setStorage({
										key: 'shopId',
										data: JSON.stringify(shopIdsArr),
									})
								}
							} else {
								shopIdsArr.push(that.shopId);
								uni.setStorage({
									key: 'shopId',
									data: JSON.stringify(shopIdsArr),
									fail: function(res) {
										console.log("存储店铺Id---fail")
									}
								})
							}
						},
						fail: function(ress) {
							uni.setStorage({
								key: 'shopId',
								data: JSON.stringify([that.shopId]),

							})
						}
					})
				}
				this.$emit('touchClose','false')
				setTimeout(function () {
					utils.showCacheCount()
				},800)
			},
			/**
			 * 规格选择
			 */
			clickSpecsFuc: function(index) {
				var goodsSpecsArr = this.goodsSpecsList
				var goodsMoreSpecInfo = goodsSpecsArr[index] // 当前选已选中的规格
				for (var i = 0; i < goodsSpecsArr.length; i++) {
					var info = goodsSpecsArr[i];
					if (goodsMoreSpecInfo.id == info.id) {
						goodsSpecsArr[i].checked = true
					} else {
						goodsSpecsArr[i].checked = false
					}
				}
				this.goodsSpecsList = goodsSpecsArr
				this.goodsMoreSpecInfo = goodsMoreSpecInfo
				// console.log(goodsMoreSpecInfo)
				var specsId = utils.isNotNull(goodsMoreSpecInfo.isMultiSpecs) && goodsMoreSpecInfo.isMultiSpecs == 1 ? goodsMoreSpecInfo.id : 0
				this.queryCacheGoodInfo(goodsMoreSpecInfo.goodsId + '_' + specsId + '_' + this.attrIdStr)
			},


			/**
			 * 属性选择
			 */
			clickGoodsAttr: function(typeIndex, index) {
				let that = this;
				let goodsAttrArr = this.goodsAttrVOList; // 属性列表
				var attrInfo = goodsAttrArr[typeIndex] // 属性列表
				var attrName = attrInfo.name
				that.attrName = attrName
				var valueInfo = goodsAttrArr[typeIndex].goodsAttrValVOList[index] // 属性值信息
				var attrValueId = valueInfo.id

				// 拦截属性个数
				if (this.hasMultipleAttribute) {
					var checkedNum = attrInfo.checkedNum
					if (!(attrInfo.minCount == 1 && attrInfo.maxCount == 1)) { // 排除单选
						if (!valueInfo.checked && checkedNum + 1 > attrInfo.maxCount) {
							return
						}
					}
				}

				//TODO
				var attrNameStr = ''
				var attrIdStr = ''
				for (let i = 0; i < goodsAttrArr.length; i++) {
					if (goodsAttrArr[i].name === attrName) {
						for (let j = 0; j < goodsAttrArr[i].goodsAttrValVOList.length; j++) {
							// 某类属性可多选(如浩源)
							if (this.hasMultipleAttribute && !(attrInfo.minCount == 1 && attrInfo.maxCount == 1)) {
								if (goodsAttrArr[i].goodsAttrValVOList[j].id == attrValueId) {
									goodsAttrArr[i].goodsAttrValVOList[j].checked = !goodsAttrArr[i].goodsAttrValVOList[j].checked;
								}
							} else {
								if (goodsAttrArr[i].goodsAttrValVOList[j].id == attrValueId) {
									goodsAttrArr[i].goodsAttrValVOList[j].checked = true;
								} else {
									goodsAttrArr[i].goodsAttrValVOList[j].checked = false;
								}
							}
						}
					}
				}
				var attrNameStr = '',
						attrIdStr = '';
				// 展示已选择的属性
				for (let y = 0; y < goodsAttrArr.length; y++) {
					for (let z = 0; z < goodsAttrArr[y].goodsAttrValVOList.length; z++) {
						if (goodsAttrArr[y].goodsAttrValVOList[z].checked) {
							attrNameStr += goodsAttrArr[y].goodsAttrValVOList[z].name + '，'
							attrIdStr += goodsAttrArr[y].goodsAttrValVOList[z].id // 属性Id
						}
					}
				}
				attrNameStr = attrNameStr.substring(0, attrNameStr.length - 1)

				that.goodsAttrVOList = goodsAttrArr
				that.attrNameStr = attrNameStr
				that.attrIdStr = attrIdStr

				// 监测当前属性类别选中的个数（用于限制属性选择个数问题）
				if (this.hasMultipleAttribute) {
					var checkedNum = 0
					for (var zz = 0; zz < this.goodsAttrVOList[typeIndex].goodsAttrValVOList.length; zz++) {
						if (this.goodsAttrVOList[typeIndex].goodsAttrValVOList[zz].checked) {
							checkedNum++
						}
					}
					that.goodsAttrVOList[typeIndex].checkedNum = checkedNum
					console.log(checkedNum)
				}

				var goodsId = that.goodsMoreSpecInfo.goodsId //  utils.isNotNull(that.goodsMoreSpecInfo.goodsId) ? that.goodsMoreSpecInfo.goodsId : that.goodsMoreSpecInfo.id
				var specsId = utils.isNotNull(that.goodsMoreSpecInfo.isMultiSpecs) && that.goodsMoreSpecInfo.isMultiSpecs == 1 ?
						that.goodsMoreSpecInfo.id : 0

				that.queryCacheGoodInfo(goodsId + '_' + specsId + '_' + that.attrIdStr)
			},


			/**
			 * 多规格限购
			 */
			addLimitV2: function() {
				var mulLimitInfo = this.mulLimitInfo // 多规格限购信息
				var goodsMoreSpecInfo = this.goodsMoreSpecInfo

				// var numCount = this.queryCarNum(goodsMoreSpecInfo.goodsId) // 查询多规格已加车数量


				this.bindAddV2()
			},

			// 加
			bindAddV2() {
				var that = this;
				var info = that.goodsMoreSpecInfo;
				var goodId = info.isMultiSpecs == 1 ? info.goodsId : info.id;
				var num = utils.isNotNull(info.num) ? info.num : 0;
				// num++;
				var count = 1
				if(this.goodsInfo.buyMultiple) {
					count = count*this.goodsInfo.buyMultiple
				}
				num += count
				/**
				 * 库存问题处理
				 */
				if (info.checkStock === 1) {

					if (info.stock < num) { // goodsMoreSpecInfo.num
						utils.showToast("库存不足")
						return
					}
					if(utils.isNotNull(that.flashSaleInfo) && that.flashSaleInfo.goodsCount < num){
						utils.showToast("秒杀商品数量不足")
						return
					}
				}
				info.num = num;

				if (utils.isNotNull(info.isOriginal) && info.isOriginal) {
					info.price = info.originalPrice
				}
				var specsId = info.isMultiSpecs == 1 ? info.id : 0

				info.attrNameStr = utils.isNotNull(that.attrNameStr) ? that.attrNameStr : ''
				info.attrName = utils.isNotNull(that.attrName) ? that.attrName : ''
				info.attrIdStr = utils.isNotNull(that.attrIdStr) ? that.attrIdStr : ''
				info.goodsName = that.goodsInfo.name
				info.specsId = specsId
				var goodKey = goodId + '_' + specsId + '_' + info.attrIdStr;
				that.goodKey = goodId + '_' + specsId + '_' + info.attrIdStr;
				that.info = info
				that.goodsMoreSpecInfo = info
				// console.log(that.goodsMoreSpecInfo)
				// that.$emit('refreshCache')
			},

			// 减
			bindMinusV2() {
				var that = this;
				var info = that.goodsMoreSpecInfo;
				var goodId = info.isMultiSpecs == 1 ? info.goodsId : info.id;
				var specsId = info.isMultiSpecs == 1 ? info.id : 0
				var num = info.num;
				// if (num >= 1) {
				// 	num--;
				// }
				var count = 1
				if(this.goodsInfo.buyMultiple) {
					count = count*this.goodsInfo.buyMultiple
				}
				num -=  count
				if(num <= 0) {
					num = 0
				}

				if (info.minBuyCount && num<info.minBuyCount) {
					utils.showToast("请选择不小于起批量("+info.minBuyCount+")的数量")
					return
				}
				if (num === 0){
					utils.showToast("数量不能为0")
					return
				}
				if (utils.isNotNull(info.isOriginal) && info.isOriginal) {
					info.price = info.originalPrice
				}
				info.num = num;
				var goodKey = goodId + '_' + specsId + '_' + info.attrIdStr;
				that.goodKey = goodId + '_' + specsId + '_' + info.attrIdStr;
				that.info = info
				that.goodsMoreSpecInfo = info
				that.$emit('refreshCache')
			},
			// 拼接info
			infocombination(){
				var that = this;
				var info = that.goodsMoreSpecInfo;
				var goodId = info.isMultiSpecs == 1 ? info.goodsId : info.id;
				var specsId = info.isMultiSpecs == 1 ? info.id : 0
				var num = info.num;
				if(utils.isNull(num)) {
					num = 1
				}
				info.num = num;
				if (utils.isNotNull(info.isOriginal) && info.isOriginal) {
					info.price = info.originalPrice
				}
				info.attrNameStr = utils.isNotNull(that.attrNameStr) ? that.attrNameStr : ''
				info.attrName = utils.isNotNull(that.attrName) ? that.attrName : ''
				info.attrIdStr = utils.isNotNull(that.attrIdStr) ? that.attrIdStr : ''
				info.goodsName = that.goodsInfo.name
				info.specsId = specsId
				that.goodKey = goodId + '_' + specsId + '_' + info.attrIdStr;
				info.minBuyCount = that.goodsInfo.minBuyCount //起批量
				info.buyMultiple = that.goodsInfo.buyMultiple //加车倍数
				info.stock = that.goodsInfo.stock //库存
				info.isFlashGood = that.goodsInfo.isFlashGood
				that.info = info
			},

			/**
			 * 获取商品详情（规格属性）
			 */
			getGoodInfo: function() {
				var that = this
				var params = {
					"goodsId": that.goodsId
				};
				this.$apis.sendRequest({
					url: '/action/goods/detail',
					data: params,
					success: function(result) {
						console.log(result.info)
						var info = result.info;
						if (utils.isNotNull(info)&& utils.isNotNull(info.isFlashGood) && info.isFlashGood===1) {
							that.getFlashSaleInfo(info)
						}
						var goodsSpecsArr = []
						var goodsAttrArr = []
						/**
						 * 多规格处理
						 */
						if (utils.isNotNull(info) && info.goodsSpecsList.length > 0) {
							info.goodsSpecsList[0].checked = true // 规格默认第一个
							goodsSpecsArr = info.goodsSpecsList
							for (var i = 0; i < goodsSpecsArr.length; i++) {
								goodsSpecsArr[i].isMultiSpecs = 1
								goodsSpecsArr[i].num = 0
								goodsSpecsArr[i].src = info.imageUrl
								goodsSpecsArr[i].specsId = info.id
							}
						} else {
							info.src = info.imageUrl
							info.goodsId = info.id
							info.num = 0
							info.specsId = 0
						}

						/**
						 * 多属性处理
						 */
						var attrNameStr = ''
						var attrIdStr = ''
						var attrName = ''
						if (utils.isNotNull(info) && info.goodsAttrVOList.length > 0) {

							goodsAttrArr = info.goodsAttrVOList
							//  默认属性第一个
							for (var i = 0; i < goodsAttrArr.length; i++) {
								if (goodsAttrArr[i].goodsAttrValVOList.length>0) {
									goodsAttrArr[i].goodsAttrValVOList[0].checked = true
									goodsAttrArr[i].checkedNum = 1 // 多属性可选个数默认一个
									attrName += goodsAttrArr[i].name + ','
									attrNameStr += goodsAttrArr[i].goodsAttrValVOList[0].name + ','
									attrIdStr += goodsAttrArr[i].goodsAttrValVOList[0].id
								}
							}
							attrNameStr = attrNameStr.substring(0, attrNameStr.length - 1)
							attrName = attrName.substring(0, attrName.length - 1)
						}

						// that.goodsInfo = info
						that.goodsInfo = {}
						console.log(that.goodsInfo)
						// 去缓存
						that.goodsInfo = JSON.parse(JSON.stringify(info))
						console.log(that.goodsInfo)
						console.log(that.goodsInfo.minBuyCount)
						that.attrName = attrName
						that.attrNameStr = attrNameStr
						that.attrIdStr = attrIdStr
						that.goodsSpecsList = goodsSpecsArr // 多规格列表
						that.goodsAttrVOList = goodsAttrArr // 多属性列表
						that.goodsMoreSpecInfo = goodsSpecsArr.length > 0 ? goodsSpecsArr[0] : info // 默认第一个规格
						if (utils.isNotNull(info.isFlashGood) && info.isFlashGood===1) {
							that.goodsMoreSpecInfo.isFlashGood = info.isFlashGood
							that.goodsMoreSpecInfo.flashPrice = info.flashPrice
						}
						// console.log(that.goodsSpecsList)
						console.log(that.goodsMoreSpecInfo)
						var goodsId = that.goodsMoreSpecInfo.goodsId // goodsSpecsArr.length > 0 ? that.goodsMoreSpecInfo.goodsId : that.goodsMoreSpecInfo.id
						var specsId = utils.isNotNull(that.goodsMoreSpecInfo.isMultiSpecs) && that.goodsMoreSpecInfo.isMultiSpecs ===1 ? that.goodsMoreSpecInfo.id : 0
						that.queryCacheGoodInfo(goodsId + '_' + specsId + '_' + that.attrIdStr)
					}
				});
			},

			/**
			 * 点击属性规格查询匹配的商品信息
			 */
			queryCacheGoodInfo: function(key) {
				console.log("goodId_specsId_attrIdStr ===> " + key)
				var that = this,
						info = {};
				uni.getStorage({
					key: key,
					success: function(res) {
						info = res.data
						if (typeof info == 'string') {
							info = JSON.parse(info)
						}
						that.goodsMoreSpecInfo = info
						info.minBuyCount = that.goodsInfo.minBuyCount //起批量
						info.buyMultiple = that.goodsInfo.buyMultiple //加车数量
						info.stock = that.goodsInfo.stock //库存
						that.info = info
					},
					fail: function(res) {
						info = that.goodsMoreSpecInfo
						if (that.goodsInfo.minBuyCount){
							info.num = that.goodsInfo.minBuyCount
						}else{
							info.num = 1;
						}
						that.goodsMoreSpecInfo = info
						that.info = info
						console.log("查询失败")
					},
					complete() {
						// 拼接info
						that.infocombination()
					}
				})
			},
			/**
			 * 查询当前多规格商品数量
			 */
			queryCarNum(id) {
				var goodsIdsStr = uni.getStorageSync('goodIds' + this.shopId)
				var numCount = 0
				if (utils.isNotNull(goodsIdsStr) && JSON.parse(goodsIdsStr).length > 0) {
					var goodsIds = JSON.parse(goodsIdsStr)
					for (var i = 0; i < goodsIds.length; i++) {
						var val = JSON.stringify(goodsIds[i])
						if (val.indexOf(id) > 0) {
							var info = uni.getStorageSync(goodsIds[i])
							numCount += info.num
						}
					}
				}
				return numCount
			},
			// 获取活动列表
			getFlashSaleInfo(detail){
				this.detail = detail
				if (utils.isNull(detail) || utils.isNull(detail.flashGoodId)) {
					return
				}
				var that = this;
				var params = {
					"sysAppKey": this.$sysAppKey,
					"flashGoodId": detail.flashGoodId,
				};
				this.$apis.sendRequest({
					url: "/action/user/flash/sale/goods/detail",
					data: params,
					success: function (result) {
						var info = result.info;
						if (utils.isNotNull(info)) {
							that.flashSaleInfo = info
							that.flashSaleInfo.stock = that.flashSaleInfo.goodsCount -  that.flashSaleInfo.marketCount
						}
					}
				})
			},
		}
	}
</script>

<style type="text/less" lang="scss">
	@import 'cartDateil.less';
</style>
