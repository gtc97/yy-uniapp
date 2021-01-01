<template>
    <view class="fp-list">
        <view class="fp-record">
            <view class="title">已完成订单</view>
            <view class="fp-rec-btn" @click="navTo">开票历史</view>
        </view>
        <view class="fp-item" v-if="overOrderList.length>0" v-for="(item,index) in overOrderList"
             @click="checkOrder(index)">
            <view class="fp-left">
                <image :src="item.checked === 1?'../../static/icop-ico9.png' : '../../static/icop-ico8.png'"
                       class="img"/>
            </view>
            <view class="fp-right">
                <view class="top1">
                    <view>{{item.orderNo}}</view>
                    <view>{{item.createTimeStr}}</view>
                </view>
                <view class="bot" v-for="(goods,index2) in item.goods">
                    <view>{{goods.name}}</view>
                    <view>x {{goods.totalCount}}</view>
                </view>
                <view class="bot">
                    <view>共{{item.goods.length}}种商品,总件数{{item.totalCount}}件 </view>
                    <view>共计{{item.totalPrice|numberFormat}}元</view>
                </view>
            </view>

        </view>
        <view class="bottom">
            <view class="left" @click="checkedAllFun">
                <image :src="checkedAll === 1?'../../static/icop-ico9.png' : '../../static/icop-ico8.png'"
                       class="img" style="width: 50upx;height: 50upx;float: left;"/>
                <view class="all">全选</view>
            </view>
            <view class="btn-next" @click="navToNext">下一步</view>
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
                size: 30,
                overOrderList: [],
                checkedAll:0,
                createTime: 0

            }
        },
        onShow(){
            var that = this
            that.createTime = 0
            that.getOverOrder()
        },
        // 上拉触底
        onReachBottom() {
            var that = this
            that.getOverOrder()
        },
        methods: {
            navToNext() {
                var that = this
                var orderNos = ""
                var money = 0
                for (var i = 0; i < that.overOrderList.length; i++) {
                    var info = that.overOrderList[i]
                    if (info.checked) {
                        orderNos += info.orderNo + ','
                        money += info.totalMoney
                    }
                }
                if (utils.isNull(orderNos)) {
                    utils.showToast("请选择订单")
                    return
                }
                wx.navigateTo({
                    url: 'openTicket/openTicket?orderNos=' + orderNos + '&money=' + money,
                })
            },
            navTo() {
                uni.navigateTo({
                    url: 'billRecords/billRecords',
                })
            },
            checkOrder(index) {
                var that =  this
                that.overOrderList[index].checked ^= 1;
                var info  = that.overOrderList[index]
                console.log(that.overOrderList[index])

            },

            checkedAllFun() {
                var that = this
                that.checkedAll ^= 1
                for (var i = 0; i < that.overOrderList.length; i++) {
                    that.overOrderList[i].checked = that.checkedAll
                }
            },
            getOverOrder: function () {
                var that = this;
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                    'sysAppKey': that.$sysAppKey,
                    "createTime": that.createTime,
                    "size": that.size,
                };
                this.$apis.sendRequest({
                    url: "/action/user/order/un/bill/list",
                    data: params,
                    success: function (result) {
                        var successs = result.status === 1 ? true : false;
                        if (successs) {
                            let data = result.data
                            var newData = []
                            // var timestamp = utils.getNowTimestamp()
                            // var thirtyTamp = timestamp - 30* 24 * 60 * 60 * 1000 // 30天前时间戳
                            for (let i = 0; i < data.length; i++) {
                                var info = data[i]
                                info.createTimeStr = utils.formatTimeYMD(info.createTime, 'Y/M/D')
                                if (that.createTime<info.createTime){
                                    that.createTime = info.createTime
                                }
                                // if (thirtyTamp > info.createTime) {
                                //     continue
                                // }
                                info.checked = 0
                                newData.push(info)
                            }
                            that.overOrderList = newData

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
    @import "myBill.less";
</style>
