<template>
    <view class="fp-list">
        <view class="fp-record" >
            <view class="title">发票详情</view>
        </view>

        <view class="list">
            <view class="item">
                <view class="d1">发票类型</view>
                <view class="d2">
                    <radio-group class="item-right radio-group" bindchange="changeInvoiceType">
                        <label class="radio"  v-for="(item,index) in billMethods">
                            <radio :value="item.value" color="#04C1AB" :checked="item.checked" @click="changeBillMethods(item)"/>
                            <text style="margin-left: 30upx">{{item.name}}</text>
                        </label>
                    </radio-group>
                </view>
            </view>
            <view class="item">
                <view class="d1">发票抬头</view>
                <view class="d2">
                    <input type="text"  v-model="shopVerifyInfo.shopName" placeholder="填写发票抬头" />
                </view>
            </view>
            <view class="item">
                <view class="d1">税号</view>
                <view class="d2">
                    <input type="text" v-model="invoiceInfo.billNumber"  placeholder="填写税号" />
                </view>
            </view>
            <view class="item">
                <view class="d1">发票金额</view>
                <view class="d2">
                    <text style="color:#F79F41" >{{money}}</text>
                </view>
            </view>
            <view class="item">
                <view class="d1">开户行</view>
                <view class="d2">
                    <input type="text"  v-model="invoiceInfo.billBank" placeholder="填写开户行" />
                </view>
            </view>
            <view class="item">
                <view class="d1">开户账号</view>
                <view class="d2">
                    <input type="text"  v-model="invoiceInfo.billBankNumber" placeholder="填写开户账号" />
                </view>
            </view>
        </view>
        <view class="fp-record" >
          <view class="title">个人信息</view>
        </view>
      <view class="list">
        <view class="item">
          <view class="d1">联系人</view>
          <view class="d2">
            <input type="text" v-model="invoiceInfo.receiveUser" placeholder="填写联系人" />
          </view>
        </view>
        <view class="item">
          <view class="d1">联系电话</view>
          <view class="d2">
            <input type="number" v-model="invoiceInfo.telPhone" maxlength='11'
            placeholder="填写联系电话" />
          </view>
        </view>
        <view class="item">
          <view class="d1">收件地址</view>
          <view class="d2">
            <input   style='padding-left:17upx;' type="text" v-model="invoiceInfo.address"
            placeholder="填写收件地址"/>
          </view>
        </view>
        <view class="item">
          <view class="d1">备注信息</view>
          <view class="d2">
            <input type="text"  v-model="note"
             placeholder="填写备注信息" />
          </view>
        </view>
      </view>

        <view class='login-view'>
            <button class="login-btn" @click="billDetail">提交</button>
        </view>
    </view>
</template>

<script>
    const utils = require('../../../common/utils')

    export default {
        data() {
            return {
                invoiceInfo: {},
                shopVerifyInfo:{},
                billType: 'company',
                invoiceTypes: [
                    { name: '纸质发票', value: "paper", checked: true },
                    { name: '电子发票', value: "online", checked: false }
                ],
                billMethods:[{ name: '普票', value: "ordinary", checked: true },{ name: '专票', value: "special", checked: false }],
                billMethod: "ordinary" ,// ordinary : 普票 special:专票
                invoiceType: "paper",  // 发票类型  paper 纸质的 online电子的
                money : 0,
                orderNos: '',
                note:''
            }
        },
        onLoad(option) {
            var that = this
            if(option.money){
                that.money = option.money
                that.money = Number(that.money).toFixed(2)
            }
            if (option.orderNos) {
                that.orderNos = option.orderNos
            }
            that.getShoperbInfo()
        },
        methods: {

            // 查询药店信息
            getShoperbInfo() {
                var that = this
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                    'sysAppKey': that.$sysAppKey,
                };
                this.$apis.sendRequest({
                    url: "/action/user/shoper/b/info",
                    data: params,
                    success: function (result) {
                        var successs = result.status === 1 ? true : false;
                        if (successs) {
                            let info = result.info
                            that.shopVerifyInfo = info
                            that.shopBId = info.id
                            that.getInvoiceInfo()
                        } else {
                            utils.showToast(response.error);
                        }
                    }
                })
            },
            // 获取发票信息
            getInvoiceInfo() {
                var that = this
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                    'sysAppKey': that.$sysAppKey,
                    "shopId": that.shopBId,
                    "code": 1,
                };
                this.$apis.sendRequest({
                    url: "/action/shop/invoice/info/get",
                    data: params,
                    success: function (result) {
                        var successs = result.status === 1 ? true : false;
                        if (successs) {
                            let info = result.info
                            if (utils.isNull(info)) {
                                info = {billType: 'paper', billNumber: '', billBank: '', billBankNumber: ''}
                            }
                            that.invoiceInfo = info
                        } else {
                            utils.showToast(result.error);
                        }
                    }
                })
            },
            getOverOrder: function () {
                var that = this;
                var token = uni.getStorageSync("token");
                var params = {
                    "token": token,
                    'sysAppKey': that.$sysAppKey,
                    "createTime": 0,
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
                                info.checked = 0
                                newData.push(info)
                            }
                            that.overOrderList = newData

                        } else {
                            utils.showToast(response.data.error);
                        }
                    },
                });
            },
            billDetail: function (id) {
                var that = this;
                if (utils.isNull(id)) {
                    return
                }
                var token = uni.getStorageSync("token");
                if (utils.isNull(that.shopVerifyInfo.shopName) || utils.isNull(that.billType) || utils.isNull(that.invoiceInfo.billNumber)) {
                    utils.showToast("信息不全")
                    return
                }
                var params = {
                    "token": token,
                    "sysAppKey": that.$sysAppKey,
                    "orderNos": that.orderNos,
                    "title": that.shopVerifyInfo.shopName,          // 发票抬头
                    "billNumber": that.invoiceInfo.billNumber,      // 税号
                    "billType": that.billType,                      // self : 个人 company:公司
                    "billMethod": that.billMethod,                      // ordinary : 普票 special:专票
                    "note": that.note || '',
                    "type": that.invoiceType,                       // 发票类型paper 纸质的 online电子的
                    "billBank": that.invoiceInfo.billBank,         // 开户行
                    "billBankNumber": that.invoiceInfo.billBankNumber,  // 开户行号
                    "receiveName": that.invoiceInfo.receiveUser || '',// 联系人
                    "telPhone": that.invoiceInfo.telPhone|| '',         // 电话
                    "address": that.invoiceInfo.address|| '',            // 地址
                    "money": this.money  // 金额
                };
                console.log(params)
                this.$apis.sendRequest({
                    url: "/action/user/bill/apply",
                    data: params,
                    success: function (result) {
                        var successs = result.status == 1 ? true : false;
                        if (successs) {
                            utils.showToast("开票成功")
                            uni.navigateBack()
                        } else {
                            utils.showToast(result.error)
                        }
                    }
                });
            },
            // 发票类型 普票/专票
            changeBillMethods(item) {
                var that = this
                that.billMethod = item.value
            },

        }
    }
</script>

<style type="text/css" lang="scss" scoped>
    @import "openTicket.less";
</style>
