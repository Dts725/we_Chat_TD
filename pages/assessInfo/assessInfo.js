// pages/assessInfo/assessInfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    backup_id : '',
    topic : '',
    content : '',
    imageShow :'',

  },
  topicFn(e) {
    this.data.topic = e.detail.value;
    console.log(e)
  },
  contentFn(e) {
    this.data.content = e.detail.value;
    console.log(this.data.content)

  },
  submit() {


    if (!this.data.content || !this.data.topic) {
      wx.showToast({
        title: '请填写主题和内容',
        icon: 'none',
        duration: 2500
      })

      return 
    }
    wx.request({
      url: app.globalData.url + 'estimate',
      method: 'post',
      tyep: 'json',
      data: {
        backup_id: this.data.backup_id,
        topic: this.data.topic,
        content: this.data.content,
        image: this.data.imageShow

      },

      success: function (res) {

        wx.navigateTo({
          url: '../myScores/myScores?code=0',
        })
          
      }
    })
  },

  return () {
    wx.navigateBack({
      
    })
  },
  uploadFile () {
 let   that = this
    console.log(app.globalData.fileUrl)
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.url + 'file/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            console.log(JSON.parse(res.data))
            that.setData({
              imageShow: app.globalData.fileUrl + '/' + JSON.parse(res.data).data.store_result
            })
           
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        this.data.backup_id = options.id

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})