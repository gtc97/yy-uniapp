

<!-- 提交订单 -->

<template>
	<view>
		<!-- 地址 -->
		<view class="address-section">
			<view class="order-content" @click="changeAddress" v-if="selectHeadr == 0">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{addInfo.buyer}}</text>
						<text class="mobile">{{addInfo.telephone}}</text>
					</view>
					<text class="address">{{addInfo.address}}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		</view>
		<!--s 配送 -->
<!--		<view class="beisong" v-if="selectHeadr == 0">-->
<!--			&lt;!&ndash; <view class="distribution" >-->
<!--				配送时间 :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2020-01-02 18:17:48-->
<!--			</view> &ndash;&gt;-->

<!--			<view class="distribution" >-->
<!--				<picker class='time-picker' style='float:left;width:100%;' mode="multiSelector"-->
<!--					@change="bindStartMultiPickerChangeV2" @click='pickerTap'-->
<!--					@columnchange="bindMultiPickerColumnChange"-->
<!--					:value="multiIndex" :range="multiArray">-->
<!--				  <view class="picker">-->
<!--					<text class="user-motto" :decode="true" style='font-size:30upx'>-->
<!--						配送时间 :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{appointDate}}-->
<!--					</text>-->
<!--					</view>-->
<!--				</picker>-->
<!--			</view>-->
<!--		</view>-->
		<!--e 配送 -->
		<!--s 到店 -->
		<!-- <view class="daodian" v-if="selectHeadr == 1">
		</view> -->
		<!--e 到店 -->
		<view class="goods-section" v-for="(item, index) in shopGoodsList" :key="index">
			<view class="g-header b-b">
				<image class="logo" :src="item.shopImageUrl"></image>
				<text class="name">{{item.shopName}}</text>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-for="(subitem, indexC) in item.goodsList" :key="indexC">
				<image :src="subitem.imageUrl"></image>
				<view class="right">
					<view class="price-box">
						<text class="price">￥{{subitem.price}}</text>
						<text class="number">x {{subitem.num}}</text>
					</view>
					<text class="clamp title">
						<text v-if="subitem.goodsName">{{subitem.goodsName}}</text>
					</text>
<!--					<text class="title clamp">{{subitem.name}}</text>-->
					<text class="spec" v-if="subitem.name">{{subitem.name}}</text>
				</view>
			</view>
<!--			<view class="g-item">-->
<!--				<image src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg"></image>-->
<!--				<view class="right">-->
<!--					<view class="price-box">-->
<!--						<text class="price">￥17.8</text>-->
<!--						<text class="number">x 1</text>-->
<!--					</view>-->
<!--					<text class="title clamp">韩版于是洞洞拖鞋 夏季浴室防滑简约居家【新人专享，限选意见】</text>-->
<!--					<text class="spec">春装款 L</text>-->
<!--				</view>-->
<!--			</view> -->
		</view>

		<!-- 优惠明细 -->
<!--					<view class="yt-list">-->
<!--						<view class="yt-list-cell b-b" @click="toggleMask('show')">-->
<!--							<view class="cell-icon">-->
<!--								券-->
<!--							</view>-->
<!--							<text class="cell-tit clamp">优惠券</text>-->
<!--							<text class="cell-tip active">-->
<!--								选择优惠券-->
<!--							</text>-->
<!--							<text class="cell-more wanjia wanjia-gengduo-d"></text>-->
<!--						</view>-->
<!--						<view class="yt-list-cell b-b">-->
<!--							<view class="cell-icon hb">-->
<!--								减-->
<!--							</view>-->
<!--							<text class="cell-tit clamp">商家促销</text>-->
<!--							<text class="cell-tip disabled">暂无可用优惠</text>-->
<!--						</view>-->
<!--					</view>-->
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">

				<block v-for="(item, index) in goodDisplayList" :key="index">
					<view class="clearFlex info_cv">
						<text class="cell-tit clamp">{{item.name}}</text>
						<text class="cell-tip">{{item.price}}</text>
					</view>
					<block v-if="index == goodDisplayList.length - 2">
						<view class="yt-list-cell b-b" style="padding: 9upx 5upx;" @click="selectRedPackage">
							<view class="clearFlex info_cv">
								<text class="yticon icon-you"></text>
								<text class="cell-tip red" v-if="redPackagePrice>0">-￥{{redPackagePrice}}</text>
								<text class="cell-tit clamp">红包</text>
							</view>
						</view>
					</block>
				</block>

				 <!-- 活动信息 -->
				<view class='game-wrap' v-if="gameArray && gameArray.length >= 1">
					<view class='game' v-for="(item, index) in gameArray" :key='index'>
					  <view class='manjian'>
						  <image class='game-img' :src="item.image"/>
						  <view>{{item.name}}</view>
					  </view>
					  <view class='awardMoney'>{{item.priceStr}}</view>
					</view>
				</view>

