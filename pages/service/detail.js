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
      date_time: "1531882800000",
      status: 1
    },

    

		testData:[
      { id: '1', name: '缴纳水费', src:'https://static.shyunhua.com/staticHTML/water/water.html'},
      { id: '3', name: '缴纳购电', src:'https://static.shyunhua.com/staticHTML/elec/elec.html'},
      { id: '2', name: '燃气查询', src:'https://static.shyunhua.com/staticHTML/air/air.html'},
			{id: '4', name:'有线电视', src:'https://static.shyunhua.com/staticHTML/cable/cable.html'},
			{id: '5', name:'暖气业务', src:'https://static.shyunhua.com/staticHTML/hot/hot.html'},
      // { id: '6', name: '公积金业务', src:'./ProvidentFund.wxml'},
			// {id: '7', name:'测试', src:'https://test.shyunhua.com/sign/index.html'},
		],
		src:'',
  },

  // 获取详情
  getDetail(id, uid) {
		// console.log('id:::',id, 'uid:::',uid);
		this.data.testData.forEach(ele=>{
			if(ele.id == id){
				// WxParse.wxParse('article', 'html', ele.con, this, 5);
				this.setData({
					src: ele.src
				});
			}
		});
//     if (!id || !uid) {
//       wx.showToast({
//         title: '获取详情信息失败，请返回重试！',
//         icon: 'none',
//         duration: 2000
//       })
//     }
//     wx.showLoading({
//       title: '加载中',
//     });
//     let _this = this;
//     wx.request({
//       url: this.data.url + 'news/' + id + '?uid=' + uid,
//       success: (res) => {
//         if (res.data.code == 0) {
//           wx.hideLoading();
//           res.data.data.date_time = res.data.data.date_time ? dateformat.dateformat.format(new Date(Number(res.data.data.date_time)), 'yyyy-MM-dd hh:mm') : '';
//           this.setData({
//             detail: res.data.data
//           });
//           console.log('文本内容详情：：：', res.data.data.content);
//           if (res.data.data.content.length <= 1048000 / 3) {
//             var article = this.data.detail.content;
//             WxParse.wxParse('article', 'html', article, this, 5);
//           } else {
//             wx.showToast({
//               title: '加载失败，文本字段长度超过了微信限制长度1048576，因此无法显示！！！',
//               icon: 'none',
//               duration: 2000
//             })
//           }
//           console.log('活动详情数据：：：', res.data.data)
//         }
//       },
//       fail: (res) => {
//         console.log('fail', res);
//       }
//     });
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