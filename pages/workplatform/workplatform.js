// pages/gridview/gridview.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          selectedKey: null,
          menuData: [
               {
                    "moduleName": "UU应用",
                    "isLocalModule": true,
                    "moduleTag": "uu_application",
                    "moduleId": "",
                    "moduleVisible": true,
                    "moduleList": [
                         {
                              "isLocalMenu": true,
                              "menuName": "预约小秘书",
                              "menuIcon": "/res/images/ic_work_subscribe_secretary.png",
                              "menuActivity": "../service_appointment/service_appointment",
                              "menuTag": "local_subscribe_secretary",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "UU运动",
                              "menuIcon": "/res/images/ic_work_uu_sports.png",
                              "menuActivity": "../select_city/select_city",
                              "menuTag": "local_uu_sports",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "一元捐",
                              "menuIcon": "../../res/images/ic_work_charitable_donations.png",
                              "menuActivity": "com.modular.work.CharitableActivity",
                              "menuTag": "local_charitable_donations",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "邀请注册",
                              "menuIcon": "../../res/images/ic_work_invite_register.png",
                              "menuActivity": "com.modular.work.InviteRegisterMainActivity",
                              "menuTag": "local_invite_register",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         }
                    ]
               },
               {
                    "moduleName": "行政办公",
                    "isLocalModule": true,
                    "moduleTag": "administrative_office",
                    "moduleId": "",
                    "moduleVisible": true,
                    "moduleList": [
                         {
                              "isLocalMenu": true,
                              "menuName": "我的审批",
                              "menuIcon": "../../res/images/ic_work_work_approval.png",
                              "menuActivity": "com.modular.work.ProcessMsgActivity",
                              "menuTag": "local_work_approval",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "待办工作",
                              "menuIcon": "../../res/images/ic_work_backlog.png",
                              "menuActivity": "com.modular.task.TaskActivity",
                              "menuTag": "local_backlog",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "工作日历",
                              "menuIcon": "../../res/images/ic_work_work_calendar.png",
                              "menuActivity": "com.modular.work.OAActivity",
                              "menuTag": "local_work_calendar",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "工作汇报",
                              "menuIcon": "../../res/images/ic_work_work_report.png",
                              "menuActivity": "com.modular.work.WorkReportMenuActivity",
                              "menuTag": "local_work_report",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "打卡签到",
                              "menuIcon": "../../res/images/ic_work_punch_clock.png",
                              "menuActivity": "com.modular.work.WorkActivity",
                              "menuTag": "local_punch_clock",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "外勤签到",
                              "menuIcon": "../../res/images/ic_work_outwork_sign.png",
                              "menuActivity": "com.modular.work.MissionActivity",
                              "menuTag": "local_outwork_sign",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "考勤统计",
                              "menuIcon": "../../res/images/ic_work_attendance_statistics.png",
                              "menuActivity": "com.modular.oa.StatisticsActivity",
                              "menuTag": "local_attendance_statistics",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "加班申请",
                              "menuIcon": "../../res/images/ic_work_overtime_request.png",
                              "menuActivity": "com.modular.form.DataFormDetailActivity",
                              "menuTag": "local_overtime_request",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "请假申请",
                              "menuIcon": "../../res/images/ic_work_leave_request.png",
                              "menuActivity": "com.modular.form.DataFormDetailActivity",
                              "menuTag": "local_leave_request",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "出差申请",
                              "menuIcon": "../../res/images/ic_work_travel_request.png",
                              "menuActivity": "com.modular.form.TravelDataFormDetailActivity",
                              "menuTag": "local_travel_request",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "费用报销",
                              "menuIcon": "../../res/images/ic_work_expense_account.png",
                              "menuActivity": "com.modular.oa.ExpenseReimbursementActivity",
                              "menuTag": "local_expense_account",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "会议管理",
                              "menuIcon": "../../res/images/ic_work_meeting_manage.png",
                              "menuActivity": "com.modular.oa.AddMeetingActivity",
                              "menuTag": "local_meeting_manage",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "特殊考勤",
                              "menuIcon": "../../res/images/ic_work_special_attendance.png",
                              "menuActivity": "com.modular.form.DataFormDetailActivity",
                              "menuTag": "local_special_attendance",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "设备管理",
                              "menuIcon": "../../res/images/ic_device_manage.png",
                              "menuActivity": "com.modular.work.DeviceManageActivity",
                              "menuTag": "local_device_manage",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "商旅服务",
                              "menuIcon": "../../res/images/ic_business_services.png",
                              "menuActivity": "com.modular.work.BusinessTravelActivity",
                              "menuTag": "local_business_services",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "工资条",
                              "menuIcon": "../../res/images/company_salary.png",
                              "menuActivity": "com.modular.appme.CheckWagesActivity",
                              "menuTag": "local_company_salary",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         }
                    ]
               },
               {
                    "moduleName": "客户关系管理",
                    "isLocalModule": true,
                    "moduleTag": "customer_relationship",
                    "moduleId": "",
                    "moduleVisible": true,
                    "moduleList": [
                         {
                              "isLocalMenu": true,
                              "menuName": "商机管理",
                              "menuIcon": "../../res/images/ic_work_business_manage.png",
                              "menuActivity": "com.modular.crm.BusinessActivity",
                              "menuTag": "local_business_manage",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "客户管理",
                              "menuIcon": "../../res/images/ic_work_customer_manage.png",
                              "menuActivity": "com.modular.crm.CustomerListActivity",
                              "menuTag": "local_customer_manage",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "客户拜访",
                              "menuIcon": "../../res/images/ic_work_customer_visit.png",
                              "menuActivity": "com.modular.work.OAActivity",
                              "menuTag": "local_customer_visit",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "销售看板",
                              "menuIcon": "../../res/images/ic_work_sales_data.png",
                              "menuActivity": "com.modular.crm.ClientActivity",
                              "menuTag": "local_sales_data",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "荣誉墙",
                              "menuIcon": "../../res/images/ic_work_honor_rank.png",
                              "menuActivity": "com.modular.crm.SalesRankingActivity",
                              "menuTag": "local_honor_rank",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         }
                    ]
               },
               {
                    "moduleName": "企业应用",
                    "isLocalModule": true,
                    "moduleTag": "enterprise_application",
                    "moduleId": "",
                    "moduleVisible": true,
                    "moduleList": [
                         {
                              "isLocalMenu": true,
                              "menuName": "数据查询",
                              "menuIcon": "../../res/images/ic_work_data_inquiry.png",
                              "menuActivity": "com.modular.company.DataInquiryActivity",
                              "menuTag": "local_data_inquiry",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "报表统计",
                              "menuIcon": "../../res/images/ic_work_report_statistics.png",
                              "menuActivity": "com.modular.company.ReportStatisticsActivity",
                              "menuTag": "local_report_statistics",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "实时看板",
                              "menuIcon": "../../res/images/ic_work_real_time_subs.png",
                              "menuActivity": "com.modular.company.RealTimeFormActivity",
                              "menuTag": "local_real_time_subs",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "订阅号管理",
                              "menuIcon": "../../res/images/ic_work_subs_manage.png",
                              "menuActivity": "com.modular.company.SubcribeManageActivity",
                              "menuTag": "local_subs_manage",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         }
                    ]
               },
               {
                    "moduleName": "优软云平台",
                    "isLocalModule": true,
                    "moduleTag": "usoft_cloud_platform",
                    "moduleId": "",
                    "moduleVisible": true,
                    "moduleList": [
                         {
                              "isLocalMenu": true,
                              "menuName": "B2B商务",
                              "menuIcon": "../../res/images/ic_work_b2b_commerce.png",
                              "menuActivity": "../b2b_login_main/b2b_login_main",
                              "menuTag": "local_b2b_commerce",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         },
                         {
                              "isLocalMenu": true,
                              "menuName": "优软商城",
                              "menuIcon": "../../res/images/ic_work_usoft_mall.png",
                              "menuActivity": "com.modular.apputils.activity.SimpleWebActivity",
                              "menuTag": "local_usoft_mall",
                              "menuUrl": "",
                              "caller": "",
                              "isHide": false
                         }
                    ]
               }
          ]
     },

     menuSelect: function (e) {
          console.log(e);
          var menuTag = e.currentTarget.dataset.key;
          var page = e.currentTarget.dataset.page;
          this.setData({
               selectedKey: menuTag
          });
          wx.navigateTo({
               url: page
          })
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {

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