// pages/user/user.js
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		personInfo: {},
		activeIndex: 0,
		userInformation: {},
		isAuthentication: '',
		isAuthenticationPic: 1,
		// 我的的预约
		aptList: [],
		// 字段名对应的中文名
		cnKey: {
			application: "预约用途",
			day: "预约日期",
			// field_id: 7,
			fieldname: "预约场地",
			id: 26,
			moment: "预约时间",
			phone: "联系方式",
			// team_id: 1,
			teamname: "预约团队",
			username: "预约人"
		},
		showBtn: false, //权限
		userInfo: {},
		hasUserInfo: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

		// setTimeout(function() {

		//   wx.request({
		//     url: app.globalData.url + `user/${app.globalData.personInfo.id}`,
		//     method: 'GET',
		//     success: function(res) {
		//       if (res.code === 0) {
		//         app.globalData.personInfo = res.data
		//       }
		//     }
		//   })
		// }, 500)


	},


	onShow() {
		let _this = this;
		setTimeout(function() {
			if (!app.globalData.personInfo || !app.globalData.personInfo.id) {
				_this.getPersonInfoByAppJs();
				setTimeout(function() {
					_this.getPersonInfo();
				}, 500);
			} else {
				_this.getPersonInfo();
			}
		}, 500);
	},
	// 获取用户信息-from 接口
	getPersonInfo() {
		if (!app.globalData.personInfo.id) {
			this.setData({
				//未验证
				isAuthentication: '../register/register',
				isAuthenticationPic: 1
			});
			return;
		}
		let _this = this;
		wx.request({
			url: app.globalData.url + `user/${app.globalData.personInfo.id}`,
			method: 'GET',
			success: function(res) {
				if (res.data.code === 0) {
					app.globalData.personInfo = res.data.data
					_this.checkAuth();
				}
			}
		});
	},
	// 获取用户信息-from appjs配置
	getPersonInfoByAppJs() {
		// app.getPersonInfo();
		app.getUserInfo();
	},
	// 扫码
	scan() {
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
		});
		return false;
	},
	// 拍照签到
	scanToSign() {
		let me = this,
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
							url: app.globalData.url + 'sign_pull', //仅为示例，并非真实的接口地址
							data: {
								image: img
							},
							method: 'POST',
							success: function(res) {
								console.log('res::', res.data)
								wx.hideLoading();
								content = res.data.data ?
									`${res.data.data.username} ${res.data.status}! \n签到信息:\n姓名:${res.data.data.username}\n总积分:${res.data.data.score}\n本次积分:${res.data.data.reward}` :
									`${res.data.status}`;
								wx.showModal({
									title: '签到结果',
									content: content
								});

							}
						});
					},
					fail: fl => {
						console.log('fail:::', fl);
						wx.hideLoading();
					}
				})
				// 				wx.uploadFile({
				// 					url: app.globalData.url + 'file/upload',
				// 					filePath: tempFilePaths[0],
				// 					name: 'file',
				// 					success: function (response) {
				// 						let img = JSON.parse(response.data).data.store_result;
				// 						console.log('img::',img,'response::',response);
				// 						wx.request({
				// 							url: app.globalData.url + 'sign_pull', //仅为示例，并非真实的接口地址
				// 							data: {
				// 								image: img
				// 							},
				// 							method:'POST',
				// 							success: function (res) {
				// 								me.setData({
				// 									showBtn: false
				// 								})
				// 								res = res.data
				// 								if (res.code === 0) {
				// 									try {
				// 										wx.setStorageSync('key', res.data.id)
				// 									} catch (e) {
				// 									}
				// 									wx.navigateTo({
				// 										url: '../repairInfo/repairInfo?id = 1'
				// 									})
				// 								} else {
				// 									wx.showToast({
				// 										title: res.status,
				// 										icon:'none'
				// 									})
				// 								}
				// 								console.log('res::',res)
				// 							}
				// 						})
				// 					}
				// 				})
			}
		})
		return false;
	},
	statusOn() {
		console.log('点击了状态图标:::::::', this);
	},
	checkAuth() {
		let me = this;
		me.setData({
			personInfo: app.globalData.personInfo,
		})
		// 如果是未注册或为登录用户
		if (!me.data.personInfo.authentication) {
			me.setData({
				//未验证
				isAuthentication: '../register/register',
				isAuthenticationPic: 1
			})
			/** 检测是否登录或认证了 **/
			// app.globalData.checkIsLogin(app.globalData.personInfo.id);
		} else {
			if (me.data.personInfo.authentication == 2) {
				me.setData({
					//已验证
					isAuthentication: '../repairInfo/repairInfo',
					isAuthenticationPic: 2
				})
			} else if (me.data.personInfo.authentication == 1) {
				me.setData({
					//未验证
					isAuthentication: '../identity/identity',
					isAuthenticationPic: 1
				})
			}
			// 显示管理员的一些功能
			if (!app.globalData.personInfo.authority || Number(app.globalData.personInfo.authority) < 2) {
				me.setData({
					showBtn: false
				});
			} else {
				me.setData({
					showBtn: true
				});
			}
		}
	}




})
