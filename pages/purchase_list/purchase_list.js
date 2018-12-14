// pages/purchase_list/purchase_list.js
var app = getApp();
var mEnuu = '', mUserphone;
var isTabEvent = false;
var purchaseUrl = 'http://218.17.158.219:9000/b2b-test/mobile/sale/orders/info/search';
var allScrollTop, todoScrollTop, doneScrollTop, endScrollTop;
var allRefreshState = 0, todoRefreshState = 0, doneRefreshState = 0, endRefreshState = 0;

var isAllTouchEnd = true, isTodoTouchEnd = true, isDoneTouchEnd = true, isEndTouchEnd = true;
const refreshHeight = 0;
const cRefreshState = {
     invisiable: 0,  //看不见
     pulling: 1,     //下拉时
     release: 2,     //可松开刷新时
     refresing: 3,   //正在刷新
     finish: 4,      //刷新完成
}

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
               "全部", "待回复", "已回复", "已结案"
          ],
          common_row: {
               caption_class: 'caption',
               value_class: 'value'
          },
          STATE_PURCHASE_ORDER_TODO: "todo",
          STATE_PURCHASE_ORDER_END: "end",
          STATE_PURCHASE_ORDER_DONE: "done",

          selectedIndex: 0,
          purchaseAll: undefined,
          purchaseTodo: undefined,
          purchaseDone: undefined,
          purchaseEnd: undefined,

          allLoadEnable: false,
          todoLoadEnable: false,
          doneLoadEnable: false,
          endLoadEnable: false,
          allIndex: 1,
          todoIndex: 1,
          doneIndex: 1,
          endIndex: 1,
          allSize: 20,
          keyword: "",
          scrollHeight: 0,
          allRefreshEnable: false,
          allRefreshText: '下拉刷新',
          todoRefreshText: '下拉刷新',
          doneRefreshText: '下拉刷新',
          endRefreshText: '下拉刷新',
          allScrollTop: refreshHeight,
          todoScrollTop: refreshHeight,
          doneScrollTop: refreshHeight,
          endScrollTop: refreshHeight,
          allEmpty: '列表数据为空',
          todoEmpty: '列表数据为空',
          doneEmpty: '列表数据为空',
          endEmpty: '列表数据为空',
     },

     allTouchStart: function (e) {
          isAllTouchEnd = false;
     },

     allTouchEnd: function (e) {
          // isAllTouchEnd = true;
          // var that = this;
          // if (allRefreshState == cRefreshState.release) {
          //      allRefreshState = cRefreshState.refresing;
          //      that.setData({
          //           allRefreshText: '正在刷新'
          //      });
          //      setTimeout(function () {
          //           wx.showToast({
          //                title: '刷新完成',
          //           });
          //           that.setData({
          //                allRefreshText: '下拉刷新',
          //           });
          //           if (allScrollTop <= refreshHeight) {
          //                that.setData({
          //                     allScrollTop: refreshHeight
          //                });
          //           }
          //           allRefreshState = cRefreshState.invisiable;
          //      }, 4000);
          // } else if (allRefreshState == cRefreshState.refresing) {
          //      this.setData({
          //           allRefreshText: '正在刷新'
          //      });
          // } else if (allRefreshState == cRefreshState.invisiable) {
          //      if (allScrollTop <= refreshHeight) {
          //           this.setData({
          //                allScrollTop: refreshHeight
          //           });
          //      }
          // } else {
          //      allRefreshState = cRefreshState.invisiable;
          //      this.setData({
          //           allScrollTop: refreshHeight
          //      });
          // }
     },

     todoTouchEnd: function (e) {
     },

     doneTouchEnd: function (e) {
     },

     endTouchEnd: function (e) {
     },

     allScrollTap: function (e) {
          // allScrollTop = e.detail.scrollTop;
          // if (isAllTouchEnd) {
          //      allRefreshState = cRefreshState.invisiable;
          //      if (allScrollTop <= refreshHeight) {
          //           this.setData({
          //                allScrollTop: refreshHeight
          //           });
          //      }
          // } else {
          //      if (allScrollTop <= 4) {
          //           allRefreshState = cRefreshState.release;
          //      } else if (allScrollTop < refreshHeight) {
          //           allRefreshState = cRefreshState.pulling;
          //      } else {
          //           allRefreshState = cRefreshState.invisiable;
          //      }
          // }

          // if (allRefreshState == cRefreshState.release) {
          //      this.setData({
          //           allRefreshText: '松手刷新'
          //      });
          // } else {
          //      this.setData({
          //           allRefreshText: '下拉刷新'
          //      });
          // }
     },

     todoScrollTap: function (e) {
          // todoScrollTop = e.detail.scrollTop;
          // if (todoScrollTop <= 0) {
          //      todoRefreshState = cRefreshState.release;
          // } else if (todoScrollTop < refreshHeight) {
          //      todoRefreshState = cRefreshState.pulling;
          // } else {
          //      todoRefreshState = cRefreshState.invisiable;
          // }

          // if (todoRefreshState == cRefreshState.release) {
          //      this.setData({
          //           todoRefreshText: '松手刷新'
          //      });
          // } else {
          //      this.setData({
          //           todoRefreshText: '下拉刷新'
          //      });
          // }
     },

     doneScrollTap: function (e) {
          // doneScrollTop = e.detail.scrollTop;
          // if (doneScrollTop <= 0) {
          //      doneRefreshState = cRefreshState.release;
          // } else if (doneScrollTop < refreshHeight) {
          //      doneRefreshState = cRefreshState.pulling;
          // } else {
          //      doneRefreshState = cRefreshState.invisiable;
          // }

          // if (doneRefreshState == cRefreshState.release) {
          //      this.setData({
          //           doneRefreshText: '松手刷新'
          //      });
          // } else {
          //      this.setData({
          //           doneRefreshText: '下拉刷新'
          //      });
          // }
     },

     endScrollTap: function (e) {
          // endScrollTop = e.detail.scrollTop;
          // if (endScrollTop <= 0) {
          //      endRefreshState = cRefreshState.release;
          // } else if (endScrollTop < refreshHeight) {
          //      endRefreshState = cRefreshState.pulling;
          // } else {
          //      endRefreshState = cRefreshState.invisiable;
          // }

          // if (endRefreshState == cRefreshState.release) {
          //      this.setData({
          //           endRefreshText: '松手刷新'
          //      });
          // } else {
          //      this.setData({
          //           endRefreshText: '下拉刷新'
          //      });
          // }
     },

     //全部列表滑到底部
     allScrollLower: function (e) {
          this.setData({
               allIndex: this.data.allIndex + 1
          });
          this.getPurchaseList("", 0);
     },
     //待回复列表滑到底部
     todoScrollLower: function (e) {
          this.setData({
               todoIndex: this.data.todoIndex + 1
          });
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_TODO, 1);
     },
     //已回复列表滑到底部
     doneScrollLower: function (e) {
          this.setData({
               doneIndex: this.data.doneIndex + 1
          });
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_DONE, 2);
     },
     //已结案列表滑到底部
     endScrollLower: function (e) {
          this.setData({
               endIndex: this.data.endIndex + 1
          });
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_END, 3);
     },

     // allScrollUpper: function (e) {
     //      this.setData({
     //           allRefreshEnable: true,
     //           allRefreshText: '松开刷新'
     //      });
     // },

     // todoScrollUpper: function (e) {
     //      this.setData({
     //           allRefreshEnable: true,
     //           todoRefreshText: '松开刷新'
     //      });
     // },

     // doneScrollUpper: function (e) {
     //      this.setData({
     //           allRefreshEnable: true,
     //           doneRefreshText: '松开刷新'
     //      });
     // },

     // endScrollUpper: function (e) {
     //      this.setData({
     //           allRefreshEnable: true,
     //           endRefreshText: '松开刷新'
     //      });
     // },

     turnPage: function (e) {
          var dataIndex = e.currentTarget.dataset.index;
          if (this.data.selectedIndex != dataIndex) {
               this.setData({
                    selectedIndex: dataIndex
               });
          } else {
               if (this.data.selectedIndex == 0) {
                    if (this.data.purchaseAll != null) {
                         this.setData({
                              purchaseAll: null,
                              allIndex: 1
                         });
                         this.getPurchaseList("", 0);
                    }
               } else if (this.data.selectedIndex == 1) {
                    if (this.data.purchaseTodo != null) {
                         this.setData({
                              purchaseTodo: null,
                              todoIndex: 1
                         });
                         this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_TODO, 1);
                    }
               } else if (this.data.selectedIndex == 2) {
                    if (this.data.purchaseDone != null) {
                         this.setData({
                              purchaseDone: null,
                              doneIndex: 1
                         });
                         this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_DONE, 2);
                    }
               } else if (this.data.selectedIndex == 3) {
                    if (this.data.purchaseEnd != null) {
                         this.setData({
                              purchaseEnd: null,
                              endIndex: 1
                         });
                         this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_END, 3);
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
               purchaseAll: null,
               allIndex: 1,
               purchaseTodo: null,
               todoIndex: 1,
               purchaseDone: null,
               doneIndex: 1,
               purchaseEnd: null,
               endIndex: 1
          });
          wx.showLoading({
               title: '数据加载中'
          })
          this.getPurchaseList("", 0);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_TODO, 1);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_DONE, 2);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_END, 3);
     },

     /**
      * 解析客户采购订单数据
      */
     purchaseResult: function (result, dataIndex) {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          if (result == false) {
               wx.showToast({
                    title: '请求失败',
                    duration: 1500
               })
               if (dataIndex == 0) {
                    if (this.data.allIndex > 1) {
                         this.setData({
                              allIndex: this.data.allIndex - 1
                         });
                    } else {
                         this.setData({
                              allEmpty: '数据请求失败',
                              purchaseAll: []
                         })
                    }
               } else if (dataIndex == 1) {
                    if (this.data.todoIndex > 1) {
                         this.setData({
                              todoIndex: this.data.todoIndex - 1
                         });
                    } else {
                         this.setData({
                              todoEmpty: '数据请求失败',
                              purchaseTodo: []
                         })
                    }
               } else if (dataIndex == 2) {
                    if (this.data.doneIndex > 1) {
                         this.setData({
                              doneIndex: this.data.doneIndex - 1
                         });
                    } else {
                         this.setData({
                              doneEmpty: '数据请求失败',
                              purchaseDone: []
                         })
                    }
               } else if (dataIndex == 3) {
                    if (this.data.endIndex > 1) {
                         this.setData({
                              endIndex: this.data.endIndex - 1
                         });
                    } else {
                         this.setData({
                              endEmpty: '数据请求失败',
                              purchaseEnd: []
                         })
                    }
               }
          } else {
               var error = result.error;
               if (error == true) {
                    if (dataIndex == 0) {
                         if (this.data.allIndex > 1) {
                              this.setData({
                                   allIndex: this.data.allIndex - 1
                              });
                         } else {
                              this.setData({
                                   allEmpty: result.errMsg,
                                   purchaseAll: []
                              })
                         }
                    } else if (dataIndex == 1) {
                         if (this.data.todoIndex > 1) {
                              this.setData({
                                   todoIndex: this.data.todoIndex - 1
                              });
                         } else {
                              this.setData({
                                   todoEmpty: result.errMsg,
                                   purchaseTodo: []
                              })
                         }
                    } else if (dataIndex == 2) {
                         if (this.data.doneIndex > 1) {
                              this.setData({
                                   doneIndex: this.data.doneIndex - 1
                              });
                         } else {
                              this.setData({
                                   doneEmpty: result.errMsg,
                                   purchaseDone: []
                              })
                         }
                    } else if (dataIndex == 3) {
                         if (this.data.endIndex > 1) {
                              this.setData({
                                   endIndex: this.data.endIndex - 1
                              });
                         } else {
                              this.setData({
                                   endEmpty: result.errMsg,
                                   purchaseEnd: []
                              })
                         }
                    }
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

               var listLength = purchaseList.length;
               var isLoadEnable = false;
               if (listLength < this.data.allSize) {
                    isLoadEnable = false;
               } else {
                    isLoadEnable = true;
               }

               if (dataIndex == 0) {
                    var resultList = [];
                    if (this.data.allIndex == 1) {
                         resultList = resultList.concat(purchaseList);
                         // resultList.push.apply(resultList, purchaseList);
                    } else {
                         resultList = resultList.concat(this.data.purchaseAll, purchaseList);
                         // resultList.push.apply(resultList, this.data.purchaseAll);
                         // resultList.push.apply(resultList, purchaseList);
                    }
                    this.setData({
                         purchaseAll: resultList,
                         allLoadEnable: isLoadEnable,
                         allEmpty: '列表数据为空',
                    });
               }
               if (dataIndex == 1) {
                    var resultList = [];
                    if (this.data.todoIndex == 1) {
                         resultList = resultList.concat(purchaseList);
                         // resultList.push.apply(resultList, purchaseList);
                    } else {
                         resultList = resultList.concat(this.data.purchaseTodo, purchaseList);
                         // resultList.push.apply(resultList, this.data.purchaseTodo);
                         // resultList.push.apply(resultList, purchaseList);
                    }
                    this.setData({
                         purchaseTodo: resultList,
                         todoLoadEnable: isLoadEnable,
                         todoEmpty: '列表数据为空',
                    });
               }
               if (dataIndex == 2) {
                    var resultList = [];
                    if (this.data.doneIndex == 1) {
                         resultList = resultList.concat(purchaseList);
                         // resultList.push.apply(resultList, purchaseList);
                    } else {
                         resultList = resultList.concat(this.data.purchaseDone, purchaseList);
                         // resultList.push.apply(resultList, this.data.purchaseDone);
                         // resultList.push.apply(resultList, purchaseList);
                    }
                    this.setData({
                         purchaseDone: resultList,
                         doneLoadEnable: isLoadEnable,
                         doneEmpty: '列表数据为空',
                    });
               }
               if (dataIndex == 3) {
                    var resultList = [];
                    if (this.data.endIndex == 1) {
                         resultList = resultList.concat(purchaseList);
                         // resultList.push.apply(resultList, purchaseList);
                    } else {
                         resultList = resultList.concat(this.data.purchaseEnd, purchaseList);
                         // resultList.push.apply(resultList, this.data.purchaseEnd);
                         // resultList.push.apply(resultList, purchaseList);
                    }
                    this.setData({
                         purchaseEnd: resultList,
                         endLoadEnable: isLoadEnable,
                         endEmpty: '列表数据为空',
                    });
               }
          }
     },

     getPurchaseList: function (state, dataIndex) {
          var that = this;
          var pageIndex;
          if (dataIndex == 0) {
               pageIndex = this.data.allIndex;
          }
          if (dataIndex == 1) {
               pageIndex = this.data.todoIndex;
          }
          if (dataIndex == 2) {
               pageIndex = this.data.doneIndex;
          }
          if (dataIndex == 3) {
               pageIndex = this.data.endIndex;
          }
          // 请求列表数据
          app.func.httpRequest(purchaseUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: state,
               page: pageIndex,
               size: that.data.allSize,
               keyword: that.data.keyword
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.purchaseResult(result, dataIndex);
               });
     },

     changePurchaseStatus: function (index, moduleIndex) {
          // purchaseAll: undefined,
          //      purchaseTodo: undefined,
          //           purchaseDone: undefined,
          //                purchaseEnd: undefined,
          if (moduleIndex == 1) {
               var allList = this.data.purchaseAll;
               allList[index].billState = this.data.STATE_PURCHASE_ORDER_DONE;
               this.setData({
                    purchaseAll: allList
               });
          } else if (moduleIndex == 2) {
               var todoList = this.data.purchaseTodo;
               todoList[index].billState = this.data.STATE_PURCHASE_ORDER_DONE;
               this.setData({
                    purchaseTodo: todoList
               });
          } else if (moduleIndex == 3) {
               var doneList = this.data.purchaseDone;
               doneList[index].billState = this.data.STATE_PURCHASE_ORDER_DONE;
               this.setData({
                    purchaseDone: doneList
               });
          } else if (moduleIndex == 4) {
               var endList = this.data.purchaseEnd;
               endList[index].billState = this.data.STATE_PURCHASE_ORDER_DONE;
               this.setData({
                    purchaseEnd: endList
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
          var that = this;
          wx.getSystemInfo({
               success: function (res) {
                    that.setData({
                         scrollHeight: res.windowHeight
                    });
               },
          })
          mEnuu = options.enuu;
          mUserphone = wx.getStorageSync('b2b_user_phone');
          this.getPurchaseList("", 0);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_TODO, 1);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_DONE, 2);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_END, 3);
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
          wx.showLoading({
               title: '数据加载中'
          })
          this.getPurchaseList("", 0);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_TODO, 1);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_DONE, 2);
          this.getPurchaseList(this.data.STATE_PURCHASE_ORDER_END, 3);
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