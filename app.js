//app.js
App({
	onLaunch: function() {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
		//登录并从后台获取用户信息
		this.loginAndGetSetting();

		// 获取用户信息-头像-从微信api
		// 		wx.getSetting({
		// 			success: res => {
		// 				if (res.authSetting['scope.userInfo']) {
		// 					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
		// 					wx.getUserInfo({
		// 						success: res => {
		// 							debugger;
		// 							// 可以将 res 发送给后台解码出 unionId
		// 							this.globalData.userInfo = res.userInfo
		// 							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
		// 							// 所以此处加入 callback 以防止这种情况
		// 							if (this.userInfoReadyCallback) {
		// 								this.userInfoReadyCallback(res)
		// 							}
		// 						}
		// 					})
		// 				}
		// 			}
		// 		});

		// 获取用户信息-头像-从微信api
		//当用户未授权过，调用该接口将直接报错, 当用户授权过，可以使用该接口获取用户信息
		wx.getUserInfo({
			success: res => {
				// 可以将 res 发送给后台解码出 unionId
				this.globalData.userInfo = res.userInfo

				// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				// 所以此处加入 callback 以防止这种情况
				if (this.userInfoReadyCallback) {
					this.userInfoReadyCallback(res)
				}
			}
		})


	},
	// 登录--并设置基本信息
	loginAndGetSetting() {
		wx.login({
			success: resLogin => {
				var _this = this;
				// debugger
				this.globalData.loginInfo = resLogin;
				this.getSettings();
				// this.getUserInfoWX();
			}
		});
	},
	/** 获取授权情况 **/
	getSettings() {
		wx.getSetting({
			success: res => {
				// 如果为授权获取用户信息 则 打开欢迎页引导授权
				if (!res.authSetting['scope.userInfo']) {
					wx.reLaunch({
						url: '../../pages/welcome/welcome'
					})
				} else {
					this.getUserInfoWX();
				}
			},
			fail: fl => {
				console.log('getSettings--fl::', fl);
			}
		});
	},
	/** 获取用户信息--微信接口 
	 *  因微信限制 只可调用一次，多次报错
	 **/
	getUserInfoWX() {
		let _this = this;
		wx.getUserInfo({
			success: resp => {
				// debugger;
				// 可以将 resp 发送给后台解码出 unionId
				this.globalData.userInfo = resp.userInfo;
				this.globalData.userInfoWX = resp;
				// console.log('this.globalData.userInfo:::', this.globalData.userInfo);
				// 发送 code 到后台换取 openId, sessionKey, unionId ---调用request请求api转换登录凭证 
				// this.getUserInfo();
				wx.request({
					url: this.globalData.url + 'getWxUserInfo',
					// header: {
					//   'content-type': 'application/json'
					// },
					method: 'GET',
					data: {
						code: this.globalData.loginInfo.code,
						iv: this.globalData.userInfoWX.iv,
						encryptedData: this.globalData.userInfoWX.encryptedData
					},
					success: function(res) {
            console.log('登录~~~', res);

						// console.log('getWxUserInfo:::', res);
						if (res.statusCode == 200) {
							_this.globalData.openid = res.data.data.openid;
							_this.globalData.personInfo = res.data.data;
							// 当用户已注册时 跳转到内部页面
// 							if (res.data.data.if_register !== 2) {
// 								console.log('登录成功后获取的用户信息：', res);
// 								wx.switchTab({
// 									url: '../../pages/news/news'
// 								})
// 							}
							
							
							// if (res.data.data.if_register == 2) {
							//   console.log('登录成功后获取的用户信息：', res);
							//   wx.reLaunch({
							//     url: '../../pages/register/register'
							//   })
							// }
						}
					}
				});
			},
			fail: fl => {
				console.log('fl::', fl);
				// wx.getUserInfo();
			}
		});
	},

	/**
	 * 从 globalData 中获取用户数据
	 */
	getUserInfo() {
		let info = this.globalData.personInfo;
		if (info.if_register == 2) {
			wx.showModal({
				title: '温馨提示',
				content: '您尚未注册，是否立刻注册 ？注册后即可使用全部功能……',
				success: function(e) { // 点击确定或取消按钮的回调事件  confirm-确定 cancel-取消
					if (e.confirm == true) {
						//   wx.reLaunch({
						wx.navigateTo({
							url: '../../pages/register/register'
						})
					}
				}
			});
		} else {
			return info;
		}
	},

	// 发送 code 到后台换取 openId, sessionKey, unionId ---调用request请求api转换登录凭证  
	// getUserInfo() {
	// debugger;
	// 		let _this=this;
	// 		let p = new Promise((resolve,reject)=>{
	// 			wx.request({
	// 				url: this.globalData.url + 'getWxUserInfo',
	// 				// header: {
	// 				//   'content-type': 'application/json'
	// 				// },
	// 				method: 'GET',
	// 				data: {
	// 					code: this.globalData.loginInfo.code,
	// 					iv: this.globalData.userInfoWX.iv,
	// 					encryptedData: this.globalData.userInfoWX.encryptedData
	// 				},
	// 				success: function(res) {
	// 					debugger;
	// 					console.log('getWxUserInfo:::', res);
	// 					if (res.statusCode == 200) {
	// 						_this.globalData.openid = res.data.data.openid;
	// 						_this.globalData.personInfo = res.data.data;
	// 						// 当用户已注册时 跳转到内部页面
	// 						if (res.data.data.if_register !== 2) {
	// 							console.log('登录成功后获取的用户信息：', res);
	// 							wx.switchTab({
	// 								url: '../../pages/news/news'
	// 							})
	// 						}
	// 						resolve(res.data);
	// 						// if (res.data.data.if_register == 2) {
	// 						//   console.log('登录成功后获取的用户信息：', res);
	// 						//   wx.reLaunch({
	// 						//     url: '../../pages/register/register'
	// 						//   })
	// 						// }
	// 					}
	// 				},
	// 				fail: fl=>{
	// 					reject(fl);
	// 				}
	// 			});
	// 		});
	// 		wx.request({
	// 			url: this.globalData.url + 'getWxUserInfo',
	// 			// header: {
	// 			//   'content-type': 'application/json'
	// 			// },
	// 			method: 'GET',
	// 			data: {
	// 				code: this.globalData.loginInfo.code,
	// 				iv: this.globalData.userInfoWX.iv,
	// 				encryptedData: this.globalData.userInfoWX.encryptedData
	// 			},
	// 			success: function(res) {
	// 				debugger;
	// 				console.log('getWxUserInfo:::', res);
	// 				if (res.statusCode == 200) {
	// 					_this.globalData.openid = res.data.data.openid;
	// 					_this.globalData.personInfo = res.data.data;
	// 					// 当用户已注册时 跳转到内部页面
	// 					if (res.data.data.if_register !== 2) {
	// 						console.log('登录成功后获取的用户信息：', res);
	// 						wx.switchTab({
	// 							url: '../../pages/news/news'
	// 						})
	// 					}
	// 					// if (res.data.data.if_register == 2) {
	// 					//   console.log('登录成功后获取的用户信息：', res);
	// 					//   wx.reLaunch({
	// 					//     url: '../../pages/register/register'
	// 					//   })
	// 					// }
	// 				}
	// 			}
	// 		});
	// },

	/** 拆分数组 接收数组和拆分份数 **/
	sliceArray(arr,num){
		if(!arr || !Array.isArray(arr)){ return;}
		if(!num){num=1}
		var result = [],fen=Math.ceil(arr.length/num);
	    for(var i=0,len=arr.length;i<len;i+=fen){
	        result.push(arr.slice(i,i+fen));
	     }
		return result;
	},
	onShow: function() {

	},
	/** 全局数据 */
	globalData: {
		userInfoWX: null, // {iv:xx, encryptedData:xx, userInfo:{avatarUrl:微信头像地址,nickName:姓名}}
		loginInfo: null, // {code:xxx, errMsg:xx}
		userInfo: null, // {}
		personInfo: null, // 这里有用户id {if_register:xx, openid:xx, unionid:xx}
		openid: null,
		optId: null, // 预约详情的id，会自动清空
		url: 'https://huanaapi.shyunhua.com/',
		fileUrl: 'https://huanafile.shyunhua.com',
		/** 
		 * 检测是否登录或认证了
		 * id：personInfo中的用户的id
		 *  **/
		checkIsLogin(id) {
			if (!id) {
				wx.showModal({
					title: '温馨提示',
					content: '您尚未注册，是否立刻注册 ？注册后即可使用全部功能……',
					success: function(e) { // 点击确定或取消按钮的回调事件  confirm-确定 cancel-取消
						if (e.confirm == true) {
							wx.reLaunch({
								url: '../../pages/register/register'
							})
						}
					}
				});
				return false;
			}
		}
	}
})
