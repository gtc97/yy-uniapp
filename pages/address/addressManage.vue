<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.buyer" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.telephone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">收货地址</text>
			<text @click="chooseLocation" class="input" :class="haveAdr == 1 ? 'active':''">
				{{addressData.address}}
			</text>
			<!-- <input class="input" type="text" @click="chooseLocation" v-model="addressData.address" placeholder="请选择地址" placeholder-class="placeholder" disabled="true"/> -->
			<text class="yticon icon-shouhuodizhi"></text>
		</view>
		<view class="row b-b">
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.address2" placeholder="请输入详细地址" placeholder-class="placeholder" />
		</view>
		<view class="row b-b"> 
			<text class="tit">楼号-门牌号</text>
			<input class="input" type="text" v-model="addressData.address3" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.default" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	export default {
		data() {
			return {
				addressData: {
					id: 0,
					buyer: '',
					telephone: '',
					address2: '',
					address: '请选择地址',
					address3: '',
					default: false,
				},
				haveAdr:0,
				province: "",
				city: "",
				
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				this.initEditData(option.data)
			}
			console.log(option.type)
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			initEditData(data) {
				console.log('初始化编辑信息');
				this.addressData = JSON.parse(data)
				if (this.addressData.isDefault === 1) {
					this.addressData.default = true
				}
				this.loadCity(this.addressData.lng, this.addressData.lat)
			},
			switchChange(e){
				this.addressData.default = e.detail.value;
				console.log(this.addressData.default)
			},
			
			//地图选择地址
			chooseLocation(){
				var that= this
				uni.chooseLocation({
					success: (data)=> {
						console.log(data)
						that.addressData.address2 = data.name;
						that.addressData.address = data.address;
						that.addressData.lng = data.longitude
						that.addressData.lat = data.latitude
						that.loadCity(data.longitude, data.latitude)
						if (that.addressData.address.length > 0) {
							that.haveAdr = 1
						} else {
							that.haveAdr = 0
						}
					}
				})
			},
			
			
			loadCity: function (lo1, la1) {
				// var myAmapFun = new amapFile.AMapWX({ key: "0a647d4c9f629bf95ec5b244afbc25b2" });
				// const key = "0a647d4c9f629bf95ec5b244afbc25b2"
				var that= this
				const key = that.$amapKey
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo',
					data: {
						key: key,
						location: lo1 + "," + la1 ,
						extensions:"all",
						s:"rsx",
						sdkversion:"sdkversion",
						logversion:"logversion"
			
					},
					success: function (res) {
						var province = res.data.regeocode.addressComponent.province,
								city = res.data.regeocode.addressComponent.city,
								district = res.data.regeocode.addressComponent.district;
								if (utils.isNotNull(city) && city.indexOf("市") == city.length - 1) {
									city = city.substring(0, city.length - 1);
								}
								if (utils.isNotNull(province) && province.indexOf("省") == province.length - 1) {
									province = province.substring(0, province.length - 1);
								}
								that.province = province
								that.city = city
					},
					fail: function (res) {
						utils.showToast("获取定位失败")
					}
				})
			},
			
			//提交
			confirm(){
				let data = this.addressData;
				var token = uni.getStorageSync("token")
				if(!data.buyer){
					utils.showToast("请填写收货人姓名")
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.telephone)){
					utils.showToast("请输入正确的手机号码")
					return;
				}
				if(!data.address || !data.lat || !data.lng){
					utils.showToast("请在地图选择所在位置")
					return;
				}
				if(!data.address3){
					utils.showToast("请填写门牌号信息")
					return;
				}
				if(this.manageType === 'edit') {
					 this.modify_address(data)
				} else {
					this.add_address(data);
				}
				// var params = {
				// 	"sysAppKey": this.$sysAppKey,
				// 	"token": token,
				// 	"buyer": data.buyer,
				// 	"telephone": data.telephone,
				// 	"address": data.address,
				// 	"address2": data.address2,
				// 	"address3": data.address3,
				// 	"province": this.province,
				// 	"isDefault": data.default ? 1 : 0,
				// 	"city": this.city,
				// 	"lat": data.lat,
				// 	"lng":data.lng,
				// }
				// console.log(params)
				// this.$apis.sendRequest({
				// 	url : "/action/user/address/add",
				// 	data : params,
				// 	success:function (res) {
				// 		utils.showToast("添加成功~")
				// 		_self.$api.prePage().refreshList();
				// 		setTimeout(()=>{
				// 			uni.navigateBack()
				// 		}, 800)
				// 	},
				// })
				
				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				// this.$api.prePage().refreshList(data, this.manageType);
				// this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
				// setTimeout(()=>{
				// 	uni.navigateBack()
				// }, 800)
			},
			// 添加一个地址
			add_address(data){
				let _self = this;
				var token = uni.getStorageSync("token")
				var params = {
					"sysAppKey": this.$sysAppKey,
					"token": token,
					"buyer": data.buyer,
					"telephone": data.telephone,
					"address": data.address,
					"address2": data.address2,
					"address3": data.address3,
					"province": this.province,
					"isDefault": data.default ? 1 : 0,
					"city": this.city,
					"lat": data.lat,
					"lng":data.lng,
				}
				console.log(params)
				this.$apis.sendRequest({
					url : "/action/user/address/add",
					data : params,
					success:function (res) {
						utils.showToast("添加成功~")
						_self.$api.prePage().refreshList();
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
					},
				})
			},
			// 修改地址
			modify_address(data){
				let _self = this;
				var token = uni.getStorageSync("token")
				var params = {
					"sysAppKey": this.$sysAppKey,
					"token": token,
					"id": data.id,
					"buyer": data.buyer,
					"telephone": data.telephone,
					"address": data.address,
					"address2": data.address2,
					"address3": data.address3,
					"province": this.province,
					"isDefault": data.default ? 1 : 0,
					"city": this.city,
					"lat": data.lat,
					"lng":data.lng,
				}
				console.log(params)
				this.$apis.sendRequest({
					url : "/action/user/address/modify",
					data : params,
					success:function (res) {
						utils.showToast("修改成功~")
						_self.$api.prePage().refreshList();
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
					},
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 180upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		text.input {
			color: #999;
		}
		text.active {
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: #dd5b50;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
