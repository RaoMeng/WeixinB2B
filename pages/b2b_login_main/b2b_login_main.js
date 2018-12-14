// pages/b2b_login_main/b2b_login_main.js
var app = getApp();
var mUsername, mPassword;
// var loginUrl = "https://sso.ubtob.com/sso/login/mobile"
var loginUrl = "http://218.17.158.219:32323/sso/login/mobile"

Page({

     /**
      * 页面的初始数据
      */
     data: {
          showContent: false,
          isVersionHigh: false
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          var that = this;
          if (app.globalData.isVersionHigh) {
               that.setData({
                    showContent: true,
                    isVersionHigh: true
               });
          } else {
               that.setData({
                    showContent: true,
                    isVersionHigh: false
               });
          }

          mUsername = '';
          mPassword = '';
     },

     usernameInput: function (e) {
          mUsername = e.detail.value;
     },

     passwordInput: function (e) {
          mPassword = e.detail.value;
     },

     loginEvent: function () {
          if (mUsername === null || mUsername === undefined || mUsername.length === 0) {
               wx.showToast({
                    title: '请输入用户名',
                    icon: 'none'
               })
               return;
          }
          else if (mPassword === null || mPassword === undefined || mPassword.length === 0) {
               wx.showToast({
                    title: '请输入密码',
                    icon: 'none'
               })
               return;
          }
          wx.showLoading({
               title: '正在登录...',
               mask: true
          })

          app.func.httpRequest(loginUrl, {
               mobile: mUsername,
               password: mPassword
          }, 'POST', {
                    'content-type': 'application/x-www-form-urlencoded'
               }, function (result) {
                    wx.hideLoading();
                    if (result == false) {
                         wx.showToast({
                              title: '登录失败',
                              icon: 'none'
                         })
                    } else {
                         var error = result.error;
                         if (error == true) {
                              var errorMsg = result.errMsg;
                              if (errorMsg == undefined || errorMsg == null) {
                                   errorMsg = '登录失败';
                              }
                              wx.showToast({
                                   title: errorMsg,
                                   icon: 'none'
                              })
                         } else {
                              wx.setStorageSync("b2b_user_phone", mUsername)
                              var token = result.token;
                              var accountList = result.datalist;
                              wx.setStorageSync("b2b_token", token);
                              if (accountList === undefined || accountList === null) {
                                   wx.showToast({
                                        title: '您没有开通任何B2B账套',
                                        icon: 'none'
                                   })
                              } else {
                                   var spaces = '';
                                   for (var i = 0; i < accountList.length; i++) {
                                        var accountObject = accountList[i];
                                        if (accountObject.platform == 'B2B') {
                                             spaces = JSON.stringify(accountObject.spaces);
                                             var userUU = accountObject.account;
                                             wx.setStorageSync('useruu', userUU)
                                        }
                                   }
                                   wx.navigateTo({
                                        url: '../b2b_login/b2b_login?accounts=' + spaces,
                                   })
                              }
                         }
                    }
               });
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