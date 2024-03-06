Page({
    onShow() {
      let list = wx.getStorageSync('shoucangVideo')
      console.log('收藏列表', list)
      this.setData({
        list: list
      })
    },
    //去新闻详情页
    goDetail(event) {
      wx.navigateTo({
        url: '/pages/videoDetail/videoDetail?id=' + event.currentTarget.dataset.id,
      })
    }
  })