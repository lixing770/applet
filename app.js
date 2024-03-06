//app.js
App({
  //创建towxml对象，供小程序页面使用
  globalData: {
    userInfo: {},
    openid: null,
  },
  onLaunch: function () {
    //云开发初始化
    wx.cloud.init({
      env: 'xiangmu1-8gak7hbb003fd5e1',
      traceUser: true,
    })
  },

  // 获取当前时间
  _getCurrentTime(date) {
    var d = new Date();
    if (date) {
      var d = new Date(date);
    }
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();

    var curDateTime = d.getFullYear() + '年';
    if (month > 9)
      curDateTime += month + '月';
    else
      curDateTime += month + '月';

    if (date > 9)
      curDateTime = curDateTime + date + "日";
    else
      curDateTime = curDateTime + date + "日";
    if (hours > 9)
      curDateTime = curDateTime + hours + "时";
    else
      curDateTime = curDateTime + hours + "时";
    if (minutes > 9)
      curDateTime = curDateTime + minutes + "分";
    else
      curDateTime = curDateTime + minutes + "分";
    return curDateTime;
  },
})