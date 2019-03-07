// pages/components/qrcode/qrcode.js
let QRCode = require('../../../utils/weapp-qrcode.js');
let qrcode;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 二维码的连接地址
    url: {
      type: String,
      default: 'https://github.com/tomfriwel/weapp-qrcode'
    },
    // 二维码中间的logo地址
    logoUrl: {
      type: String,
      default: '../../../static/taida.png'
    },
    title: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    leftBtnName: {
      type: String,
      default: '按钮一'
    },
    rightBtnName: {
      type: String,
      default: '按钮二'
    },


  },

  /**
   * 组件的初始数据
   */
  data: {
    // 是否显示logo
    showLogo: false
  },
  ready: function() {
    // if (this.data.url) {
    this._createQrCode(this.data.url);
    // console.log('this.data.url:::', this.data.url);
    // } else {
    //   let _this = this;
    //   setTimeout(() => {
    //     this._createQrCode(this.data.url);
    //     console.log('this.data.url::timeout:', this.data.url);
    //   }, 1000);
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* * 内部私有方法建议以下划线开头 * triggerEvent 用于触发事件, {}中的内容为返回的对象 */
    /** 创建二维码 */
    _createQrCode(url, imgUrl) {
      //传入wxml中二维码canvas的canvas-id
      qrcode = new QRCode('canvas', {
        usingIn: this,
        text: url,
        // text: "https://github.com/tomfriwel/weapp-qrcode",
        width: 260,
        height: 260,
        colorDark: "#1CA4FC",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
      console.log('url:::', url, 'qrcode::', qrcode);
      // qrcode.clear(); // clear the code.
      // qrcode.makeCode('http://naver.com'); // make another code.
      this.setData({
        showLogo: true
      });
    },
    _save(e) {
      console.log('save  ---  e::::::', e);
    },

    // 下载
    _download() {
      qrcode.exportImage(function(e) {
        console.log(e);
      });
    }
  }
})