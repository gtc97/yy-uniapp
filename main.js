import Vue from 'vue'
import App from './App'
import store from './store'
// import './common/font/iconfont.css'
const apis = require('./common/request')
const config = require('./common/config/config')
import G_show_modal from './common/G_show_modal/g_show_modal.js'
Vue.use(G_show_modal)
Vue.config.productionTip = false

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
    //统一提示方便全局修改
    if (Boolean(title) === false) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}
const json = type => {
    //模拟异步请求数据
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Json[type]);
        }, 500)
    })
}

const prePage = () => {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    // #ifdef H5
    return prePage;
    // #endif
    return prePage.$vm;
}

Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
    msg,
    json,
    prePage
};
Vue.prototype.$sysAppKey = config.sysAppKey;
Vue.prototype.$shopId = config.shopId;
Vue.prototype.$url = config.url;
Vue.prototype.$appVersion = config.appVersion;
Vue.prototype.$h5Url = config.h5Url;
Vue.prototype.$apis = apis;
Vue.prototype.$amapKey = config.amapKey;


Vue.filter('numberFormat', (number) => {
    if (!number) {
        return 0.00
    }
    return number.toFixed(2)
})
Vue.filter( 'stringFormat', (string) => {
    if (!string || string.length<=7) {
        return string
    }
    return string.substring(0,6) +  '...'
})
Vue.filter( 'stringFormat10', (string) => {
    if (!string || string.length<=11) {
        return string
    }
    return string.substring(0,10) +  '...'
})
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
