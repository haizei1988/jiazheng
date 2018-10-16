// pages/index2/index2.js
Page({
  data: {
    imgUrls: [],
    type1:[],
    smalltype:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    nickName:"",
    storageid:'',
    baseurl: getApp().globalData.url+'/uploads/'
  },
  // 点击显示
  blocking: function (e) {
    var that=this
    var id = e.target.id;
    var index = e.currentTarget.dataset.num;
    var hidething = 'type1[' + index + '].hide'
    if(that.data.type1[index].hide){
      this.setData({
        [hidething]: false
      })
    }else{
      this.setData({
        [hidething]: true
      })
    }
  },
 /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
     var that = this;
     var imgUrls = that.imgUrls
      //获取用户信息
     wx.getUserInfo({
       success: function (res) {
         var userInfo = res.userInfo;        
         console.log(userInfo)
         that.setData({
           nickName: userInfo.nickName,
           gender: userInfo.gender,
         })
       },
     }),
    
     // 登录
     wx.login({     
       success: res => {
         var code=res.code       
        //  wx.setStorageSync("code", code)
         wx.request({
           url: getApp().globalData.url + "/api/code",
           method:'GET',
           data: { code: code },
           header: {
             'Content-Type': 'application/json'
           },
           success: function (res) {           
             wx.setStorageSync('openid',res.data.openid)
             wx.setStorageSync('session_key', res.data.session_key)
             var key = wx.getStorageSync('session_key');
             var openid = wx.getStorageSync('openid');
             if(res.data.openid){
               wx.request({
                 url: getApp().globalData.url + '/api/login',
                 method: 'GET',
                 data: { name: that.data.nickName, openid: openid, gender: that.data.gender },
                 header: { 'Content-Type': 'application/json' },
                 success: function (res) {
                   console.log(1212121)
                   console.log(res.data[1])
                   wx.setStorageSync('user_access_token', res.data[1])
                   wx.setStorageSync('user_id', res.data.user_id)
                 }
               })
             }
           }
         })

       }
     }),
    
     // 首页轮播 
     wx.request({
       url: getApp().globalData.url +"/api/slide",
       method:'GET',
       header: {
         'Content-Type': 'application/json',
          
       },
       success: function (res) {           
         that.setData({
           imgUrls: res.data.pic
         })   
       }
     })
     
     // 首页分类 
     wx.request({
       url: getApp().globalData.url +"/api/category",
       method: 'GET',
       header: {
         'Content-Type': 'application/json'
       },
       success: function (res) {
         for (var i = 0; i < res.data.data.length;i++){
           res.data.data[i].hide=true
         };      
         that.setData({
           type1: res.data.data,
         })       
       }
     })
    //顶部标题
     wx.setNavigationBarTitle({
       title: '首页',
     })
   },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})