<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.buyer" placeholder="取货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.telephone" placeholder="取货人手机号码" placeholder-class="placeholder" />
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
			}
		},
		onLoad(option){
			var that = this
			if(option.info){
				var info = JSON.parse(option.info)
				that.addressData = info
			}
		},
		methods: {
			//提交
			confirm(){
				let data = this.addressData;
				if(!data.buyer){
					utils.showToast("请填写收货人姓名")
					return;
				}
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(data.telephone))){
					utils.showToast("请输入正确的手机号码")
					return;
				}
				// 调取上页面方法
				this.$api.prePage().ziquAddress(data)
				uni.navigateBack()
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
