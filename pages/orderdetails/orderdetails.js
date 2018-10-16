// pages/orderdetails/orderdetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:"",
    storageopenuser_id:'',
    storageopentoken:'',
    orders:'',
    worker:'',
    kong:false,
    orderdetails:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var datas = that.datas
    var access_token = that.data.storageopentoken 
    // 订单详情 
    wx.getStorage({
      key: 'user_access_token',
      success: function (res) {
        console.log(808080)
        console.log(res)
        that.setData({
          //
          storageopentoken: res.data
        })
        console.log(909090)              
        console.log(that.data.storageopentoken)
      }
    })


    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          storageopenuser_id: res.data
        })
        console.log(that.data.storageopenuser_id)
        wx.request({
          url: getApp().globalData.url + "/api/order/index",
          method: 'GET',
          data:{
            user_id: that.data.storageopenuser_id
          },
          header: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + that.data.storageopentoken
          },
          fail:function(res){
            console.log("hahah")
            console.log(res)
          },
          success: function (res) {
            console.log("lalalalal")
            console.log(res.data.data)
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].worker == null) {
                res.data.data[i].worker ='公司暂未分配'
                that.setData({
                  datas: res.data.data
                })
              } else {
                that.setData({
                  datas: res.data.data
                })
              }
            };            
            if (res.data.data == undefined || res.data.data.length === 0){
              that.setData({
                kong: true
              })
            }else{
              that.setData({
                kong: false
              })
            }      
            console.log(that.data.datas)
          }
        })
      }

    })

   
   //顶部标题
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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