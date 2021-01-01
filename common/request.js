const config = require('./config/config')
  var shopId = config.shopId
  // var shopId = uni.getStorageSync('shopIdNum') || '1'
  console.log(shopId)
  var siteBaseUrl = config.url
  var sysAppKey = config.sysAppKey
  module.exports = {
	  siteBaseUrl : siteBaseUrl,
	  sendRequest: function (param) {
		var that = this,
        url = param.url,
        method = param.method || 'POST',
        header = {},
        data = param.data || {},
        token = "",
        hideLoading = param.hideLoading || false;
          //拼接完整请求地址
          var requestUrl = siteBaseUrl + url;

	if (url.indexOf('/api/') > -1) {
		requestUrl = url
	}
	data.shopId =  uni.getStorageSync('shopIdNum') || '1'
	data.sysAppKey = sysAppKey

    //固定参数:仅仅在小程序绑定页面通过code获取token的接口默认传递了参数token = login
    if(!data.token){//其他业务接口传递过来的参数中无token
        token = uni.getStorageSync('token');//参数中无token时在本地缓存中获取
        console.log("当前token:" + token);
        if(!token){//本地无token需重新登录(退出时清缓存token)
            // _self.login(backpage, backtype);
            // return;
        }else{
            data.token = token;
        }
    }

    //请求方式:GET或POST(POST需配置header: {'content-type' : "application/x-www-form-urlencoded"},)
    if(method){
        method = method.toUpperCase();//小写改为大写
        if(method=="POST"){
            header = {'content-type' : "application/x-www-form-urlencoded"};
        }else{
            header = {'content-type' : "application/json"};
        }
    }else{
        method = "GET";
        header = {'content-type' : "application/json"};
    }
    //用户交互:加载圈
    if (!hideLoading) {
        // uni.showLoading({title:'加载中...'});
    }

    // console.log("网络请求start");
    //网络请求
    uni.request({
        url: requestUrl,
        method: method,
        header: header,
        data: data,
        success: res => {
            // console.log("网络请求success:" + JSON.stringify(res));
            if (res.statusCode && res.statusCode != 200) {//api错误
                that.showModal(res.errMsg)
                return;
            }
            // if (res.data.status) {
                if (res.data.status == "0" || res.data.status == 0) {
                    if (!res.data.error) {
                        return;
                    }
                    that.showModal(res.data.error)
                    typeof param.fail == "function" && param.fail(res.data);
                    return;
                }
    //         } else{
				// uni.showToast({
				// 	title: "No ResultCode:" + res.data.error,
				// 	icon: "none",
				// 	duration: 2000
				// });
    //             return;
    //         }
            typeof param.success == "function" && param.success(res.data);
        },
        fail: (e) => {
            console.log("网络请求fail:" + JSON.stringify(e));
            // uni.showModal({
            //     title: '提示',
            //     content:"" + e.errMsg,
            //     showCancel:false,
            // });
            //     confirmText:'关闭',
            typeof param.fail == "function" && param.fail(e.data);
            // that.showModal("网络请求失败:" + e.errMsg)
			uni.showToast({
			    title:"网络请求失败:" + e.errMsg,
				icon: 'none',
			    duration: 2000
			});
        },
        complete: () => {
            // console.log("网络请求complete");
            if (!hideLoading) {
                uni.hideLoading();
            }
            typeof param.complete == "function" && param.complete();
            return;
        }
    });
  },
      showModal(msg){
          // #ifdef APP-PLUS
          uni.$showModal({
              concent: msg,
              delCancel: true,
              confirmVal: '知道了',
              align: 'left'
          }).then(res => {

          })
          // #endif
          // #ifndef APP-PLUS
          uni.showModal({
              title: '温馨提示',
              content:msg,
              showCancel:false,
              confirmText:'知道了',
          });
          // #endif
      }
 }
