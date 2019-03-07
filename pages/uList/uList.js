// pages/uList/uList.js
const app = getApp();
import dateformat from '../../utils/dateformat.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    list: [], // 总数据列表
    total: 0, // 总条数
		allPageNum:0, // 总页数
    id:'',
    type:'',
    current_page:'',
  },
  //  获取列表信息
  getList(id, type, page){
    if(!id||!type){return '';}
    page = typeof (page) == 'number' ? page : 1;
    if (page == 1) {
      this.setData({
        list: []
      });
    }
    let time = type == 'enroll'?'enroll_time':'date_time';
    wx.showLoading({
      title: '加载中',
    });
    let _this = this;
    wx.request({
      url: _this.data.url + 'active_'+type +'?active_id=' + id+'&page='+page,
      success: (res) => {
        if (res.data.code == 0) {
          wx.hideLoading();
          if (res.data.data.data.length <= 0) {
            wx.showToast({
              title: '已经到底了~~',
              icon: 'none',
              duration: 2000
            });
            return false;
          }
          let data = res.data.data.data, oldData = this.data.list;
          for (let i = 0; i < data.length; i++) {
            if (data[i][time]){
              data[i].time = dateformat.dateformat.format(new Date(Number(data[i][time])), 'yyyy-MM-dd hh:mm');
            }
          }
          oldData = oldData.concat(data);
          _this.setData({
            total: res.data.data.total,
            list: oldData,
            current_page: res.data.data.current_page,
						allPageNum: Math.ceil(res.data.data.total/res.data.data.per_page)
          });
        }
      },
      fail: (res) => {
        console.log('_this.data.list', _this.data.list);
      }
    });
  },

  // 获取下一页
  getNextPage(){
		if(this.data.allPageNum>=this.data.current_page+1){
			this.getList(this.data.id, this.data.type, this.data.current_page+1);
		}else{
			wx.showToast({
			  title: '已经到底了~~',
			  icon: 'none',
			  duration: 2000
			});
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad---options::::',options);
    this.setData({
      id: options.id,
      type: options.type
    });
    this.getList(options.id, options.type);
    let type = '';
    if(options.type == 'sign'){
      type = '签到人数';
    }else if(options.type=='enroll'){
      type = '报名人数';
    }
    wx.setNavigationBarTitle({
      title: type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log('onShow---options::::', options);
    this.setData({
      id: options.id,
      type: options.type
    });
    this.getList(options.id, options.type);
    let type = '';
    if (options.type == 'sign') {
      type = '签到人数';
    } else if (options.type == 'enroll') {
      type = '报名人数';
    }
    wx.setNavigationBarTitle({
      title: type
    })
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