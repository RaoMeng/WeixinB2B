//app.js
var httpRequest = require('common/request.js');
var utils = require('common/utils.js');

function BusinessBean() {
     var id;//单据id
     var companyName; //公司名
     var billDate; //单据日期
     var billNum; //单据编号
     var currency; //币别
     var money; //金额
     var materialNum; //物料编号
     var materialName;// 物料名称
     var materialSpec;// 物料规格
     var billState;//单据状态
     var expiryDate; //截止日期
     var productName; //产品名称
     var productModel; //产品型号
     var productSpec;// 产品规格
     var productBrand;//产品品牌
     var productAmount;// 产品数量
     var remainTime;//剩余天数
     var jsonData;
}

App({
     onLaunch: function () {
          var that = this;
          wx.getSystemInfo({
               success: function (res) {
                    var sdkVersion = res.SDKVersion;
                    var versionCompare = utils.compareVersion(sdkVersion, '1.9.90');
                    if (versionCompare == -1) {
                         that.globalData.isVersionHigh = false
                    } else {
                         that.globalData.isVersionHigh = true
                    }
               },
          });

          // 登录
          wx.login({
               success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
               }
          })
          // 获取用户信息
          wx.getSetting({
               success: res => {
                    if (res.authSetting['scope.userInfo']) {
                         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                         wx.getUserInfo({
                              success: res => {
                                   // 可以将 res 发送给后台解码出 unionId
                                   this.globalData.userInfo = res.userInfo

                                   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                   // 所以此处加入 callback 以防止这种情况
                                   if (this.userInfoReadyCallback) {
                                        this.userInfoReadyCallback(res)
                                   }
                              }
                         })
                    }
               }
          })
     },
     globalData: {
          userInfo: null,
          isVersionHigh: false
     },
     func: {
          httpRequest: httpRequest.httpRequest,
          dateFormat: utils.dateFormat,
          floatAdd: utils.floatAdd,
          floatSub: utils.floatSub,
          floatDiv: utils.floatDiv,
          floatMul: utils.floatMul,
          compareVersion: utils.compareVersion
     }
})