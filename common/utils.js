function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function IsURL(str_url) {
  return (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm).test(str_url);
}

function AnalysisURL(url) {
  return /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.exec(url);
}
/**
 * 时间戳转换为年月日
 */
function formatTimeYMD(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  // returnArr.push(formatNumber(date.getHours()));
  // returnArr.push(formatNumber(date.getMinutes()));
  // returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

/**
 * 时间戳转换时分
 * 例如：1559271628446----> 11: 30
 */
function toHours(number) {
  var n = number;
  var date = new Date(n);
  // var y = date.getFullYear();
  // var m = date.getMonth() + 1;
  // m = m < 10 ? ('0' + m) : m;
  // var d = date.getDate();
  // d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return h + ':' + minute;
}
/**
 * 时间戳转换时分
 * 例如：1559271628446----> 11: 30
 */
function toYear(number) {
  var n = number;
  var date = new Date(n);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m +'-'+ d + ' ' +h + ':' + minute;
}

function formatTimeV2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours() + 1
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (hour == 24) {
    hour = "0" + "0"
  }

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 获取当前时间戳
function getNowTimestamp() {
  var timestamp = Date.parse(new Date());
  // timestamp = timestamp / 1000;
  return timestamp;
}
// 获取当天结束时间戳（当天23：59）
function getTodayEndTim() {
  return new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
}

function formatTimestamp(date) {
  var date1 = new Date(date);
  var timestamp = date1.getTime();

  return timestamp;
}

//获取当前时间，离开日期默认为t+1
function getLocalTime(addNum) {
  var today, ms, thatDay, y, m, d, endDate;
  today = new Date().getTime();
  ms = today + addNum * 24 * 60 * 60 * 1000;
  thatDay = new Date(ms);
  y = thatDay.getFullYear();
  m = thatDay.getMonth() + 1;
  d = thatDay.getDate();
  endDate = y + "-" + m + "-" + d;
  return endDate
}
//时间格式化(格式化最大为小时)
function formatToHours(t) {
  var format = {
    d: '00',
    h: '00',
    m: '00',
    s: '00' };

  if (t > 0) {
    var h = Math.floor(t / 3600);
    var m = Math.floor(t / 60 % 60);
    var s = Math.floor(t % 60);

    format.h = h < 10 ? '0' + h : h;
    format.m = m < 10 ? '0' + m : m;
    format.s = s < 10 ? '0' + s : s;
  }
  return format;
}

function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}

function isNull(obj) {
  if (null == obj || undefined == obj || "" == obj || "undefined" == obj || "undefined" == typeof(obj) || "null" == obj) {
    return true;
  } else {
    return false;
  }
}

function isNotNull(obj) {
  return !isNull(obj);
}

// 验证是否为Id
function isID(val) {
  if (null == val || val <= 0) {
    return false;
  }
  return true;
}

// 计算两个经纬度之间的距离
function getDistance(la1, lo1, la2, lo2) {
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137;//地球半径
  s = Math.round(s * 10000) / 10000;
  s = (s * 1000).toFixed(2)
  // if (s < 1) {
  //   s = s * 100 + 'm'
  // }
  // else {
  //   s = s + 'km'
  // }
  return s; //输出为米
}
// 截取小数点后
function getnum(num) {
  var s = num + ""
  var result = s.substring(0, s.indexOf(".") + 3)
  return result;
}
//数组排序倒序
function compare(prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  }
}

//数组排序正序
function comparev2(prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }
}


function millisecondToDate(msd) {
  var time = parseFloat(msd) / 1000;
  if (null != time && "" != time) {
    if (time >= 60 && time <= 60 * 60) {
      time = parseInt(time / 60.0) + "分钟"
      // + parseInt((parseFloat(time / 60.0) -
      //   parseInt(time / 60.0)) * 60) + "秒";
    }
    else if (time >= 60 * 60 && time < 60 * 60 * 24) {
      time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
        parseInt(time / 3600.0)) * 60) + "分钟"
        //  +
        // parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
        //   parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
    }
    else {
      time = parseInt(time) + "秒";
    }
  }
  return time;
}


