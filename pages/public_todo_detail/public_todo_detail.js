// pages/public_detail/public_detail.js
var app = getApp();
var mId, mState, mJson, mEnuu, mUserphone;
var mPreIndex, mPreModuleIndex;
var mDetailMainData = [], mQuotePriceList = [];
var mCustomer,//客户
     mAddress,//客户地址
     mLinkman,//联系人
     mLinkPhone,//联系电话
     mBillNum,//单据号
     mProductCode,//产品编号
     mProductName,//产品名称
     mProductCmpcode,//产品型号
     mProductBrand,//品牌
     mProductSpec,//产品规格
     mEncapsulation,//封装
     mNeedquantity,//采购数量
     mUnitPrice,//单价预算
     mProduceDate,//生产日期
     mEnvironment,//环保要求
     mCurrency,//币别
     mTaxrate,//税率
     mLeadTime,//交货周期
     mMinOrderQty,//最小起订
     mMinPackQty//最小包装
     ;

Page({

     /**
      * 页面的初始数据
      */
     data: {
          canQuote: false,
          detailMainData: [],
          isLoading: true,
          quotePriceList: [],
          currency: '',
          taxrate: '',
          leadTime: '',
          minOrderQty: '',
          minPackQty: ''
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          console.log(options);
          var that = this;
          mDetailMainData = [];
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
          mPreIndex = options.index;
          mPreModuleIndex = options.moduleIndex;

          mUserphone = wx.getStorageSync('b2b_user_phone');
          try {
               mEnuu = wx.getStorageSync('b2b_enuu')
          } catch (e) {
               mEnuu = wx.getStorageSync('b2b_enuu')
          }
          this.setPulicState(true);

          this.setData({
               isLoading: true,
          });
          var publicDetailUrl = 'http://218.17.158.219:24000/inquiry/sale/publicInquiry/detail';
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
                    var inquiryItem = result.inquiryItem;
                    if (inquiryItem == undefined) {
                         that.customerDetailResult(mJson);
                    } else {
                         that.publicDetailResult(inquiryItem);
                    }
               });
     },

     publicDetailResult: function (detail) {
          wx.hideLoading();
          if (detail == false) {
               wx.showToast({
                    title: '数据请求失败',
                    duration: 1500
               })
               this.customerDetailResult(mJson);
          } else {
               var inquiryObject = detail.inquiry;
               var productObject = detail.product;

               if (inquiryObject != undefined) {
                    var enterpriseObject = inquiryObject.enterprise;
                    var recorderUser = inquiryObject.recorderUser;

                    mBillNum = inquiryObject.code;
                    mEnvironment = inquiryObject.environment;

                    if (enterpriseObject != undefined) {
                         mCustomer = enterpriseObject.enName;
                         mAddress = enterpriseObject.enAddress;
                    }
               }

               if (productObject != undefined) {
                    mProductCode = productObject.code;
                    mProductName = productObject.title;
                    mProductCmpcode = productObject.cmpCode;
                    mProductBrand = productObject.brand;
                    mProductSpec = productObject.spec;
               }

               mLinkman = detail.userName;
               mLinkPhone = detail.userTel;
               mEncapsulation = detail.encapsulation;
               mNeedquantity = detail.needquantity;
               mUnitPrice = detail.unitPrice;
               mProduceDate = detail.produceDate;
               mCurrency = detail.currency;
               mTaxrate = detail.taxrate;
               mLeadTime = detail.leadtime;
               mMinOrderQty = detail.minOrderQty;
               mMinPackQty = detail.minPackQty;
               var replies = detail.replies;

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
                    currency: (mCurrency === undefined || mCurrency == 'undefined') ? '' : mCurrency,
                    quotePriceList: mQuotePriceList,
                    taxrate: (mTaxrate === undefined || mTaxrate == 'undefined') ? '' : mTaxrate,
                    leadTime: (mLeadTime === undefined || mLeadTime == 'undefined') ? '' : mLeadTime,
                    minOrderQty: (mMinOrderQty === undefined || mMinOrderQty == 'undefined') ? '' : mMinOrderQty,
                    minPackQty: (mMinPackQty === undefined || mMinPackQty == 'undefined') ? '' : mMinPackQty
               });

               mDetailMainData.push({
                    caption: '客户',
                    value: mCustomer
               });
               mDetailMainData.push({
                    caption: '客户地址',
                    value: mAddress
               });
               mDetailMainData.push({
                    caption: '联系人',
                    value: mLinkman
               });
               mDetailMainData.push({
                    caption: '联系电话',
                    value: mLinkPhone
               });
               mDetailMainData.push({
                    caption: '单据',
                    value: mBillNum
               });

               if (mProductCode != undefined && mProductCode != null && mProductCode.length > 0) {
                    mDetailMainData.push({
                         caption: '产品编号',
                         value: mProductCode
                    });
               }
               if (mProductName != undefined && mProductName != null && mProductName.length > 0) {
                    mDetailMainData.push({
                         caption: '产品名称',
                         value: mProductName
                    });
               }
               if (mProductCmpcode != undefined && mProductCmpcode != null && mProductCmpcode.length > 0) {
                    mDetailMainData.push({
                         caption: '产品型号',
                         value: mProductCmpcode
                    });
               }
               if (mProductBrand != undefined && mProductBrand != null && mProductBrand.length > 0) {
                    mDetailMainData.push({
                         caption: '品牌',
                         value: mProductBrand
                    });
               }
               if (mProductSpec != undefined && mProductSpec != null && mProductSpec.length > 0) {
                    mDetailMainData.push({
                         caption: '产品规格',
                         value: mProductSpec
                    });
               }
               if (mEncapsulation != undefined && mEncapsulation != null && mEncapsulation.length > 0) {
                    mDetailMainData.push({
                         caption: '封装',
                         value: mEncapsulation
                    });
               }
               if (mNeedquantity != undefined && mNeedquantity != null && mNeedquantity.length > 0) {
                    mDetailMainData.push({
                         caption: '采购数量',
                         value: mNeedquantity
                    });
               }
               if (mUnitPrice != undefined && mUnitPrice != null && mUnitPrice.length > 0 && mCurrency != undefined && mCurrency != null && mCurrency.length > 0) {
                    mDetailMainData.push({
                         caption: '单价预算',
                         value: mUnitPrice + '(' + mCurrency + ')'
                    });
               }
               if (mProduceDate != undefined && mProduceDate != null && mProduceDate.length > 0) {
                    mDetailMainData.push({
                         caption: '生产日期',
                         value: mProduceDate
                    });
               }
               if (mEnvironment != undefined && mEnvironment != null && mEnvironment.length > 0) {
                    mDetailMainData.push({
                         caption: '环保要求',
                         value: mEnvironment
                    });
               }

               this.setData({
                    detailMainData: mDetailMainData
               });
          }
     },

     setPulicState: function (setButton) {
          var title;
          if (mState == 'todo') {
               title = '待报价';
               if (setButton) {
                    this.setData({
                         canQuote: true
                    })
               }
          } else if (mState == 'invalid') {
               title = '已结束';
               if (setButton) {
                    this.setData({
                         canQuote: false
                    });
               }
          } else {
               title = '我的商机';
               if (setButton) {
                    this.setData({
                         canQuote: false
                    })
               }
          }
          wx.setNavigationBarTitle({
               title: title
          })
     },

     currencyTap: function () {
          if (this.data.canQuote) {
               var that = this;
               var currencyList = ['RMB', 'USD', 'HKD', 'JPY', 'EUR'];
               wx.showActionSheet({
                    itemList: currencyList,
                    success: function (res) {
                         var index = res.tapIndex;
                         mCurrency = currencyList[index];
                         that.setData({
                              currency: mCurrency
                         });
                    },
                    fail: function (res) {
                    }
               })
          }
     },

     taxrateInputListener: function (e) {
          mTaxrate = e.detail.value;
     },
     leadTimeInputListener: function (e) {
          mLeadTime = e.detail.value;
     },
     minOrderQtyInputListener: function (e) {
          mMinOrderQty = e.detail.value;
     },
     minPackQtyInputListener: function (e) {
          mMinPackQty = e.detail.value;
     },

     addTap: function (e) {
          mQuotePriceList.push({
               amount: '',
               price: ''
          });

          this.setData({
               quotePriceList: mQuotePriceList
          });
     },

     deleteTap: function (e) {
          var position = e.currentTarget.dataset.position;
          mQuotePriceList.splice(position, 1);

          this.setData({
               quotePriceList: mQuotePriceList
          });
     },

     amountInputListener: function (e) {
          var position = e.currentTarget.dataset.position;
          var amount = e.detail.value;
          mQuotePriceList[position].amount = amount;

          this.setData({
               quotePriceList: mQuotePriceList
          });
     },

     unitPriceInputListener: function (e) {
          var position = e.currentTarget.dataset.position;
          var unitPrice = e.detail.value;
          mQuotePriceList[position].price = unitPrice;

          this.setData({
               quotePriceList: mQuotePriceList
          });
     },
     submitEvent: function (e) {
          var that = this;
          if (mLeadTime == undefined || mLeadTime == null || mLeadTime.length == 0) {
               wx.showToast({
                    title: '交货周期不能为空',
                    icon: 'none'
               })
               return;
          }
          var submitReplies = [];
          for (var i = 0; i < mQuotePriceList.length; i++) {
               var quotePriceBean = mQuotePriceList[i];

               var amount = quotePriceBean.amount;
               var price = quotePriceBean.price;

               if (amount == null || amount == undefined || amount.length == 0
                    || price == null || price == undefined || price.length == 0) {
                    wx.showToast({
                         title: '分段报价存在未填项',
                         icon: 'none'
                    })
                    return;
               }
               if (i >= 1) {
                    var amountFloatN = parseFloat(amount);
                    var lastQuotePrice = mQuotePriceList[i - 1];
                    var amountFloatB = parseFloat(lastQuotePrice.amount);

                    if (amountFloatN < amountFloatB) {
                         wx.showToast({
                              title: '分段数量请保持递增！',
                              icon: 'none'
                         })
                         return;
                    }
               }
               submitReplies.push({
                    lapQty: amount,
                    price: price
               });
          }

          var repliesJson = JSON.stringify(submitReplies);

          wx.showLoading({
               title: '正在报价...',
               mask: true
          })
          var publicQuoteUrl = 'http://218.17.158.219:24000/inquiry/sale/mobile/quote';
          var useruu = wx.getStorageSync('useruu');
          wx.request({
               url: publicQuoteUrl,
               data: {
                    en_uu: mEnuu,
                    user_tel: mUserphone,
                    inquiryItemId: mId,
                    replies: repliesJson,
                    leadtime: mLeadTime,
                    minPackQty: (mMinPackQty === undefined || mMinPackQty == 'undefined') ? '' : mMinPackQty,
                    minOrderQty: (mMinOrderQty === undefined || mMinOrderQty == 'undefined') ? '' : mMinOrderQty,
                    currency: mCurrency,
                    taxrate: (mTaxrate === undefined || mTaxrate == 'undefined') ? '' : parseFloat(mTaxrate),
                    useruu: useruu
               },
               method: 'POST',
               header: {
                    'content-type': 'application/x-www-form-urlencoded'
               },
               success: function (result) {
                    wx.hideLoading();
                    var result = result.data;
                    var error = result.error;
                    if (error == true) {
                         wx.showToast({
                              title: result.errMsg,
                              icon: 'none',
                              duration: 1500
                         })
                         return;
                    }
                    var success = result.success;
                    if (success === false) {
                         wx.showToast({
                              title: result.message,
                              icon: 'none',
                              duration: 1500
                         })
                         return;
                    }
                    wx.showToast({
                         title: '报价成功',
                         duration: 1500
                    })
                    wx.setNavigationBarTitle({
                         title: '已报价',
                    })
                    var publicId = result.content;
                    if (publicId != undefined) {
                         var pages = getCurrentPages();
                         if (pages.length > 1) {
                              var prePage = pages[pages.length - 2];
                              prePage.changePublicStatus(mPreIndex, publicId, mPreModuleIndex);
                         }
                    }

                    that.setData({
                         canQuote: false,
                         currency: mCurrency,
                         quotePriceList: mQuotePriceList,
                         taxrate: (mTaxrate === undefined || mTaxrate == 'undefined') ? '' : mTaxrate,
                         leadTime: (mLeadTime === undefined || mLeadTime == 'undefined') ? '' : mLeadTime,
                         minOrderQty: (mMinOrderQty === undefined || mMinOrderQty == 'undefined') ? '' : mMinOrderQty,
                         minPackQty: (mMinPackQty === undefined || mMinPackQty == 'undefined') ? '' : mMinPackQty
                    });
                    wx: setTimeout(function () {
                         wx.navigateBack({
                              delta: 1
                         });
                    }, 1500);
               },
               fail: function (error) {
                    wx.showToast({
                         title: '报价失败',
                         icon: 'none'
                    })
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