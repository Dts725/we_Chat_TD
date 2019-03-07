const app = getApp();
const { computed, watch } = require('../../utils/vuefy.js');
let common = require('../../utils/common.js');
let nowTime=new Date();
let YY = nowTime.getFullYear(),
	MM = (nowTime.getMonth() + 1)>9?(nowTime.getMonth() + 1):('0'+(nowTime.getMonth() + 1)),
	DD = nowTime.getDate()>9?nowTime.getDate():('0'+nowTime.getDate());
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		deviceType: '', //设备类型 - iphone - android
		url: app.globalData.url,
		// 社区-场地
		communityIndex: 0,
		community_name: '',
		communityList: [],
		showCommunityPicker: false,
		communityAll: [], // 社区列表和场地
		fieldAll: [], // 所有的场地
		
		// 展示用的数据
		onlyShowData:{
			fieldAllNumber:'',	// 场地的总资源数
			canUseNumber:'',	// 可用资源数
		},

		// 社区-团队
		showTeamPicker: false,
		communityTeamIndex: 0,
		community_team_name: '',
		communityTeamList: [],
		communityTeamAll: [], // 社区列表和团队
		team_info: '', // 当前选择的团队的信息

		// 预约场地
		indexF: 0,
		field: [{
			id: 1,
			fieldname: "二楼儿童坊"
		}],
		// 预约团队
		indexT: 0,
		team: [{
			id: 1,
			teamname: "舞蹈教室"
		}],
		// 个人预约开关
		checkSingleItem: [{
			name: '个人预约',
			value: '0',
			checked: true
		}],
		//预约时间
		timeList: [
			{ id: 1, time: '07:00-08:00' },
			{ id: 2, time: '08:00-09:00' },
			{ id: 3, time: '09:00-10:00' },
			{
				id: 4,
				time: '10:00-11:00'
			},
			{
				id: 5,
				time: '11:00-12:00'
			},
			{
				id: 6,
				time: '12:00-13:00'
			},
			{
				id: 7,
				time: '13:00-14:00'
			},
			{
				id: 8,
				time: '14:00-15:00'
			}, {
				id: 9,
				time: '15:00-16:00'
			},
			{
				id: 10,
				time: '16:00-17:00'
			},
			{
				id: 11,
				time: '17:00-18:00'
			},
			{
				id: 12,
				time: '18:00-19:00'
			}
		],
		checkboxItems: [{
			name: '在预约信息中显示团队联系方式',
			value: '0',
			checked: true
		}],
		uid: '',
		// canntTime: '', //已经预约的--即不可选的预约时间段
		//保存预约的数据- 发送后台使用
		aptData: {
			uid: '',
			community_id: '', // 社区id--场地所在的社区
			field_id: '', //场地id
			day: `${YY}-${MM}-${DD}`, //预约日期
			moment: '', //时间段
			application: '', //活动用途
			username: '', //联系人
			team_id: '', //预约团队
			phone: '', //联系电话
			people_phone: '', // 联系方式
			code: '', //验证码
			number:1, // 使用资源
		},
		// 表单校验
		rules:[
			{name: 'field_id',tip:'请选择预约场地 ！！！',required:true},
			{name: 'moment',tip:'请选择预约时间 ！！！',required:true},
			{name: 'application',tip:'请输入活动用途 ！！！',required:true},
			{name: 'username',tip:'请输入联系人 ！！！',required:true},
			{name: 'people_phone',tip:'请输入正确的手机号 ！！！',reg:'[1][2,3,4,5,7,8][0-9]{9}',required:true,cname:'手机号',length:11},
			{name: 'phone',tip:'请输入正确的手机号 ！！！',reg:'[1][2,3,4,5,7,8][0-9]{9}',required:true,cname:'手机号',length:11},
			{name: 'code',tip:'请输入验证码 ！！！',required:true},
			{name: 'use_number',tip:'请输入使用资源数量 ！！！',required:true},
			// {name: 'application',tip:'请输入活动用途 ！！！',required:true},
		],
		day: '', //预约日期-- 用在xml中的预约日期选择处
		dayStart: `${YY}-${MM}-${DD}`, //预约日期--开始  用在xml中的预约日期选择处
		dayEnd: (MM + 1 > 12) ? `${YY + 1}-${1}-${DD}` : `${YY}-${MM + 1}-${DD}`, //预约日期--结束

		timer: 45, //倒计时用的
		codeTitle: '验证码',
		codeDisabled: false,
		isHide: false, //隐藏code
		
		isSinglePeople: true,	// 是否个人预约

		/** 预约情况的 */
		// 所有人的预约
		aptList: [],
		// 字段名对应的中文名
		cnKey: {
			id: '',
			fieldname: '活动场地',
			teamname: "预约团队",
			application: "活动用途",
			// day: "预约日期",
			// moment: "预约时间",
			username: "联系人",
			people_phone: '联系电话'
		},
		showBtn: false,
		customBtnName: '取消预约',

		/** 顶部tab切换 */
		tabs: ["当前预约情况", "我要预约"],
		activeIndex: 0,
		sliderOffset: 0,
		sliderLeft: 0
	},
	/******************************************************** 
	 * 我要预约的
	 *******************************************************  */
	// 重置数据
	resetAllData() {
		this.setData({
			indexF: 0,
			indexT: 0,
			day: new Date().toLocaleDateString().replace(/\//g, '-'),
			isHide: false,
			'aptData.uid': '',
			'aptData.field_id': this.data.field[0].id, //场地id
			'aptData.username': '', //联系人
			// 'aptData.team_id': this.data.team[0].id, //预约团队
			'aptData.team_id': '', //预约团队
			'aptData.phone': '', //联系电话
			'aptData.day': `${YY}-${MM}-${DD}`, //预约日期
			'aptData.moment': '', //时间段
			'aptData.application': '', //活动用途
			'aptData.code': '', //验证码
			'aptData.people_phone': '' ,// 联系方式
			'aptData.number': 1 // 使用资源
		});
		this.setCanntCheck([]);
		// 将预约的id清零
		app.globalData.optId = null;
	},
	// 重置一些预约的数据
	resetSomeData(){
		this.setData({
			isHide: false,
			'aptData.day': `${YY}-${MM}-${DD}`, //预约日期
			'aptData.moment': '', //时间段
			'aptData.code': '', //验证码
		});
		this.setCanntCheck([]);
		// 将预约的id清零
		app.globalData.optId = null;
	},
	// 选择预约日期
	bindDayChange(e) {
		// this.data.aptData.day = e.detail.value;
		this.setData({
			day: e.detail.value,
			'aptData.day': e.detail.value
		});
		this.data.aptData.moment = '';
		// 获取已被预约的
		this.ajax(this.data.url + 'appointment/day?field_id=' + this.data.aptData.field_id + '&day=' + this.data.aptData.day,
			this.getCanntTime);
		setTimeout(() => {
			this.checkCanApt();
		}, 100);
	},
	// 预约时间段
	checkboxChange(e) {
		this.data.aptData.moment = e.detail.value;
		this.setData({
			'aptData.moment': e.detail.value
		});
		if(e.detail.value&& e.detail.value.length>0){
			this.setCanUseNumber(e.detail.value.join(','));
		}else{
			this.setData({
				'onlyShowData.canUseNumber':''
			});
		}
	},
	// 设置最大可用资源数
	setCanUseNumber(str){
		let url = `${this.data.url}appointment/resource?field_id=${this.data.aptData.field_id}&day=${this.data.aptData.day}&community_id=${this.data.aptData.community_id}&str=${str}`;
		wx.request({
			url: url,
			method: 'get',
			success: (res) => {
				if (res.data.code == 0) {
					this.setData({
						'onlyShowData.canUseNumber':res.data.data
					});
					if(res.data.data==0){
						wx.showToast({
							title: '当前所选时间资源数为0，请换个时间段 ！！！',
							icon: 'none',
							duration: 2000
						});
					}
				}
			},
			fail: (res) => {
				console.log('失败:', res);
			}
		});
	},
	// 个人预约开关
	checkSingleChange(e) {
		var checkboxItems = this.data.checkSingleItem,
			values = e.detail.value,
			team = '';
		for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
			checkboxItems[i].checked = false;
			for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
				if (checkboxItems[i].value == values[j]) {
					checkboxItems[i].checked = true;
					break;
				}
			}
		}
		// 个人
		if (values.length > 0) {
			this.setData({
				checkSingleItem: checkboxItems,
				isSinglePeople: true,
				'aptData.team_id': '', // 设置团队id
				'aptData.username': app.globalData.personInfo.username, // 设置联系人
				'aptData.people_phone': this.data.aptData.phone // 设置联系方式
			});
		} else {
			// 团队
			if (!this.data.aptData.team_id) {
				team = this.data.team[0];
			} else {
				this.data.team.forEach((ele, idx) => {
					if (ele.id == this.data.aptData.team_id) {
						team = ele;
					}
				});
			}
			this.setData({
				checkSingleItem: checkboxItems,
				isSinglePeople: false,
				'aptData.team_id': team.id, // 设置团队id
				'aptData.username': team.people, // 设置联系人
				'aptData.people_phone': team.people_phone, // 设置联系方式
				'aptData.number': this.data.onlyShowData.fieldAllNumber	// 资源数
			});
		}
	},
	// 选择切换联系人
	checkboxChangePhone(e) {
		// console.log('checkbox发生change事件，携带value值为：', e.detail.value);
		if (this.data.aptData.people_phone) {
			let phone = '';
			// 不勾选 在预约信息中显示团队联系方式  -- 即显示自己的电话
			if (e.detail.value.length === 0) {
				phone = this.data.aptData.phone;
			} else {
				// 勾选 在预约信息中显示团队联系方式  -- 即显示队长的电话
				phone = this.data.aptData.people_phone;
			}
			this.data.aptData.people_phone = phone;
		} else {
			wx.showToast({
				title: '请先填写预约团队联系方式！！',
				icon: 'none',
				duration: 1000
			});
			return
		}

		var checkboxItems = this.data.checkboxItems,
			values = e.detail.value;
		for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
			checkboxItems[i].checked = false;

			for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
				if (checkboxItems[i].value == values[j]) {
					checkboxItems[i].checked = true;
					break;
				}
			}
		}

		this.setData({
			checkboxItems: checkboxItems
		});
	},
	/** 去掉空格值 */
	filterSpace(data){
		if(!data){
			return '';
		}else if(typeof(data)=='string'){
			return data.replace(/\s/g,'');
		}else if(typeof(data)=='object'){
			let dat = JSON.parse(JSON.stringify(data));
			if(Array.isArray(data)){
				dat.forEach(ele=>{
					if(typeof(ele)=='object'){
						return ele;
					}else{
						if(ele && typeof(ele)=='string'){
							return ele.replace(/\s/g,'');
						}
					}
				});
			}else{
				for(let i in dat){
					if(typeof(dat[i])=='object'){
						this.filterSpace(dat[i]);
					}else{
						if(dat[i] && typeof(dat[i])=='string'){
							dat[i] =dat[i].replace(/\s/g,'');
						}
					}
				}
			}
			return dat;
		}else{
			return data;
		}

	},
	
	
	/** 确定预约 */
	submitApt() {
		let canSubmit=true;
		let _this = this;
		this.data.aptData.field_id = this.data.aptData.field_id ? this.data.aptData.field_id : this.data.field[0].id;
		if (!this.data.uid) {
			app.getUserInfo();
			return false;
		}
		this.data.aptData = this.filterSpace(this.data.aptData);
		this.checkCanApt();
		// 资源数是否足够
		if(!this.data.onlyShowData.canUseNumber || this.data.onlyShowData.canUseNumber==0){
			wx.showToast({
				title: '当前资源数为0，请修改所选时间段 ！！！',
				icon: 'none',
				duration: 2000
			});
			return false;
		}else if(this.data.aptData.number>this.data.onlyShowData.canUseNumber){
			wx.showToast({
				title: '可用资源不足，请修改使用资源 ！！！',
				icon: 'none',
				duration: 2000
			});
			return false;
		}
		if (this.data.deviceType == 'iphone') {
			this.data.aptData.day = this.data.aptData.day.replace(/\-/g, '/');
		}

		if (Array.isArray(this.data.aptData.moment)) {
			//数组排序
			let momentTmp = this.sortarr(this.data.aptData.moment);
			//如果是连续的则保存时间段
			if (this.isContinuity(momentTmp) == 'no') {
				wx.showToast({
					title: '请选择连续的时间段 ！！！',
					icon: 'none',
					duration: 1000
				});
				return false;
			} else {
				this.data.aptData.moment = momentTmp.join(',');
				if(!this.checkRoles(this.data.aptData.moment,'moment')){
					return false;
				}
			}
		}
		// 校验输入的数据是否完整
		for(let ii in this.data.aptData){
			canSubmit = this.checkRoles(this.data.aptData[ii],ii);
			if(!canSubmit){
				return;
			}
		}
		if (new Date(this.data.aptData.day).getTime() + this.data.timeList[this.data.aptData.moment.split(',')[0] - 1].time
			.slice(0, 2) * 60 * 60 * 1000 - new Date().getTime() <= 3600000 * 0.5) {
			// if (new Date(this.data.aptData.day).getTime() < new Date().getTime()) {
			wx.showToast({
				title: '开始时间至少大于现在半个小时 ！！！',
				icon: 'none',
				duration: 1500
			});
			return false;
		}
		if (!this.data.isSinglePeople && !this.data.aptData.team_id) {
			wx.showToast({
				title: '请选择预约团队 ！！！',
				icon: 'none',
				duration: 1000
			});
			return false;
		}
		// 如果是个人预约，则设置联系人的电话，并将团队id置空
		if (this.data.isSinglePeople) {
			this.setData({
				'aptData.team_id': '',
			});
		}else{
			// 团队预约则使用全部的资源数
			this.setData({
				'aptData.number': this.data.onlyShowData.canUseNumber,
			});
		}
		this.data.aptData.uid = this.data.uid;
		wx.showModal({
			title: '预约',
			content: '您确定预约吗？',
			// showCancel: true,
			success: function(e) {
				if (e.confirm !== true) {
					return false;
				}
				let mhd = 'POST',
					url = _this.data.url + '/appointment';
				if (_this.data.aptData.id) {
					mhd = 'PUT';
					url = _this.data.url + '/appointment/' + _this.data.aptData.id;
					delete _this.data.aptData.id;
					delete _this.data.aptData.code;
				}
				wx.request({
					url: url,
					method: mhd,
					data: _this.data.aptData,
					success: (res) => {
						if (res.data.code == 0) {
							wx.showToast({
								title: '恭喜您预约成功',
								icon: 'success',
								duration: 1000
							});
							setTimeout(function() {
								// 清理部分数据
								_this.resetSomeData();
								_this.getAptList();
								// 转到当前预约详情
								_this.setData({
									sliderOffset: 0,
									activeIndex: '0'
								});
							}, 1500);
						} else {
							wx.showToast({
								title: res.data.status,
								icon: 'none',
								duration: 1000
							});
						}
					},
					fail: (res) => {
						console.log('预约失败:', res);
					}
				});
			}
		});
	},
	/** 获取已被预约的时间段,并设置可选时间段 **/
	getCanntTime(res) {
		if(res.data&&res.data.data){
// 			if (Array.isArray(res.data.data)&&res.data.data.length > 0) {
// 				this.setCanntCheck(res.data.data.split(','));
// 			}else 
			if(typeof(res.data.data)=='string'){
				this.setCanntCheck(res.data.data.split(','));
			} else {
				this.setCanntCheck([]);
			}
		}
	},
	/** 将已被预约的设置为不可选状态 **/
	setCanntCheck(arr) {
		let lis = this.data.timeList;
		for (let j = 0; j < lis.length; j++) {
			lis[j].checked = false;
			lis[j].disabled = false;
			for (let i = 0; i < arr.length; i++) {
				if (Number(arr[i]) == lis[j].id) {
					lis[j].disabled = true;
				}
			}
		}
		this.setData({
			timeList: lis
		});
	},
	/** ajax请求 */
	ajax(url, data, callback) {
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
				if (res) {
					if (callback) {
						return callback(res);
					}
				} else {
					alert('未找到结果：' + res);
				}
			},
			fail: (res) => {
				console.log('fail', res);
			}
		});
	},
	//验证码倒计时
	timeDown() {
		let index = --this.data.timer
		this.setData({
			timer: index,
			codeTitle: '(' + index + ')秒'
		});
	},
	/** 获取验证码 */
	getCode() {
		let _this = this;
		function codeDisabled(value){
			_this.setData({
				codeDisabled: value
			});
		}
		if (Number(app.globalData.personInfo.verify) == 1) {
			wx.showToast({
				title: '您暂时无法预约，请等待管理员审核通过您的注册信息 ！！！',
				icon: 'none',
				duration: 3000
			});
			return false;
		}
		codeDisabled(true);
		setTimeout(el=>{
			let username = _this.data.aptData.username,
				phone = _this.data.aptData.phone;
			if(!_this.checkRoles(username,'username')){
				codeDisabled(false);
				return false;
			}
			if(!_this.checkRoles(phone,'phone')){
				codeDisabled(false);
				return false;
			}
			_this.timeDown();
			wx.request({
				url: _this.data.url + 'code',
				method: 'POST',
				data: {
					phone: _this.data.aptData.phone
				},
				success: (res) => {
					if (res.statusCode == 200) {
						wx.showToast({
							title: '验证码发送成功！！！',
							icon: 'none',
							duration: 1000
						});
					}
				},
				fail: (res) => {
					console.log('fail', res);
				}
			});
			let timer = setInterval(function() {
				if (_this.data.timer > 0) {
					_this.timeDown()
				} else {
					_this.setData({
						timer: 45,
						codeTitle: '验证码',
						codeDisabled: false
					})
					clearInterval(timer)
				}
			}, 1000)
			
		},1000);

	},
	
	/** 更新输入的数据 **/
	update(e,target){
		let rule='',con='',check='';
		// 事件传入的对象
		if(e.target){
			rule=e.target.dataset['rule'];
			con = e.detail.value;
			check=true;
		}else{
		// 手动传入的
			rule=target;
			con = e;
			check=false;
		}
		switch(rule){
			case 'application':
				this.setData({'aptData.application':con}); 
			break;
			case 'username':
				this.setData({'aptData.username':con}); 
			break;
			case 'people_phone':
				this.setData({'aptData.people_phone':con});
			break;
			case 'phone':
				this.setData({'aptData.phone':con});
			break;
			case 'code':
				this.setData({'aptData.code':con});
			break;
			case 'use_number':
				this.setData({'aptData.useNumber':con});
			break;
		}
		if(check){
			return this.checkRoles(con,rule);
		}
	},
	
	/** 内容检测，自动不允许为空 **/
	checkRoles(con,name,rules){
		// {name: 'phone',tip:'请输入正确的手机号 ！！！',reg:'[1][2,3,4,5,7,8][0-9]{9}',required:true,cname='手机号',length:11}
		let info={};
		rules = rules?rules:this.data.rules;
		if(!name|| !rules){
			console.log('请传入验证的内容、规则名称');
			return '请传入验证的内容、规则名称';
		}
		rules.forEach(ele=>{
			 if(ele.name==name){
				 info.tip=ele.tip;
				 info.cname=ele.cname?ele.cname:'';
				 info.reg = ele.reg?new RegExp(ele.reg):'';
				 info.required=ele.required;
				 info.length=ele.length;
				 return;
			 }
		});
		if(info.required){
			if(!con){
				wx.showToast({
					title: info.cname?('请输入'+info.cname+' ！'):info.tip,
					icon: 'none',
					duration: 1000
				});
				return false;
			}
		}
		if(info.length && con && con.length!==Number(info.length)){
			wx.showToast({
				title: (info.cname?info.cname:'')+'长度应为：'+info.length+'位！',
				icon: 'none',
				duration: 1000
			});
			return false;
		}
		if(info.reg && !info.reg.test(con)){
			wx.showToast({
				title: info.tip,
				icon: 'none',
				duration: 1000
			});
			return false;
		}
		return true;
	},
	
	/** 冒泡排序 **/
	sortarr(arr) {
		if (arr.length == 1) {
			return arr;
		}
		for (let i = 0; i < arr.length - 1; i++) {
			for (let j = 0; j < arr.length - 1 - i; j++) {
				if (Number(arr[j]) > Number(arr[j + 1])) {
					var temp = Number(arr[j]);
					arr[j] = Number(arr[j + 1]);
					arr[j + 1] = temp;
				}
			}
		}
		return arr;
	},
	/** 判断是否连续 **/
	isContinuity(arr) {
		var res = 'yes';
		for (let j = 0; j < arr.length; j++) {
			if (arr[j + 1] - arr[j] > 1) {
				res = 'no';
			}
		}
		return res;
	},

	// 判断是否可预约
	checkCanApt() {
		wx.request({
			url: this.data.url + 'user/' + app.globalData.personInfo.id,
			success: res => {
				if (res.data.code == 0) {
					app.globalData.personInfo = res.data.data;
					if (Number(res.data.data.verify) == 1) {
						this.setCanntCheck([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
						wx.showToast({
							title: '您暂时无法预约，请等待管理员审核通过您的注册信息 ！！！',
							icon: 'none',
							duration: 3000
						});
					} else if (Number(res.data.data.verify) == 2) {

					}
				} else {
					/** 检测是否登录或认证了 **/
					app.globalData.checkIsLogin(app.globalData.personInfo.id);
				}
			}
		});
	},

	// 获取社区
	getCommunityList() {
		let _this = this;
		wx.request({
			url: this.data.url + '/community',
			success: (res) => {
				if (res.data.code == 0) {
					this.setData({
						communityList: res.data.data,
						community_name: res.data.data[0].community_name.substring(0, 2),
						'aptData.community_id': res.data.data[0].id,
						communityTeamList: res.data.data,
						community_team_name: res.data.data[0].community_name.substring(0, 2)
					});
				}
			},
			fail: (res) => {
				console.log('fail', res);
			}
		});
	},

	// 获取场地表
	getFieldList(community_id = '') {
		let _this = this;
		wx.request({
			// url: this.data.url + '/field',
			url: `${this.data.url}/field?community_id=${community_id}`,
			success: (res) => {
				if (res.data.code == 0) {
					let arr = [];
					_this.data.communityList.forEach((el, ids) => {
						let chd = [];
						res.data.data.forEach((ele, idx) => {
							if (ele.community_id == el.id) {
								chd.push(ele);
							}
						})
						arr.push({
							id: el.id,
							community_name: el.community_name,
							children: chd
						});
					});
					this.setData({
						field: res.data.data,
						isHide: false,
						communityList: arr,
						'aptData.field_id': res.data.data[0].id // 设置默认选中
					});
					if (!community_id) {
						this.setData({
							fieldAll: res.data.data,
							'aptData.field_id': res.data.data[0].id // 设置默认选中
						});
					}
				}
			},
			fail: (res) => {
				console.log('fail', res);
			}
		});
	},

	// 获取团队表
	getTeamList() {
		let _this = this;
		wx.request({
			url: this.data.url + '/team',
			success: (res) => {
				if (res.data.code == 0) {
					let arr = [];
					_this.data.communityTeamList.forEach((el, ids) => {
						let chd = [];
						res.data.data.forEach((ele, idx) => {
							if (ele.community_id == el.id) {
								chd.push(ele);
							}
						})
						arr.push({
							id: el.id,
							community_team_name: el.community_name,
							children: chd
						});
					});
					this.setData({
						team: res.data.data,
						isHide: false,
						communityTeamList: arr,
						'aptData.people_phone': res.data.data[0].people_phone
					});
				}
			},


			fail: (res) => {
				console.log('fail', res);
			}
		});
	},

	// 打开或关闭社区和场地选择
	openCloseCommunityPicker: function() {
		let pikerField = this.data.showCommunityPicker ? false : true;
		// let pikerTeam = this.data.showCommunityTeamPicker ? false : true;
		this.setData({
			showCommunityPicker: pikerField
			// showCommunityTeamPicker: pikerTeam
		});
	},
	// 打开或关闭社区和团队选择
	openCloseCommunityTeamPicker: function() {
		// let pikerField = this.data.showCommunityPicker ? false : true;
		let pikerTeam = this.data.showCommunityTeamPicker ? false : true;
		this.setData({
			// showCommunityPicker: pikerField,
			showCommunityTeamPicker: pikerTeam
		});
	},

	// 确定选择社区 - 选择面板的确定按钮
	sureCommunityPicker() {
		if (this.data.field.length == 0) {
			wx.showToast({
				title: '请选择场地 ！',
				icon: 'none',
				duration: 2000
			})
			return false;
		}
		this.setData({
			'aptData.community_id': this.data.communityList[this.data.communityIndex].id,
			'aptData.field_id': this.data.field[this.data.indexF].id,
			showCommunityPicker: false
		});
	},
	// 确定选择社区-团队 - 选择面板的确定按钮
	sureCommunityTeamPicker() {
		if (this.data.team.length == 0) {
			wx.showToast({
				title: '请选择团队 ！',
				icon: 'none',
				duration: 2000
			})
			return false;
		}
		this.setData({
			// 			'aptData.community_id': this.data.communityList[this.data.communityIndex].id,
			'aptData.team_id': this.data.team[this.data.indexT].id,
			showCommunityTeamPicker: false,
		});
	},

	// 选择社区和场地
	bindCommunityPickerChange(e) {
		// 在滚动社区 - 选择的默认的或者上次选择的社区
		if (e.detail.value[0] !== this.data.communityIndex) {
			this.setData({
				communityIndex: e.detail.value[0],
				community_name: this.data.communityList[e.detail.value[0]].community_name.substring(0, 2),
				field: this.data.communityList[e.detail.value[0]].children?this.data.communityList[e.detail.value[0]].children:[],
				'aptData.field_id': ''
			});
		} else {
			// 说明在选择场地
			this.setData({
				indexF: e.detail.value[1]
			});
		}
		if (this.data.field.length == 0) {
			wx.showToast({
				title: '当前社区无场地信息 ！',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		this.setData({
			// 'aptData.community_id': this.data.communityList[this.data.communityIndex].id,
			'aptData.field_id': this.data.field[this.data.indexF].id,
			'aptData.community_id': this.data.communityList[this.data.communityIndex].id,
			'aptData.moment': '',
			'onlyShowData.fieldAllNumber':this.data.field[this.data.indexF].number
		});
		// 
		let id = this.data.field[this.data.indexF].id;
		// 获取已被预约的
		this.ajax(this.data.url + 'appointment/day?field_id=' + this.data.aptData.field_id + '&day=' + this.data.aptData.day,
			this.getCanntTime);
		setTimeout(() => {
			this.checkCanApt();
		}, 100);
	},

	// 选择社区和团队
	bindCommunityTeamPickerChange(e) {
		// 在滚动社区 - 选择的默认的或者上次选择的社区
		if (e.detail.value[0] !== this.data.communityTeamIndex) {
			this.setData({
				communityTeamIndex: e.detail.value[0],
				community_team_name: this.data.communityList[e.detail.value[0]].community_name.substring(0, 2),
				team: this.data.communityTeamList[e.detail.value[0]].children,
				'aptData.team_id': ''
			});
		} else {
			// 说明在选择二级
			let name = this.data.team[e.detail.value[1]].teamname == '个人' ? '' : this.data.team[e.detail.value[1]].people;
			this.setData({
				indexT: e.detail.value[1],
				'aptData.username': name,
				'aptData.people_phone': this.data.team[e.detail.value[1]].people_phone,
				'team_info': this.data.team[e.detail.value[1]]
			});
		}
		if (this.data.team.length == 0) {
			wx.showToast({
				title: '当前社区无团队信息 ！',
				icon: 'none',
				duration: 1000
			})
			return false;
		}
		this.setData({
			// 'aptData.community_id': this.data.communityList[this.data.communityIndex].id,
			'aptData.team_id': this.data.team[this.data.indexT].id
		});

	},

	/***************************************************** 
	 * 当前预约情况的 
	 **************************************************** */
	// 获取预约列表
	getAptList() {
		let _this = this,time=new Date(new Date().getTime()-7*86400000);
		let YY = time.getFullYear(),
			MM = (time.getMonth() + 1)>9?(time.getMonth() + 1):'0'+(time.getMonth() + 1),
			DD = time.getDate()>9?time.getDate():'0'+time.getDate();
			
		wx.request({
			url: this.data.url + 'appointment?start_day='+(YY+'-'+MM+'-'+DD),
			success: (res) => {
				if (res.data.code == 0) {
					common.exchange(res.data.data.data);
					let data = res.data.data.data;
					let list = _this.data.fieldAll;
					for (var i = 0; i < data.length; i++) {
						if (data[i].is_show == 1) { // 已预约
							data[i].statusName = '已预约';
							data[i].customBtnStatuClass = 'success';
						} else if (data[i].is_show == 2) { //已取消
							data[i].statusName = '已取消';
							data[i].customBtnStatuClass = 'cancel';
						}
						// 已结束
						let aptTime = new Date(data[i].day.substr(0, 11) + data[i].moment.substr(0, 5) + ':00:000').getTime()
						if (aptTime - new Date().getTime() <= 0) {
							data[i].statusName = '已结束';
							data[i].customBtnStatuClass = 'end';
							data[i].is_show = 2;
						}
						data[i].fieldname = _this.returnCommunityName(data[i].field_id) + ' - ' + data[i].fieldname;
						// 如果团队名字无效  则显示个人
						if (!data[i].teamname) {
							data[i].teamname = '个人';
						}
						if(data[i].team_id){
							data[i].teamname = data[i].community_name?data[i].community_name+' - '+data[i].teamname:data[i].community_name;
						}
					}
					// common.exchange(res.data.data);
					this.setData({
						aptList: res.data.data.data
					});
				}
			},
			fail: (res) => {
				console.log('fail', res);
			}
		});
	},
	// 返回场地所在的社区
	returnCommunityName(id) {
		let list = this.data.fieldAll,
			name = '';
		list.forEach((ele, idx) => {
			if (ele.id == id) {
				name = ele.community_name;
			}
		});
		return name;
	},
	// 取消
	cancel(res) {
		wx.showModal({
			title: '取消',
			content: '您确定取消吗？',
			// showCancel: true,
			success: (e, d) => {
				if (e.confirm) {
					wx.request({
						url: this.data.url + '/appointment/' + res.detail.con.id,
						method: 'PUT',
						data: {
							is_show: 2
						},
						success: (res) => {
							// 获取预约列表
							this.getAptList();
							wx.showToast({
								title: '当前预约取消了 ！！！',
								icon: 'none',
								duration: 1000
							});
						},
						fail: (res) => {
							console.log('fail', res);
						}
					});
				}
			}
		});
	},
	/******************************************************** 
	 * 顶部tab切换的
	 *******************************************************  */
	tabClick: function(e) {
		this.setData({
			sliderOffset: e.currentTarget.offsetLeft,
			activeIndex: e.currentTarget.id
		});
		// 当前预约情况的
		if (e.currentTarget.id == '0') {
			this.getAptList();
		} else if (e.currentTarget.id == '1' && this.data.isSinglePeople) { // 我要预约的
			this.resetAllData();
			this.checkCanApt();
			this.setData({
				'aptData.username': app.globalData.personInfo.username, // 设置预约人姓名
				'aptData.people_phone': app.globalData.personInfo.phone, // 设置联系方式
				'aptData.phone': app.globalData.personInfo.phone // 设置预约电话
			});
			// 获取已被预约的
			this.ajax(this.data.url + 'appointment/day?field_id=' + this.data.aptData.field_id + '&day=' + this.data.aptData
				.day, this.getCanntTime);
		}
		if (!app.globalData.personInfo) {
			app.getUserInfo();
		}

	},
	/** 检测设备类型 **/
	checkDevice() {
		wx.getSystemInfo({
			success: res => {
				let type = /iPhone/.test(res.model) ? 'iphone' : 'android';
				this.setData({
					deviceType: type
				})
			}
		});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onLoad: function() {
		// 获取社区列表
		this.getCommunityList();
		// 获取场地列表
		this.getFieldList();
		// 获取团队列表
		this.getTeamList();
		setTimeout(() => {
			// 获取所有预约的列表
			this.getAptList();
		}, 300);
		let _this = this;
		setTimeout(() => {
			if (app.globalData.personInfo.id) {
				// setTimeout(() => {
				this.data.uid = app.globalData.personInfo.id;
				// 判断是否有预约的权限
				this.checkCanApt();
				// 判断是否为管理员 authority>1 为管理员
				if (Number(app.globalData.personInfo.authority) < 2) {
					this.setData({
						showBtn: false
					});
				} else {
					this.setData({
						showBtn: true
					});
				}
			} else {
				app.getUserInfo();
			}
		}, 1000);
		this.checkDevice();
	},
})