function showToast(msg) {
  // uni.showToast({
  //   title: msg,
  //   icon: "none",
  //   duration: 1200
  // })
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
function showModal(msg) {
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
function showToastSuccess(msg) {
  uni.showToast({
    title: msg,
    icon: "success",
    duration: 1200
  })
}

function showToastImage(msg,image) {
  uni.showToast({
    title: msg,
    iamge:image,
    duration: 1200
  })
}

function makePhoneCall(number) {
	uni.showModal({
	    // title: '拨号',
	    content: number,
	    success: function (res) {
	        if (res.confirm) {
	            uni.makePhoneCall({
	            	phoneNumber: number,
	            })
	        } else if (res.cancel) {
	            console.log('用户点击取消');
	        }
	    }
	});
}
function getFlatternDistance(lat1,lng1,lat2,lng2){
  var EARTH_RADIUS = 6378137.0;    //单位M
  var PI = Math.PI;

  var f = (lat1 + lat2)/2*PI/180.0
  var g = (lat1 - lat2)/2*PI/180.0
  var l = (lng1 - lng2)/2*PI/180.0

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s,c,w,r,d,h1,h2;
  var a = EARTH_RADIUS;
  var fl = 1/298.257;

  sg = sg*sg;
  sl = sl*sl;
  sf = sf*sf;

  s = sg*(1-sl) + (1-sf)*sl;
  c = (1-sg)*(1-sl) + sf*sl;

  w = Math.atan(Math.sqrt(s/c));
  r = Math.sqrt(s*c)/w;
  d = 2*w*a;
  h1 = (3*r -1)/2/c;
  h2 = (3*r +1)/2/s;

  return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
}

// 加载缓存数据
function  showCacheCount () {
  console.log("加载数据")

  uni.getStorage({
    key: 'shopId',
    success:function (res) {
      console.log(res.data)
      var shopIdArr = JSON.parse(res.data)
      var  allCount = 0;
      if (isNotNull(shopIdArr) && shopIdArr.length > 0) {
        for (var i = 0; i < shopIdArr.length; i++) {
          var shopId = shopIdArr[i];
          var goodsStr = uni.getStorageSync('goodIds' + shopId);
          if(isNotNull(goodsStr) ){
            var goodsArr = []
            if (typeof goodsStr==='string') {
              goodsArr = JSON.parse(goodsStr);
            }
            if (isNotNull(goodsArr) && goodsArr.length > 0) {
              for (var j = 0; j < goodsArr.length; j++) {
                var goodid = goodsArr[j];
                var goodInfo = uni.getStorageSync(goodid + '');
                if (isNull(goodInfo)) {
                  continue;
                }
                // allCount += goodInfo.num
                allCount += 1
              }
            }
          }
        }
        if (allCount>0) {
          uni.setTabBarBadge({
            index: 2,
            text: allCount+ ''
          })
        }else{
          uni.hideTabBarRedDot({
            index : 2,
          })
        }

      } else {
        uni.hideTabBarRedDot({
          index : 2,
        })
      }
    },
    fail() {
      uni.hideTabBarRedDot({
        index : 2,
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  formatTimeV2: formatTimeV2,
  isNull: isNull,
  isNotNull: isNotNull,
  removeByValue: removeByValue,
  getNowTimestamp: getNowTimestamp,
  getTodayEndTim: getTodayEndTim,
  formatTimestamp: formatTimestamp,
  getLocalTime: getLocalTime,
  isID: isID,
  getDistance: getDistance,
  getnum: getnum,
  compare: compare,
  comparev2: comparev2,
  formatTimeYMD: formatTimeYMD,
  toHours: toHours,
  toYear: toYear,
  millisecondToDate: millisecondToDate,
  showToast: showToast,
  showToastSuccess:showToastSuccess,
  showToastImage:showToastImage,
  showModal:showModal,
  makePhoneCall: makePhoneCall,
  getFlatternDistance: getFlatternDistance,
  IsURL:IsURL,
  AnalysisURL:AnalysisURL,
  showCacheCount:showCacheCount,
  formatToHours: formatToHours
}
