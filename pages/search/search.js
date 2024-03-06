const db = wx.cloud.database()
Page({
  data: {
    searchKey: '',
    list: [], //购物车数据
  },
  onLoad: function (options) {
    this.setData({
      searchKey: options.searchKey
    })
    this.getSearchData()
  },
  //获取用户输入的内容
  getSearch(e) {
    this.setData({
      searchKey: e.detail.value
    })
  },
  //触发搜索事件
  goSearch() {
    console.log('触发了搜索', searchKey)
    let searchKey = this.data.searchKey
    if (searchKey && searchKey.length > 0) {
      this.getSearchData()
    } else {
      wx.showToast({
        icon: 'error',
        title: '搜索词为空',
      })
    }
  },
  // 获取搜索数据
  getSearchData() {
    wx.cloud.callFunction({
      name: 'news',
      data: {
        action: 'search',
        searchKey: this.data.searchKey
      }
    }).then(res => {
      console.log('搜索结果', res)
      this.setData({
        list: res.result.data
      })
    })
  },
  // 去新闻详情页
  goForumDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  }
})