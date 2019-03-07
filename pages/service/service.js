// pages/service/service.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    /** 检测是否登录或认证了 **/
    app.globalData.checkIsLogin(app.globalData.personInfo.id);
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
  
  },
  //点击跳转公积金

  provident() {
      wx.navigateTo({
        url: "./ProvidentFund"
      })
  },

	// 标签点击事件
  relationJump(e){
		console.log(e, e.currentTarget.id);
		wx.navigateTo({
			url: '../../pages/service/detail?id=' + e.currentTarget.id + '&uid=' + app.globalData.personInfo.id
		})
// 		wx.navigateTo({
// 			url: '../../pages/news/detail?id=' + e.detail.con.id + '&uid=' + app.globalData.personInfo.id
// 		})
//     wx.showToast({
//       title: '敬请期待开放更多业务',
//       icon: 'none',
//       duration: 1500
//     });
  }
})