// pages/news/news.js
const app = getApp();
let dateformat = require('../../utils/dateformat.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    fileUrl: app.globalData.fileUrl,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    /** 顶部tab切换 */
    tabs: ["新闻公告", "幸福社区"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    lists: [], // 存放所有的列表数据
    current_page: 1, //当前页
    all_page: 1, // 总页数
    type: 1, // 文章类型：1新闻 2动态
  },

  /******************************************************** 
   * 顶部tab切换的
   *******************************************************  */
  tabClick: function(e) {
    let type = '';
    // 当前预约情况的
    if (e.currentTarget.id == '0') {
      type = 1
    } else if (e.currentTarget.id == '1') { // 我要预约的
      type = 2
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      type: type,
      lists: []
    });
    this.getList(this.data.type, 1);
    if (!app.globalData.personInfo) {
      // this.reLogin();
    }

  },
  detailEvent(e, d) {
    // console.log(e, d);
    wx.navigateTo({
      url: '../../pages/news/detail?id=' + e.detail.con.id + '&uid=' + app.globalData.personInfo.id
    })
  },
  /** 获取下一页 **/
  getNextPage() {
    console.log(this.data.current_page + 1)
    this.getList(this.data.type, this.data.current_page + 1);
  },

  /** 获取列表信息 **/
  getList(type, page) {
    type = typeof(type) == 'number' ? type : this.data.type;
    page = page ? page : 1;
    if (page > 1 && this.data.all_page < page) {
			console.log('没有下一页，因此跳出。。');
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    this.fetchData(this.data.url + 'news?type=' + type + '&page=' + page+'&is_show=1', res => {
      if (res.data.code == 0) {
        wx.hideLoading();
        if (res.data.data.data.length <= 0) {
          // 					wx.showToast({
          // 						title: '已经到底了~~',
          // 						icon: 'none',
          // 						duration: 2000
          // 					});
          return false;
        }
        if (page == 1) {
          this.setData({
            lists: []
          });
        }
        // console.log('lists:::::::::::::::::::::::::::::::', res);
        let arr = this.data.lists,tmpArr=[],tmpNum='';;
        res.data.data.data.forEach(ele => {
          ele.date_time = dateformat.dateformat.format(new Date(Number(ele.date_time)), 'MM-dd hh:mm');
        });
        arr = arr.concat(res.data.data.data);
				console.log('arr:::',JSON.stringify(arr).length);
				
        this.setData({
          // lists: res.data.data.data,
          // lists: arr,
          current_page: res.data.data.current_page,
          all_page: Math.ceil(res.data.data.total / res.data.data.per_page)
        })
				/** 注意：微信限制单次setData的数据不得超过1048576即1024k大小的数据 **/
				if(JSON.stringify(arr).length<1048000){
					_this.setData({
						lists: arr
					});
				}else{
					tmpArr=app.sliceArray(arr,Math.ceil(JSON.stringify(arr).length/1048000));
					for(var i=0;i<tmpArr.length;i++){
						_this.setData({
							lists: tmpArr[0]
						});
						if(i>=1){
							for(var j=0;j<tmpArr[i].length;j++){
								tmpNum=_this.data.lists.length+j
								let tmp='lists['+tmpNum+']';
								_this.setData({
									[tmp]: tmpArr[i][j]
								});
							}
						}
					}
				}
        // console.log('页码：：', page, '总数据列表：：', this.data.lists);
      }
    });
  },

  /** 请求数据 */
  fetchData(url, data, callback) {
    let type = 'GET';
    if (typeof data == 'object') {
      type = 'POST';
    } else if (typeof data == 'function') {
      callback = data;
    }
    wx.request({
      url: url,
      method: type,
      data: data,
      success: (res) => {
        if (res && callback) {
          callback(res);
        } else {
          alert('未找到结果：' + res);
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
		
		
		
		
		// 判断用户是否注册
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
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
		
		// 新版本检测
		wx.getUpdateManager().onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			console.log("是否有新版本："+res.hasUpdate);
			if(res.hasUpdate){//如果有新版本
				// 小程序有新版本，会主动触发下载操作（无需开发者触发）
				wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
					wx.showModal({
						title: '更新提示',
						content: '新版本已经准备好，单击确定重启应用',
						showCancel:false,
						success: function (res) {
							if (res.confirm) {
                wx.clearStorage();
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								wx.getUpdateManager().applyUpdate();
							}
						}
					})
				})
				// 小程序有新版本，会主动触发下载操作（无需开发者触发）
				wx.getUpdateManager().onUpdateFailed(function () {//当新版本下载失败，会进行回调
					wx.showModal({
						title: '提示',
						content: '检查到有新版本，但下载失败，请检查网络设置',
						showCancel: false,
					})
				})
			}
		});

		
		
    let me = this;
    setTimeout(function() {
      me.setData({
        openid: app.globalData.personInfo
      })
    }, 300);
    this.getList(this.data.type, 1);
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

  },


})
