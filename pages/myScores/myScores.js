// pages/myScores/myScores.js
const app = getApp()
let dateformat = require('../../utils/dateformat.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: 200,
    score: [],
    img: ''
  },

  // 初始化数据



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options)
      if(options.code === '0') {
        wx.showToast({
          title: '评价成功',
          icon: 'success',
          duration: 2500
        })
      }
  },
  getInit() {

    wx.request({
      url: app.globalData.url + 'user/' + app.globalData.personInfo.id,
      method: 'get',
      success: res => {
        res.data.data.score_array.forEach((el , index) => {
          res.data.data.score_array[index].date_time = dateformat.dateformat.format(new Date(Number(el.date_time*1000)), 'yyyy-MM-dd hh:mm')
        })
        this.setData({
          score: res.data.data,
          img: app.globalData.fileUrl+ '/' + res.data.data.image,
        })


      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getInit()

    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight //设备的高度等于scroll-view内容的高度
        })

      }
    });

    setTimeout(function() {
      //获取高度
      let query = wx.createSelectorQuery();
      query.select('#scoreScroll').boundingClientRect()
      query.exec(function(res) {
        that.setData({
          clientHeight: that.data.clientHeight - res[0].top //设备的高度等于scroll-view内容的高度
        })

      })
    }, 300)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getInit()
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})