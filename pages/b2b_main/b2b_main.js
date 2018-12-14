// pages/b2b_main/b2b_main.js
var app = getApp();

var companyDetail;
var mEnuu = '', mUserphone;
var purchaseUrl = 'http://218.17.158.219:9000/b2b-test/mobile/sale/orders/info/search';
var customerUrl = 'http://218.17.158.219:9000/b2b-test/mobile/sale/inquiry/info/search';
var publicUrl = 'http://218.17.158.219:24000/inquiry/public/mobile/v2';

var isPurchaseSuccess = false, isCustomerSuccess = false, isPublicSuccess = false;

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

Page({
     /**
      * 页面的初始数据
      */
     data: {
          purchaseOrders: [],
          customerInquiries: [],
          publicInquiries: [],
          STATE_PURCHASE_ORDER_TODO: "todo",
          STATE_PURCHASE_ORDER_END: "end",
          STATE_PURCHASE_ORDER_DONE: "done",

          STATE_CUSTOMER_INQUIRY_TODO: "todo",
          STATE_CUSTOMER_INQUIRY_DONE: "done",
          STATE_CUSTOMER_INQUIRY_AGREED: "agreed",
          STATE_CUSTOMER_INQUIRY_END: "end",
          STATE_CUSTOMER_INQUIRY_REFUSED: "refused",
          STATE_CUSTOMER_INQUIRY_INVALID: "invalid",
          STATE_CUSTOMER_INQUIRY_ABANDONED: "abandoned",

          STATE_PUBLIC_INQUIRY_DONE: "done",
          STATE_PUBLIC_INQUIRY_TODO: "todo",
          STATE_PUBLIC_INQUIRY_INVALID: "invalid",

          common_row: {
               caption_class: 'caption',
               value_class: 'value'
          }
     },

     /**
      * 解析客户采购订单数据
      */
     purchaseResult: function (result) {
          isPurchaseSuccess = true;
          if (isPurchaseSuccess && isCustomerSuccess && isPublicSuccess) {
               wx.hideLoading();
               wx.stopPullDownRefresh();
               wx.hideNavigationBarLoading();
          }
          if (result == false) {
               wx.showToast({
                    title: '请求失败',
                    icon: 'none',
                    duration: 1500
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
               var contentArray = result.content;
               var purchaseList = [];
               if (contentArray != undefined && contentArray.length != undefined) {
                    for (var i = 0; i < contentArray.length; i++) {
                         var contentObject = contentArray[i];
                         var enterpriseObject = contentObject.enterprise;
                         var orderItems = contentObject.orderItems;

                         var purchase = new BusinessBean();
                         purchase.jsonData = JSON.stringify(contentObject);
                         purchase.id = contentObject.id;
                         purchase.companyName = enterpriseObject.enName;
                         purchase.billDate = app.func.dateFormat(contentObject.date, 'Y-M-D');
                         purchase.billNum = contentObject.code;
                         purchase.currency = contentObject.currency;

                         if (orderItems == null || orderItems.length == 0) {
                              purchase.money = 0;
                         } else {
                              var money = 0;
                              for (var j = 0; j < orderItems.length; j++) {
                                   var orderItem = orderItems[j];
                                   if (orderItem.amount != undefined) {
                                        money += orderItem.amount;
                                   }
                              }
                              purchase.money = money.toFixed(2) * 100 / 100;
                         }

                         var end = contentObject.end;
                         var status = contentObject.status;
                         if (end == 1) {
                              purchase.billState = this.data.STATE_PURCHASE_ORDER_END
                         } else if (status == 200) {
                              purchase.billState = this.data.STATE_PURCHASE_ORDER_TODO
                         } else if (status == 201) {
                              purchase.billState = this.data.STATE_PURCHASE_ORDER_DONE
                         }

                         purchaseList.push(purchase);
                    }
               }
               this.setData({
                    purchaseOrders: purchaseList
               });
          }
     },

     /**
      * 解析客户询价单数据
      */
     customerResult: function (result) {
          isCustomerSuccess = true;
          if (isPurchaseSuccess && isCustomerSuccess && isPublicSuccess) {
               wx.hideLoading();
               wx.stopPullDownRefresh();
               wx.hideNavigationBarLoading();
          }
          if (result == false) {
               wx.showToast({
                    title: '请求失败',
                    duration: 1500
               })
          } else {
               var contentArray = result.content;
               var customerList = [];
               if (contentArray != undefined && contentArray.length != undefined) {
                    for (var i = 0; i < contentArray.length; i++) {
                         var customer = new BusinessBean();

                         var contentObject = contentArray[i];
                         var inquiryObject = contentObject.inquiry;
                         var productObject = contentObject.product;

                         customer.jsonData = JSON.stringify(contentObject);
                         customer.id = contentObject.id;

                         if (!(inquiryObject == null)) {
                              var enterpriseObject = inquiryObject.enterprise;

                              customer.companyName = enterpriseObject.enName;
                              customer.billNum = inquiryObject.code;
                              if (inquiryObject.endDate != undefined) {
                                   customer.expiryDate = app.func.dateFormat(inquiryObject.endDate, 'Y-M-D');
                              } else {
                                   customer.expiryDate = '';
                              }
                         }

                         if (!(productObject == null)) {
                              customer.materialNum = productObject.code;
                              customer.materialName = productObject.title;
                              customer.materialSpec = productObject.spec;
                         }

                         if (contentObject.date != undefined) {
                              customer.billDate = app.func.dateFormat(contentObject.date, 'Y-M-D');
                         } else {
                              customer.billDate = '';
                         }

                         var remainDate = inquiryObject.endDate - Date.parse(new Date());
                         if (remainDate <= 0) {
                              remainDate = 0;
                              customer.remainTime = 0;
                         } else {
                              customer.remainTime = Math.ceil(app.func.floatDiv(remainDate, (1000 * 60 * 60 * 24)));
                         }

                         var invalid = contentObject.invalid;
                         var status = contentObject.status;
                         var overdue = contentObject.overdue;
                         var agreed = contentObject.agreed;

                         if (status == 314) {
                              customer.billState = this.data.STATE_CUSTOMER_INQUIRY_ABANDONED;
                         } else if (status == 200) {
                              if (overdue == 1) {
                                   customer.billState = this.data.STATE_CUSTOMER_INQUIRY_END;
                              } else {
                                   customer.billState = this.data.STATE_CUSTOMER_INQUIRY_TODO;
                              }
                         } else if (status == 201) {
                              if (agreed == 1) {
                                   if (invalid == 1) {
                                        customer.billState = this.data.STATE_CUSTOMER_INQUIRY_INVALID;
                                   } else {
                                        customer.billState = this.data.STATE_CUSTOMER_INQUIRY_AGREED;
                                   }
                              } else if (agreed == 0) {
                                   customer.billState = this.data.STATE_CUSTOMER_INQUIRY_REFUSED;
                              } else {
                                   customer.billState = this.data.STATE_CUSTOMER_INQUIRY_DONE;
                              }
                         }
                         customerList.push(customer);
                    }
               }

               this.setData({
                    customerInquiries: customerList
               });
          }
     },

     /**
      * 解析公共询价单数据
      */
     publicResult: function (result) {
          isPublicSuccess = true;
          if (isPurchaseSuccess && isCustomerSuccess && isPublicSuccess) {
               wx.hideLoading();
               wx.stopPullDownRefresh();
               wx.hideNavigationBarLoading();
          }
          if (result == false) {
               wx.showToast({
                    title: '请求失败',
                    duration: 1500
               })
          } else {
               var contentArray = result.content;
               var publicList = [];

               if (contentArray != undefined && contentArray.length != undefined) {
                    for (var i = 0; i < contentArray.length; i++) {
                         var publicBean = new BusinessBean();

                         var contentObject = contentArray[i];
                         var inquiryObject = contentObject.inquiry;
                         var productObject = contentObject.product;

                         var quoted = contentObject.quoted;
                         if (quoted == null || quoted == undefined) {
                              publicBean.jsonData = JSON.stringify(contentObject);
                              quoted = 1;
                         }
                         if (contentObject.quteId == null || contentObject.quteId == undefined) {
                              publicBean.id = contentObject.id;
                         } else {
                              publicBean.id = contentObject.quteId;
                         }

                         publicBean.productAmount = contentObject.needquantity;
                         publicBean.billDate = app.func.dateFormat(contentObject.date, 'Y-M-D');
                         if (!(productObject == null || productObject == undefined)) {
                              publicBean.productName = productObject.title;
                              publicBean.productModel = productObject.code;
                              publicBean.productSpec = productObject.spec;
                              publicBean.productBrand = productObject.brand;
                         }
                         if (!(inquiryObject == null || inquiryObject == undefined)) {
                              var enterpriseObject = inquiryObject.enterprise;
                              if (!(enterpriseObject == null || enterpriseObject == undefined)) {
                                   publicBean.companyName = enterpriseObject.enName;
                              }
                              var endDate = inquiryObject.endDate;
                              if (!(endDate == null || endDate == undefined)) {
                                   publicBean.expiryDate = app.func.dateFormat(endDate, 'Y-M-D');
                              }
                         }

                         var overdue = contentObject.overdue;
                         var remainingTime = contentObject.remainingTime;
                         if (remainingTime <= 0 || remainingTime == undefined) {
                              remainingTime = 0;
                              publicBean.remainTime = 0;
                         } else {
                              publicBean.remainTime = Math.ceil(app.func.floatDiv(remainingTime, (1000 * 60 * 60 * 24)));
                         }
                         if (quoted == 1) {
                              publicBean.billState = this.data.STATE_PUBLIC_INQUIRY_DONE;
                              publicBean.jsonData = JSON.stringify(contentObject);
                         } else {
                              publicBean.jsonData = JSON.stringify(contentObject);
                              if (overdue == 1 || remainingTime <= 0) {
                                   publicBean.billState = this.data.STATE_PUBLIC_INQUIRY_INVALID;
                              } else {
                                   publicBean.billState = this.data.STATE_PUBLIC_INQUIRY_TODO;
                              }
                         }

                         publicList.push(publicBean);
                    }
               }

               this.setData({
                    publicInquiries: publicList
               });
          }
     },

     purchaseTap: function () {
          wx.navigateTo({
               url: '../purchase_list/purchase_list?enuu=' + mEnuu,
          })
     },

     customerTap: function () {
          wx.navigateTo({
               url: '../customer_list/customer_list?enuu=' + mEnuu,
          })
     },

     publicTap: function () {
          wx.navigateTo({
               url: '../public_list/public_list?enuu=' + mEnuu,
          })
     },

     publicListTab: function (e) {
          var state = e.currentTarget.dataset.billstate;
          var id = e.currentTarget.dataset.id;
          var jsonData = e.currentTarget.dataset.jsondata;
          var index = e.currentTarget.dataset.index;

          if (state == 'todo' || state == 'invalid') {
               wx.navigateTo({
                    url: '../public_todo_detail/public_todo_detail?id=' + id + '&state=' + state + '&json=' + jsonData + '&index=' + index + '&moduleIndex=0'
               })
          } else {
               wx.navigateTo({
                    url: '../public_done_detail/public_done_detail?id=' + id + '&state=' + state + '&json=' + jsonData + '&index=' + index + '&moduleIndex=0'
               })
          }
     },

     changePurchaseStatus: function (index, moduleIndex) {
          var purchaseList = this.data.purchaseOrders;
          purchaseList[index].billState = this.data.STATE_PURCHASE_ORDER_DONE;
          this.setData({
               purchaseOrders: purchaseList
          });
     },
     changeCustomerStatus: function (index, moduleIndex) {
          var customerList = this.data.customerInquiries;
          customerList[index].billState = this.data.STATE_CUSTOMER_INQUIRY_DONE;
          this.setData({
               customerInquiries: customerList
          });
     },
     changePublicStatus: function (index, publicId, moduleIndex) {
          var publicList = this.data.publicInquiries;
          publicList[index].billState = this.data.STATE_PUBLIC_INQUIRY_DONE;
          publicList[index].id = publicId;
          this.setData({
               publicInquiries: publicList
          });
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          var that = this;
          var actionTitle = options.companyName;
          mEnuu = options.companyEnuu;
          mUserphone = wx.getStorageSync('b2b_user_phone');
          try {
               wx.setStorageSync('b2b_enuu', mEnuu)
          } catch (e) {
               wx.setStorageSync('b2b_enuu', mEnuu)
          }

          wx.setNavigationBarTitle({
               title: actionTitle
          })

          wx.showLoading({
               title: '数据请求中'
          })
          // 请求列表数据
          app.func.httpRequest(purchaseUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: '',
               page: 1,
               size: 3,
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.purchaseResult(result);
               });

          app.func.httpRequest(customerUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: '',
               page: 1,
               size: 3,
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.customerResult(result);
               });

          app.func.httpRequest(publicUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: '',
               page: 1,
               size: 3,
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.publicResult(result);
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
          isPurchaseSuccess = false;
          isCustomerSuccess = false;
          isPublicSuccess = false;
          wx.showNavigationBarLoading();
          var that = this;
          // 请求列表数据
          app.func.httpRequest(purchaseUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: '',
               page: 1,
               size: 3,
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.purchaseResult(result);
               });

          app.func.httpRequest(customerUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: '',
               page: 1,
               size: 3,
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.customerResult(result);
               });

          app.func.httpRequest(publicUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: '',
               page: 1,
               size: 3,
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.publicResult(result);
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

     },

})