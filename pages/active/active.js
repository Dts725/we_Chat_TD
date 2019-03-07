// pages/active/active.js
let dateformat = require('../../utils/dateformat.js');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		url: app.globalData.url,
		fileUrlurl: app.globalData.fileUrl,
		total: 0,
		current_page: 1,
		cardData: [{
			image: '../../../static/test.jpg',
			name: '传承五四薪火，弘扬泰达精神',
			start_time: '2016-04-29 11:00-12:00',
			end_time: '',
			place: '美克公寓餐厅一楼活动室',
			organization: '兰亭秀书画社'
		}, ],
		status: 1,
		isAdmin: false,
		/** card组件右侧的扫码图标路径 */
		imgSrc: '../../../static/qcode.png',
		scanImgSrc: '../../../static/scanPeople.png',
	},
	/**
	 * medthod
	 */
	// 拍脸签到
	scanImgEvent(e) {
		// 		wx.navigateTo({
		// 			url: '../../pages/activeDetail/detail?id=' + e.detail.con.id + '&uid=' + app.globalData.personInfo.id
		// 		})
		let me = this,
			active_id = e.detail.con.id,
			uid = app.globalData.personInfo.id,
			img = '',
			content = '';
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				wx.showLoading({
					title: '努力识别中……',
					mask: true
				});
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				// var tempFilePaths = res.tempFilePaths;
				wx.getFileSystemManager().readFile({
					filePath: res.tempFilePaths[0], //选择图片返回的相对路径 
					encoding: 'base64', //编码格式 
					success: res => { //成功的回调 
						img = 'data:image/png;base64,' + res.data;
						wx.request({
							url: app.globalData.url + 'sign_active', //仅为示例，并非真实的接口地址
							data: {
								image: img,
								active_id: active_id,
								uid: uid
							},
							method: 'POST',
							success: function(res) {
								// console.log('res::', res.data)
								wx.hideLoading();
// 								content = res.data.data ?
// 									`${res.data.data.username} ${res.data.status}! \n签到信息:\n姓名:${res.data.data.username}\n总积分:${res.data.data.score}\n本次积分:${res.data.data.reward}` :
// 									`${res.data.status}`;
// 								wx.showModal({
// 									title: '签到结果',
// 									content: content
// 								});
								wx.showToast({
									title:res.data.status,
									icon:'none',
									duration:1500
								});

							}
						});
					},
					fail: fl => {
						console.log('fail:::', fl);
						wx.hideLoading();
					}
				})
			}
		})
		return false;
	},
	//查看详情
	detailEvent(e) {
		wx.navigateTo({
			url: '../../pages/activeDetail/detail?id=' + e.detail.con.id + '&uid=' + app.globalData.personInfo.id
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
			if (!app.globalData.personInfo || !app.globalData.personInfo.id) {
				console.log('未检测到用户id，打开提示注册弹窗');
				app.getUserInfo();
				return ;
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
			// console.log('dat:::', dat);
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
	/** 二维码按钮 */
	customEvent(e) {
		wx.navigateTo({
			url: '../../pages/qrCode/qrCode?id=' + e.detail.con.id
		})
	},
	// 获取活动列表
	getList(page) {
		page = typeof(page) == 'number' ? page : 1;
		if (page == 1) {
			this.setData({
				cardData: []
			});
		}
		let _this = this;
		wx.showLoading({
			title: '加载中',
		});

//     console.log(app.globalData.personInfo)
//     console.log('111111111111111111111111111111111111111111')
		wx.request({
			url: this.data.url + 'active?is_show=2&page=' + page + '&uid= ' + app.globalData.personInfo.id,
			// url: this.data.url + 'active?is_show=2&page=' + page + '&uid=184',
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
					let data = res.data.data.data,
						oldData = this.data.cardData;
					let time = '',tmpArr=[],tmpNum='';
					for (let i = 0; i < data.length; i++) {
						if (!data[i].start_time || !data[i].end_time) {
							time = '';
						} else {
							// time = _this.fmtDate(data[i].start_time).substring(0, 10) + ' ' + _this.fmtDate(data[i].start_time).substring(10) + ' -' + _this.fmtDate(data[i].end_time).substring(10);
							time = dateformat.dateformat.format(new Date(Number(data[i].start_time)), 'yyyy-MM-dd hh:mm') + ' - ' +
								dateformat.dateformat.format(new Date(Number(data[i].end_time)), 'hh:mm');
						}
						data[i].time = time;
						data[i].image = data[i].image ? (_this.data.fileUrlurl + '/' + data[i].image) :
							'../../../static/default_img.png';
						if (Number(data[i].status) && Number(data[i].status) == 2 && Number(data[i].sign_status) == 1) {
							data[i].status = 3;
						}
					}
					_this.setData({
						cardData: oldData,
						total: res.data.data.total,
						current_page: res.data.data.current_page
					});
					oldData = oldData.concat(data);
					
					/** 注意：微信限制单次setData的数据不得超过1048576即1024k大小的数据 **/
					if(JSON.stringify(oldData).length<1048000){
						_this.setData({
							cardData: oldData
						});
					}else{
						tmpArr=app.sliceArray(oldData,Math.ceil(JSON.stringify(oldData).length/1048000));
						for(var i=0;i<tmpArr.length;i++){
							_this.setData({
								cardData: tmpArr[0]
							});
							if(i>=1){
								for(var j=0;j<tmpArr[i].length;j++){
									tmpNum=_this.data.cardData.length+j
									let tmp='cardData['+tmpNum+']';
									_this.setData({
										[tmp]: tmpArr[i][j]
									});
								}
							}
						}
					}
					// console.log('this.data.cardData::::', oldData, oldData.length,JSON.stringify(oldData).length);
				}
			},
			fail: (res) => {
				console.log('fail', res);
			}
		});
	},

	// 获取下一页
	getNextPage() {
		this.getList(this.data.current_page + 1);
	},
	/** 判断是否为管理员 */
	isAdmin() {
		// 判断是否为管理员 authority>1 为管理员
		if (app.globalData.personInfo && app.globalData.personInfo.authority && Number(app.globalData.personInfo.authority) >
			1) {
			return true;
		} else {
			return false;
		}
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
		// 判断是否为管理员
		this.setData({
			isAdmin: this.isAdmin() ? true : false
		});
		console.log('this.data.isAdmin:::::', this.data.isAdmin);
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
