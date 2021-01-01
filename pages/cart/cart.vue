
<!-- 购物车 -->

<template>
	<view class="container">
		<view v-if="shopItems && shopItems.length>0">
			<!-- 列表 -->
			<view v-for="(item, index) in shopItems" :key="index">
				<view class="show-item">
					<view class="shop-title">
						<image
							class="yticon checkbox"
							:class="{checked: item.shopChecked}"
							:src="item.shopChecked ? '../../static/icop-ico9.png':'../../static/icop-ico8.png'"
							@click="checkShop(index)"
						></image>
						<text @click="toShopInfo(item.id)">{{item.title}}
						</text>
					</view>
				</view>
				<view class="cart-list">
					<block v-for="(itemChid, indexC) in item.child" :key="indexC">
						<!--套餐-->
						<view class="cart-item2" v-if="itemChid.isGroupGood===1">
							<!-- :class="{'b-b': index!==item.child.length-1}" -->
							<view class="groupGoods">
								<image
										class="yticon checkbox"
										:class="{checked: itemChid.checked}"
										:src="itemChid.checked ? '../../static/icop-ico9.png':'../../static/icop-ico8.png'"
										@click="checkOnly(index, indexC)"
								></image>
								<view class="image-wrapper">
									<image :src="itemChid.src || '../../static/goodsImg.jpg'" lazy-load style="opacity: 1;"></image>
									<text v-if="itemChid.isFlashGood===1" class="tt_pp" >秒杀</text>
								</view>
								<view class="item-right">
									<text class="clamp title">
										<text class="rx" v-if="itemChid.isGroupGood===1">套餐</text>
										{{itemChid.goodsName}}
									</text>
									<text class="attr" v-if="itemChid.name">{{itemChid.name}}</text>
									<text class="attr" v-if="itemChid.attrNameStr">{{itemChid.attrNameStr}}</text>
									<text class="price">¥{{itemChid.isFlashGood===1?itemChid.flashPrice:itemChid.price|numberFormat}}</text>

									<view class="clearFlex choose-amount">
										<image class="right normal" src="../../static/icop-ico20.png" mode="widthFix" @click="bindAdd(index, indexC)"></image>
										<image class="left normal" src="../../static/icop-ico21.png" mode="widthFix" @click="bindMinus(index, indexC)"></image>
										<input class="input" disabled="true" type="number" :value="itemChid.num" />
									</view>
								</view>
							</view>
							<view class="groupAllGoods" v-for="(itemGroup, indexGroup) in itemChid.goodsGroups" v-if="itemChid.showAllGroup?indexGroup>=0:indexGroup<2">
								<view class="image-wrapper2">
									<image :src="itemGroup.imageUrl" lazy-load style="opacity: 1;"></image>
								</view>
								<view class="item-right" >
									<text class="clamp title">
										{{itemGroup.name}}
									</text>
									<text class="attr">{{itemGroup.manufacturerName}}</text>
									<text class="attr">x {{itemGroup.groupNumber}}</text>
								</view>
							</view>
							<!--							向下箭头 展示全部-->
							<view class="showmore" v-if="!itemChid.showAllGroup&&(itemChid.goodsGroups.length-2)>0"  @click="showAllGroup(index, indexC)">
								<image class="img" :src="'../../static/down.png'"></image>
							</view>
							<!-- <text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text> -->
						</view>
						<view class="cart-item" v-else>
							<image
								class="yticon checkbox"
								:class="{checked: itemChid.checked}"
								:src="itemChid.checked ? '../../static/icop-ico9.png':'../../static/icop-ico8.png'"
								@click="checkOnly(index, indexC)"
							></image>
							<view class="image-wrapper">
								<image :src="itemChid.src || '../../static/goodsImg.jpg'" lazy-load style="opacity: 1;"></image>
								<text v-if="itemChid.isFlashGood===1" class="tt_pp" >秒杀</text>
								<text v-if="itemChid.isGroupGood===1" class="tt_pp" >套餐</text>
							</view>
							<view class="item-right">
								<text class="clamp title">
									{{itemChid.goodsName}}
								</text>
								<text class="attr" v-if="itemChid.name">{{itemChid.name}}</text>
								<text class="attr" v-if="itemChid.attrNameStr">{{itemChid.attrNameStr}}</text>
								<text class="price">¥{{itemChid.isFlashGood===1?itemChid.flashPrice:itemChid.price|numberFormat}}
									<text class="tt_yxq" style="margin-left: 10rpx;text-decoration: line-through;" v-if="itemChid.originalPrice > (itemChid.isFlashGood===1?itemChid.flashPrice:itemChid.price)">￥{{itemChid.originalPrice|numberFormat}}</text>
								</text>

								<view class="clearFlex choose-amount">
									<image class="right normal" src="../../static/icop-ico20.png" mode="widthFix" @click="bindAdd(index, indexC)"></image>
									<image class="left normal" src="../../static/icop-ico21.png" mode="widthFix" @click="bindMinus(index, indexC)"></image>
									<input class="input" disabled="true" type="number" :value="itemChid.num" />
								</view>
							</view>

						</view>
					</block>
				</view>
			</view>

			<!-- 底部按钮 -->
			<view class="clearFlex lowViews">
				<view class="shopcar">
					<image src="../../static/icop-ico4.png" mode="widthFix"></image>
					<text class="number" v-if="goodCount>0">{{goodCount}}</text>
				</view>
				<!--				<view class="price">￥{{goodsPrice}}</view>-->
				<view :class="packetPrice>0? 'price2' : 'price' ">￥{{goodsPrice|numberFormat}}
					<!--					<text class="price3">￥{{originalPrice}}</text>-->
				</view>
				<button class="payBtn" style="background-color: #04C1AB;" type="primary" @click="creatOrder">选好了</button>
			</view>
		</view>
		<view v-else class="empty">
			<image src="/static/empty.png" mode="aspectFit"></image>
			<view  class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	const utils = require('../../common/utils')
	export default {
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				shopChecked:true,
				totalNumber:0,
				shopItems: [],
				goodCount: 0,
				goodsPrice: 0,
				originalPrice: 0,  // 原价
				packetPrice: 0 // 打包费
			};
		},
		onLoad(){
			// this.loadData();
			// this.showCache()
		},
		onShow() {
			this.showCache()
		},
		watch:{
			//显示空白页
			cartList(e){
				this.empty = false
			}
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			// 加载缓存数据
			showCache () {
				console.log("加载数据")
				var that = this
				var allPrice = 0, allCount = 0;
				var originalPrice = 0  // 原价
				var packetPrice = 0 // 打包费
				uni.getStorage({
					key: 'shopId',
					success:function (res) {
						var data = res.data, shopIdArr = []
						if (typeof data == 'string') {
							shopIdArr= JSON.parse(data);
						}
						var fatherArr = [];
						if (utils.isNotNull(shopIdArr) && shopIdArr.length > 0) {
							for (var i = 0; i < shopIdArr.length; i++) {
								var shopId = shopIdArr[i];

								// var shopInfoStr = uni.getStorageSync('shopId' + shopId);
								// var shopInfo = JSON.parse(shopInfoStr);
								var shopInfo = uni.getStorageSync('shopInfo');
								var goodsStr = uni.getStorageSync('goodIds' + shopId);
								if (utils.isNull(goodsStr)){
									return
								}
								var goodsArr = []
								if (typeof goodsStr==='string') {
									goodsArr = JSON.parse(goodsStr);
								}
								var childArr = [];

								if (utils.isNotNull(goodsArr) && goodsArr.length > 0) {
									for (var j = 0; j < goodsArr.length; j++) {
										var goodid = goodsArr[j];
										var goodInfo = uni.getStorageSync(goodid + '');
										if (utils.isNull(goodInfo)) {
											continue;
										}
										console.log(typeof goodInfo)
										if (typeof goodInfo == 'string') {
											goodInfo = JSON.parse(goodInfo)
										}
										goodInfo.checked = false
										goodInfo.showAllGroup = false
										childArr.push(goodInfo);
									}
								}
								if (utils.isNotNull(childArr) && childArr.length > 0) {
									fatherArr.push({
										'id': shopInfo.id,
										"shopPacketPrice": shopInfo.packetPrice,
										'title': shopInfo.shopName,
										'shopChecked': 0,
										'child': childArr
									});
								}
								that.shopItems = fatherArr
								console.log(that.shopItems)
							}
						} else {
							that.shopItems = [];
							that.goodCount = 0;
							that.goodsPrice = 0;
							that.originalPrice = 0  // 原价
							that.packetPrice = 0 // 打包费
						}
						that.calcTotal()
					},
					fail() {
						console.log("获取失败")
						that.shopItems = [];
						that.goodCount = 0;
						that.goodsPrice = 0;
						that.originalPrice = 0  // 原价
						that.packetPrice = 0 // 打包费
					}
				})
			},

			checkShop(index){
				var lists = this.shopItems;
				var child = lists[index].child;
				lists[index].shopChecked ^= 1;
				console.log(lists[index].shopChecked)
				for (var i = 0; i < child.length; i++) {
					child[i].checked = lists[index].shopChecked;
				};
				console.log(lists)
				this.shopItems = lists
				this.calcTotal();
			},

			//计算总价
			calcTotal(){
				var lists = this.shopItems;
				var allCount = 0, allPrice = 0.0;
				var originalPrice = 0  // 原价
				var packetPrice = 0 // 打包费
				for (var i = 0; i < lists.length; i++) {
					var shopInfo = lists[i];
					var goodsArr = shopInfo.child;
					shopInfo.child.forEach(goodInfo=>{
						console.log()
						if (goodInfo.checked == 1) {
							allCount += goodInfo.num;
							allPrice += goodInfo.num * (goodInfo.isFlashGood===1?goodInfo.flashPrice:goodInfo.price)
							originalPrice += goodInfo.num * goodInfo.originalPrice
							packetPrice += goodInfo.num * goodInfo.packetPrice
						}
					})
				}
				// console.log(allCount)
				// console.log(allPrice.toFixed(2))
				this.goodCount = Number(allCount)
				this.goodsPrice = Number(allPrice.toFixed(2))
				this.originalPrice = Number(originalPrice.toFixed(2))
				this.packetPrice = Number(packetPrice.toFixed(2))
				utils.showCacheCount()
			},

			//选中状态处理
			checkOnly(index, indexC){
				var lists = this.shopItems;
				var n = 0;
				var checked = lists[index].child[indexC].checked;
				lists[index].child[indexC].checked ^= 1;

				for (var j = 0; j < lists[index].child.length; j++) {
					var check = lists[index].child[j].checked;
					if (check == 1) {
						n++;
					};
				};
				if (n == lists[index].child.length) {
					lists[index].shopChecked = 1;
				} else {
					lists[index].shopChecked = 0;
				};

				this.shopItems = lists

				this.calcTotal();
			},
			showAllGroup(index, indexC) {
				this.shopItems[index].child[indexC].showAllGroup = true;

			},
			bindAdd: function (index, indexC) {
				var that = this;
				var lists = this.shopItems;
				var shopId = lists[index].id;
				var isMultiSpecs = lists[index].child[indexC].isMultiSpecs;
				var goodId =  utils.isNotNull(isMultiSpecs) && isMultiSpecs == 1 ? lists[index].child[indexC].goodsId : lists[index].child[indexC].id;
				var specsId = utils.isNotNull(isMultiSpecs) && isMultiSpecs == 1 ? lists[index].child[indexC].id : 0;
				var attrIdStr = lists[index].child[indexC].attrIdStr; // 属性Id
				var info = lists[index].child[indexC]

				var goodKey = goodId + '_' + specsId + '_' + attrIdStr

				var num = lists[index].child[indexC].num;

				var count = 1
				if (info.buyMultiple) { // 加车数量
					count = info.buyMultiple
				}
				num += count;
				/**
				 * 库存问题处理
				 */
				if (lists[index].child[indexC].checkStock === 1) {
					var goodsStock = lists[index].child[indexC].stock;
					if (num > goodsStock) {
						utils.showToast("库存不足")
						return
					}
				}

				lists[index].child[indexC].num = num;
				uni.setStorage({
					key: goodKey + "",
					data: lists[index].child[indexC],
				});
				this.calcTotal()
			},

			/**
			 * 绑定减1
			 */
			bindMinus: function (index, indexC) {
				var that = this;
				var lists = that.shopItems;
				var info = lists[index].child[indexC]
				var num = lists[index].child[indexC].num;
				var shopId = lists[index].id;
				var isMultiSpecs = lists[index].child[indexC].isMultiSpecs;
				var count = 1
				if(info.buyMultiple){
					count = info.buyMultiple
				}
				num -=  count
				if(num <= 0) {
					num = 0
				}
				if(info.minBuyCount&&num<info.minBuyCount){  // 起批量判断
					num = 0
				}
				lists[index].child[indexC].num = num;

				var goodId =  utils.isNotNull(isMultiSpecs) && isMultiSpecs == 1 ?  lists[index].child[indexC].goodsId : lists[index].child[indexC].id ;
				var specsId = utils.isNotNull(isMultiSpecs) && isMultiSpecs == 1 ? lists[index].child[indexC].id : 0;

				var attrIdStr = lists[index].child[indexC].attrIdStr; // 属性Id
				var goodKey = goodId + '_' + specsId + '_' + attrIdStr
				if (num === 0) {
					lists[index].child.splice(indexC, 1);
					if (lists[index].child.length === 0) {
						lists.splice(index, 1);
					}
					uni.removeStorage({
						key: goodKey + "",
						success: function (res) {
						},
						fail(err) {
							console.log("商品移除"+ree)
						}
					});

					wx.getStorage({
						key: 'goodIds' + shopId,
						success: function (res) {
							var goodIdsArr = JSON.parse(res.data);
							if (utils.isNotNull(goodIdsArr)) {
								var haveObj = false;
								for (let i = 0; i < goodIdsArr.length; i++) {
									var element = goodIdsArr[i];
									if (element == goodKey) {
										haveObj = true;
									}
								}

								if (haveObj) {
									utils.removeByValue(goodIdsArr, goodKey);

									if (goodIdsArr.length == 0) {
										uni.getStorage({
											key: 'shopId',
											success: function (res) {
												var data = res.data, shopIdsArr = []
												if (typeof data == 'string') {
													shopIdsArr= JSON.parse(data);
												}
												if (utils.isNotNull(shopIdsArr)) {
													var haveObj = false;
													for (let i = 0; i < shopIdsArr.length; i++) {
														var element = shopIdsArr[i];
														if (element == shopId) {
															haveObj = true;
														}
													}

													if (haveObj) {
														utils.removeByValue(shopIdsArr, shopId);

														uni.setStorage({
															key: 'shopId',
															data: JSON.stringify(shopIdsArr),
														})
													}
												}
											},
											fail: function (ress) {
												console.log(ress);
											}
										})
									}

									wx.setStorage({
										key: 'goodIds' + shopId,
										data: JSON.stringify(goodIdsArr),
									})
								}
							}
						},
						fail(ress) {
							console.log(ress)
						}
					})
				} else {
					uni.setStorage({
						key: goodKey + "",
						data: lists[index].child[indexC],
					})
				}
				this.shopItems = lists
				this.calcTotal()
			},

			creatOrder(){
				var that = this;
				var token = ""
				try{
					token = uni.getStorageSync("token")
				}catch(e){
					//TODO handle the exception
				}
				if (utils.isNull(token)) {
					uni.navigateTo({
						url: '../public/login'
					})
					return
				}
				var selectShop = this.shopItems;
				var multiShop = [];
				var shopIdArr = [];
				var shopId = '';

				for (var i = 0; i < selectShop.length; i++) {
					var shopInfo = selectShop[i];
					var goodsA = [];
					// shopId = shopInfo.id;

					for (var j = 0; j < shopInfo.child.length; j++) {
						var checked = shopInfo.child[j].checked;
						var isMultiSpecs = shopInfo.child[j].isMultiSpecs
						if (checked == 1) {
							shopId = shopInfo.id;
							shopIdArr["" + shopId] = "" + shopId;
							goodsA.push({
								goodsId: shopInfo.child[j].goodsId?shopInfo.child[j].goodsId:shopInfo.child[j].id,
								specsId:shopInfo.child[j].specsId,
								totalCount: shopInfo.child[j].num,
								attrIdStr: utils.isNotNull(shopInfo.child[j].attrIdStr) ? shopInfo.child[j].attrIdStr : '',
								attrNameStr: utils.isNotNull(shopInfo.child[j].attrNameStr) ? shopInfo.child[j].attrNameStr : '',
							});
						}
					}
					if (goodsA.length > 0) {
						multiShop.push({
							shopId: shopId,
							goods: goodsA
						});
					}
				}
				if (Object.keys(shopIdArr).length > 1) {
					utils.showToast("只能选择一家商店的商品结算")
					return
				}
				if (Object.keys(shopIdArr).length < 1 || multiShop.goodsA < 1) {
					utils.showToast("请选择要购买的商品")
					return;
				}


				var goodString = JSON.stringify(multiShop);

				console.log(goodString)
				var url= '../order/submitOrder?shopId=' + shopId + '&goodsArr=' + goodString
				console.log(url)
				uni.navigateTo({
					url:url
				})

				// uni.getStorage({
				// 	key: "goodIds" + this.shopId,
				// 	success: function (res) {
				// 		var goodIdsList = JSON.parse(res.data);
				// 		if (goodIdsList.length > 0) {
				// 			var goodString = "", multiShop = [], goodsA = [];
				// 			for (let i = 0; i < goodIdsList.length; i++) {
				// 				var element = goodIdsList[i];
				// 				try{
				// 					var value = uni.getStorageSync(element + '')
				// 					if (typeof value == 'string') {
				// 						value = JSON.parse(value)
				// 					}
				// 					var attrIdStr = utils.isNotNull(value.attrIdStr) ? value.attrIdStr : ''
				// 					var attrNameStr = utils.isNotNull(value.attrNameStr) ? value.attrNameStr : ''
				// 					var isMultiSpecs = value.isMultiSpecs
				// 					var specsId = utils.isNotNull(value.specsId) ? value.specsId : 0
				// 					if (value) {
				// 						goodsA.push({
				// 							goodsId: value.id,
				// 							specsId: specsId,
				// 							totalCount: value.num,
				// 							attrIdStr: attrIdStr,
				// 							attrNameStr: attrNameStr
				// 						});
				// 					}

				// 				}catch(e){
				// 					//TODO handle the exception
				// 					console.log(e);
				// 				}
				// 			}
				// 			multiShop.push({
				// 				shopId: that.shopId,
				// 				goods: goodsA
				// 			});
				// 			goodString = JSON.stringify(multiShop);

				// 			uni.navigateTo({
				// 				url:'../order/createOrder?shopId=' + that.shopId + '&goodsArr=' + goodString
				// 			})
				// 		} else {
				// 			utils.showToast("请先选择要购买的商品~")
				// 		}
				// 	}
				// })

			},



			//请求数据
			async loadData(){
				let list = await this.$api.json('cartList');
				let cartList = list.map(item=>{
					item.checked = true;
					return item;
				});
				this.cartList = cartList;
				this.calcTotal();  //计算总价
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},

			//数量
			numberChange(data){
				this.cartList[data.index].number = data.number;
				this.calcTotal();
			},
			addLimit(index){
				let that = this
				that.cartList[index].number += 1
				that.calcTotal();
			},
			// bindMinus(index){
			// 	// console.log(e)
			// 	let that = this
			// 	if (that.cartList[index].number > 0) {
			// 		that.cartList[index].number -= 1
			// 	}
			// 	that.calcTotal();
			// },
			//删除
			deleteCartItem(index){
				let list = this.cartList;
				let row = list[index];
				let id = row.id;

				this.cartList.splice(index, 1);
				this.calcTotal();
				uni.hideLoading();
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							this.cartList = [];
						}
					}
				})
			},
			// 去商家
			toShopInfo(id) {
				var that = this;
				var token = uni.getStorageSync("token")
				var params = {
					"token": token,
					"shopId": id,
					"sysAppKey": this.$sysAppKey,
				};
				var url = "/action/shop/info"
				this.$apis.sendRequest({
					url: url,
					data: params,
					success: function (result) {
						var info  = result.info;
						var routeStr = "../shopGoodsList/shopGoodsList"
						if ((info.cloudShopType & 4) > 0) {
							routeStr = "../home/home"
						}
						var toUrl = routeStr + "?shopId=" + info.id  + "&squareId=" + info.squareId;
						uni.navigateTo({
							url:toUrl
						})
					}
				})
			}




			//创建订单
			// createOrder(){
			// 	let list = this.cartList;
			// 	let goodsData = [];
			// 	list.forEach(item=>{
			// 		if(item.checked){
			// 			goodsData.push({
			// 				attr_val: item.attr_val,
			// 				number: item.number
			// 			})
			// 		}
			// 	})

			// 	uni.navigateTo({
			// 		url: `/pages/order/createOrder?data=${JSON.stringify({
			// 			goodsData: goodsData
			// 		})}`
			// 	})
			// 	this.$api.msg('跳转下一页 sendData');
			// }
		}
	}
