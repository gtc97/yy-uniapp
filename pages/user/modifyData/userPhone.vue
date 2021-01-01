<template>
    <view>
        <view>
            <view class="input">
                <input class="input" type="text" v-model="info.telPhone"
                       placeholder-class="placeholder"/>
            </view>
            <view class="add" @click="doSubmit">确定</view>
        </view>
    </view>
</template>

<script>
    const utils = require('../../../common/utils')
    export default {
        data() {
            return {
                info:{}
            }
        },
        onLoad(option) {
            var that = this
            if (option.info) {
                var info = JSON.parse(option.info)
                that.info = info
            }

        },
        methods: {
            //提交
            doSubmit(){
                var that = this
                var token = wx.getStorageSync("token");
                let info = that.info;
                if(!(/^1\d{10}$/.test(info.telPhone))){
                    utils.showToast("请输入正确的手机号码")
                    return;
                }
                var params = {
                    "token": token,
                    "sex": info.sex,
                    "name": info.name,
                    "signature": info.signature,
                    "telPhone": info.telPhone,
                };
                this.$apis.sendRequest({
                    url : "/action/user/info/modify",
                    data : params,
                    success:function (result) {
                        var successs = result.status == 1 ? true : false;
                        if (successs) {
                            that.$api.msg('保存成功');
                            // 调取上页面方法
                            that.$api.prePage().getUserInfo()
                            // 回退
                            setTimeout(() => {
                                uni.navigateBack()
                            }, 800)
                        }
                    },
                });
            },
        }
    }
</script>


<style type="text/less">
    page {
        background-color: #f7f7f7;
    }
    .input {
        margin-left: 5%;
        width: 90%;
        margin-top: 50upx;
        height: 90upx;
        line-height: 90upx;
        background-color: #ffffff;
    }

    .text {
        border: 0;
    }

    .add {
        margin-left: 10%;
        margin-top: 100upx;
        z-index: 99;
        width: 80%;
        background-color: #04c1ab;
        color: #ffffff;
        text-align: center;
        font-size: 40upx;
        line-height: 92upx;
        border-radius: 15upx;
    }

</style>
