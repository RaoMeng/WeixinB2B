
var app = getApp();
var mId, mState, mJson, mEnuu, mUserphone;
var mDetailMainData = [], mQuotePriceList = [];
var mPreIndex, mPreModuleIndex;
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
     mMaterial,//物料
     mCurrency,//币别
     mTaxrate,//税率
     mEnvironment,//环保要求
     mPriceType,//价格类型
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
          leadTime: '',
          minOrderQty: '',
          minPackQty: ''
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
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
          this.setCustomerState(true);

          this.setData({
               isLoading: true,
          });
          var customerDetailUrl = 'http://218.17.158.219:9000/b2b-test/mobile/sale/inquiry/' + mId + '/info';
          app.func.httpRequest(customerDetailUrl, {
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
                    that.customerDetailResult(result);
               });
     },

     setCustomerState: function (setButton) {
          var title;
          if (mState == 'todo') {
               title = '待报价';
               if (setButton) {
                    this.setData({
                         canQuote: true
                    })
               }
          } else if (mState == 'done') {
               title = '已报价';
               if (setButton) {
                    if (mJson != null && mJson != undefined) {
                         var inquiry = mJson.inquiry;
                         var checked, overdue;
                         if (inquiry !== undefined) {
                              checked = inquiry.checked;
                              overdue = inquiry.overdue;
                         }
                         if (checked != 1 || overdue != 0) {
                              this.setData({
                                   canQuote: true
                              })
                         } else {
                              this.setData({
                                   canQuote: false
                              })
                         }
                    } else {
                         this.setData({
                              canQuote: false
                         })
                    }
               }
          } else if (mState == 'agreed') {
               title = '已采纳';
               if (setButton) {
                    this.setData({
                         canQuote: false
                    })
               }
          } else if (mState == 'end') {
               title = '已过期';
               if (setButton) {
                    this.setData({
                         canQuote: false
                    })
               }
          } else if (mState == 'refused') {
               title = '未采纳';
               if (setButton) {
                    this.setData({
                         canQuote: false
                    })
               }
          } else if (mState == 'invalid') {
               title = '已失效';
               if (setButton) {
                    this.setData({
                         canQuote: false
                    })
               }
          } else if (mState == 'abandoned') {
               title = '已作废';
               if (setButton) {
                    this.setData({
                         canQuote: false
                    })
               }
          } else {
               title = '客户询价单';
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

     customerDetailResult: function (result) {
          wx.hideLoading();
          if (result == false) {
               wx.showToast({
                    title: '数据请求失败',
                    duration: 1500
               })
               this.customerDetailResult(mJson);
          } else {
               var inquiryObject = result.inquiry;
               var productObject = result.product;
               var enterpriseObject = inquiryObject.enterprise;
               var recorderUser = inquiryObject.recorderUser;

               if (enterpriseObject !== undefined) {
                    mCustomer = enterpriseObject.enName;
                    mAddress = enterpriseObject.enAddress;
               }

               if (recorderUser !== undefined) {
                    mLinkPhone = recorderUser.userTel;
               }

               mBillNum = inquiryObject.code;
               if (productObject !== undefined) {
                    var title = (productObject.title == undefined ? '' : productObject.title);
                    var spec = (productObject.spec == undefined ? '' : productObject.spec);
                    var code = (productObject.code == undefined ? '' : productObject.code);

                    mMaterial = code + (title.length == 0 ? "" : ((code.length == 0 ? "" : (",\n")) + title)
                         + (spec.length == 0 ? "" : ((code.length == 0 ? "" : (",\n")) + spec)));

                    mProductCode = productObject.code;
                    mProductName = productObject.title;
                    mProductCmpcode = productObject.cmpCode;
                    mProductBrand = productObject.brand;
                    mProductSpec = productObject.spec;
               }
               mEncapsulation = result.encapsulation;
               mNeedquantity = result.needquantity;
               mUnitPrice = result.unitPrice;
               mProduceDate = result.produceDate;
               mCurrency = result.currency;
               mTaxrate = result.taxrate;
               mEnvironment = inquiryObject.environment;
               mPriceType = inquiryObject.priceType;
               mLeadTime = result.leadtime;
               mMinOrderQty = result.minOrderQty;
               mMinPackQty = result.minPackQty;
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
                    quotePriceList: mQuotePriceList,
                    leadTime: (mLeadTime == undefined || mLeadTime == 'undefined') ? '' : mLeadTime,
                    minOrderQty: (mMinOrderQty == undefined || mMinOrderQty == 'undefined') ? '' : mMinOrderQty,
                    minPackQty: (mMinPackQty == undefined || mMinPackQty == 'undefined') ? '' : mMinPackQty
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
                    caption: '联系电话',
                    value: mLinkPhone
               });
               mDetailMainData.push({
                    caption: '单据',
                    value: mBillNum
               });
               mDetailMainData.push({
                    caption: '物料',
                    value: mMaterial
               });
               mDetailMainData.push({
                    caption: '币别',
                    value: mCurrency
               });
               mDetailMainData.push({
                    caption: '税率',
                    value: mTaxrate
               });
               if (mEnvironment != undefined && mEnvironment != null) {
                    mDetailMainData.push({
                         caption: '环保要求',
                         value: mEnvironment
                    });
               }
               mDetailMainData.push({
                    caption: '价格类型',
                    value: mPriceType
               });

               this.setData({
                    detailMainData: mDetailMainData
               });
          }
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
          var customerReplyUrl = 'http://218.17.158.219:9000/b2b-test/mobile/sale/inquiry/items/' + mId + '/reply';
          var useruu = wx.getStorageSync('useruu');
          wx.request({
               url: customerReplyUrl,
               data: {
                    en_uu: mEnuu,
                    user_tel: mUserphone,
                    inquiryItemId: mId,
                    replies: repliesJson,
                    leadtime: mLeadTime,
                    minPackQty: (mMinPackQty === undefined || mMinPackQty == 'undefined') ? '' : mMinPackQty,
                    minOrderQty: (mMinOrderQty === undefined || mMinOrderQty == 'undefined') ? '' : mMinOrderQty,
                    currency: mCurrency,
                    useruu: useruu
               },
               method: 'POST',
               header: {
                    'content-type': 'application/x-www-form-urlencoded'
               },
               success: function (result) {
                    wx.hideLoading();
                    var statusCode = result.statusCode;
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
                    if (statusCode != 200) {
                         wx.showToast({
                              title: result,
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
                    var pages = getCurrentPages();
                    if (pages.length > 1) {
                         var prePage = pages[pages.length - 2];
                         prePage.changeCustomerStatus(mPreIndex, mPreModuleIndex);
                    }
                    that.setData({
                         canQuote: false,
                         quotePriceList: mQuotePriceList,
                         leadTime: (mLeadTime == undefined || mLeadTime == 'undefined') ? '' : mLeadTime,
                         minOrderQty: (mMinOrderQty == undefined || mMinOrderQty == 'undefined') ? '' : mMinOrderQty,
                         minPackQty: (mMinPackQty == undefined || mMinPackQty == 'undefined') ? '' : mMinPackQty
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