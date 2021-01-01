<script>
	const utils = require('./common/utils')
	const config = require('./common/config/config')
	import sj_show_modal from './common/G_show_modal/index'

	export default {
		onLaunch: function() {
			// 环境判断
			// #ifdef MP-WEIXIN
			uni.setStorageSync('platform', 'xcx')
			this.weixinLogin()
			// #endif
			// #ifdef APP-PLUS
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					console.log('打开的是安卓')
					uni.setStorageSync('platform', 'android')
					// this.CheckUpdate('android');
					break;
				case 'ios':
					console.log('打开的是苹果')
					uni.setStorageSync('platform', 'ios')
					// this.CheckUpdate('ios');
					break;
			}
			uni.$showModal = function(op = {}) {
				return new Promise((resolve, reject) => {
					let ssm = new sj_show_modal({
						...op,
						$event: function(e) {
							if (e.res) {
								resolve(e);
							} else {
								reject(e);
							}
						}
					})
					ssm.show();
					uni.$hide = function() {
						ssm.hide();
					}
				})
			}
			// 获取药店信息
			this.getShopInfo()
			// #endif
			// #ifdef MP-WEIXIN
			// 获取版本信息
			this.getShopEdition()
			// #endif
		},
		onShow: function() {
			console.log('App Show')
			// #ifdef MP-WEIXIN
			// 获取版本信息
			this.getShopEdition()
			// #endif
			// #ifdef APP-PLUS

			// 获取药店信息
			this.getShopInfo()
			// #endif
			utils.showCacheCount()
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			getShopInfo() {
				var that = this
				var token = uni.getStorageSync("token");
				var params = {
					"token": token,
				};
				this.$apis.sendRequest({
					url: "/action/shop/info",
					data: params,
					success: function(result) {
						var info = result.info;
						if (utils.isNotNull(info)) {
							uni.setStorageSync('shopInfo', info)
							// 活动处理
							if (utils.isNotNull(info.gameList) && info.gameList.length > 0) {
								info.gameList = that.gameListUtil(info.gameList)
							}
						}
					}
				});
			},
			gameListUtil(gameList) {
				var gList = [];
				var gameListStr = ''
				if (utils.isNotNull(gameList) && gameList.length > 0) {
					for (let j = 0; j < gameList.length; j++) {
						var gam = gameList[j];
						var gRule = gam.ruleList;
						if (utils.isNotNull(gRule) && gRule.length > 0) {
							var image = '',
								backColor = '' // 背景颜色
								,
								borederColor = '' // 边框颜色
								,
								color = ''; // 字体颜色
							if (utils.isNotNull(gam.gameType)) {
								switch (gam.gameType) {
									case 1: // 满减
										{
											backColor = '',
											borederColor = '#ff2a5f',
											color = '#ff2a5f';
										}
										break;
									case 2: //满赠
										{
											backColor = '#d6f1ff',
											borederColor = '#d6f1ff',
											color = '#43c0ff';
										}
										break;
									case 3: //首单减
										{
											backColor = '#ffe4cf',
											borederColor = '#ff2a5f',
											color = '#ff2a5f';
										}
										break;
									case 4: //首单赠
										{
											backColor = '#ffe4cf',
											borederColor = '#ff2a5f',
											color = '#ff2a5f';
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
				uni.setStorageSync('gameListStr', gameListStr)
				return gList
			},
			weixinLogin() {
				var that = this
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						if (loginRes.code) {
							var params = {
								code: loginRes.code,
								needSessionKey: 1,
								shopId: that.$shopId
							};
							that.$apis.sendRequest({
								url: "/action/user/wx/xcx/openId/get",
								data: params,
								success: function(result) {
									var successs = result.status == 1 ? true : false;
									if (successs) {
										var info = result.info;
										if (info) {
											var openID = info.openid
											var sessionKey = info.session_key
										}
										//保存openid
										uni.setStorageSync('wxXcxOpenId', openID);
										uni.setStorageSync('sessionKey', sessionKey);
										console.log("保存openId等")
									}
								}
							})
						}
					}
				});
			},
			getShopEdition() {
				var that = this
				var params = {
					"tipType": -33,
				}
				that.$apis.sendRequest({
					url: "action/tip/info/list",
					data: params,
					success: function(result) {
						var successs = result.status == 1 ? true : false;
						if (successs) {
							console.log(result.data[0].name)
							if (that.$appVersion === result.data[0].name) {
								uni.setStorageSync('shopIdNum', '15')
							} else {
								uni.setStorageSync('shopIdNum', '1')
							}
							console.log(that.$appVersion)
							// 获取药店信息
							that.getShopInfo()
						}
					}
				})
			},
		}
	}
</script>

<style>
	@import "./common/font/iconfont.css";
	/*全局公共样式和字体图标 */
	@import './node_modules/quill/dist/quill.core.css';
	@import './node_modules/quill/dist/quill.snow.css';
	@import './node_modules/quill/dist/quill.bubble.css';

	/*每个页面公共css */
	view {
		box-sizing: border-box;
	}

	.container {
		width: 100%;
	}

	image {
		max-width: 100%;
		height: auto;
	}

	.clearFlex:after {
		display: block;
		content: '';
		clear: both;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	/* 自定义导航 */
	.navView {
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		width: 100%;
		padding-top: var(--status-bar-height);
		height: calc(var(--status-bar-height) + 88upx);
		background-color: #fff;
	}

	.nav {
		height: 88upx;
		width: 100%;
		position: relative;
		padding: 0 24upx;
	}

	/*
		全局公共样式和字体图标
	*/
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}

	image {
		max-width: 100%;
		height: auto;
	}

	.clearFlex:after {
		display: block;
		content: '';
		clear: both;
	}

	.left {
		float: left;
	}

	.right {
		float: right;
	}

	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-yiguoqi1:before {
		content: "\e700";
	}

	.icon-iconfontshanchu1:before {
		content: "\e619";
	}

	.icon-iconfontweixin:before {
		content: "\e611";
	}

	.icon-alipay:before {
		content: "\e636";
	}

	.icon-shang:before {
		content: "\e624";
	}

	.icon-shouye:before {
		content: "\e626";
	}

	.icon-shanchu4:before {
		content: "\e622";
	}

	.icon-xiaoxi:before {
		content: "\e618";
	}

	.icon-jiantour-copy:before {
		content: "\e600";
	}

	.icon-fenxiang2:before {
		content: "\e61e";
	}

	.icon-pingjia:before {
		content: "\e67b";
	}

	.icon-daifukuan:before {
		content: "\e68f";
	}

	.icon-pinglun-copy:before {
		content: "\e612";
	}

	.icon-dianhua-copy:before {
		content: "\e621";
	}

	.icon-shoucang:before {
		content: "\e645";
	}

	.icon-xuanzhong2:before {
		content: "\e62f";
	}

	.icon-gouwuche_:before {
		content: "\e630";
	}

	.icon-icon-test:before {
		content: "\e60c";
	}

	.icon-icon-test1:before {
		content: "\e632";
	}

	.icon-bianji:before {
		content: "\e646";
	}

	.icon-jiazailoading-A:before {
		content: "\e8fc";
	}

	.icon-zuoshang:before {
		content: "\e613";
	}

	.icon-jia2:before {
		content: "\e60a";
	}

	.icon-huifu:before {
		content: "\e68b";
	}

	.icon-sousuo:before {
		content: "\e7ce";
	}

	.icon-arrow-fine-up:before {
		content: "\e601";
	}

	.icon-hot:before {
		content: "\e60e";
	}

	.icon-lishijilu:before {
		content: "\e6b9";
	}

	.icon-zhengxinchaxun-zhifubaoceping-:before {
		content: "\e616";
	}

	.icon-naozhong:before {
		content: "\e64a";
	}

	.icon-xiatubiao--copy:before {
		content: "\e608";
	}

	.icon-shoucang_xuanzhongzhuangtai:before {
		content: "\e6a9";
	}

	.icon-jia1:before {
		content: "\e61c";
	}

	.icon-bangzhu1:before {
		content: "\e63d";
	}

	.icon-arrow-left-bottom:before {
		content: "\e602";
	}

	.icon-arrow-right-bottom:before {
		content: "\e603";
	}

	.icon-arrow-left-top:before {
		content: "\e604";
	}

	.icon-icon--:before {
		content: "\e744";
	}

	.icon-zuojiantou-up:before {
		content: "\e605";
	}

	.icon-xia:before {
		content: "\e62d";
	}

	.icon--jianhao:before {
		content: "\e60b";
	}

	.icon-weixinzhifu:before {
		content: "\e61a";
	}

	.icon-comment:before {
		content: "\e64f";
	}

	.icon-weixin:before {
		content: "\e61f";
	}

	.icon-fenlei1:before {
		content: "\e620";
	}

	.icon-erjiye-yucunkuan:before {
		content: "\e623";
	}

	.icon-Group-:before {
		content: "\e688";
	}

	.icon-you:before {
		content: "\e606";
	}

	.icon-forward:before {
		content: "\e607";
	}

	.icon-tuijian:before {
		content: "\e610";
	}

	.icon-bangzhu:before {
		content: "\e679";
	}

	.icon-share:before {
		content: "\e656";
	}

	.icon-yiguoqi:before {
		content: "\e997";
	}

	.icon-shezhi1:before {
		content: "\e61d";
	}

	.icon-fork:before {
		content: "\e61b";
	}

	.icon-kafei:before {
		content: "\e66a";
	}

	.icon-iLinkapp-:before {
		content: "\e654";
	}

	.icon-saomiao:before {
		content: "\e60d";
	}

	.icon-shezhi:before {
		content: "\e60f";
	}

	.icon-shouhoutuikuan:before {
		content: "\e631";
	}

	.icon-gouwuche:before {
		content: "\e609";
	}

	.icon-dizhi:before {
		content: "\e614";
	}

	.icon-fenlei:before {
		content: "\e706";
	}

	.icon-xingxing:before {
		content: "\e70b";
	}

	.icon-tuandui:before {
		content: "\e633";
	}

	.icon-zuanshi:before {
		content: "\e615";
	}

	.icon-zuo:before {
		content: "\e63c";
	}

	.icon-shoucang2:before {
		content: "\e62e";
	}

	.icon-shouhuodizhi:before {
		content: "\e712";
	}

	.icon-yishouhuo:before {
		content: "\e71a";
	}

	.icon-dianzan-ash:before {
		content: "\e617";
	}





	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}

	/* 骨架屏替代方案 */
	.Skeleton {
		background: #f3f3f3;
		padding: 20upx 0;
		border-radius: 8upx;
	}

	/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;
	}

	.image-wrapper image {
		width: 100%;
		height: 100%;
		transition: .6s;
		opacity: 0;
	}

	.image-wrapper image .loaded {
		opacity: 1;
	}



	.clamp {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	.common-hover {
		background: #f5f5f5;
	}

	/*边框*/
	.b-b:after,
	.b-t:after {
		position: absolute;
		z-index: 3;
		left: 0;
		right: 0;
		height: 0;
		content: '';
		transform: scaleY(.5);
		border-bottom: 1px solid $border-color-base;
	}

	.b-b:after {
		bottom: 0;
	}

	.b-t:after {
		top: 0;
	}

	/* button样式改写 */
	uni-button,
	button {
		height: 80upx;
		line-height: 80upx;
		font-size: $font-lg + 2upx;
		font-weight: normal;
	}

	uni-button[type=default],
	button[type=default] {
		color: $font-color-dark;
	}

	/* input 样式 */
	.input-placeholder {
		color: #999999;
	}

	.placeholder {
		color: #999999;
	}

	/*!* 自定义导航 *!*/
	.navView {
		position: fixed;
		background-color: #fff;
		padding: 7px 7px;
		height: calc(var(--status-bar-height) + 44px);
		z-index: 9999;
		left: 0;
		top: 0;
		width: 100%;
		padding-top: calc(var(--status-bar-height) + 7px);
	}

	.navView .title {
		position: absolute;
		left: 70px;
		right: 70px;
		min-width: 0;
		user-select: auto;
		line-height: 30px;
		font-weight: 700;
		font-size: 16px;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.nav_back {
		float: left;
		height: 30px;
		width: 27px;
		font-weight: lighter;
	}

	.nav_right {
		float: right;
		height: 30px;
	}

	.searchBtn {
		float: left;
		height: 30px;
		width: 27px;
		position: relative;
		z-index: 999;
		margin-right: 16upx;
	}

	.sortingBtn {
		float: left;
		height: 30px;
		width: 27px;
		position: relative;
		z-index: 999;
	}

	.tt_pp {
		position: absolute;
		top: 0;
		left: 0;
		line-height: 34upx;
		color: #fff;
		font-size: 24upx;
		text-align: center;
		min-width: 64upx;
		border-radius: 2px 4px 0px 4px;
		background-color: #DD0D3C;
	}

	/* x水平排列*/
	.x-f {
		display: flex;
		align-items: center;
	}

	/*x两端且水平居中*/
	.x-bc {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/*x平分且水平居中*/
	.x-ac {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	/*x水平靠上对齐*/
	.x-start {
		display: flex;
		align-items: flex-start;
	}

	/*x水平靠下对齐*/
	.x-end {
		display: flex;
		align-items: flex-end;
	}

	/*上下左右居中*/
	.x-c {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/*y竖直靠左*/
	.y-start {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	/*y竖直靠右*/
	.y-end {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	/*y竖直居中*/
	.y-f {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/*y竖直两端*/
	.y-b {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	/*y竖直两端居中*/
	.y-bc {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
</style>
