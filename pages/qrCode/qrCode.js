// pages/qrCode/qrCode.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // url: 'https://github.com/tomfriwel/weapp-qrcode',
    myurl: app.globalData.url,
    qrUrl: '',
    title: '',
    info: '扫码签到',
    detail: {} // 详情
  },

  // 获取详情
  getDetail(id) {
    wx.showLoading({
      title: '加载中',
    });
    let _this = this;
    wx.request({
      url: _this.data.myurl + 'active/' + id,
      success: (res) => {
        if (res.data.code == 0) {
          wx.hideLoading();
          _this.setData({
            title: res.data.data.name,
            detail: res.data.data
          });
          console.log('活动详情数据：：：', res.data.data)
        }
      },
      fail: (res) => {
        console.log('fail', res);
      }
    });
  },
  // 获取列表
  getList(e) {
    let type = e.target.id, id = this.data.detail.id;
    console.log('type:::', type, '  id:::', id);
    wx.navigateTo({
      url: '../../pages/uList/uList?id=' + id + '&type=' + type
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:::', options);
    this.setData({
      qrUrl: '../../pages/myactive/sign?id=' + options.id
      // qrUrl: (this.data.myurl + 'active/' + options.id)
      // qrUrl: options.id
    });
    this.getDetail(options.id);
    console.log('this.data:::', this.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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