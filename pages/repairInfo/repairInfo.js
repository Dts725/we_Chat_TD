// pages/repairInfo/repairInfo.js
let dateformat = require('../../utils/dateformat.js')
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		files: [], //图片列表
		// 所有信息
		personInfo: {},
		gender: '',

		url: app.globalData.fileUrl,


		// 证件部分的
		cards: {
			cardFront: '',
			cardBack: '',
			cardDegree: '',
		},

		communityShow: false,
		communityList: [], // 社区列表
		communitySelected: 0, // 选择的社区

		whichRoute: '',
		/** 模拟数据 */
		business: [],
		infos: [{
				name: '陈松',
				infos: [{
						date: '2018-5-25 10:30',
						field: '华纳社区服务中心',
						con: '向滨海新区领导介绍泰达智慧化建设'
					},
					{
						date: '2018-5-30 14:56',
						field: '华纳社区服务中心',
						con: '部署社区智慧化升级工作'
					},
					{
						date: '2018-6-14 16:30',
						field: '华纳社区服务中心',
						con: '部署社区智慧化升级工作'
					},
					{
						date: '2018-7-4 11:20',
						field: '华纳社区服务中心',
						con: '向泰达街领导介绍泰达智慧化建设'
					},
					{
						date: '2018-7-13 10:50',
						field: '华纳社区服务中心',
						con: '部署社区智慧化升级工作'
					}
				]
			},
			{
				name: '刘静陶',
				infos: [{
						date: '2018-6-30 9:00',
						field: '华纳社区服务中心',
						con: '准备万人环境大整洁活动'
					},
					{
						date: '2018-6-28 9:00',
						field: '华纳社区二楼会议室',
						con: '参加社区党组织换届选举大会'
					},
				]
			},
			{
				name: '刘红霞',
				infos: [{
						date: '2018-6-5 10:00',
						field: '华纳社区二楼会议室',
						con: '主持召开党委会议'
					},
					{
						date: '2018-6-7 10:00',
						field: '华纳社区二楼会议室',
						con: '主持召开党委扩大会议'
					},
					{
						date: '2018-6-8 9:30',
						field: '华纳社区二楼会议室',
						con: '参加党组织换届选举大会'
					},
				]
			},
		]
	},

	onLoad: function(option) {

		this.setData({
			whichRoute: option
		});
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
						communityList: res.data.data
						// 'field.community_id': res.data.data[0].id
					});
				}
			}
		});

	},
	// 修改社区
	communityEdit() {
		this.setData({
			communityShow: !this.data.communityShow
		});
	},
	/**
	 * 选择社区
	 */
	bindCommunityChange: function(e) {
		let _this = this,
			community = '';
		// console.log('picker country code 发生选择改变，携带值为', e.detail.value);
		wx.showModal({
			title: '提示',
			content: '您确定修改吗？',
			success: res => {
				console.log('success:::', res);
				// 点击了确定按钮
				if (res.confirm) {
					_this.data.communityList.forEach((el, idx) => {
						if (idx == Number(e.detail.value)) {
							_this.setData({
								communitySelected: e.detail.value
								// 'field.community_id': el.id
							});
							community = el;
						}
					});
					console.log('community:::', community);
					wx.request({
						url: app.globalData.url + `user/${app.globalData.personInfo.id}`,
						method: 'PUT',
						data: {
							community_id: community.id
						},
						success: res => {
							if (res.data.code === 0) {
								_this.setData({
									'personInfo.community_name': community.community_name,
									'personInfo.community_id': community.id,
									communityShow: false
								});
								wx.showToast({
									title: '修改成功',
									duration: 2500
								});
							}
						},
						fail: fl => {
							wx.showToast({
								title: rl.code,
								duration: 3000
							});
						}
					});

				}
			}
		});

	},

	/** 通过身份证号获取性别 */
	// getGender(con) {
	//   let gender = '',
	//     num = '';
	//   if (con.length == 18) {
	//     num = Number(con.charAt(con.length - 2));
	//     console.log(num)
	//   } else {
	//     num = Number(con.charAt(con.length - 4));
	//     console.log(num)
	//   }
	//   if (num % 2 == 0) {
	//     gender = '女';
	//   } else {
	//     gender = '男';
	//   }
	//   console.log(gender)
	//   return gender;
	// },


	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		this.setData({
			business: []
		});
		let id;
		console.log(typeof this.data.whichRoute)
		if (id = wx.getStorageSync('key')) {
			wx.removeStorageSync('key')

		} else {

			id = app.globalData.personInfo.id
		}
		let me = this,
			_this = this;
		wx.request({
			url: app.globalData.url + `user/${id}`,
			method: 'GET',
			success: function(res) {
				if (res.data.code === 0) {
					// app.globalData.personInfo = res.data.data
					let info = res.data.data
					me.setData({
						personInfo: me.infoConvert(info),
						gender: info.sex
					})
					console.log('personInfo::::', _this.data.personInfo);
					/**************************** 模拟数据部分 ***************************** */
					// let infos = _this.data.infos;
					// for (let i in infos) {
					//   if (infos[i].name == info.username) {
					//     _this.setData({
					//       business: infos[i].infos
					//     });
					//   }
					// }

				}
			}
		})


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
		//  else if (ua) {
		//   if (browserType == 'IE') {
		//     fmt = new Date(date).toLocaleString().replace(/年|月|日/g, '-').replace(/上午|下午/g, '')
		//   } else {
		//     fmt = new Date(date).toLocaleString().replace(/\//g, '-').replace(/上午|下午/g, '')
		//   }
		// }
		return fmt
	},

	infoConvert(old) {
		if (old.political == 0) {
			old.political = ''
		} else if (old.political == 1) {
			old.political = '党员'
		} else if (old.political == 2) {
			old.political = '团员'
		} else if (old.political == 3) {
			old.political = '其他'
		}
		if (old.marriage == 0) {
			old.marriage = ''
		} else if (old.marriage == 1) {
			old.marriage = '未婚'
		} else if (old.marriage == 2) {
			old.marriage = '已婚'
		} else if (old.marriage == 3) {
			old.marriage = '离异'
		}

		if (old.record == 0) {
			old.record = ''
		} else if (old.record == 1) {
			old.record = '小学'
		} else if (old.record == 2) {
			old.record = '初中'
		} else if (old.record == 3) {
			old.record = '高中'
		} else if (old.record == 4) {
			old.record = '专科'
		} else if (old.record == 5) {
			old.record = '本科'
		} else if (old.record == 6) {
			old.record = '硕士'
		} else if (old.record == 7) {
			old.record = '博士'
		}

		if (old.image) {
			old.image = `${app.globalData.fileUrl}/${old.image}`
		}
		for (let el in old) {
			old[el] = old[el] ? old[el] : '';
			// new Date(Number(time)).toLocaleString().replace(/\//g, '-').replace(/上午|下午/g, '')
		}
		if (old.appointment) {
			for (let pt in old.appointment) {
				old.appointment[pt].date_time = this.fmtDate(old.appointment[pt].date_time);
			}
		}
		if (old.record_array) {
			for (let ry in old.record_array) {
				old.record_array[ry].date_time = dateformat.dateformat.format(new Date(Number(old.record_array[ry].date_time)));
				old.record_array[ry].content = old.record_array[ry].content ? old.record_array[ry].content : '';
			}
		}

		return old
	},

	_previewImage(e) {
		let url = this.data.url + '/' + e.target.dataset.url
		wx.previewImage({
			urls: [url],
		})
	},

	/** 获取活动列表 */


})
