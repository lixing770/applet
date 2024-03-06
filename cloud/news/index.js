// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const dbForum = db.collection('news')

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action == 'getList') { //获取某个分类下的新闻
    return await dbForum.where({
        type: event.type
      })
      .orderBy('_createTime', 'desc').get()
  } else if (event.action == 'search' && event.searchKey) { //搜索
    return await dbForum.where({
      title: db.RegExp({
        regexp: event.searchKey,
        options: 'i'
      }),
    }).get()
  } else if (event.action == "shoucang") { //收藏
    const DB = cloud.database()
    const _ = DB.command
    return await dbForum.doc(event._id).update({
      data: {
        shoucang: _.inc(event.num)
      }
    }).then(res => {
      return res
    }).catch(res => {
      return res
    })
  } else if (event.action == "liulan") { //浏览量
    const DB = cloud.database()
    const _ = DB.command
    return await dbForum.doc(event._id).update({
      data: {
        liulan: _.inc(event.num)
      }
    }).then(res => {
      return res
    }).catch(res => {
      return res
    })
  }
}