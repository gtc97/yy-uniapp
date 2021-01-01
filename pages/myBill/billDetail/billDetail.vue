<template>
    <view class="fp-list">

        <view class="fp-record">
            <view class="title">{{billInfo.billMethodStr}}</view>
            <view class="fp-rec-btn">{{billInfo.billStateStr}}</view>
        </view>

        <view class="fp-detail">
            <view class="fp-item">
                <view class="name">发票抬头</view>
                <view class="value">{{billInfo.title}}</view>
            </view>

            <view class="fp-item">
                <view class="name">税号</view>
                <view class="value">{{billInfo.billNumber}}</view>
            </view>

            <view class="fp-item">
                <view class="name">发票金额</view>
                <view class="value">{{billInfo.money}}</view>
            </view>
            <view class="fp-item">
                <view class="name">地址</view>
                <view class="value">{{billInfo.address}}</view>
            </view>
            <view class="fp-item">
                <view class="name">电话</view>
                <view class="value">{{billInfo.telPhone}}</view>
            </view>
            <view class="fp-item">
                <view class="name">开户行</view>
                <view class="value">{{billInfo.billBank}}</view>
            </view>
            <view class="fp-item">
                <view class="name">开户账号</view>
                <view class="value">{{billInfo.billBankNumber}}</view>
            </view>
            <view class="fp-item">
                <view class="name">申请时间</view>
                <view class="value">{{billInfo.createTime}}</view>
            </view>

            <view class="fp-record">
                <view class="title">个人信息</view>
            </view>

            <view class="fp-item">
                <view class="name">收件人名称</view>
                <view class="value">{{billInfo.receiveName}}</view>
            </view>

            <view class="fp-item">
                <view class="name">联系方式</view>
                <view class="value">{{billInfo.telPhone}}</view>
            </view>

            <view class="fp-item">
                <view class="name">收件人地址</view>
                <view class="value">{{billInfo.address}}</view>
            </view>
            <view class="fp-item">
                <view class="name">备注信息</view>
                <view class="value">{{billInfo.note}}</view>
            </view>
        </view>
    </view>

</template>

<script>
    const utils = require('../../../common/utils')

    export default {
        data() {
            return {
                billInfo:{},
                id: 0
            }
        },
        onLoad(option) {
            var that = this
            if (option.id) {
                that.id = option.id
            }
            that.billDetail()
        },
        methods: {
            navTo(item) {
                var id = item.id
                uni.navigateTo({
                    url: 'billDetail/billDetail?id=' + id,
                })
            },
            billDetail() {
                var that = this;
                if (utils.isNull(that.id)) {
                    return
                }
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                    'sysAppKey': that.$sysAppKey,
                    "id": that.id
                };
                this.$apis.sendRequest({
                    url: "/action/user/bill/detail",
                    data: params,
                    success: function (result) {
                        var successs = result.status === 1 ? true : false;
                        if (successs) {
                            var info = result.info;
                            // 状态 0 申请中 10 开票完成 - 10 开票中
                            info.billStateStr = ""
                            if (info.billState === 0) {
                                info.billStateStr = "申请中"
                            } else if (info.billState === 10) {
                                info.billStateStr = "开票完成"
                            } else if (info.billState === -10) {
                                info.billStateStr = "申请被拒"
                            }
                            info.billTypeStr = info.billType === 'self' ? '个人' : '公司'
                            info.billMethodStr = info.billMethod === 'special' ? '专票' : '普票'
                            that.billInfo = info
                        } else {
                            utils.showToast(result.error)
                        }
                    }
                });
            },
        }
    }
</script>

<style type="text/css" lang="scss" scoped>
    @import "billDetail.less";
</style>
