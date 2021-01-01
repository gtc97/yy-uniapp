<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressData" :key="index"  @click="checkAddress(item)" >
		 <view class="add_cv" :data-index="index" @touchstart="touchS" @touchmove="touchM"
		 @touchend="touchE" :style="item.txtStyle">
			 <view class="wrapper">
			 	<view class="u-box">
			 		<text class="name">{{item.buyer}}</text>
			 		<text class="mobile">{{item.telephone}}</text>
			 	</view>
			 	<view class="address-box">
			 		<text v-if="item.isDefault === 1" class="tag">默认</text>
			 		<text class="address">{{item.addressStr}} </text>
			 	</view>
			 </view>
			 <text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
		 </view>
			<view class="touch-list list-delete" :data-index="index" @click="deleteMember(index)"><text>删除</text></view>
		</view>
		<!-- <text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：添加和修改地址回调仅增加了一条数据做演示，实际开发中将回调改为请求后端接口刷新一下列表即可
		</text> -->

		<button class="add-btn" @click="addAddress('add')">
			<image src="../../static/ico-hm-18.png" mode="widthFix"></image>
			新增地址
		</button>
	</view>
</template>

<script>
	const utils = require('../../common/utils')	
	export default {
		data() {
			return {
				source: 0,
				result: [{
					name: '刘晓晓',
					mobile: '18666666666',
					addressName: '贵族皇仕牛排(东城店)',
					address: '北京市东城区',
					area: 'B区',
					default: true,
					txtStyle:"",
				}, {
					name: '刘大大',
					mobile: '18667766666',
					addressName: '龙回1区12号楼',
					address: '山东省济南市历城区',
					area: '西单元302',
					default: false,
					txtStyle:"",
				}],
				addressData: [],
				delBtnWidth: 60, //删除按钮宽度单位（rpx）
				startX: '',
				type:''
			}
		},
		onLoad(option) {
			console.log(option.source);
			this.source = option.source;
			if(option.type) {
				this.type = option.type
			}
			this.getAddress()
		},
		methods: {
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addInfo = item;
					if(this.type === 'paotui') {
						this.$api.prePage().selectAddress(item)
					}else{
						this.$api.prePage().selectAddress(item.lng, item.lat, item.id)
					}
					uni.navigateBack()
				}
			},
			addAddress(type, item) {
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},

			// 获取地址列表
			getAddress: function () {
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
							utils.showToast("您还没有收货地址")
						}
						for (var i = 0; i < data.length; i++) {
						  data[i].addressStr = data[i].address + data[i].address2 + data[i].address3
						  if (data[i].addressStr.length > 22) {
							data[i].addressStr = data[i].addressStr.substring(0, 22) +"..."
						  }
						}
						that.addressData = data
					},
				})
			},




			//添加或修改成功之后回调
			// refreshList(data, type) {
			// 	//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
			// 	// this.result.unshift(data);

			// 	console.log('添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可');
			// },
			
			// 添加或者修改完之后回调信息
			refreshList() {
				console.log('地址操作回调~~~');
				this.getAddress()
			},
			touchS: function(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX
					// console.log(this.startX)
				}
			},
			touchM: function(e) {
				// console.log('touchM')
				if (e.touches.length == 1) {
					//手指移动时水平方向位置
					var moveX = e.touches[0].clientX;
					//手指起始点位置与移动期间的差值
					var disX = this.startX - moveX;
					var delBtnWidth = this.delBtnWidth;
					var txtStyles = "";
					if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
						txtStyles = "left:0px";
					} else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
						txtStyles = "left:-" + disX + "px";
						if (disX >= delBtnWidth) {
							//控制手指移动距离最大值为删除按钮的宽度
							txtStyles = "left:-" + delBtnWidth + "px";
						}
					}
					//获取手指触摸的是哪一项
					var index = e.currentTarget.dataset.index;
					var list = this.addressData;
					list[index].txtStyle = txtStyles;
					// console.log(list[index].txtStyle)
					//更新列表的状态
					this.addressData = list;
				}
			},
			touchE: function(e) {
				// console.log('touchE')
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					//触摸开始与结束，手指移动的距离
					var disX = this.startX - endX;
					var delBtnWidth = this.delBtnWidth;
					//如果距离小于删除按钮的1/2，不显示删除按钮
					var txtStyles = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
					//获取手指触摸的是哪一项
					var index = e.currentTarget.dataset.index;
					var list = this.addressData;
					console.log(list[index])
					list[index].txtStyle = txtStyles;
					console.log(list[index].txtStyle)
					//更新列表的状态{
					this.addressData = list
				}
			},
			//点击删除按钮事件
			deleteMember: function(index) {
				var token = wx.getStorageSync("token");
				var addArr = this.addressData;
				var addInfo = addArr[index];
				if (utils.isNull(addInfo.id)) {
					utils.showToast("请选择您要删除的")
					return
				}
				var params = {
					"token": token,
					"id": addInfo.id,
				};
				this.$apis.sendRequest({
					url : "/action/user/address/list",
					data : params,
					success:function (result) {
						addArr.splice(index, 1);
						that.addressData = addArr
						utils.showToast("删除成功")
					},
				})
			},

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
	.touch-list{
	    position: absolute;
	    top:0;
	    padding: 10upx 10upx 10upx;
	    background-color: #697082;
	    border-radius: 10upx;
	    overflow: hidden;
	}
	.list-touch{
	    position: relative;
	    width: 100%;
	    z-index: 5;
	    transition: left 0.2s ease-in-out;
	    white-space:nowrap;
	    overflow:hidden;
	    text-overflow:ellipsis;
	}
	.list-delete{
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
		transform: translate(-50%,-50%);
	}

</style>
