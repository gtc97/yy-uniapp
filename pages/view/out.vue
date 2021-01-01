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
                title: ''
            }
        },
        onLoad(option) {
            if (option.url) {
                this.url = option.url
            }
            if (option.title) {
                this.title = option.title
                uni.setNavigationBarTitle({
                    title:option.title
                })
            }
        },
        methods: {

        }
    }
</script>

