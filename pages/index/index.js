Page({
     data: {

     },

     onLoad: function () {
          setTimeout(function () {
               wx.redirectTo({
                    url: '../workplatform/workplatform',
               })
          }, 1000);
     }
})
