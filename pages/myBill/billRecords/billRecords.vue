<template>
    <view>
        <view class="container" v-for="(item,index) in alreadyOpenList" @click="navTo(item)">
            <view class="nav_top">
                <view class="data">
                    <image src="../../../static/time.png" style='width: 29upx;height: 29upx;margin-right: 15upx;'/>
                    {{item.createTimeStr}}
                </view>
                <view class="status">
                    {{item.billState === 0 ?'申请中':(item.billState === 10 ?'开票完成':'申请被拒')}}
                    <image src="../../../static/icop-ico3.png"
                           style='width: 12upx;height: 20upx;margin: 0 20upx 0 20upx;'/>
                </view>
            </view>
            <view class="totolPrice">
                <view class="title">
                    <view>{{item.shopName}}</view>
                    <view>{{item.billType==='special'?'专票':'普票'}}</view>
                    <view>共{{item.orderCount}}个订单</view>
                </view>
                <view class="money">
                    {{item.money}}<text>元</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    const utils = require('../../../common/utils')

    export default {
        data() {
            return {
                commentDetails: "",
                name: "",
                phone: "",
                page: 1,
                size: 30,
                alreadyOpenList: [],
            }
        },
        onShow() {
            var that = this
            that.getOverOrder()
        },
        // 上拉触底
        onReachBottom() {
            var that = this
            that.page = that.page + 1
            that.getOverOrder()
        },
        methods: {
            navTo(item) {
                var id = item.id
                uni.navigateTo({
                    url: '../billDetail/billDetail?id=' + id,
                })
            },
            getOverOrder: function () {
                var that = this;
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                    'sysAppKey': that.$sysAppKey,
                    "page": that.page,
                    "size": that.size,
                };
                this.$apis.sendRequest({
                    url: "/action/user/bill/history",
                    data: params,
                    success: function (result) {
                        var successs = result.status === 1 ? true : false;
                        if (successs) {
                            let data = result.data
                            var newData = []
                            if (that.page > 1) {
                                newData = that.alreadyOpenList
                            }
                            for (let i = 0; i < data.length; i++) {
                                var info = data[i]
                                info.createTimeStr = utils.formatTimeYMD(info.createTime, 'Y/M/D')
                                newData.push(info)
                            }
                            that.alreadyOpenList = newData

                        } else {
                            utils.showToast(response.data.error);
                        }
                    },
                });
            }

        }
    }
</script>

<style type="text/css" lang="scss" scoped>
    @import "billRecords.less";
</style>
<style>
    page {
        background-color: #eee;
    }
</style>
