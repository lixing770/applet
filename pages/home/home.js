const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
Page({
  data: {
    tabs: [],
    tabCur: 0,
    searchKey: ''
  },
  //顶部选择分类条目
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.index,
      scrollLeft: (e.currentTarget.dataset.index - 2) * 200
    }, success => {
      this.getList()
    })
  },
  //获取用户输入的内容
  getSearch(e) {
    this.setData({
      searchKey: e.detail.value
    })

  },
  //触发搜索事件
  goSearch() {
    let searchKey = this.data.searchKey
    console.log('触发了搜索', searchKey)
    if (searchKey && searchKey.length > 0) {
      //搜索的触发写在这里
      wx.navigateTo({
        url: '/pages/search/search?searchKey=' + searchKey,
      })
    } else {
      wx.showToast({
        icon: 'error',
        title: '搜索词为空',
      })
    }
  },
  onLoad() {
    this.getLunbotu()
  },
  onShow() {
    this.getForum()
  },
  // 获取顶部轮播图
  getLunbotu() {
    db.collection('news')
      .where({
        tuijian: true
      }).get()
      .then(res => {
        console.log('轮播图数据', res)
        this.setData({
          topList: res.data
        })
      })
  },
  getForum() {
    db.collection('news').aggregate()
      .group({
        _id: '$type',
        num: $.sum(1)
      })
      .sort({
        _id: 1
      })
      .end()
      .then(res => {
        console.log('分类数据', res)
        this.setData({
          tabs: res.list
        })
        this.getList()
      })
  },
  getList() {
    let type = this.data.tabs[this.data.tabCur]._id
    wx.cloud.callFunction({
        name: "news",
        data: {
          action: 'getList',
          type: type
        }
      })
      .then(res => {
        console.log('列表成功', res)
        this.setData({
          list: res.result.data
        })
      })
  },
  // 去新闻详情页
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  }

})