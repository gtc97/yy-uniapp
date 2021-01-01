<!--<script src="../../../main.js"></script>-->
<template>
    <view>
        <web-view :src="url"></web-view>
    </view>
</template>

<script>
    const utils = require('../../common/utils')
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
                lng:'',
                lat:'',
                city:'',
                page: '/',
                info:''
            }
        },
        onLoad(option) {
            if (option.page) {
                this.page = option.page
                this.info = option.info
                this.title = option.title

            }
            this.h5Url = this.$h5Url
            this.sysAppKey = this.$sysAppKey
            this.u = this.$url
            this.token = uni.getStorageSync("token");
            if (this.page==='fpManage'){
                uni.setNavigationBarTitle({
                    title:'发票设置'
                })
            }
            if (utils.isNotNull(option.title)){
                uni.setNavigationBarTitle({
                    title:option.title
                })
            }
            var location = uni.getStorageSync("location");
            if(utils.isNotNull(location)&&utils.isNotNull(location.lng)) {
                this.lng = location.lng
                this.lat = location.lat
                this.city = location.city
            }
            this.toUrl()

        },
        methods: {
            toUrl() {
                var that = this
                var url = that.h5Url+(utils.isNull(that.page) ? '' :that.page ) +'?sysAppKey='+that.sysAppKey+'&u='+that.u+'&token='+that.token+'&index='+that.index+'&city='+that.city+'&lng='+that.lng+'&lat='+that.lng + '&t='+ Date.parse(new Date())

                if (utils.isNotNull(that.info)) {
                    url += '&info='+that.info
                }
                that.url = url
				console.log(that.url)
            }
        }
    }
</script>

