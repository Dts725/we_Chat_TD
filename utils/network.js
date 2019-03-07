var requestHandler = {
  url: '',
  data: {},
  method: '',
  success: function (res) {
  },
  fail: function () {
  },
  complete: function () {
  }
}

function request(requestHandler) {
  var data = requestHandler.data;
  var url = requestHandler.url;
  var method = requestHandler.method;
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: url,
    data: data,
    method: method,
    success: function (res) {
      wx.hideLoading();
      requestHandler.success(res)
    },
    fail: function () {
      wx.hideLoading();
      requestHandler.fail();
    },
    complete: function () {

    }
  })
}

module.exports = {
  request: request
}

/** 
 * 在需要用到的js文件用require引入即可,之后你要向服务器请求数据只要
 * network.request({
  url:'',
  data:{}
  success:function(){

  }
})
 */