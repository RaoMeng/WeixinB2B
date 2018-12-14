var app = getApp();
var mEnuu = '', mUserphone;
var customerUrl = 'http://218.17.158.219:9000/b2b-test/mobile/sale/inquiry/info/search';
//状态标识
const STATE_CUSTOMER_INQUIRY_TODO = 'todo',
     STATE_CUSTOMER_INQUIRY_DONE = 'done',
     STATE_CUSTOMER_INQUIRY_AGREED = 'agreed',
     STATE_CUSTOMER_INQUIRY_END = 'end',
     STATE_CUSTOMER_INQUIRY_REFUSED = 'refused',
     STATE_CUSTOMER_INQUIRY_INVALID = 'invalid',
     STATE_CUSTOMER_INQUIRY_ABANDONED = 'abandoned';

//列表数据页码
var allIndex = 1,
     todoIndex = 1,
     doneIndex = 1,
     agreedIndex = 1,
     invalidIndex = 1;

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
          isVersionHigh: false,
          stateList: [
               "全部", "待报价", "已报价", "已采纳", "已失效"
          ],
          common_row: {
               caption_class: 'caption',
               value_class: 'value'
          },
          selectedIndex: 0,

          //数据列表数组
          customerAll: undefined,
          customerTodo: undefined,
          customerDone: undefined,
          customerAgreed: undefined,
          customerInvalid: undefined,

          //是否可以上拉加载
          allLoadEnable: false,
          todoLoadEnable: false,
          doneLoadEnable: false,
          agreedLoadEnable: false,
          invalidLoadEnable: false,

          //数据为空或请求失败的提示语
          allEmpty: '列表数据为空',
          todoEmpty: '列表数据为空',
          doneEmpty: '列表数据为空',
          agreedEmpty: '列表数据为空',
          invalidEmpty: '列表数据为空',

          allSize: 20,
          keyword: "",
     },

     //全部列表滑到底部
     allScrollLower: function () {
          allIndex++;
          this.getCustomerList("", 0);
     },
     //待报价列表滑到底部
     todoScrollLower: function () {
          todoIndex++;
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_TODO, 1);
     },
     //已报价列表滑到底部
     doneScrollLower: function () {
          doneIndex++;
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_DONE, 2);
     },
     //已采纳列表滑到底部
     agreedScrollLower: function () {
          agreedIndex++;
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_AGREED, 3);
     },
     //已失效列表滑到底部
     invaildScrollLower: function () {
          invalidIndex++;
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_INVALID, 4);
     },

     turnPage: function (e) {
          var dataIndex = e.currentTarget.dataset.index;
          if (this.data.selectedIndex != dataIndex) {
               this.setData({
                    selectedIndex: dataIndex
               });
          } else {
               if (this.data.selectedIndex == 0) {
                    if (this.data.customerAll != null) {
                         this.setData({
                              customerAll: null
                         });
                         allIndex = 1;
                         this.getCustomerList("", 0);
                    }
               } else if (this.data.selectedIndex == 1) {
                    if (this.data.customerTodo != null) {
                         this.setData({
                              customerTodo: null
                         });
                         todoIndex = 1;
                         this.getCustomerList(STATE_CUSTOMER_INQUIRY_TODO, 1);
                    }
               } else if (this.data.selectedIndex == 2) {
                    if (this.data.customerDone != null) {
                         this.setData({
                              customerDone: null
                         });
                         doneIndex = 1;
                         this.getCustomerList(STATE_CUSTOMER_INQUIRY_DONE, 2);
                    }
               } else if (this.data.selectedIndex == 3) {
                    if (this.data.customerAgreed != null) {
                         this.setData({
                              customerAgreed: null
                         });
                         agreedIndex = 1;
                         this.getCustomerList(STATE_CUSTOMER_INQUIRY_AGREED, 3);
                    }
               } else if (this.data.selectedIndex == 4) {
                    if (this.data.customerInvalid != null) {
                         this.setData({
                              customerInvalid: null,
                         });
                         invalidIndex = 1;
                         this.getCustomerList(STATE_CUSTOMER_INQUIRY_INVALID, 4);
                    }
               }

          }
     },

     swiperChange: function (e) {
          var detailIndex = e.detail.current;
          var source = e.detail.source;
          if (this.selectedIndex != detailIndex && source == 'touch') {
               this.setData({
                    selectedIndex: detailIndex
               });
          }
     },

     searchEvent: function (e) {
          var text = e.detail.value;
          this.setData({
               keyword: text,
               customerAll: null,
               customerTodo: null,
               customerDone: null,
               customerAgreed: null,
               customerInvalid: null
          });
          allIndex = 1;
          doneIndex = 1;
          agreedIndex = 1;
          invalidIndex = 1;
          wx.showLoading({
               title: '数据加载中'
          })
          this.getCustomerList("", 0);
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_TODO, 1);
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_DONE, 2);
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_AGREED, 3);
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_INVALID, 4);
     },

     /**
      * 解析客户询价单数据
      */
     customerResult: function (result, dataIndex) {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          if (result == false) {
               wx.showToast({
                    title: '请求失败',
                    duration: 1500
               });
               if (dataIndex == 0) {
                    if (allIndex > 1) {
                         allIndex--;
                    } else {
                         this.setData({
                              allEmpty: '数据请求失败',
                              customerAll: []
                         })
                    }
               } else if (dataIndex == 1) {
                    if (todoIndex > 1) {
                         todoIndex--;
                    } else {
                         this.setData({
                              todoEmpty: '数据请求失败',
                              customerTodo: []
                         })
                    }
               } else if (dataIndex == 2) {
                    if (doneIndex > 1) {
                         doneIndex--;
                    } else {
                         this.setData({
                              doneEmpty: '数据请求失败',
                              customerDone: []
                         })
                    }
               } else if (dataIndex == 3) {
                    if (agreedIndex > 1) {
                         agreedIndex--;
                    } else {
                         this.setData({
                              agreedEmpty: '数据请求失败',
                              customerAgreed: []
                         })
                    }
               } else if (dataIndex == 4) {
                    if (invalidIndex > 1) {
                         invalidIndex--;
                    } else {
                         this.setData({
                              invalidEmpty: '数据请求失败',
                              customerInvalid: []
                         })
                    }
               }
          } else {
               var error = result.error;
               if (error == true) {
                    if (dataIndex == 0) {
                         if (allIndex > 1) {
                              allIndex--;
                         } else {
                              this.setData({
                                   allEmpty: result.errMsg,
                                   customerAll: []
                              })
                         }
                    } else if (dataIndex == 1) {
                         if (todoIndex > 1) {
                              todoIndex--;
                         } else {
                              this.setData({
                                   todoEmpty: result.errMsg,
                                   customerTodo: []
                              })
                         }
                    } else if (dataIndex == 2) {
                         if (doneIndex > 1) {
                              doneIndex--;
                         } else {
                              this.setData({
                                   doneEmpty: result.errMsg,
                                   customerDone: []
                              })
                         }
                    } else if (dataIndex == 3) {
                         if (agreedIndex > 1) {
                              agreedIndex--;
                         } else {
                              this.setData({
                                   agreedEmpty: result.errMsg,
                                   customerAgreed: []
                              })
                         }
                    } else if (dataIndex == 4) {
                         if (invalidIndex > 1) {
                              invalidIndex--;
                         } else {
                              this.setData({
                                   invalidEmpty: result.errMsg,
                                   customerInvalid: []
                              })
                         }
                    }
                    return;
               }
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
                              customer.billState = STATE_CUSTOMER_INQUIRY_ABANDONED;
                         } else if (status == 200) {
                              if (overdue == 1) {
                                   customer.billState = STATE_CUSTOMER_INQUIRY_END;
                              } else {
                                   customer.billState = STATE_CUSTOMER_INQUIRY_TODO;
                              }
                         } else if (status == 201) {
                              if (agreed == 1) {
                                   if (invalid == 1) {
                                        customer.billState = STATE_CUSTOMER_INQUIRY_INVALID;
                                   } else {
                                        customer.billState = STATE_CUSTOMER_INQUIRY_AGREED;
                                   }
                              } else if (agreed == 0) {
                                   customer.billState = STATE_CUSTOMER_INQUIRY_REFUSED;
                              } else {
                                   customer.billState = STATE_CUSTOMER_INQUIRY_DONE;
                              }
                         }
                         customerList.push(customer);
                    }
               }

               var listLength = customerList.length;
               var isLoadEnable = false;
               if (listLength < this.data.allSize) {
                    isLoadEnable = false;
               } else {
                    isLoadEnable = true;
               }

               if (dataIndex == 0) {
                    var resultList = [];
                    if (allIndex == 1) {
                         resultList = resultList.concat(customerList);
                    } else {
                         resultList = resultList.concat(this.data.customerAll, customerList);
                    }
                    this.setData({
                         customerAll: resultList,
                         allLoadEnable: isLoadEnable
                    });
               }
               else if (dataIndex == 1) {
                    var resultList = [];
                    if (todoIndex == 1) {
                         resultList = resultList.concat(customerList);
                    } else {
                         resultList = resultList.concat(this.data.customerTodo, customerList);
                    }
                    this.setData({
                         customerTodo: resultList,
                         todoLoadEnable: isLoadEnable
                    });
               }
               else if (dataIndex == 2) {
                    var resultList = [];
                    if (doneIndex == 1) {
                         resultList = resultList.concat(customerList);
                    } else {
                         resultList = resultList.concat(this.data.customerDone, customerList);
                    }
                    this.setData({
                         customerDone: resultList,
                         doneLoadEnable: isLoadEnable
                    });
               }
               else if (dataIndex == 3) {
                    var resultList = [];
                    if (agreedIndex == 1) {
                         resultList = resultList.concat(customerList);
                    } else {
                         resultList = resultList.concat(this.data.customerAgreed, customerList);
                    }
                    this.setData({
                         customerAgreed: resultList,
                         agreedLoadEnable: isLoadEnable
                    });
               }
               else if (dataIndex == 4) {
                    var resultList = [];
                    if (invalidIndex == 1) {
                         resultList = resultList.concat(customerList);
                    } else {
                         resultList = resultList.concat(this.data.customerInvalid, customerList);
                    }
                    this.setData({
                         customerInvalid: resultList,
                         invalidLoadEnable: isLoadEnable
                    });
               }
          }
     },

     getCustomerList: function (state, dataIndex) {
          var that = this;
          var pageIndex;
          if (dataIndex == 0) {
               pageIndex = allIndex;
          }
          else if (dataIndex == 1) {
               pageIndex = todoIndex;
          }
          else if (dataIndex == 2) {
               pageIndex = doneIndex;
          }
          else if (dataIndex == 3) {
               pageIndex = agreedIndex;
          }
          else if (dataIndex == 4) {
               pageIndex = invalidIndex;
          }

          // 请求列表数据
          app.func.httpRequest(customerUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: state,
               page: pageIndex,
               size: that.data.allSize,
               keyword: that.data.keyword
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.customerResult(result, dataIndex);
               });
     },

     changeCustomerStatus: function (index, moduleIndex) {
          // customerAll: undefined,
          //      customerTodo: undefined,
          //           customerDone: undefined,
          //                customerAgreed: undefined,
          //                     customerInvalid: undefined,
          if (moduleIndex == 1) {
               var allList = this.data.customerAll;
               allList[index].billState = STATE_CUSTOMER_INQUIRY_DONE;
               this.setData({
                    customerAll: allList
               });
          } else if (moduleIndex == 2) {
               var todoList = this.data.customerTodo;
               todoList[index].billState = STATE_CUSTOMER_INQUIRY_DONE;
               this.setData({
                    customerTodo: todoList
               });
          } else if (moduleIndex == 3) {
               var doneList = this.data.customerDone;
               doneList[index].billState = STATE_CUSTOMER_INQUIRY_DONE;
               this.setData({
                    customerDone: doneList
               });
          } else if (moduleIndex == 4) {
               var agreedList = this.data.customerAgreed;
               agreedList[index].billState = STATE_CUSTOMER_INQUIRY_DONE;
               this.setData({
                    customerAgreed: agreedList
               });
          } else if (moduleIndex == 4) {
               var invalidList = this.data.customerInvalid;
               invalidList[index].billState = STATE_CUSTOMER_INQUIRY_DONE;
               this.setData({
                    customerInvalid: invalidList
               });
          }
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          if (app.globalData.isVersionHigh) {
               this.setData({
                    isVersionHigh: true
               });
          } else {
               this.setData({
                    isVersionHigh: false
               });
          }
          mEnuu = options.enuu;
          mUserphone = wx.getStorageSync('b2b_user_phone');

          this.getCustomerList("", 0);
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_TODO, 1);
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_DONE, 2);
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_AGREED, 3);
          this.getCustomerList(STATE_CUSTOMER_INQUIRY_INVALID, 4);
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
          // switch (this.data.selectedIndex) {
          //      case 0:
          //           this.allScrollLower();
          //           break;
          //      case 1:
          //           this.todoScrollLower();
          //           break;
          //      case 2:
          //           this.doneScrollLower();
          //           break;
          //      case 3:
          //           this.endScrollLower();
          //           break;
          // }
     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     }
})