<!-- 				<view class="clearFlex info_cv">
					<text class="cell-tit clamp">运费</text>
					<text class="cell-tip">0</text>
				</view>
				<view class="clearFlex info_cv">
					<text class="cell-tit clamp">打包费</text>
					<text class="cell-tip">0</text>
				</view>
				<view class="clearFlex info_cv">
					<text class="cell-tit clamp">已优惠</text>
					<text class="cell-tip">￥0</text>
				</view> -->
			</view>

			<!-- <view class="yt-list-cell b-b">
				<view class="clearFlex info_cv">
					<text class="cell-tit clamp">红包</text>
					<text class="cell-tip red">-￥35</text>
					<text class="yticon icon-you"></text>
				</view>
			</view> -->
			<view class="yt-list-cell desc-cell">
				<!-- <view class="clearFlex info_cv">
					<text class="cell-tit clamp">实付款</text>
					<text class="cell-tip">21</text>
				</view> -->
				<view class="clearFlex info_cv info_cv2">
					<text class="cell-tit clamp">备注</text>
					<input class="desc" type="text" v-model="desc" placeholder="口味、偏好等" placeholder-class="placeholder" />
				</view>
			</view>
		</view>

		<!-- 底部 -->
		<view class="clearFlex footer">
			<!-- <view class="price-content">
				<text>实付款</text>
				<text class="price-tip">￥</text>
				<text class="price">475</text>
			</view> -->
			<text class="canleBnt" @click="goBack()">取消订单</text>
			<text class="submit" @click="submitSingleShopOrder">提交订单</text>
		</view>

		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">有效期至2019-06-30</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text>满30可用</text>
						</view>

						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	var date = new Date();
	var currentHours = date.getHours();
	var currentMinute = date.getMinutes();
	export default {
		data() {
			const currentDate = this.getDate({
			            format: true
			       })
			return {
				maskState: 0, //优惠券面板显示状态
				isOnceOrder: false, // 是不是再来一单
				payType: 1, //1微信 2支付宝
				couponList: [
					{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					}
				],
				shop: {},
				className:"triangle-topleft",
				startdate:currentDate,
				getStart:"请选择日期",

				addInfo: {},
				selectHeadr:0,
				appointDate: '',
				multiArray: [
				   ['今天', '明天', '3/2', '3/3', '3/4', '3/5'],
				   [0, 1, 2, 3, 4, 5, 6],
				   [0, 10, 20]
				],
				multiIndex: [0, 0, 0],
				shopId: "",
				multiShopGoods: "",
				goodDisplayList:  [],
				goodMoneyObj:  {},
				shopGoodsList: [],
				showPs: 1,
				shopZq: 1,
				ziquUserInfo: {buyer: "", telephone: ""},
				desc: '', //备注
				ziquTime: "请选择日期",
				goodType: "" ,//2 创业商圈商品  其他 普通商品
				shopDeliveryPriceType: 3,
				redPackagePrice: 0,
				redpacketArray: [],
				gameArray: [],
				gameArray2: [],
				totalAward: 0, //总优惠

			}
		},
		computed:{
			startDate() {
				return this.getDate('start');
			},
		},
		onLoad(option){
			//商品数据
			// let data = JSON.parse(option.data);
			// console.log(option.shopId)
			// console.log(option.goodsArr)
			// console.log(option.goodType)
			// console.log(option.isOnceOrder)
			// console.log(option.shopInfo)
			this.isOnceOrder = false;
			this.shop = {};
			if(option.isOnceOrder && option.isOnceOrder === '1') {
				this.isOnceOrder = true;
			}
			if(this.isOnceOrder) {
				if(utils.isNotNull(option.shopInfo)){
					this.shop = option.shopInfo;
					if(typeof this.shop === 'string') {
						this.shop = JSON.parse(this.shop);
					}
				}
			}
			this.ziquUserInfo = uni.getStorageSync('ziquUserInfo')
			this.appointDate = utils.formatTime(Date.parse(new Date()) + 30 * 60 * 1000, 'Y/M/D h:m:s');


			this.shopId = option.shopId + '';
			this.multiShopGoods = option.goodsArr + '';
			this.goodType = option.goodType + '';
			this.showGoods(this.shopId, this.multiShopGoods); //展示商品信息


			// this.getUserRedPackage(); //获取用户红包
			// this.getUserAddres()
		},
		methods: {
			goBack () {
				uni.navigateBack()
			},
			showGoods() {
				var that = this;
				var multiShop = [];
				if (utils.isNotNull(this.multiShopGoods) && typeof this.multiShopGoods == 'string') {
					multiShop = JSON.parse(this.multiShopGoods);
				}
				if (multiShop.length > 0) {
					var totalMoney = 0 //总金额
						,totalGoodsMoney = 0 //商品金额
						,totalPeisong = 0 //运费
						,totalWeight = 0; // 总量量

						var shopGooL = [];
						for (var i = 0; i < multiShop.length; i++) { //遍历店铺
							var shopId =  multiShop[i].shopId;
							var shopInfo = uni.getStorageSync("shopInfo");
							if(this.isOnceOrder) {
								shopInfo = this.shop;
							}
							var goodInfoArr = [];
							var goodsA = multiShop[i].goods;
							if (utils.isNotNull(goodsA) && goodsA.length > 0) {
								for (var j = 0; j < goodsA.length; j++) {
									var element = goodsA[j];
									if (utils.isNull(element)) {
										continue;
									}
									var isMultiSpecs;
									try{
										let goodsInfo = {};
										if(this.isOnceOrder) {
											goodsInfo = element;
										}else {
											isMultiSpecs = element.isMultiSpecs;
											var gdId = element.goodsId;
											var spId = element.specsId;
											var attrIdStr = element.attrIdStr;

											if ((utils.isNotNull(attrIdStr) && attrIdStr) || spId > 0) {
												gdId = gdId + '_' + spId + '_' + attrIdStr
											}else{
												gdId = gdId + '_' + spId + '_'
											}
											// var goodsInfo = uni.getStorageSync(gdId + '')
											goodsInfo = uni.getStorageSync(gdId + '')
											if (typeof goodsInfo == 'string') {
												goodsInfo = JSON.parse(goodsInfo)
											}
										}
										if (utils.isNotNull(goodsInfo)) {
											var info = {
												"goodId":  goodsInfo.goodsId ?goodsInfo.goodsId:goodsInfo.id,
												"specsId": goodsInfo.specsId,
												"imageUrl": goodsInfo.src,
												"name": goodsInfo.name,
												"goodsName": goodsInfo.goodsName,
												"num": goodsInfo.num,
												"price": goodsInfo.price,
												"originalPrice": goodsInfo.originalPrice,
												"zhekou": goodsInfo.zhekou,
												// "isOriginal": utils.isNull(goodsInfo.isOriginal) ? false : true,
												"packetPrice": goodsInfo.packetPrice,
												"attrIdStr": goodsInfo.attrIdStr,
												"attrNameStr": goodsInfo.attrNameStr,
												"weight": utils.isNotNull(goodsInfo.weight) ? goodsInfo.weight : 0,
												// "descs": ""
											};
											goodInfoArr.push(info);


											totalGoodsMoney += goodsInfo.price * goodsInfo.num;

											if (utils.isNotNull(goodsInfo.weight)) {
												totalWeight += goodsInfo.weight * goodsInfo.num;
											}
										}

									}catch(e){
										//TODO handle the exception
										console.log(e);
									}
								}
							}
							var peisongFee = parseFloat(shopInfo.yunfei);  // 实际运费

							//  满足金额减运费, 免运费
							var freeYunFei = shopInfo.freeYunFei;
							if (utils.isNotNull(shopInfo.freeYunFei) && shopInfo.freeYunFei > 0) {
								if (utils.isNotNull(shopInfo.freeYunFeiMoney) && shopInfo.freeYunFeiMoney == -1) { //免运费
								  totalPeisong = 0
								}
								else if (utils.isNotNull(shopInfo.freeYunFeiMoney) && shopInfo.freeYunFeiMoney > 0 && totalGoodsMoney >= freeYunFei) { // 满足金额减运费金额
								  peisongFee = (Number(peisongFee) - Number(shopInfo.freeYunFeiMoney)).toFixed(2)
								  if (peisongFee < 0) {
									peisongFee = 0
								  }
								  totalPeisong += parseFloat(peisongFee);
								}
							} else {
								totalPeisong += peisongFee;
							}

							var goodsObj = {
								"shopName": shopInfo.shopName,
								"shopImageUrl": shopInfo.imageUrl,
								"shopInfo": shopInfo,
								"goodsList": goodInfoArr,
							};
							shopGooL.push(goodsObj);
						}

						totalMoney = Number(totalGoodsMoney) + Number(totalPeisong);

						var currencyUnit = "￥"
						var goodDisplayList = [
							{
								'name': '商品金额',
								'price': currencyUnit  + totalGoodsMoney.toFixed(2)
							},
							{
								'name': '运费',
								'price': currencyUnit + totalPeisong
							},
							{
								'name': '已优惠',
								'price': currencyUnit + '0'
							},
							{
								'name': '实付款',
								'price': currencyUnit + totalMoney.toFixed(2)
							}
						];

						var goodMoneyObj = {
							totalGoodsMoney: totalGoodsMoney.toFixed(2),
							totalPeisong: totalPeisong,
							totalAward: 0,
							totalMoney: totalMoney.toFixed(2),
							totalWeight: totalWeight
						}

						this.goodDisplayList = goodDisplayList
						this.goodMoneyObj = goodMoneyObj
						this.shopGoodsList = shopGooL
						console.log(goodDisplayList)
						console.log(goodMoneyObj)
						console.log(shopGooL)
						this.showGameInfo()

						this.dealShopPsType()
				}
			},
			// 处理活动显示
			showGameInfo () {
				var that = this
				var shopInfo = ""
				try{
					shopInfo = uni.getStorageSync("shopInfo")
				}catch(e){
					//TODO handle the exception
				}
				if (typeof shopInfo == 'string') {
					shopInfo = JSON.parse(shopInfo)
				}
				var gameList = shopInfo.gameList || []
				var platFormArr = uni.getStorageSync("platFormArr") || []
				if (typeof platFormArr == 'array') {
					platFormArr = JSON.parse(platFormArr)
				}

				gameList = gameList.concat(platFormArr)

				if (utils.isNull(gameList) || gameList.length < 1) {
				    return;
				}

				var nowTime = utils.getNowTimestamp();
				/**
				 * TODO 用户首单
				 */
				var hasOrder = true // app.globalData.userHasOrder == 1 ? true : false;
				var ruleList = [];
				for (let i = 0; i < gameList.length; i++) {
					var gameInfo = gameList[i];
					if (utils.isNull(gameInfo)) {
						continue;
					}
					if (utils.isNull(gameInfo.startTime) || nowTime - gameInfo.startTime < 0) {
					    continue;
					}
					if (utils.isNull(gameInfo.endTime) || nowTime - gameInfo.endTime > 0) {
						continue;
					}
					// 新订单判断
					if (gameInfo.gameType == 3 && hasOrder) {
						continue;
					}

					var rList = gameInfo.ruleList;
					if (utils.isNull(rList)) {
					    continue;
					}
					for (let j = 0; j < rList.length; j++) {
						if (utils.isNull(rList[j])) {
						  continue;
						}
						rList[j].gameType = gameInfo.gameType;
						ruleList.push(rList[j]);
					}
				}

				// 处理活动规则
				if (ruleList.length < 1) {
				    return;
				}
				ruleList.sort(utils.compare("rang"))
				var gameArray = [];
				var gameArray2 = [];
				var award = 0;
				var totalGoodsMoney = this.goodMoneyObj.totalGoodsMoney
				console.log("活动规则处理")
				console.log(ruleList)
				var info // 满减
				for (let i = 0; i < ruleList.length; i++) {
					var rule = ruleList[i];
					if (utils.isNull(rule)) {
						continue;
					}
					if (rule.rang <= totalGoodsMoney) {
						var gameType = rule.gameType;
						if (utils.isNull(gameType)) {
						    return;
						}
						award = rule.award;
						var gameGoodName = "";
						switch (gameType) {
							case 1://满减
								if (utils.isNotNull(award)) {
									if(utils.isNull(info) || info.money<rule.rang) {
										info = {
											'money': rule.rang,
											'name': '满' + rule.rang + "减" + award,
											'image': '../../static/icon_jian.png',
											'price': award,
                                            'priceStr': "-￥" + award,
                                            'gameId': rule.pId,
											'gameRuleId': rule.id
										}
									}
									// totalMoney -= award;
								}
								break;
							case 2://满赠
								if (utils.isNotNull(rule.goodsInfo)) {
									gameGoodName = rule.goodsInfo.name;
									if (utils.isNotNull(gameGoodName)) {
										if(utils.isNull(info) || info.money<rule.rang) {
											info = {
												'money': rule.rang,
                                                'price': 0,
                                                'name': '满' + rule.rang + "赠" + gameGoodName,
												'image': '../../static/icon_zeng.png',
												'gameId': rule.pId,
												'gameRuleId': rule.id
											}
										}
									}
								}
							break;
							case 3://首单减
								if (!hasOrder) {
									if (utils.isNotNull(award)) {
										if(utils.isNull(info) || info.money<rule.rang) {
											info = {
												'money': rule.rang,
												"award": award,
												'name': '首单满' + rule.rang + "减" + award,
												'image': '../../static/icon_shou.png',
												'price': award,
												'priceStr': "-￥" + award,
												'gameId': rule.pId,
												'gameRuleId': rule.id
											}
										}
										// totalMoney -= award;
									}
								}
							break;
							case 4://首单赠
								if (!hasOrder) {
									gameGoodName = rule.goodsInfo.name;
									if (utils.isNotNull(gameGoodName)) {
										if(utils.isNull(info) || info.money<rule.rang) {
											info = {
												'money': rule.rang,
                                                'price': award,
                                                'name': '首单满' + rule.rang + "赠" + gameGoodName,
												'image': '../../static/icon_shou.png',
												'gameId': rule.pId,
												'gameRuleId': rule.id
											}
										}
									}
								}
							break;
						}
					}
				}
				var totalAward = 0
				if (utils.isNotNull(info) && info.money>0) {
					gameArray2.push({gameId:info.gameId,gameRuleId:info.gameRuleId})
					gameArray.push(info)
					totalAward = info.price
				}
				this.gameArray = gameArray
				this.gameArray2 = gameArray2
				this.totalAward = totalAward
				this.moneyCallBack()
			},
			dealShopPsType () {
				var that = this;
				var shopInfo = uni.getStorageSync('shopInfo');
				if (this.isOnceOrder) {
					shopInfo = this.shop;
				}
				if (utils.isNull(shopInfo)) {
					return;
				}
				if (typeof shopInfo === 'string') {
					shopInfo = JSON.parse(shopInfo)
				}
				var showPs = shopInfo.isPeiSong;  // 配送
				var shopZq = shopInfo.isDaoDian;  // 自取

				/**
				 * 	 isPeiSong  是否配送 0:不支持配送,1:支持配送
				 *	 isDaodian 是否到店消费 0:不支持到店消费,1:支持到店消费
				 */
				if (showPs == 1 && shopZq == 1) {  // 到店&配送
					this.getUserAddres()
				} else if (showPs == 1 && shopZq == 0) { // 配送
					this.getUserAddres()
					this.selectHeadr = 0
				} else if (showPs == 0 && shopZq == 1) { // 到店
					this.selectHeadr = 1
					this.moneyCallBack()
				}
				this.showPs = showPs
				this.shopZq = shopZq
				// that.showGoods(this.shopId, this.multiShopGoods); //展示商品信息

				console.log("配送方式"+showPs +","+shopZq)
			},

			getUserAddres() {
				var that = this;
				var token = uni.getStorageSync("token");
				var params = {
				  "token": token,
				};
				this.$apis.sendRequest({
					url : "/action/user/address/list",
					data : params,
					success:function (result) {
						var data = result.data;
						if (data.length == 0) {
							utils.showToast("您还没有收货地址~")
						}
						var addInfo = {}, flag = true;
						for (let i = 0; i < data.length; i++) {
						  var infos = data[i];
						  if (infos.isDefault == 1) {
						    addInfo = data[i];
						    flag = false;
							break
						  }
						}
						if (flag) {
						  addInfo = data[0];
						}
						if (utils.isNotNull(addInfo)) {
							that.addInfo = addInfo
                            that.ziquUserInfo = addInfo
                            uni.setStorageSync('ziquUserInfo',that.ziquUserInfo)
							that.moneyCallBack(addInfo.lng, addInfo.lat, addInfo.id)
						}
						console.log(that.addInfo)
					},
				})
			},

			submitSingleShopOrder() {
				var that = this;
				var token = uni.getStorageSync("token");

				if (0 == this.selectHeadr && utils.isNull(that.addInfo.id)) {
					utils.showToast("请选择收货地址")
					return
				}

				var shopInfo = {}
				try{
					shopInfo = JSON.parse(uni.getStorageSync("shopId" + this.shopId));
				}catch(e){
					//TODO handle the exception
				}


				var goodsJson = [];
				console.log(this.shopGoodsList)
				var goodsList = this.shopGoodsList[0].goodsList // 单个店铺
				for (let i = 0; i < goodsList.length; i++) {
				  var infos = goodsList[i];
				  var totalPrice = infos.price * infos.num;
				  var attrNameStr = ''
				  if (utils.isNotNull(infos.attrNameStr)) {
				    attrNameStr = infos.attrNameStr
				    attrNameStr = attrNameStr.replace(/,/g, '+');
				  }
				  var dic = {
				    "shopId": this.shopId,
				    "goodsId": infos.goodId,
				    "goodsSpecsId": infos.specsId,
				    "goodsPrice": infos.price,
				    "totalCount": infos.num,
				    "totalPrice": totalPrice,
				    "goodsAttrVals": attrNameStr,
                    "specsId": infos.specsId,
                    "attrIdStr": infos.attrIdStr,
                    "attrNameStr": attrNameStr,
				  };
				  goodsJson.push(dic);
				}

				//  TODO 处理满减满赠等活动
				var gameJson = that.gameArray2 || []
				// TODO 处理红包活动
				var redpacketJson = that.redpacketArray || []

				var isZiQu = 0, ziquTime = 0;
				if (this.selectHeadr == 0) {
					ziquTime = (new Date(that.appointDate.replace(/-/g, '/'))).getTime();
				} else {
					isZiQu = 1
					if (utils.isNotNull(that.appointDate) && '请选择日期' != that.appointDate) {
						ziquTime = (new Date(that.appointDate.replace(/-/g, '/'))).getTime();
					}
				}

				var url = "/action/order/submit/v2"

				var params = {
				   "sysAppKey": this.$sysAppKey,
				   "token": token,
				   "shopId": this.shopId,
				   "deliveryPrice": that.goodMoneyObj.totalPeisong,
				   "deliveryId": this.selectHeadr == 0 ? that.addInfo.id : 0,
				   "goodsInfoJson": JSON.stringify(goodsJson),
				   "isZiQu": isZiQu,
				   "ziQuTime": ziquTime,
				   "shopSpecs": '',
				   "buyName": utils.isNull(that.ziquUserInfo.buyer) ? that.ziquUserInfo.telephone : that.ziquUserInfo.buyer,
				   "buyPhone": that.ziquUserInfo.telephone,
				   // "packetPrice": shopInfo.packetPrice,
				   'note': that.desc,
				   "gameInfoJson": JSON.stringify(gameJson),
				   "redpacketJson": JSON.stringify(redpacketJson),
				   "isUrgent": 0,
				   "shareUsername": "",
				   "orderType": 1,
				   "isAppointment": 0,
				   "integral": ""
				 };
				this.$apis.sendRequest({
					url : url,
					data : params,
					success:function (result) {
						var priceStr = result.info.mustPayMoney;
						var orderNo = result.info.orderNo;

						for (var u = 0; u < goodsJson.length; u++) {
							var infos = goodsJson[u];
							if (utils.isNull(infos)) {
							  continue;
							}
							var gId = infos.goodsId;
							if (utils.isNull(gId)) {
							  continue;
							}
							var attrIdStr = infos.attrIdStr; // 属性Id
							var spId = infos.specsId;
							if ((utils.isNotNull(attrIdStr) && attrIdStr) || spId > 0) {
							  gId = gId + '_' + spId + '_' + attrIdStr
							}else{
								gId = gId + '_' + spId + '_'
							}
							console.log("商品Id"+gId)
							that.removeGoods(gId, that.shopId);
						}
						uni.redirectTo({
							url: '/pages/money/pay?orderNo=' + orderNo + '&price=' + priceStr,
						})
					},
				})
			},
			// 关闭页面
			closePage(index) {
				uni.navigateBack({
					delta: index
				});
			},
			//提交订单后删除商品
			removeGoods: function(goodId, shopId) {
			    console.log("清空缓存"+goodId+'商家'+shopId)
			  uni.removeStorage({
			    key: goodId + "",
			    success: function(res) {}
			  });
			  uni.getStorage({
			    key: 'goodIds' + shopId,
			    success: function(res) {
			      var goodIdsArr = JSON.parse(res.data);
			      if (utils.isNotNull(goodIdsArr)) {
			        var haveObj = false;
			        for (let i = 0; i < goodIdsArr.length; i++) {
			          var element = goodIdsArr[i];
			          if (element == goodId) {
			            haveObj = true;
			          }
			        }

			        if (haveObj) {
			          // goodIdsArr.remove(goodId);
			          utils.removeByValue(goodIdsArr, goodId);

			          if (goodIdsArr.length == 0) {
			            uni.getStorage({
			              key: 'shopId',
			              success: function(res) {
			                var shopIdsArr = JSON.parse(res.data);
			                if (utils.isNotNull(shopIdsArr)) {
			                  var haveObj = false;
			                  for (let i = 0; i < shopIdsArr.length; i++) {
			                    var element = shopIdsArr[i];
			                    if (element == shopId) {
			                      haveObj = true;
			                    }
			                  }

			                  if (haveObj) {
			                    // shopIdsArr.remove(shopId);
			                    utils.removeByValue(shopIdsArr, shopId);
			                    uni.setStorage({
			                      key: 'shopId',
			                      data: JSON.stringify(shopIdsArr),
			                    })
			                  }
			                }
			              },
			              fail: function(ress) {
			                console.log(ress);
			              }
			            })
			          }

			          uni.setStorage({
			            key: 'goodIds' + shopId,
			            data: JSON.stringify(goodIdsArr),
			          })
			        }
			      }
			    },
			    fail: function(ress) {
			      console.log(ress);
			    }
			  })
			},

			selectAddress (lng, lat, id) {
				var that = this;
				if (utils.isNotNull(that.shopDeliveryPriceType) && that.shopDeliveryPriceType != 1) {
					this.moneyCallBack(lng, lat, id)
				}
			},

			selectRedPackage () {
				var that = this;
				 var totalGoodsMoney = this.goodMoneyObj.totalGoodsMoney;
				 wx.navigateTo({
				   url: "../user/redPackage/redPackage?isShowRadio=1&totalGoodsMoney=" + totalGoodsMoney+"&redPackagePrice="+this.redPackagePrice + "&shopId="+ that.shopId,
				 })
			},

			alreadyCheckedRed (redId, redPrice) {
				var redpacketArray = [];
				if (utils.isID(redId) && utils.isNotNull(redPrice)) {
				  redpacketArray.push({
				    'gameId': redId
				  })
				}
				this.redpacketArray = redpacketArray
				this.redPackagePrice = redPrice
				this.moneyCallBack()
			},

			moneyCallBack (lng, lat, id) {
				var that = this;
				var pledgeMoney = 0
				var goodDisplayArrVal = this.goodDisplayList  // 页面展示数据
				var goodMoneyObjVal = this.goodMoneyObj 	// 实际金额

				// 1. 红包费用
				var redPackagePrice = utils.isNotNull(that.redPackagePrice) ? that.redPackagePrice  : 0;
				// 2. 加急
				var urgentPrice = 0;
				// 3. 运费处理
				var deliveryPrice = 0;
				var shopInfo = uni.getStorageSync('shopInfo');
				if (utils.isNotNull(that.shopDeliveryPriceType)) {
					if (that.shopDeliveryPriceType == 1) { // 固定运费
						deliveryPrice =  utils.isNotNull(shopInfo) ? shopInfo.yunfei : 0
					} else if (that.shopDeliveryPriceType == 2) {// 平台优惠
					} else if (that.shopDeliveryPriceType == 3) {
						var distance = (utils.getDistance(shopInfo.lat, shopInfo.lng, lat, lng) / 1000).toFixed(2) // km
						// if (util.isNotNull(that.data.sysSettingInfo.runningDistanceRate) && that.data.sysSettingInfo.runningDistanceRate > 0) {
						// 	distance = JSON.parse((that.data.sysSettingInfo.runningDistanceRate / 100) * distance).toFixed(2)
						// }
						if (distance <= shopInfo.withinDistance) { // 在范围内
							deliveryPrice = shopInfo.fixedCost;
						} else if (distance > shopInfo.withinDistance) { // 超出范围
							var outDis = Math.ceil(distance - shopInfo.withinDistance)
							var outMoney = outDis * Number(shopInfo.oneKmCost)
							deliveryPrice = (Number(shopInfo.fixedCost) + Number(outMoney)).toFixed(2)
						}
					}
				}

				/**
				 * 满足金额减运费,免运费
				 * "freeYunFei":  #满足金额免运费（需大于0才减）
				 * "freeYunFeiMoney": #满足金额减运费金额 -1时为免运费
				 * "freeYunFeiShop": #满足金额减运费, 商家承担部分
				 **/
				 // 条件限制（满多少减免运费）
				var freeYunFei = shopInfo.freeYunFei;
				var totalGoodsMoney = goodMoneyObjVal.totalGoodsMoney
				var originalYunfei = deliveryPrice; // 原始运费
				if (utils.isNotNull(shopInfo.freeYunFei) && shopInfo.freeYunFei > 0 && totalGoodsMoney >= freeYunFei) {
					if (utils.isNotNull(shopInfo.freeYunFeiMoney) && shopInfo.freeYunFeiMoney == -1) { //免运费
						deliveryPrice = 0;
					}
					else if (utils.isNotNull(shopInfo.freeYunFeiMoney) && shopInfo.freeYunFeiMoney > 0 && totalGoodsMoney >= freeYunFei) { // 满足金额减运费金额
						deliveryPrice = (Number(deliveryPrice) - Number(shopInfo.freeYunFeiMoney)).toFixed(2)
						if (deliveryPrice < 0) {
							deliveryPrice = 0
						}
					}
				}

				// 配送方式 自取运费为0
				if (this.selectHeadr == 1) {
					deliveryPrice = 0
				}

				// 4. 优惠活动处理（首单减 首单增，满减，满赠）
				var totalAward = goodMoneyObjVal.totalAward
				if (utils.isNotNull(this.totalAward) && this.totalAward > 0) {
					totalAward = this.totalAward
				}


				var totalMoneyNew = (Number(goodMoneyObjVal.totalGoodsMoney) + Number(deliveryPrice)
						- Number(totalAward)
						- Number(redPackagePrice) + Number(urgentPrice) - Number(pledgeMoney)).toFixed(2);


				totalMoneyNew = totalMoneyNew > 0  ? totalMoneyNew : 0 ;
				for (let i = 0; i < goodDisplayArrVal.length; i++) {
					if (goodDisplayArrVal[i].name == '运费') {
					  goodDisplayArrVal[i].price = "￥" + deliveryPrice
					  goodMoneyObjVal.totalPeisong = deliveryPrice
					}
					if (totalAward > 0 && goodDisplayArrVal[i].name == '已优惠') {
						goodDisplayArrVal[i].price = "-￥" + totalAward
						goodMoneyObjVal.totalAward = totalAward

					}
					if (goodDisplayArrVal[i].name == '实付款') {
					  goodDisplayArrVal[i].price = "￥" + totalMoneyNew
					  goodMoneyObjVal.totalMoney = totalMoneyNew
					}
				}

				// 处理完红包 运费从渲染
				this.goodDisplayList =  goodDisplayArrVal
				this.goodMoneyObj = goodMoneyObjVal
				console.log(this.goodDisplayList)
				console.log(this.goodMoneyObj)
			},


			pickerTap: function() {
				console.log("pickerTap")
				var date = new Date(this.appointDate);

				var monthDay = ['今天', '明天'];
				var hours = [];
				var minute = [];

				currentHours = date.getHours();
				currentMinute = date.getMinutes();

				// 月-日
				for (var i = 2; i <= 7; i++) {
				  var date1 = new Date(date);
				  date1.setDate(date1.getDate() + i);

				  var md = date1.getFullYear() + "/" + (date1.getMonth() + 1) + "/" + date1.getDate();
				  monthDay.push(md);
				}
				console.log(monthDay)

				var data = {
				  multiArray: this.multiArray,
				  multiIndex: this.multiIndex
				};

				if (data.multiIndex[0] === 0) {
				  if (data.multiIndex[1] === 0) {
					  this.loadData(hours, minute);
				  } else {
					  this.loadMinute(hours, minute);
				  }
				} else {
				  this.loadHoursMinute(hours, minute);
				}

				this.multiArray = [monthDay, hours, minute];
				console.log(this.multiArray)
				// this.multiArray[1] = hours;
				// this.multiArray[2] = minute;
				// this.setData(data);
			},

			// 配送时间
			bindStartMultiPickerChangeV2: function(e) {
				console.log("bindStartMultiPickerChangeV2")
				var that = this;
				var monthDay = that.multiArray[0][e.detail.value[0]];
				var hours = that.multiArray[1][e.detail.value[1]];
				var minute = that.multiArray[2][e.detail.value[2]];

				if (monthDay === "今天") {
				  var year = date.getFullYear();
				  var month = date.getMonth() + 1;
				  var day = date.getDate();
				  if (day < 10) {
				    day = "0" + day
				  }
				 //  console.log(day)
				  monthDay = year + "/" + month + "/" + day;
				} else if (monthDay === "明天") {
				  var date1 = new Date(date);
				  date1.setDate(date.getDate() + 1);
				  var day = date1.getDate()
				  if (day < 10) {
				    day = "0" + day
				  }
				  monthDay = date1.getFullYear() + "/" + (date1.getMonth() + 1) + "/" + day;
				} else {
				  var year = monthDay.split("/")[0];
				  var month = monthDay.split("/")[1]; // 返回月
				  var day = monthDay.split("/")[2]; // 返回日
				  if (day < 10) {
				    day = "0" + day
				  }
				  monthDay = year + "/" + month + "/" + day;
				}
				if (hours < 10) {
				  hours = "0" + hours
				}
				if (hours == 24) {
				  hours = "0" + "0"
				}

				var appointDate = monthDay + " " + hours + ":" + minute;
				that.appointDate = appointDate
				// that.setData({
				//   appointDate: appointDate
				// })

			},

		    bindMultiPickerColumnChange: function(e) {
				console.log("bindMultiPickerColumnChange")

				var that = this;

				var monthDay = ['今天', '明天'];
				var hours = [];
				var minute = [];

				date = new Date(this.appointDate);
				currentHours = date.getHours();
				currentMinute = date.getMinutes();

				var data = {
					multiArray: this.multiArray,
					multiIndex: this.multiIndex
				};
				// 把选择的对应值赋值给 multiIndex
				that.multiIndex[e.detail.column] = e.detail.value;

				// 然后再判断当前改变的是哪一列,如果是第1列改变
				if (e.detail.column === 0) {
					 // 如果第一列滚动到第一行
					 if (e.detail.value === 0) {
					   that.loadData(hours, minute);
					 } else {
					   that.loadHoursMinute(hours, minute);
					 }

					 that.multiIndex[1] = 0;
					 that.multiIndex[2] = 0;

					 // 如果是第2列改变
				} else if (e.detail.column === 1) {

				 // 如果第一列为今天
				 if (that.multiIndex[0] === 0) {
				   if (e.detail.value === 0) {
					 that.loadData(hours, minute);
				   } else {
					 that.loadMinute(hours, minute);
				   }
				   // 第一列不为今天
				 } else {
				   that.loadHoursMinute(hours, minute);
				 }
				 that.multiIndex[2] = 0;

				 // 如果是第3列改变
				} else {
					 // 如果第一列为'今天'
					 if (that.multiIndex[0] === 0) {

					   // 如果第一列为 '今天'并且第二列为当前时间
					   if (that.multiIndex[1] === 0) {
						 that.loadData(hours, minute);
					   } else {
						 that.loadMinute(hours, minute);
					   }
					 } else {
					   that.loadHoursMinute(hours, minute);
					 }
				}
				that.multiArray[1] = hours;
				that.multiArray[2] = minute;
				// console.log(that.multiArray[1])
				that.$forceUpdate();
				// this.setData(data);
			},

			   loadData: function(hours, minute) {
			        var minuteIndex;
			        if (currentMinute > 0 && currentMinute <= 10) {
			          minuteIndex = 10;
			        } else if (currentMinute > 10 && currentMinute <= 20) {
			          minuteIndex = 20;
			        } else if (currentMinute > 20 && currentMinute <= 30) {
			          minuteIndex = 30;
			        } else if (currentMinute > 30 && currentMinute <= 40) {
			          minuteIndex = 40;
			        } else if (currentMinute > 40 && currentMinute <= 50) {
			          minuteIndex = 50;
			        } else {
			          minuteIndex = 60;
			        }

			        if (minuteIndex == 60) {
			          // 时
			          for (var i = currentHours + 1; i < 24; i++) {
			            hours.push(i);
			          }
			          // 分
			          for (var i = 0; i < 60; i += 10) {
			            //  minute.push(i);
			            if (i == 0) {
			              minute.push('00');
			            } else {
			              minute.push(i);
			            }
			          }
			        } else {
			          // 时
			          for (var i = currentHours; i < 24; i++) {
			            hours.push(i);
			          }
			          // 分
			          for (var i = minuteIndex; i < 60; i += 10) {
			            minute.push(i);
			          }
			        }
			      },

				  loadHoursMinute: function(hours, minute) {
				    // 时
				    for (var i = 0; i < 24; i++) {
				      hours.push(i);
				    }
				    // 分
				    for (var i = 0; i < 60; i += 10) {
				      //  minute.push(i);
				      if (i == 0) {
				        minute.push('00');
				      } else {
				        minute.push(i);
				      }
				    }
				  },

				  loadMinute: function(hours, minute) {
				       var minuteIndex;
				       if (currentMinute > 0 && currentMinute <= 10) {
				         minuteIndex = 10;
				       } else if (currentMinute > 10 && currentMinute <= 20) {
				         minuteIndex = 20;
				       } else if (currentMinute > 20 && currentMinute <= 30) {
				         minuteIndex = 30;
				       } else if (currentMinute > 30 && currentMinute <= 40) {
				         minuteIndex = 40;
				       } else if (currentMinute > 40 && currentMinute <= 50) {
				         minuteIndex = 50;
				       } else {
				         minuteIndex = 60;
				       }

				       if (minuteIndex == 60) {
				         // 时
				         for (var i = currentHours + 1; i < 24; i++) {
				           hours.push(i);
				         }
				       } else {
				         // 时
				         for (var i = currentHours; i < 24; i++) {
				           hours.push(i);
				         }
				       }
				       // 分
				       for (var i = 0; i < 60; i += 10) {
				         if (i == 0) {
				           minute.push('00');
				         } else {
				           minute.push(i);
				         }
				       }
				     },







			// =========================================


			//显示优惠券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type){
				this.payType = type;
			},
			// submit(){
			// 	uni.redirectTo({
			// 		url: '/pages/money/pay'
			// 	})
			// },
			// stopPrevent(){},
			changeAddress(){
				uni.navigateTo({
					url:"/pages/address/address?source=1"
				})
			},
            toziquManage() {
			    var that = this
                var info = JSON.stringify(that.ziquUserInfo)
                uni.navigateTo({
                    url:"/pages/address/ziquManage?info="+ info
                })
            },
            // 自取电话回调
            ziquAddress(info) {
			    var that = this
                that.ziquUserInfo = info
                uni.setStorageSync('ziquUserInfo',that.ziquUserInfo)
            },
			touchLeft(){
				this.selectHeadr = 0
				this.className = "triangle-topleft"
				this.moneyCallBack()
			},
			touchRight(){
				this.selectHeadr = 1
				this.className = "triangle-topright"
				this.moneyCallBack()
			},
			bindDateChange(e) {
			   this.startdate = e.target.value
			   this.getStart = this.startdate
			},
			getDate(type) {
			   const date = new Date();
			   let year = date.getFullYear();
			   let month = date.getMonth() + 1;
			   let day = date.getDate();
			   if (type === 'start') {
			       year = year - 60;
			   } else if (type === 'end') {
			       year = year + 2;
			   }
			   month = month > 9 ? month : '0' + month;;
			   day = day > 9 ? day : '0' + day;
			   return `${year}-${month}-${day}`;
			},
		},

	}
