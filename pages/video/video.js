// pages/video/video.js
Page({
    onShow() {
        wx.cloud.callFunction({
            name: 'videoFun',
            data: {
                action: "getList"
            }
        }).then(res => {
            console.log('视频列表', res)
            this.setData({
                list: res.result.data
            })
        })
    },
    // 去新详情页
    goDetail(e) {
        wx.navigateTo({
            url: '/pages/videoDetail/videoDetail?id=' + e.currentTarget.dataset.id,
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})