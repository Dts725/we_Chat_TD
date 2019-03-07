// pages/myactive/myactive.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    fileUrlurl: app.globalData.fileUrl,
    total: 0,
    cardData: [{
      image: '../../../static/test.jpg',
      name: '传承五四薪火，弘扬泰达精神',
      start_time: '2016-04-29 11:00-12:00',
      end_time: '',
      place: '美克公寓餐厅一楼活动室',
      organization: '兰亭秀书画社',
      sign_status: '2', // 1已签到 2未签到
      enroll_time: '', // 报名时间
    }, ],
    status: 1,
    /** card组件右侧的扫码图标路径 */
    imgSrc: '../../../static/scan.png',
  },
  /**
   * medthod
   */
  //查看详情
  detailEvent(e) {
    wx.navigateTo({
      url: '../../pages/myactive/myactiveDetail?id=' + e.detail.con.id + '&uid=' + app.globalData.personInfo.id
    })
  },
  // 扫码
  qrcodeEvent(e) {
    wx.scanCode({
      // onlyFromCamera: onlyCamera, // true为只可使用相机扫码
      success: (res) => {},
      complete: res => {
        if (res.result) {
          wx.navigateTo({
            url: res.result
            // url: '../../pages/myactive/sign?id=' + this.data.detail.id + '&uid=' + app.globalData.personInfo.id
          })
        } else {
          console.log('扫码失败:::', res);
        }
      }
    })
  },
  //立即报名 / 取消报名
  signEvent(e) {
    let _this = this,
      url = '',
      type = '',
      dat = '',
      con = '',
      status = 0;
    if (e.detail && e.detail.con) {
      status = e.detail.con.status;
    }
    // 报名
    if (status && status == 1) {
      url = 'active_enroll';
      type = 'POST';
      dat = {
        active_id: e.detail.con.id,
        uid: app.globalData.personInfo.id,
        date_time: new Date().getTime()
      };
      con = '您确定报名此活动吗？';
      console.log('dat:::', dat);
      if (!dat.uid) {
        wx.showToast({
          title: '未获取到用户信息，请重启小程序或微信',
          icon: 'none',
          duration: 2500
        });
        return false;
      }
      // 取消报名
    } else if (status && status == 2) {
      url = `active_enroll/cancel?active_id=${e.detail.con.id}&uid=${app.globalData.personInfo.id}`;
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
                setTimeout(() => {
                  _this.getList();
                }, 2500);
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
          console.log(e.detail.con.id, app.globalData.personInfo.id);
        }
      }
    })

  },
  // 获取我报名的活动列表
  getList(page = 1) {

    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: this.data.url + 'active_enroll?page=' + page + '&uid= ' + app.globalData.personInfo.id + '&&is_show=2',
      // url: this.data.url + 'active?is_show=2&page=' + page + '&uid=184',
      success: (res) => {
        if (res.data.code == 0) {
          wx.hideLoading();
          _this.total = res.data.data.total;

          let data = res.data.data.data;
          let time = '';
          for (let i = 0; i < data.length; i++) {
            if (!data[i].start_time || !data[i].end_time) {
              time = '';
            } else {
              time = _this.fmtDate(data[i].start_time).substring(0, 10) + ' ' + _this.fmtDate(data[i].start_time).substring(10) + ' -' + _this.fmtDate(data[i].end_time).substring(10);
            }
            data[i].time = time;
            data[i].image = data[i].image ? (_this.data.fileUrlurl + '/' + data[i].image) : '../../../static/default_img.png';
            data[i].imgSrc = '';
            if (Number(data[i].sign_status) == 1) {
              if (data[i].status !== 0) {
                data[i].status = 3;
              }
              data[i].qrcodeShow = false;
            } else {
              if (data[i].status == 0) {
                data[i].qrcodeShow = false;
              } else {
                data[i].status = 2;
                data[i].qrcodeShow = true;
                data[i].imgSrc = this.data.imgSrc;
              }
            }
          }

          _this.setData({
            cardData: data
          });
        }
      },
      fail: (res) => {
        console.log('fail', res);
      }
    });
  },
  /**
   * 格式化日期时间
   * @param date 时间戳或字符串日期
   * @param fmt 格式化类型如：yyyy-MM-dd hh:mm:ss
   * @returns 返回格式化后的日期字符串
   */
  fmtDate(date, fmt) {
    fmt = fmt ? fmt : 'yyyy-MM-dd hh:mm:ss';
    let browserType = '',
      ua = '';
    if (window && window.navigator) {
      ua = window.navigator.userAgent || window.navigator.appVersion;
    }
    if (/Edge|(rv:11\.0)|MSIE/.test(ua)) {
      browserType = 'IE'
    } else if (ua.toLocaleLowerCase().indexOf('safari') > -1) {
      browserType = 'safari'
    }
    if (String(date).length == 10 || String(date).length == 13) {
      if (String(date).length == 10) {
        date = new Date(Number(date) * 1000)
      } else {
        date = new Date(Number(date))
      }
    } else {
      if (ua && browserType == 'safari') {
        date = new Date(date.substr(0, 10) + 'T' + date.substr(11, 8))
      }
    }

    let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
    } else {

    }
    return fmt.substring(0, 16)
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    /** 检测是否登录或认证了 **/
    // app.globalData.checkIsLogin(app.globalData.personInfo.id);
    this.getList();
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