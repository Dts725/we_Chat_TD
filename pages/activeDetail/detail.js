// pages/news/detail.js
let WxParse = require('../../utils/wxParse/wxParse.js');
let dateformat = require('../../utils/dateformat.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    fileUrl: app.globalData.fileUrl,
    detail: {
      image: 'appointmentfile/5b4ef675d212b__!test.jpg',
      // image: '../../../static/test.jpg',
      name: '传承五四薪火，弘扬泰达精神',
      time: '2016-04-29 11:00-12:00',
      place: '美克公寓餐厅一楼活动室',
      team: '兰亭秀书画社',
      author: '张三',
      num: 5,
      introduction: "<p>aaa</p>",
      start_time: "1531882800000",
      status: 1
    }
  },

  //立即报名 / 取消报名
  signEvent(e) {
    let _this = this,
      url = '',
      type = '',
      dat = '',
      con = '',
      status = 0;
    if (this.data.detail && this.data.detail.status) {
      status = this.data.detail.status;
    }
		if (!app.globalData.personInfo || !app.globalData.personInfo.id) {
			console.log('未检测到用户id，准备重新获取');
			app.getUserInfo();
			return ;
		}
    // 报名
    if (status && status == 1) {
      url = 'active_enroll';
      type = 'POST';
      dat = {
        active_id: this.data.detail.id,
        uid: app.globalData.personInfo.id,
        date_time: new Date().getTime()
      };
      con = '您确定报名此活动吗？';
      // 取消报名
    } else if (status && status == 2) {
      url = `active_enroll/cancel?active_id=${this.data.detail.id}&uid=${app.globalData.personInfo.id}`;
      type = 'GET';
      dat = '';
      con = '您确定取消此活动吗？'
    }

    wx.showModal({
      title: '温馨提示',
      content: con,
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: _this.data.url + url,
            method: type,
            data: dat,
            success: (res) => {
              if (res.data.code == 0) {
                wx.showToast({
                  title: status == 1 ? '报名成功！' : (status == 2 ? '已取消报名！' : ''),
                  icon: status == 1 ? 'success' : 'none',
                  duration: 2500
                })
                _this.setData({
                  'detail.status': status == 1 ? 2 : (status == 2 ? 1 : status),
                  'detail.enroll_number': status == 1 ? _this.data.detail.enroll_number + 1 : (status == 2 ? _this.data.detail.enroll_number - 1 : _this.data.detail.enroll_number)
                });
              } else {
                wx.showToast({
                  title: res.data.status,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: (res) => {
              console.log('fail', res);
            }
          });
          console.log(_this.data.detail.id, app.globalData.personInfo.id);
        }
      }
    })

  },

  // 获取详情
  getDetail(id, uid) {
    if (!id || !uid) {
      wx.showToast({
        title: '获取详情信息失败，请返回重试！',
        icon: 'none',
        duration: 2000
      })
    }
    wx.showLoading({
      title: '加载中',
    });
    let _this = this;
    wx.request({
      url: this.data.url + 'active/' + id + '?uid=' + uid,
      success: (res) => {
        if (res.data.code == 0) {
          wx.hideLoading();
          if (res.data.data.start_time && res.data.data.end_time) {
            res.data.data.time = dateformat.dateformat.format(new Date(Number(res.data.data.start_time)), 'yyyy-MM-dd hh:mm') + '-' + dateformat.dateformat.format(new Date(Number(res.data.data.end_time)), 'hh:mm')
          }
          res.data.data.create_time = res.data.data.create_time ? dateformat.dateformat.format(new Date(Number(res.data.data.create_time)), 'yyyy-MM-dd hh:mm') : '';
          if (Number(res.data.data.sign_status) == 1) {
            res.data.data.status = 3;
          }
          this.setData({
            detail: res.data.data
          });
          console.log('文本内容详情：：：', res.data.data.introduction);
          if (res.data.data.introduction.length <= 1048000 / 3) {
            var article = this.data.detail.introduction;
            WxParse.wxParse('article', 'html', article, this, 5);
          } else {
            wx.showToast({
              title: '加载失败，文本字段长度超过了微信限制长度1048576，因此无法显示！！！',
              icon: 'none',
              duration: 2000
            })
          }
          console.log('活动详情数据：：：', res.data.data)
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
  onLoad: function(options) {
    console.log('id::::::::::::::::::::::', options);
    if (options.id && options.uid) {
      this.getDetail(options.id, options.uid);
    }
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