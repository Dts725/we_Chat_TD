// pages/register/register.js
let chk = require('../../utils/W.validate.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    textCode: '获取验证码',
    countDown: 60,
    fileUrl: app.globalData.fileUrl,
    cardStyle: '',

    personInfo: {},
    //发送请求所传数据
    field: {
      username: '',
      card: '',
      phone: '',
      code: '',
      openid: '',
      community_id: '',
      register_time : ''

    },
    showPhoto: '', // 拍照后显示的头像
    disable: false, // 是否允许输入，点击下一步 之后改为true
    canEditPhoto: false, // 如果数据库已经存在头像，则不允许编辑头像
    disableSubmit: false,
    communityList: [], // 社区列表
    communitySelected: -1, // 选择的社区
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },


  onShow() {
    let me = this;
    setTimeout(function() {
      me.setData({
        personInfo: app.globalData.personInfo
      })
    }, 300);
    this.getCommunityList();
  },
  /** 
   * 获取社区列表
   * **/
  getCommunityList() {
    let _this = this;
    wx.request({
      url: app.globalData.url + 'community',
      method: 'GET',
      success: function(res) {
        if (res.data.code == 0) {
          _this.setData({
            communityList: res.data.data,
            'field.community_id': wx.getStorageSync('community_id')
          });
        }
      }
    });
  },

  /**
   * 拍照
   */
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // that.setData({
        //   showPhoto: res.tempFilePaths[0]
        // });

        wx.uploadFile({
          url: app.globalData.url + 'file/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function(res) {
            let dat = JSON.parse(res.data);
            if (dat && dat.code == 0) {
              that.setData({
                showPhoto: dat.data.store_result,
                'field.image': dat.data.store_result
              })
            }
          }
        })
      }
    })
  },

  /**
   * 选择社区
   */
  bindCommunityChange: function(e) {
    let _this = this;
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.data.communityList.forEach((el, idx) => {
      if (idx == Number(e.detail.value)) {
        _this.setData({
					communitySelected: e.detail.value,
          'field.community_id': el.id
        })
				console.log('el:::', el);
      }
    });

  },


  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },


  //绑定用户信息提交表单
  bundleInfo() {
    let openid = this.data.personInfo.openid;

    this.data.field.openid = openid;
    this.data.field.register_time = Math.floor(new Date() / 1000);
		this.data.field.unionid = this.data.personInfo.unionid;
    let data = this.data.field,
      _this = this;

    console.log('data::::', this.data.field);

    let tip = null
    for (let key in data) {
      if (!data.username) {
        tip = '用户名不能为空'
        break
      }
      if (data.card == '') {
      	tip = '身份证号不能为空'
      	break
      } else if (!chk.default.validatIDCard(data.card)) {
      	tip = '请输入正确的身份证号'
      	break
      }
      if (data.phone == '') {
      	tip = '手机号不能为空'
      	break
      } else if (!chk.default.validatPhone(data.phone)) {
      	tip = '请输入正确的手机号'
      	break
      }
      // if (data.code == '') {
      //   tip = '验证码不能为空'
      //   break
      // }
      if (!data.image) {
        tip = '请拍摄头像'
        break
      }
			if (!data.community_id) {
				tip = '请选择社区'
				break
			}
    }

    if (!tip) {
      this.setData({
        disableSubmit: true
      });
      console.log('field11111111111111111111111111111', this.data.field);
      wx.request({
        url: app.globalData.url + 'user',
        method: 'POST',
        data: this.data.field,
        success: function(response) {

          if (response.data.code == 0) {
            app.globalData.personInfo = response.data.data

            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 1500
            });
            wx.switchTab({
              url: '../../pages/user/user'
              // url: '../../pages/appointment/apt'
            });
          } else if (response.data.code == 205) {
            console.log(205)
            wx.showToast({
              title: response.data.status,
              icon: 'none',
              duration: 1500
            });
          } else if (response.data.code == 206) {
            console.log(206)
            wx.showToast({
              title: response.data.status,
              icon: 'none',
              duration: 1500
            });
          } else {
            wx.showToast({
              title: response.data.status,
              icon: 'none',
              duration: 1500
            });
          }
          if (response.data.code !== 0) {
            _this.setData({
              disableSubmit: false
            });
          }
        }

      })
    } else {
      wx.showToast({
        title: tip,
        icon: 'none',
        duration: 1500
      });
    }


  },

  //获取验证码
  getValidateCode() {

    let reg = new RegExp("[1][0-9][0-9]{9}", 'g')
    let phone = this.data.field.phone

    if (reg.test(phone)) {


      this.setData({
        textCode: '获取成功'
      })
      this.downNum()
      let me = this
      let timer = setInterval(function() {
        if (me.data.countDown > 0) {
          me.downNum()
        } else {
          me.setData({
            textCode: '获取验证码'
          })
          me.setData({
            countDown: 60
          })
          clearInterval(timer)
        }
      }, 1000)


      wx.request({
        url: app.globalData.url + 'code',
        method: 'POST',
        data: {
          phone: phone
        },
        success: function(res) {
          wx.showToast({
            title: '已发送',
            icon: 'success',
            duration: 1500
          });

        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500
      });
    }



    console.log(reg.test(phone))

  },


  //验证码倒计时
  downNum() {
    let index = --this.data.countDown
    this.setData({
      countDown: index
    })

  },


  getUserName(e) {
    this.data.field.username = e.detail.value
  },
  getCard(e) {

    let value = e.detail.value

    let reg = new RegExp('[0-9]{17}[x,X,0-9]{1}')

    if (!reg.test(value)) {
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none',
        duration: 1500
      });
    }

    this.data.field.card = e.detail.value

  },
  getPhone(e) {
    this.data.field.phone = e.detail.value

  },
  getCode(e) {
    this.data.field.code = e.detail.value
  },
  // 返回
  goBack() {
    this.setData({
      disable: false,
      showPhoto: ''
    });
    this.data.field.image = '';
  },
  // 下一步
  goNext() {
    let openid = this.data.personInfo.openid,
      _this = this;

    this.data.field.openid = openid;
    let data = this.data.field;

    let tip = null
    for (let key in data) {
      if (data.username == '') {
        tip = '用户名不能为空'
        break
      }
      if (data.card == '') {
        tip = '身份证号不能为空'
        break
      } else if (!chk.default.validatIDCard(data.card)) {
        tip = '请输入正确的身份证号'
        break
      }
      if (data.phone == '') {
        tip = '手机号不能为空'
        break
      } else if (!chk.default.validatPhone(data.phone)) {
        tip = '请输入正确的手机号'
        break
      }
      if (data.code == '') {
        tip = '验证码不能为空'
        break
      }
      if (!data.community_id) {
        tip = '请选择社区'
        break
      }
    }

    console.log(data.community_id)

    if (!tip) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'authentication',
        method: 'POST',
        data: this.data.field,
        success: function(response) {
          wx.hideLoading();
          if (response.data.code == 0) {
            wx.setStorageSync('community_id', _this.data.field.community_id)

            if (response.data.data) {
              app.globalData.personInfo = response.data.data
            }
            if (response.data.data && response.data.data.image) {
              _this.setData({
                showPhoto: response.data.data.image,
                cardStyle: 'width:10rem;height:7rem;',
                canEditPhoto: false
              });
              _this.data.field.image = response.data.data.image;
              console.log('showPhoto:', _this.data.showPhoto, 'field:', _this.data.field)
            } else {
              _this.setData({
                cardStyle: 'width:6rem;height:8rem;',
                canEditPhoto: true
              });
            }
            _this.setData({
              disable: true,
              disableSubmit: false
            });

          }
          if (response.data.code == 205) {
            console.log(205)
            wx.showToast({
              title: response.data.status,
              icon: 'none',
              duration: 1500
            });
          }
          if (response.data.code == 206) {
            console.log(206)
            wx.showToast({
              title: response.data.status,
              icon: 'none',
              duration: 1500
            });
          }
        }

      })
    } else {
      wx.showToast({
        title: tip,
        icon: 'none',
        duration: 1500
      });
    }

  }



})