</script>

<style>
	.manjian{
		/*margin: 22upx 10upx;*/
		/*float: left;*/
		display: inline-flex;
		justify-content:  flex-start;
	}
	.game-img {
	  width: 56upx;
	  height: 30upx;
	  /*float: left;*/
	   margin-right: 10upx;
	  /*margin: 22upx 10upx;*/
	}

	.game-wrap {
	  border-bottom: 1px solid #e5e5e5;
	  border-top: 1px solid #e5e5e5;
	  padding: 10upx 0;
	}

	.game {
	  /* margin: 10upx 30upx; */
	  font-size: 25upx;
	  color: #333;
		line-height: 30upx;
		display: inline-flex;
		width: 100%;
		justify-content: space-between;
	}

	.awardMoney {
	  /*float: right;*/
	  color: #f00;
	}
</style>

<style type="text/less" lang="scss">
	@import 'order.less';
	page {
		background: $page-color-base;
		padding-bottom: 126upx;
		padding: 0 2%;
		width: 96%;

	}

	.address-section {
		padding-bottom: 30upx;
		background: #fff;
		position: relative;
		margin-top: 16upx;
		border-radius:10upx;

		.order-content {
			margin-top: 30upx;
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
			margin-top: 12upx;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			padding: 20upx 30upx;
			border-bottom:1upx solid #f8f8f8;


			image {
				flex-shrink: 0;
				display: block;
				width: 118upx;
				height: 118upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding: 0 30upx;
				overflow: hidden;
			}

			.title {
				font-size: 26upx;
				color: $font-color-dark;
				max-width: 80%;
				float: left;
			}

			.spec {
				width: 80%;
				float: left;
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				float: right;
				// display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;

				.price {
					margin-bottom: 4upx;
					display: block;
					font-size: 26upx;
				}
				.number{
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
					display: block;
				}
			}

			.step-box {
				position: relative;
			}
		}
		.g-item:last-child {
			border-bottom: none;
		}
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		// display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: #333;
			margin-right: 10upx;
			float: left;
		}

		.cell-tip {
			font-size: 26upx;
			float: right;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}

		&.desc-cell {
			.info_cv2 {
				.cell-tit {
					width: 100%;
					font-size: 32upx;
				}
				input{
					width: 100%;
				}
			}

		}

		.desc {
			flex: 1;
			font-size: 26upx;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list{
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;
		.pay-item{
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}
		.icon-weixinzhifu{
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}
		.icon-alipay{
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}
		.icon-xuanzhong2{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}
		.tit{
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}



	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;

		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);

			.mask-content{
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 44upx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips{
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}

		// .appointTimeV2 {
		//   clear:both;
		//   background-color:#fff;
		//   padding:10px 15px 10px 15px;
		//   border-bottom:1px solid #ededed;
		//   border-bottom-left-radius:10upx;
		//   border-bottom-right-radius:10upx;
		//   height:60upx;
		//   font-size:14px;
		//   line-height:30px;
		//   margin-top:7px;
		// }
	}

</style>
