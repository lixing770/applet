const app = getApp()
let DB = wx.cloud.database()
Page({
  data: {
    list: []
  },
  //去新闻详情页
  goDetail(e) {
    let item = e.currentTarget.dataset.item
    if (item.type == 2) { //1图文，2视频
      wx.navigateTo({
        url: '/pages/videoDetail/videoDetail?id=' + item.forumId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + item.forumId,
      })
    }

  },
  onLoad() {
    this.getMyCommentList();
  },
  //获取我的所有评论列表
  getMyCommentList() {
    let that = this;
    //请求自己后台获取用户openid
    DB.collection("answer").get()
      .then(res => {
        console.log("查询评论成功", res)
        if (res && res.data) {
          let dataList = res.data;
          that.setData({
            list: dataList
          })
        } else {
          that.setData({
            list: []
          })
        }
      }).catch(res => {
        console.log("查询评论失败", res)
      })
  },
})