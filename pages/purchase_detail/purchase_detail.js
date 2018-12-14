// pages/purchase_detail/purchase_detail.js
var app = getApp();
var mId, mState, mJson, mEnuu, mUserphone;
var mPreIndex, mPreModuleIndex;
var mCustomer//客户
     , mAddress//收货地址
     , mOrderNum//订单号
     , mDocumentDate//单据时间
     , mRemarks//备注
     , mCurrency//币别
     , mMoney//金额
     ;

var mPurchaseDetailList = [];

function PurchaseDetail() {
     var id;//单据id
     var identifier;//编号
     var product;//产品
     var spec;//规格型号
     var unitPrice;//单价
     var deliveryDate;//交货日期
     var quantity;//数量
     var remarks;//备注
     var isEnable;//是否可操作
}

Page({

     /**
      * 页面的初始数据
      */
     data: {
          isReplyable: false,
          detailMainData: [],
          purchaseDetailList: [],
          isLoading: true
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          var that = this;
          mPurchaseDetailList = [];
          mId = options.id;
          mState = options.state;
          if (options.json != undefined) {
               try {
                    mJson = JSON.parse(options.json);
               } catch (e) {
                    mJson = '';
               }
          }

          mPreIndex = options.index;
          mPreModuleIndex = options.moduleIndex;

          mUserphone = wx.getStorageSync('b2b_user_phone');
          try {
               mEnuu = wx.getStorageSync('b2b_enuu')
          } catch (e) {
               mEnuu = wx.getStorageSync('b2b_enuu')
          }
          this.setPurchaseState(false)

          this.initPurchaseDetail(true);
     },

     initPurchaseDetail: function (useLocal) {
          mPurchaseDetailList = [];
          var that = this;
          this.setData({
               isReplyable: false,
               detailMainData: [],
               purchaseDetailList: [],
               isLoading: true
          });
          var purchaseDetailUrl = 'http://218.17.158.219:9000/b2b-test/mobile/sale/orders/' + mId + '/info';
          app.func.httpRequest(purchaseDetailUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               id: mId
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.setData({
                         isLoading: false
                    });
                    that.purchaseDetailResult(result, useLocal);
               });
     },

     deliveryDateChange: function (e) {
          var date = e.detail.value;
          var position = e.currentTarget.dataset.position;
          mPurchaseDetailList[position].deliveryDate = date;

          this.setData({
               purchaseDetailList: mPurchaseDetailList
          });
     },

     quantityInputListener: function (e) {
          var quantity = e.detail.value;
          var position = e.currentTarget.dataset.position;
          mPurchaseDetailList[position].quantity = quantity;

          // this.setData({
          //      purchaseDetailList: mPurchaseDetailList
          // });
     },

     remarksInputListener: function (e) {
          var remarks = e.detail.value;
          var position = e.currentTarget.dataset.position;
          mPurchaseDetailList[position].remarks = remarks;

          // this.setData({
          //      purchaseDetailList: mPurchaseDetailList
          // });
     },

     submitEvent: function () {
          var that = this;
          wx.showLoading({
               title: '正在回复...',
               mask: true
          });
          var replies = [];
          if (mPurchaseDetailList !== undefined && mPurchaseDetailList !== null) {
               for (var i = 0; i < mPurchaseDetailList.length; i++) {
                    var purchaseDetail = mPurchaseDetailList[i];
                    var date = purchaseDetail.deliveryDate;
                    var dateStr = new Date(date.replace(/-/g, '/'));
                    var dateLong = dateStr.getTime();
                    var reply = {
                         qty: purchaseDetail.quantity,
                         delivery: dateLong,
                         remark: purchaseDetail.remarks,
                         pdId: purchaseDetail.id
                    }
                    replies.push(reply);
               }
          }
          var repliesJson = JSON.stringify(replies);
          var replyUrl = "http://218.17.158.219:9000/b2b-test/mobile/sale/orders/reply"
          app.func.httpRequest(replyUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               json: repliesJson
          }, 'POST', {
                    'content-type': 'application/x-www-form-urlencoded'
               }, function (result) {
                    wx.hideLoading();
                    if (result === false) {
                         wx.showToast({
                              title: '回复失败',
                              icon: 'none'
                         })
                    } else {
                         var error = result.error;
                         if (error == true) {
                              wx.showToast({
                                   title: result.errMsg,
                                   icon: 'none',
                                   duration: 1500
                              })
                              return;
                         }
                         wx.showToast({
                              title: '回复成功',
                              duration: 1500
                         })
                         var pages = getCurrentPages();
                         if (pages.length > 1) {
                              var prePage = pages[pages.length - 2];
                              prePage.changePurchaseStatus(mPreIndex, mPreModuleIndex);
                         }
                         //重新请求详情
                         // that.initPurchaseDetail(false);
                         that.setData({
                              isReplyable: false
                         });
                         wx: setTimeout(function () {
                              wx.navigateBack({
                                   delta: 1
                              });
                         }, 1500);
                    }
               });
     },

     purchaseDetailResult: function (result, useLocal) {
          wx.hideLoading();
          if (result == false) {
               wx.showToast({
                    title: '数据请求失败',
                    icon: 'none',
                    duration: 1500
               })
               if (useLocal) {
                    this.purchaseDetailResult(mJson, true);
               } else {
                    this.initPurchaseDetail(false);
               }
          } else {
               var error = result.error;
               if (error == true) {
                    wx.showToast({
                         title: result.errMsg,
                         icon: 'none',
                         duration: 1500
                    })
                    return;
               }
               var end = result.end;
               if (end != undefined && end == 1) {
                    mState = 'end';
               } else {
                    var status = result.status;
                    if (status == '200') {
                         mState = 'todo';
                    } else if (status == '201') {
                         mState = 'done';
                    }
               }
               this.setPurchaseState(true);
               console.log(result);

               var orderItems = result.orderItems;
               var enterprise = result.enterprise;

               mCustomer = enterprise.enName;
               mAddress = result.shipAddress;
               mOrderNum = result.code;
               var date = (result.erpDate == undefined ? result.date : result.erpDate);
               if (date != undefined) {
                    mDocumentDate = app.func.dateFormat(date, 'Y-M-D');
               }
               mRemarks = result.remark;
               mCurrency = result.currency;

               if (orderItems != undefined) {
                    var sumMoney = 0;
                    for (var i = 0; i < orderItems.length; i++) {
                         var orderItem = orderItems[i];
                         var productObject = orderItem.product;

                         var purchaseDetail = new PurchaseDetail();
                         purchaseDetail.id = orderItem.id;
                         purchaseDetail.identifier = productObject.code;
                         purchaseDetail.product = productObject.title;
                         purchaseDetail.spec = productObject.spec;
                         purchaseDetail.unitPrice = orderItem.price;
                         var delivery = (orderItem.replyDelivery == undefined ? orderItem.delivery : orderItem.replyDelivery);
                         if (delivery != undefined) {
                              purchaseDetail.deliveryDate = app.func.dateFormat(delivery, 'Y-M-D');
                         }
                         purchaseDetail.quantity = ((orderItem.latestReplyQty == undefined || orderItem.latestReplyQty == 0) ? orderItem.qty : orderItem.latestReplyQty);
                         purchaseDetail.remarks = orderItem.replyRemark;
                         var slaveStatus = orderItem.status;
                         if (this.data.isReplyable) {
                              if (slaveStatus == '200') {
                                   purchaseDetail.isEnable = true;
                              } else {
                                   purchaseDetail.isEnable = false;
                              }
                         } else {
                              purchaseDetail.isEnable = false;
                         }


                         mPurchaseDetailList.push(purchaseDetail);

                         var amount = orderItem.amount;
                         if (amount !== undefined && amount !== null) {
                              sumMoney = app.func.floatAdd(sumMoney, amount);
                         }
                    }
                    mMoney = sumMoney;
               }
               this.setData({
                    detailMainData: [
                         {
                              caption: '客户',
                              value: mCustomer
                         },
                         {
                              caption: '收货地址',
                              value: mAddress
                         },
                         {
                              caption: '订单号',
                              value: mOrderNum
                         },
                         {
                              caption: '单据时间',
                              value: mDocumentDate
                         },
                         {
                              caption: '备注',
                              value: mRemarks
                         },
                         {
                              caption: '币别',
                              value: mCurrency
                         },
                         {
                              caption: '金额',
                              value: mMoney
                         },
                    ],
                    purchaseDetailList: mPurchaseDetailList
               });
          }
     },

     setPurchaseState(isReply) {
          var title;
          if (mState == 'todo') {
               title = '待回复';
               if (isReply) {
                    this.setData({
                         isReplyable: true
                    })
               }
          } else if (mState == 'end') {
               title = '已结案';
               if (isReply) {
                    this.setData({
                         isReplyable: false
                    })
               }
          } else if (mState == 'done') {
               title = '已回复';
               if (isReply) {
                    this.setData({
                         isReplyable: false
                    })
               }
          }

          if (title !== undefined) {
               wx.setNavigationBarTitle({
                    title: title
               })
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