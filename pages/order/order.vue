<!--<script src="../../../main.js"></script>-->
<template>
    <view>
        <web-view :src="url"></web-view>
    </view>
</template>

<script>
    //非父子组件传值
    import {mapState, mapMutations} from 'vuex';

    export default {
        computed: mapState(['userInfo', 'api', 'webViewType']),
        data() {
            return {
                url: '',
                index:0,
                token: '',
                sysAppKey: '',
                u: '',
                h5Url:'',
                page:'/procurement',
                shopId: ''
            }
        },
        onLoad(option) {
            if (option.index) {
                this.index = option.index
            }
            this.h5Url = this.$h5Url
            this.sysAppKey = this.$sysAppKey
            this.u = this.$url
            // this.shopId = this.$shopId
            this.shopId = uni.getStorageSync("shopIdNum")
            this.token = uni.getStorageSync("token");
            this.toUrl()
        },
        methods: {
            toUrl() {
                var that = this
                that.url = that.h5Url+that.page+'?sysAppKey='+that.sysAppKey+'&u='+that.u+'&token='+that.token+'&index='+that.index+'&shopId='+that.shopId + '&t='+ Date.parse(new Date())
                console.log(this.url)
            },
        }
    }
</script>