</script>

<style type='text/less' lang='scss'>
	@import 'cart.less';
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:24upx 30upx;
		padding-left:90upx;
		border-bottom: 1upx solid #f8f8f8;
		.image-wrapper{
			width: 160upx;
			height: 160upx;
			flex-shrink: 0;
			margin-right: 10upx;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:25upx;
			top: 50%;
			z-index: 8;
			font-size: 44upx;
			width: 40upx;
			height: 40upx;
			line-height: 1;
			margin-top: -20upx;
			/* color: $font-color-disabled; */
			color: #fff;
			background:#fff;
			border-radius: 50px;
			box-sizing: border-box;
			border:1px solid #ddd;
		}
		/* 		.checkbox:before{
                    border:1px solid #ddd;
                    border-radius: 50px;
                    width: 40upx;
                    height: 40upx;
                } */
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			.title{
				font-size:$font-base - 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.price{
				font-size:30upx;
				color: #ff1414;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 购物车列表项套餐 */
	.cart-item2{
		padding:24rpx 30rpx 24rpx 0rpx;
		border-bottom: 1upx solid #f8f8f8;
		.groupGoods {
			display:flex;
			position:relative;
			padding-left:90upx;
			padding-bottom: 24rpx;
			border-bottom: 1upx solid #f8f8f8;
			.checkbox{
				position:absolute;
				left:25upx;
				top: 50%;
				z-index: 8;
				font-size: 44upx;
				width: 40upx;
				height: 40upx;
				line-height: 1;
				margin-top: -20upx;
				/* color: $font-color-disabled; */
				color: #fff;
				background:#fff;
				border-radius: 50px;
				box-sizing: border-box;
				border:1px solid #ddd;
			}
			.image-wrapper{
				width: 160upx;
				height: 160upx;
				flex-shrink: 0;
				margin-right: 10upx;
				position:relative;
				image{
					border-radius:8upx;
				}
			}
		}
		.groupAllGoods {
			padding-left:130upx;
			display:flex;
			padding-top: 15rpx;
			padding-bottom: 15rpx;
			.image-wrapper2{
				width: 120upx;
				height: 120upx;
				flex-shrink: 0;
				margin-right: 10upx;
				position:relative;
				image{
					width: 100%;
					height: 100%;
					border-radius:8upx;
				}
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 40upx;
				line-height: 40upx;
			}
		}


		/* 		.checkbox:before{
                    border:1px solid #ddd;
                    border-radius: 50px;
                    width: 40upx;
                    height: 40upx;
                } */
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			.title{
				font-size:$font-base - 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.price{
				font-size:30upx;
				color: #ff1414;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx;
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		/* color: $uni-color-primary; */
		border-color:#f4b74a;
		color: #f4b74a;
	}
	/*下箭头*/
	.showmore {
		font-size: 26upx;
		text-align: center;
		/*line-height: 82upx;*/
		background-color: white;
		color: #999;
		border-top: 1px solid #FAFAFA;
	}
	.showmore .img {
		margin-left: 15rpx;
		width: 50rpx;
		height: 35rpx;
		margin-top: 24rpx;

	}
</style>
