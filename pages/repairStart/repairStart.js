// pages/repairInfo/repairInfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],    //图片列表
    infos: {
      username: '',  //姓名
      card: '',      //身份证
      phone: '',     //手机 
    },

    identifyPic: '',

    // 证件部分的
    photo: '', //头像
    showPhoto: false, //显示或隐藏头像
    showBtn:false
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
          photo: res.tempFilePaths[0],
          showPhoto: true
        });

        wx.uploadFile({
          url: app.globalData.url + 'file/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            let dat = JSON.parse(res.data);

            if (dat && dat.code == 0) {
              // wx.setStorage({ key: "photo", data: dat.data.store_result })
              that.setData({
                identifyPic: dat.data.store_result
              })
            }
          }
        })
      }
    })
  },
  // 开始认证
  startIdentify(e) {
    var photo = wx.getStorageSync('photo')

    if (!this.data.identifyPic) {
      wx.showToast({
        icon: 'none',
        title: '请上传照片',
      })
      return
    }


    let data = {
      username: app.globalData.personInfo.username,
      id: app.globalData.personInfo.id,
      image: this.data.identifyPic
    }

    
    this.setData({
      showBtn : true
    })
    let me = this;
    wx.request({
      url: app.globalData.url + 'examine',
      data: data,
      method: 'POST',
      success: function (res) {
        
        if (res.data.code === 0) {
          wx.showToast({
            title: '认证成功！',
          })
          wx.switchTab({
            url: "../user/user",
            success: function () {
              wx.request({
                url: app.globalData.url + `user/${app.globalData.personInfo.id}`,
                method: 'GET',
                success: function (res) {
                  if (res.data.code === 0) {
                    app.globalData.personInfo = res.data.data
                  }
                }
              })

            }

          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.status,
          })
          me.setData({
            showBtn: false
          })
        }
      }
    })

  },
  
  onShow: function () {
    setTimeout(() => {
      let dat = app.globalData.personInfo ? app.globalData.personInfo : '';
      if (dat) {
        this.setData({
          'infos.username': dat.username,
          'infos.phone': dat.phone,
          'infos.card': dat.card
        });
      } else {
        wx.showToast({ title: '获取数据失败，请关闭小程序重新打开 ！！！', icon: 'none', duration: 3000 });
      }
    }, 1000);
  }

})