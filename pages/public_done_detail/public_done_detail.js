
var app = getApp();
var mId, mState, mJson, mEnuu, mUserphone;
var mInquiryData = [], mQuoteList = [], mQuotePriceList = [];

Page({

     /**
      * 页面的初始数据
      */
     data: {
          inquiryData: [],
          quoteData: [],
          quotePriceList: [],
          isLoading: true,
          canQuote: false,
          leadTime: '',
          minOrderQty: '',
          minPackQty: ''
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          var that = this;
          mInquiryData = [];
          mQuoteList = [];
          mQuotePriceList = [];

          mId = options.id;
          mState = options.state;
          try {
               if (options.json != undefined) {
                    mJson = JSON.parse(options.json);
               }
          } catch (exception) {
               mJson = "";
          }

          mUserphone = wx.getStorageSync('b2b_user_phone');
          try {
               mEnuu = wx.getStorageSync('b2b_enuu')
          } catch (e) {
               mEnuu = wx.getStorageSync('b2b_enuu')
          }
          var title;
          if (mState == 'todo') {
               title = '待报价';
          } else if (mState == 'done') {
               title = '已转报价';
          } else if (mState == 'invalid') {
               title = '已结束';
          } else {
               title = '我的商机';
          }
          wx.setNavigationBarTitle({
               title: title
          })

          this.setData({
               isLoading: true,
          });
          var publicDetailUrl = 'http://218.17.158.219:24000/inquiry/sale/inquiry/detail';
          app.func.httpRequest(publicDetailUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               id: mId,
               itemId: mId
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.setData({
                         isLoading: false
                    });

                    that.publicDetailResult(result);
               });
     },

     publicDetailResult: function (result) {
          console.log(result);
          wx.hideLoading();
          if (result == false) {
               wx.showToast({
                    title: '数据请求失败',
                    duration: 1500
               })
               this.publicDetailResult(mJson);
          } else {
               var error = result.error;
               if (error == true) {
                    wx.showToast({
                         title: result.errMsg,
                         icon: 'none',
                         duration: 1500
                    })
                    this.publicDetailResult(mJson);
                    return;
               }
               var success = result.success;
               if (success === false) {
                    wx.showToast({
                         title: result.message,
                         icon: 'none',
                         duration: 1500
                    })
                    this.publicDetailResult(mJson);
                    return;
               }
               var inquiryObject = result.inquiry;
               var productObject = result.product;

               var inquiryId = "", inquiryCompany = "", phone = "", contact = "", enddate = "", attachs = "", model = "", brand = "", spec = "", material = "", unit = "", amount = "", currency = "", taxrate = "";

               amount = result.needquantity;
               contact = result.userName;
               phone = result.userTel;
               currency = result.currency;
               taxrate = result.taxrate;

               if (productObject != undefined) {
                    model = productObject.cmpCode;
                    brand = productObject.brand;
                    spec = productObject.spec;
                    material = productObject.title;
                    unit = productObject.unit;
               }
               if (inquiryObject != undefined) {
                    inquiryId = inquiryObject.code;
                    var endDateLong = inquiryObject.endDate;
                    if (endDateLong != undefined) {
                         enddate = app.func.dateFormat(endDateLong, 'Y-M-D');
                    }

                    var enterpriseObject = inquiryObject.enterprise;
                    if (enterpriseObject != undefined) {
                         inquiryCompany = enterpriseObject.enName;
                    }
               }

               mInquiryData.push({
                    caption: '询价编号',
                    value: inquiryId
               });
               mInquiryData.push({
                    caption: '询价企业',
                    value: inquiryCompany
               });
               mInquiryData.push({
                    caption: '联系人',
                    value: contact
               });
               mInquiryData.push({
                    caption: '联系电话',
                    value: phone
               });
               mInquiryData.push({
                    caption: '报价截止日期',
                    value: enddate
               });

               mQuoteList.push({
                    caption: '原厂型号',
                    value: model
               });
               mQuoteList.push({
                    caption: '品牌',
                    value: brand
               });
               mQuoteList.push({
                    caption: '物料规格',
                    value: spec
               });
               mQuoteList.push({
                    caption: '物料名称',
                    value: material
               });
               mQuoteList.push({
                    caption: '单位',
                    value: unit
               });
               if (amount != undefined && amount != null && amount.length > 0) {
                    mQuoteList.push({
                         caption: '数量',
                         value: amount
                    });
               }
               mQuoteList.push({
                    caption: '币别',
                    value: currency
               });
               if (taxrate !== undefined && taxrate.toString().length > 0) {
                    mQuoteList.push({
                         caption: '税率(%)',
                         value: taxrate
                    });
               }

               var leadtime = result.leadtime == undefined ? '' : result.leadtime;
               var minOrderQty = result.minOrderQty == undefined ? '' : result.minOrderQty;
               var minPackQty = result.minPackQty == undefined ? '' : result.minPackQty;
               var replies = result.replies;
               if (replies == undefined || replies == null || replies.length == 0) {
                    mQuotePriceList.push({
                         amount: '0',
                         price: ''
                    });
               } else {
                    for (var i = 0; i < replies.length; i++) {
                         var reply = replies[i];
                         var amount = reply.lapQty;
                         var price = reply.price;
                         mQuotePriceList.push({
                              amount: amount,
                              price: price
                         });
                    }
               }

               this.setData({
                    inquiryData: mInquiryData,
                    quoteData: mQuoteList,
                    quotePriceList: mQuotePriceList,
                    leadTime: leadtime,
                    minOrderQty: minOrderQty,
                    minPackQty: minPackQty
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