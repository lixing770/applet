const app = getApp()
const db = wx.cloud.database()
let id = ''
Page({
  data: {
    shouCangNum: 0, //收藏人数
    isShouCang: false //是否收藏
  },
  onLoad(opt) {
    console.log("传进来的id：" + opt.id)
    id = opt.id
    db.collection('news').doc(opt.id).get()
      .then(res => {
        console.log('详情页请求成功', res)
        let bean = res.data
        console.log('是否收藏', this.checkShouCang(bean._id))
        this.setData({
          detail: res.data,
          time: app._getCurrentTime(bean._createTime),
          shouCangNum: bean.shoucang,
          liulanNum: bean.liulan,
          isShouCang: this.checkShouCang(bean._id)
        })
        this.addViews()
      })
      .catch(res => {
        console.log('详情页请求失败', res)
      })
    // 获取热门推荐
    this.getHot()
    // 获取评论
    this.getAnswer()
  },
  //增加浏览量
  addViews() {
    //修改数据库里的收藏人数
    wx.cloud.callFunction({
      name: 'news',
      data: {
        _id: id,
        action: "liulan",
        num: 1
      }
    }).then(res => console.log('增加浏览量结果', res))
  },
  //点击了收藏按钮
  shoucang(event) {
    let detail = event.currentTarget.dataset.detail
    let list = wx.getStorageSync('shoucang')
    if (!list) {
      list = []
    }
    let isShouCang = this.checkShouCang(detail._id)
    if (isShouCang) { //如果已经收藏，就取消收藏
      wx.showToast({
        title: '取消了收藏',
      })
      let index = list.findIndex(item => {
        return item._id == detail._id
      })
      list.splice(index, 1)
      isShouCang = false
    } else { //没有收藏，就保存收藏
      wx.showToast({
        title: '收藏成功',
      })
      delete detail._createTime //删除无用字段
      delete detail._updateTime //删除无用字段
      delete detail.content //删除无用字段
      list.push(detail)
      isShouCang = true
    }
    wx.setStorageSync('shoucang', list)
    let num = this.data.shouCangNum
    this.setData({
      shouCangNum: isShouCang ? ++num : --num,
      isShouCang: isShouCang
    })
    //修改数据库里的收藏人数
    wx.cloud.callFunction({
      name: 'news',
      data: {
        _id: detail._id,
        action: "shoucang",
        num: isShouCang ? 1 : -1
      }
    }).then(res => console.log('收藏结果', res))
  },

  //检查是否收藏了本篇文章
  checkShouCang(id) {
    let list = wx.getStorageSync('shoucang')
    if (list && list.length > 0) {
      let res = list.findIndex(item => {
        return item._id == id
      })
      return res != -1
    }
    return false
  },
  // 热门推荐
  getHot() {
    db.collection('news').orderBy('liulan', 'desc')
      .limit(2).get()
      .then(res => {
        console.log('浏览量最高的2篇', res)
        this.setData({
          hotList: res.data
        })
      })
  },
  // 去新闻详情页
  goDetail(e) {
    wx.redirectTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 评论相关
   */
  // 获取回答列表
  getAnswer() {
    wx.cloud.callFunction({
        name: 'answer',
        data: {
          id: id
        }
      })
      .then(res => {
        this.setData({
          list: res.result.data
        })
      })
  },

  // 发布回答
  publish() {
    let user = wx.getStorageSync('user')
    if (!user || !user.nickName) {
      wx.showToast({
        icon: 'error',
        title: '请先登录',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/me/me',
        })
      }, 1000);
      return
    }
    wx.showModal({
      title: '发表回答',
      editable: true,
      success: res => {
        if (res.confirm) {
          if (res.content) {
            db.collection('answer').add({
              data: {
                forumId: id,
                forumName: this.data.detail.title,
                content: res.content,
                name: user.nickName,
                avatarUrl: user.avatarUrl,
                type: 1, //1图文，2视频
                _createTime: new Date().getTime() //创建的时间
              }
            }).then(res => {
              console.log('回答成功', res)
              wx.showToast({
                title: '回答成功',
              })
              this.getAnswer()
            })
          } else {
            wx.showToast({
              icon: 'error',
              title: '请输入内容',
            })
          }
        }
      }
    })
  },
})