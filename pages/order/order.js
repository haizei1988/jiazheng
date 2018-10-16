var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:false,
    send: true,
    alreadySend: false,
    username:"请输入姓名",
    userphone:"填写联系人电话号码",
    date: '2018-01-01',
    time: '00:00',
    second: 60,
    index: 0,
    region: ['四川省', '成都市', '金牛区'],
    array: ['青羊区', '锦江区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', 
      '温江区', '双流县', '郫县', '金堂县', '大邑县', '蒲江县', '新津县', '都江堰市', '崇州市', '邛崃市','彭州市'],
    index: 0,
    multiArray: [['上午', '下午'], ['8:00', '14:00']],
    arraytime: ['上午 8:00', '下午 14:00'],
    index1: 0,
    focus: false,
    dd:"",
    inputValue:"",
    storageopentoken:"",
    item_id: "", 
    cate_id:"",
    afterTomorrow: '',
    numbers: '18111661369',
    details:[],
    okorder:[],
    moneyorder:[],
    multiIndex: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this    
    that.setData({
      cate_id: options.cate_id ,
      item_id: options.item_id,           
    })
    var time = this.getAffterTomoorow(2)
    that.setData({
      afterTomorrow: time
    })
    // 是否输入
    //   wx.getStorage({
    //     key: 'username',
    //     success: function (res) {
    //       console.log(808080)
    //       console.log(res)
    //       that.setData({
    //         username: res.data
    //       })
    //     }
    // })
    // wx.getStorage({
    //   key: 'userphone',
    //   success: function (res) {
    //     console.log(808080)
    //     console.log(res)
    //     that.setData({
    //       userphone: res.data
    //     })
    //   }
    // })
   //获取信息
      console.log(that.data.cate_id)
      console.log(that.data.item_id)
      wx.request({
        url: getApp().globalData.url + "/api/categoryitem",
        method: 'GET',
        data: {
          cate_id: that.data.cate_id,
          item_id: that.data.item_id,
        },
        header: {
          'Content-Type': 'application/json',
        },
        success: function (res) {
          var markdown = res.data.data.item_desc
          WxParse.wxParse('markdown', 'md', markdown, that, 5);
          that.setData({
            details: res.data.data,            
          }),
            console.log(that.data.details)
         
        }
      })
   
    wx.setNavigationBarTitle({
      title: '下单预约',
    })
    // console.log(this.data.tip)
  },
  getAffterTomoorow: function (i) {
    var date = new Date()
    date.setDate(date.getDate() + i)
    var y = date.getFullYear();
    var m = date.getMonth() + 1;//获取当前月份的日期
    var d = date.getDate();
    return y + "-" + m + "-" + d;
  },
  // 点击时间组件确定事件 
  bindTimeChange: function (e) {
    console.log('pickertime发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
    console.log(this.data.arraytime[this.data.index1])
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['8:00'];
            break;
          case 1:
            data.multiArray[1] = ['14:00'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  // 点击日期组件确定事件 
  bindDateChange: function (e) {
    this.setData({
      afterTomorrow: e.detail.value
    })
  },
  // 点击省市组件确定事件 
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获取s手机号
  bindKeyInput:function(e){
    var that=this
    that.setData({
      inputValue: e.detail.value
    })
    console.log(that.data.inputValue)
  },
  //获取验证码
  getcode:function(){
    var that = this
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(that.data.inputValue))) {
      wx.showToast({
        title: '请正确输入号码',
        icon: "none"
      })
      return
    }
    that.timer()
 
  // 读取数据
    wx.getStorage({
      key: 'user_access_token',
      success: function (res) {
        console.log(808080)
        console.log(res)
        that.setData({
          storageopentoken: res.data
        })
      
        var access_token = that.data.storageopentoken
        console.log(access_token)
        wx.request({
          url: getApp().globalData.url + "/api/laravel-sms/verify-code",
          method: 'POST',
          data: {
            mobile: that.data.inputValue,
          },
          header: {
            'Accept': 'application/json',
            'Authorization':'Bearer '+access_token
          },
          success: function (res) {
           console.log(res)
           if (res.data.success==false){
             wx.showToast({
               title: '短信验证码发送失败，请稍后重试',
               icon: "none"
             })
             that.setData({
               alreadySend: false,
               send: true
             })  
             return
           }else{
             wx.showToast({
               title: '短信验证码发送成功，请注意查收',
               icon: "none"
             })
           }
           }
          
        })
      }
    }) 
    console.log(that.data.inputValue)
    that.setData({
      alreadySend: true,
      send: false
    })    
  },
 
  // 提交订单
  formSubmit: function (e) { 
    var that=this
    console.log("hahahh")
    console.log(e.detail.formId)
    var access_token = that.data.storageopentoken
    console.log(access_token)
    var username = e.detail.value.username;
    var userphone = e.detail.value.userphone;
    var yanzheng = e.detail.value.yanzheng;
    var xiangxi = e.detail.value.textarea
    that.setData({
      dd:that.data.details.money
    })
    if (username == '' || username.length == 0) {
      wx.showToast({
        title: '请输入姓名',
        icon: "none"
      })
      that.setData({
        username: '请输入姓名'
      })
      return
    } else {
      // wx.setStorageSync('username', username)
    }
    if (userphone == '' || userphone.length == 0) {
      wx.showToast({
        title: '请输入联系人电话号码',
        icon: "none"
      })
      that.setData({
        userphone: '填写联系人电话号码'
      })
      return
    }else{
      // wx.setStorageSync('userphone', userphone)
    }
    if (yanzheng == '' || yanzheng.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
      return
    }
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        that.setData({
          storageopenuser_id: res.data
        })
        console.log(that.data.storageopenuser_id)
         //提交信息
      wx.request({
        url: getApp().globalData.url +'/api/order/create',
        method:'GET',
        data: {
          user_id: that.data.storageopenuser_id,
          user_name: username,
          type: that.data.item_id,
          order_time: that.data.date +' '+  that.data.arraytime[that.data.index1] ,
          mobile: userphone,
          verifyCode: yanzheng,
          address: that.data.region + xiangxi,
          money: that.data.dd
          // money: 0.01
        },
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token

        },
        success: function (res) {
          console.log("chenggong")
          console.log(res.data)                
          console.log(that.data.storageopenuser_id)
          var ordernum = res.data.order_num
          if (typeof (res.data.error)!== "undefined") {
            if (typeof (res.data.error.verifyCode) !== "undefined"){
              wx.showToast({
                title: '请检查验证码',
                icon: "none"
              })
            }
           
            return
          }else{
            wx.showToast({
              title: '请稍等',
              icon: "loading"
            })
            wx.request({
              url: getApp().globalData.url + '/api/order/pay',
              method: 'GET',
              data: {
                user_id: that.data.storageopenuser_id,
                order_num: res.data.order_num
              },
              header: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
              },
              success: function (res) {             
                console.log("提交")
                console.log(res)
                var preapyid = res.data.data.preapy_id
                wx.requestPayment({
                  'timeStamp': String(res.data.data.timeStamp),
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    console.log("zhifuchengg")
                    console.log(preapyid)
                    console.log(ordernum)
                    wx.request({
                      url: getApp().globalData.url + '/api/order/message',
                      method: "GET",
                      data: {
                        form_id: preapyid,
                        order_num: ordernum
                      },
                      header: {
                        //'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + access_token
                      },
                      success: function (res) {
                        console.log(res)
                      }
                    })
                    wx.navigateTo({
                      url: "/pages/orderdetails/orderdetails"
                    })
                  },
                  'fail': function (res) {
                    console.log("shibai")
                    console.log(res)
                  },
                })
              }
            })
          }    
        }
      })
      }
    })   
  },
  //倒计时
  timer: function () {
    var  that=this
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          that.setData({
            second: that.data.second - 1
          })
          if (that.data.second <= 0) {
            clearInterval(setTimer)
            that.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            // resolve(setTimer)
          }
        }
        , 1000)     
    })
  },
  // timer: function (options) {
  //   var that = this;
  //   var currentTime = that.data.currentTime
  //   interval = setInterval(function () {
  //     currentTime--;
  //     that.setData({
  //       time: currentTime + '秒'
  //     })
  //     if (currentTime <= 0) {
  //       clearInterval(interval)
  //       that.setData({
  //         time: '重新发送',
  //         currentTime: 61,
  //         disabled: false
  //       })
  //     }
  //   }, 100)
  // },
  //拨打电话
  phone:function(){
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.numbers
    })
  },
  
})
  