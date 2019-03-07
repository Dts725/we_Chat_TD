// pages/components/cardEasy/cardEasy.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // card的总数据
    cardData: {
      type: Object,
      value: {
        author: "",
        content: "",
        date_time: "",
        id: '',
        image: "",
        title: "",
        type: '',
        // 				author: "admin",
        // 				content: "<p>测试一</p>",
        // 				date_time: "1534330462275",
        // 				id: 3,
        // 				image: "appointmentfile/5b7406728a998__!u=4286534442,24327415&fm=27&gp=0.jpg",
        // 				title: "测试一",
        // 				type: 2
      }
    },
    // 显示状态  0：已结束，1：立刻报名，2：已报名, 3: 已签到
    status: {
      type: Number,
      value: 1
    },
    // 二维码或扫码的小图标地址--默认二维码
    imgsrc: {
      type: String,
      value: ''
    },
		// 二维码或扫码的小图标地址--默认二维码
		imgUrl: {
			type: String,
			value: ''
		},
    // 自定义按钮
    customName: {
      type: String,
      value: ''
    },
    // 自定义按钮-class名字
    customClass: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* * 内部私有方法建议以下划线开头 * triggerEvent 用于触发事件, {}中的内容为返回的对象 */
    /** 查看详情 */
    _detailEvent() {
      this.triggerEvent('detailEvent', {
        con: this.data.cardData
      });
    },
    /** 自定义按钮 */
    _customEvent() {
      this.triggerEvent('customEvent', {
        con: this.data.cardData
      });
    },
  }
})
