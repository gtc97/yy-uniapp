<template>
	<view class="content b-t">

	</view>
</template>

<script>
	const utils = require('../../common/utils')
	export default {
		data() {
			return {
				source: 0,
				delBtnWidth: 60, //删除按钮宽度单位（rpx）
				startX: '',
				hasLoc: false,
				lat: 0,
				lng: 0,
				page: '',
				info: {}
			}
		},
		onLoad(option) {
			var that = this;
			if (option.page) {
				this.page = option.page
			}
			console.log("我进来了");
			// this.source = option.source;
			setTimeout(function() {
				that.selectAddress()
			}, 1000)
		},
		onShow() {
			var that = this
		},
		methods: {
			selectAddress: function() {
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						if (res.errMsg == 'chooseLocation:ok') {
							console.log("成功:" + res)
							that.info.lat = res.latitude;
							that.info.lng = res.longitude;
							that.info.address = res.name;
							that.loadCity(res.longitude, res.latitude)
						} else {
							utils.showToast("选择位置出错，请重新选择")
						}
					},
					fail: function(res) {
						console.log("失败:" + res)
						// console.log(res)
						// uni.redirectTo({
						// 	url: '/pages/user/squareCreate/squareCreate?page=dianpuInfo'
						// })
					},
					complete(res) {
						console.log(res)
					}
				})
			},
			loadCity: function(lo1, la1) {
				// var myAmapFun = new amapFile.AMapWX({ key: "0a647d4c9f629bf95ec5b244afbc25b2" });
				// const key = "0a647d4c9f629bf95ec5b244afbc25b2"
				var that = this
				const key = that.$amapKey
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
					success: function(res) {
						var province = res.data.regeocode.addressComponent.province
						var city = res.data.regeocode.addressComponent.city
						var county = res.data.regeocode.addressComponent.district
						if (utils.isNotNull(province) && province.indexOf("省") == province.length - 1) {
							province = province.substring(0, province.length - 1);
						}
						if (utils.isNotNull(city) && city.indexOf("市") == city.length - 1) {
							city = city.substring(0, city.length - 1);
						}
						that.info.province = province;
						that.info.city = city;
						that.info.county = county;
						that.hasLoc = true
						that.gotoPage()
					},
					fail: function(res) {},
				})
			},
			gotoPage: function() {
				var that = this;
				// if(utils.isNull(that.lat) || utils.isNull(that.lng)){
				// 	setTimeout(function(){
				// 		uni.redirectTo({
				// 			url: '/pages/view/shopBview?page='+that.page
				// 		})
				// 	},0);
				// 	return
				// }
				setTimeout(function() {
					uni.redirectTo({
						url: '/pages/view/shopBview?page=' + that.page + '&info=' + JSON.stringify(that.info)
					})
				}, 0);
			}
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
		background-color: #f8f8f8;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		background: #fff;
		position: relative;
		border-bottom: 1upx solid #ddd;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		margin-top: 16upx;
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 24upx;
			color: $font-color-light;
		}
	}

	.u-box {
		font-size: 30upx;
		color: $font-color-dark;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 0upx;
		right: 0upx;
		bottom: 0upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		/* width: 690upx; */
		width: 100%;
		height: 80upx;
		font-size: 28upx;
		color: #666;
		background-color: #fff;
		border-radius: 0upx;
		border: none;
		/* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4); */
	}

	.add-btn:after {
		display: none;
	}

	.add-btn image {
		display: inline-block;
		width: 30upx;
		height: 30upx;
		vertical-align: -2px;
		margin-right: 10upx;
	}

	.add_cv {
		display: flex;
		align-items: center;
		background: #fff;
		position: relative;
		width: 100%;
		padding: 20upx 30upx;
		z-index: 10;
	}

	.touch-list {
		position: absolute;
		top: 0;
		padding: 10upx 10upx 10upx;
		background-color: #697082;
		border-radius: 10upx;
		overflow: hidden;
	}

	.list-touch {
		position: relative;
		width: 100%;
		z-index: 5;
		transition: left 0.2s ease-in-out;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.list-delete {
		right: 0;
		float: left;
		width: 120upx;
		height: 100%;
		line-height: 80upx;
		background-color: #EA5863;
		border-radius: 0;
		color: #fff;
		font-size: 26upx;
		font-weight: lighter;
		text-align: center;
	}

	.list-delete text {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
