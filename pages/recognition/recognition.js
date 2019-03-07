// pages/identity/identity.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  recognition(e) {
    
    let me = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        me.setData({
          showBtn: true
        })
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.url + 'file/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          
          success: function (response) {
            let img = JSON.parse(response.data).data.store_result
    
            wx.request({
              url: app.globalData.url + 'comparison', //仅为示例，并非真实的接口地址
              data: {
                small_image: img
              },
              method:'POST',
              success: function (res) {
                me.setData({
                  showBtn: false
                })
                res = res.data
                if (res.code === 0) {
                  try {
                    wx.setStorageSync('key', res.data.id)
                  } catch (e) {
                  }
                  wx.navigateTo({
                    url: '../repairInfo/repairInfo?id = 1'
                  })
                } else {
                  wx.showToast({
                    title: res.status,
                    icon:'none'
                  })
                }
                console.log(res.data)
              }
            })
          }
        })
      }
    })
  }
})