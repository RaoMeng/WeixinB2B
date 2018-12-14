// pages/publist_list/publist_list.js
var app = getApp();
var mEnuu = '', mUserphone;
var publicUrl = 'http://218.17.158.219:24000/inquiry/public/mobile/v2';

const STATE_PUBLIC_INQUIRY_TODO = "todo";
const STATE_PUBLIC_INQUIRY_DONE = "done";
const STATE_PUBLIC_INQUIRY_INVALID = "invalid";

//列表数据页码
var allIndex = 1,
     doneIndex = 1;

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
               "全部", "已报价"
          ],
          common_row: {
               caption_class: 'caption',
               value_class: 'value'
          },
          selectedIndex: 0,

          //数据列表数组
          publicAll: undefined,
          publicDone: undefined,

          //是否可以上拉加载
          allLoadEnable: false,
          doneLoadEnable: false,

          //数据为空或请求失败的提示语
          allEmpty: '列表数据为空',
          doneEmpty: '列表数据为空',

          allSize: 20,
          keyword: "",
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

          this.getPublicList("", 0);
          this.getPublicList(STATE_PUBLIC_INQUIRY_DONE, 1);
     },

     //全部列表滑到底部
     allScrollLower: function () {
          allIndex++;
          this.getPublicList("", 0);
     },
     //已报价列表滑到底部
     doneScrollLower: function () {
          doneIndex++;
          this.getPublicList(STATE_PUBLIC_INQUIRY_DONE, 1);
     },

     turnPage: function (e) {
          var dataIndex = e.currentTarget.dataset.index;
          if (this.data.selectedIndex != dataIndex) {
               this.setData({
                    selectedIndex: dataIndex
               });
          } else {
               if (this.data.selectedIndex == 0) {
                    if (this.data.publicAll != null) {
                         this.setData({
                              publicAll: null
                         });
                         allIndex = 1;
                         this.getPublicList("", 0);
                    }
               } else if (this.data.selectedIndex == 1) {
                    if (this.data.publicDone != null) {
                         this.setData({
                              publicDone: null
                         });
                         doneIndex = 1;
                         this.getPublicList(STATE_PUBLIC_INQUIRY_DONE, 1);
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
               publicAll: null,
               publicDone: null
          });
          allIndex = 1;
          doneIndex = 1;
          wx.showLoading({
               title: '数据加载中'
          })
          this.getPublicList("", 0);
          this.getPublicList(STATE_PUBLIC_INQUIRY_DONE, 1);
     },

     getPublicList: function (state, dataIndex) {
          var that = this;
          var pageIndex;
          if (dataIndex == 0) {
               pageIndex = allIndex;
          }
          else if (dataIndex == 1) {
               pageIndex = doneIndex;
          }

          // 请求列表数据
          app.func.httpRequest(publicUrl, {
               en_uu: mEnuu,
               user_tel: mUserphone,
               _state: state,
               page: pageIndex,
               size: that.data.allSize,
               keyword: that.data.keyword
          }, 'GET', {
                    'content-type': 'application/json'
               }, function (result) {
                    that.publicResult(result, dataIndex);
               });
     },

     /**
     * 解析公共询价单数据
     */
     publicResult: function (result, dataIndex) {
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
                              publicAll: []
                         })
                    }
               } else if (dataIndex == 1) {
                    if (doneIndex > 1) {
                         doneIndex--;
                    } else {
                         this.setData({
                              doneEmpty: '数据请求失败',
                              publicDone: []
                         })
                    }
               }
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
                         if (!(contentObject.quteId == null || contentObject.quteId == undefined)) {
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
                              publicBean.billState = STATE_PUBLIC_INQUIRY_DONE;
                              publicBean.jsonData = JSON.stringify(contentObject);
                         } else {
                              publicBean.jsonData = JSON.stringify(contentObject);
                              if (overdue == 1 || remainingTime <= 0) {
                                   publicBean.billState = STATE_PUBLIC_INQUIRY_INVALID;
                              } else {
                                   publicBean.billState = STATE_PUBLIC_INQUIRY_TODO;
                              }
                         }

                         publicList.push(publicBean);
                    }
               }

               var listLength = publicList.length;
               var isLoadEnable = false;
               if (listLength < this.data.allSize) {
                    isLoadEnable = false;
               } else {
                    isLoadEnable = true;
               }

               if (dataIndex == 0) {
                    var resultList = [];
                    if (allIndex == 1) {
                         resultList = resultList.concat(publicList);
                    } else {
                         resultList = resultList.concat(this.data.publicAll, publicList);
                    }
                    this.setData({
                         publicAll: resultList,
                         allLoadEnable: isLoadEnable
                    });
               }
               else if (dataIndex == 1) {
                    var resultList = [];
                    if (doneIndex == 1) {
                         resultList = resultList.concat(publicList);
                    } else {
                         resultList = resultList.concat(this.data.publicDone, publicList);
                    }
                    this.setData({
                         publicDone: resultList,
                         doneLoadEnable: isLoadEnable
                    });
               }
          }
     },

     publicListTab: function (e) {
          var state = e.currentTarget.dataset.billstate;
          var id = e.currentTarget.dataset.id;
          var jsonData = e.currentTarget.dataset.jsondata;
          var index = e.currentTarget.dataset.index;
          var moduleIndex = e.currentTarget.dataset.moduleindex;

          if (state == 'todo' || state == 'invalid') {
               wx.navigateTo({
                    url: '../public_todo_detail/public_todo_detail?id=' + id + '&state=' + state + '&json=' + jsonData + "&index=" + index + '&moduleIndex=' + moduleIndex
               })
          } else {
               wx.navigateTo({
                    url: '../public_done_detail/public_done_detail?id=' + id + '&state=' + state + '&json=' + jsonData + "&index=" + index + '&moduleIndex=' + moduleIndex
               })
          }
     },

     changePublicStatus: function (index, publicId, moduleIndex) {
          // publicAll: undefined,
          //      publicDone: undefined,
          if (moduleIndex == 1) {
               var allList = this.data.publicAll;
               allList[index].billState = STATE_PUBLIC_INQUIRY_DONE;
               allList[index].id = publicId;
               this.setData({
                    publicAll: allList
               });
          } else if (moduleIndex == 2) {
               var doneList = this.data.publicDone;
               doneList[index].billState = STATE_PUBLIC_INQUIRY_DONE;
               doneList[index].id = publicId;
               this.setData({
                    publicDone: doneList
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