// pages/userList/userList.js
// var base64 = require("../images/base64");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    List: [],  //总数据
  },
  // 审核
  examine(e) {

    // 判断是否为管理员 authority>1 为管理员
    if (!app.globalData.personInfo.authority || Number(app.globalData.personInfo.authority) < 2) {
      wx.showToast({ title: '您不是管理员无法执行操作 ！！！', icon: 'none', duration: 2000 });
      return false;
    } 
    var id = Number(e.currentTarget.dataset.id);
    var ver = Number(e.currentTarget.dataset.ver);
    id = id ? id : '';
    if (id) {
      if (ver == 2) {
        wx.showToast({ title: '该用户已予以审核通过，无需再次审核 ！！！', icon: 'none', duration: 1000 });
        return false;
      }
      wx.showModal({
        title: '审核',
        content: '您确定予以该用户通过审核吗？',
        // showCancel: true,
        success: (e, d) => {
          if (e.cancel) { return false; }
    
          wx.request({
            url: this.data.url + '/user/' + id,
            method: 'PUT',
            data: { verify: 2 },
            success: (res) => {
              if (res.data.code == 0) {
                let community_id = wx.getStorageSync('community_id')
                // 获取预约列表
                let cid = community_id ? community_id : '';
                // 获取数据
                this.getList(`?community_id=${cid}`);
          
              
              }
            },
            fail: (res) => {
              console.log('fail', res);
            }
          });
          setTimeout(()=>{
            // 登录
            wx.login({
              success: res => {
                //调用request请求api转换登录凭证  
                wx.request({
                  url: app.globalData.url + 'getWxUserInfo',
                  method: 'GET',
                  data: {
                    code: res.code
                  },
                  success: function (res) {
                    if (res.statusCode == 200) {
                      app.globalData.personInfo = res.data.data;
                    }
                  }
                })
              }
            })
          },100);
        }
      });
    } else {
      wx.showToast({ title: '未检测到用户名，请返回重新打开此页面 ！！！', icon: 'none', duration: 3000 });
    }
  },
  // 获取用户列表
  getList(params) {
    wx.request({
      url: this.data.url + 'user'+params,
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            List: res.data.data.data
          });
          console.log('List:', this.data.List);
        }
      },
      fail: (res) => {
        console.log('fail', res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   icon20: base64.icon20,
    //   icon60: base64.icon60
    // });
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
    // 判断是否为管理员
    // if (Number(app.globalData.personInfo.authority) < 2) {
    //   wx.showToast({ title: '不好意思，您不是管理员无法使用此功能 ！！！', icon: 'none', duration: 3000 });
    //   return false;
    // } else {
			let cid= app.globalData.personInfo.community_id?app.globalData.personInfo.community_id:'';
			console.log('community_id::::',cid);
      // 获取数据
      this.getList(`?community_id=${cid}`);
    // }
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