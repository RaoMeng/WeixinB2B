// pages/b2b_main/b2b_main.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          loginAccount: []
          //       {
          //      "id": 83573,
          //      "enuu": "1000001",
          //      "businessCode": "8888888888",
          //      "name": "深圳市优软科技有限公司"
          // },
          // {
          //      "id": 83591,
          //      "enuu": "10041166",
          //      "businessCode": "0000000000000",
          //      "name": "优软科技测试"
          // },
          // {
          //      "id": 83902,
          //      "enuu": "10041961",
          //      "businessCode": "440306103197436",
          //      "name": "深圳市英唐智能控制股份有限公司"
          // },
          // {
          //      "id": 85664,
          //      "enuu": "10043574",
          //      "businessCode": "12345567890",
          //      "name": "陈劲松测试SAAS注册"
          // },
          // {
          //      "id": 88247,
          //      "enuu": "10046199",
          //      "businessCode": "278597589",
          //      "name": "深圳市宁东科技有限公司"
          // }
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          var accounts = options.accounts;
          this.setData({
               loginAccount: JSON.parse(accounts)
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