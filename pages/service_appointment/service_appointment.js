// pages/service_appointment/service_appointment.js
var app = getApp();
var serviceUrl = "http://113.105.74.135:8092/user/appStoreList";
var locationUrl = 'http://apis.map.qq.com/ws/geocoder/v1/';
var mPageIndex = 1;

const tencentMapKey = 'ZNDBZ-W3YR6-6KXSB-MLKXV-6HFXK-UMFOT';

function ServiceBean() {
     var companyName;
     var industry;
     var address;
     var phone;
     var imgUrl;
}

ServiceBean.prototype.printCompany = function () {
     var that = this;
     wx.showToast({
          title: this.companyName,
          duration: 2000
     })
}


Page({

     /**
      * 页面的初始数据
      */
     data: {
          location: '定位中...',
          moduleWidth: 0,
          moduleList: [
               {
                    title: '餐饮',
                    info: '美味齐全',
                    icon: '../../res/images/icon_food.png',
                    color: 'orange'
               }, {
                    title: '美容美发',
                    info: '时尚潮流',
                    icon: '../../res/images/icon_hair.png',
                    color: 'red'
               }, {
                    title: 'KTV',
                    info: '音乐节',
                    icon: '../../res/images/icon_ktv.png',
                    color: 'skyblue'
               }, {
                    title: '运动健身',
                    info: 'hi起来',
                    icon: '../../res/images/icon_sport.png',
                    color: 'red'
               }, {
                    title: '会所',
                    info: '预约有优惠',
                    icon: '../../res/images/icon_club.png',
                    color: 'green'
               }, {
                    title: '医院挂号',
                    info: '您的健康助手',
                    icon: '../../res/images/icon_hospital.png',
                    color: 'purple'
               }
          ],
          imageUrls: [
               'http://113.105.74.140:8081/u/123/100123/201801/o/f5624e77ca374a319a28d06c92752fbb.png',
               'http://113.105.74.140:8081/u/123/100123/201801/o/f5624e77ca374a319a28d06c92752fbb.png',
               'http://113.105.74.140:8081/u/123/100123/201801/o/f5624e77ca374a319a28d06c92752fbb.png'
          ],
          serviceArray: [],
          loadenable: false
     },

     selectCity: function () {
          wx.navigateTo({
               url: '../select_city/select_city'
          })
     },

     getLocalLocation: function () {
          this.setData({
               location: '定位中...'
          });
          var that = this;
          wx.getLocation({
               success: function (res) {
                    app.func.httpRequest(locationUrl, {
                         key: tencentMapKey,
                         location: res.latitude + ',' + res.longitude
                    }, 'GET', {
                              'content-type': 'application/json'
                         }, function (result) {
                              if (result) {
                                   that.setData({
                                        location: result.result.address_component.city
                                   });
                              } else {
                                   that.setData({
                                        location: '定位失败'
                                   });
                              }
                         });
               },
               fail: function (res) {
                    that.setData({
                         location: '定位失败'
                    });
               }
          })
     },

     searchEvent: function () {

     },

     serviceItemTap: function () {

     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          var that = this;

          this.getLocalLocation();
          wx.getSystemInfo({
               success: function (res) {
                    that.setData({
                         moduleWidth: (res.windowWidth / 3) - 2
                    });
               }
          })

          wx.showLoading({
               title: '数据加载中...'
          })

          app.func.httpRequest(serviceUrl, {
               type: 0,
               pageIndex: mPageIndex,
               token: ""
          }, "GET", {
                    'content-type': 'application/json'
               }, function (result) {
                    that.analysisResult(result);
               });
     },

     analysisResult: function (result) {
          var that = this;
          wx.hideLoading();
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          if (result == false) {
               wx.showToast({
                    title: '请求失败',
                    duration: 1500
               })
          } else {
               var resultArray = result.reslut;
               if (resultArray != null && resultArray.length > 0) {
                    var serviceList = [];
                    for (var i = 0; i < resultArray.length; i++) {
                         var resultObject = resultArray[i];

                         // for (var key in resultObject) {
                         //      console.log("键", key);
                         //      console.log("值", resultObject[key]);
                         // }

                         var serviceBean = new ServiceBean();
                         serviceBean.companyName = resultObject.sc_companyname;
                         serviceBean.industry = resultObject.sc_industry;
                         serviceBean.address = resultObject.sc_address;
                         serviceBean.phone = resultObject.sc_telephone;
                         serviceBean.imgUrl = resultObject.sc_imageurl;

                         serviceList.push(serviceBean);
                    }
               };
               var finalArray = [];
               if (mPageIndex == 1) {
                    finalArray.push.apply(finalArray, serviceList);
               } else {
                    finalArray.push.apply(finalArray, that.data.serviceArray);
                    finalArray.push.apply(finalArray, serviceList);
               }
               that.setData({
                    serviceArray: finalArray
               });
          }
     },

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {

     },

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {

     },

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function () {

     },

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function () {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function () {
          var that = this;
          wx.showLoading({
               title: '数据加载中...'
          })

          app.func.httpRequest(serviceUrl, {
               type: 0,
               pageIndex: mPageIndex,
               token: ""
          }, "GET", {
                    'content-type': 'application/json'
               }, function (result) {
                    that.analysisResult(result);
               });
     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {

     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     }
})