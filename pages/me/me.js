const app = getApp();
Page({
  // 页面的初始数据
  data: {
    isShowUserName: false,
    userInfo: null,
  },
  //获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("获取用户信息成功", res)
        let user = res.userInfo
        this.setData({
          isShowUserName: true,
          userInfo: user,
        })
        wx.setStorageSync('user', user)
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },
  //退出登录
  tuichu() {
    this.setData({
      isShowUserName: false,
      userInfo: null,
    })
    wx.setStorageSync('user', null)
  },
  // 去我的评论页
  goToMyComment: function () {
    wx.navigateTo({
      url: '/pages/myComment/myComment',
    })
  },
  //去我的收藏
  goShoucang() {
    wx.navigateTo({
      url: '/pages/shoucang/shoucang',
    })
  },
  //去我的收藏
  goShoucangVideo() {
    wx.navigateTo({
      url: '/pages/shoucangVideo/shoucangVideo',
    })
  },
  onShow() {
    var user = wx.getStorageSync('user');
    if (user && user.nickName) {
      this.setData({
        isShowUserName: true,
        userInfo: user,
      })
    }
  },
})