<template>
	<view>
		<view class="list">
			<view class="sug">
			  <textarea class="input_" placeholder="请输入您宝贵的意见，我们将努力改进！" type="text" @input="inputSuggest" v-model="commentDetails"></textarea>
			</view>
			<view class="sug">
			  <input class="input_ input_2"  placeholder="请输入你的名称" @input="inputName" v-model="name" type="text"/>
			</view>

			<view class="sug">
			  <input class="input_ input_2" placeholder="请输入你的联系方式" @input="inputPhone" v-model="phone" type="text"/>
			</view>
			<view style='clear:both'>
			  <button class="btn-confirm" @click="addSuggest">
				提交
			  </button>
			</view>

		</view>
	</view>
</template>

<script>
	const utils = require('../../common/utils')
	export default {
		data() {
			return {
				commentDetails: "",
				name: "",
				phone: "",
			}
		},
		onLoad() {
			var userInfo = uni.getStorageSync("userInfo")
			if (utils.isNotNull(userInfo) && typeof userInfo == 'string') {
				userInfo = JSON.parse(userInfo)
			}
			this.name = userInfo.name
			this.phone = userInfo.phone
		},
		methods: {
			inputSuggest (event) {
				this.commentDetails = event.target.value
			},
			inputName (event) {
				this.name = event.target.value
			},
			inputPhone (event) {
				this.phone = event.target.value
			},
			addSuggest () {
				var that = this;
				var token = uni.getStorageSync("token");
				var params = {
				  "token": token,
				  'content': that.commentDetails,
				  "name": that.name,
				  "phone": that.phone,
				};
				this.$apis.sendRequest({
					url : "/action/suggest/add",
					data : params,
					success:function (result) {
						utils.showToast("感谢您的反馈")
						uni.navigateBack()
					},
				});
			}
		}
	}
</script>

<style>

	.sug {
		width:92%;
		margin:0 auto;
		font-size:30upx;
		background-color:white;
		margin-top:16upx;
	}

	.sug .input_ {
		padding:14upx;
		width:92%;
	}
	.input_2 {
		height: 100upx;
		line-height: 100upx;
	}


.btn-confirm {
    margin: 36upx 39upx 0;
    height: 90upx;
    line-height: 90upx;
    color: #fff;
    font-size: 28upx;
    background-color: #04c1ab;
}
</style>
