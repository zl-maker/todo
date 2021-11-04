import Toast from '@vant/weapp/toast/toast';
const moment = require('moment')
const db = wx.cloud.database()
const todos = db.collection('todos')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task: {},
    deadline: '',
    time: 0,
    timeData: {},
    warningMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    todos.doc(options.id).field({
        time: false,
      }).get()
      .then(res => {
        let nowTime = new Date().getTime()
        this.setData({
          task: res.data,
          deadline: moment(res.data.deadline).format('YYYY-MM-DD HH:mm'),
          time: res.data.deadline - nowTime
        })
      })
    this.typewriter()
  },

  typewriter() {
      let title = "请注意倒计时哦";
      let that = this
      let i = 0;
      let type = setInterval(function () {
        let text = title.substring(0, i);
        i++;
        that.setData({
          warningMsg: text
        });
        if (text.length == title.length) {
          clearInterval(type);
        }
      }, 350)
  },

  onChange(event) {
    this.setData({
      timeData: event.detail,
    });
  },

  subscribeMsg() {
    const item = this.data.task
    const that = this

    if (!this.data.task.deadline) {
      Toast.fail('这个事项并没有截止日期')
      return
    }
    // 调用微信 API 申请发送订阅消息
    wx.requestSubscribeMessage({
      tmplIds: ['kGBn4Ncs8AAWU0WswJpXHUY_OvvLRDQw9B2X2Tty5o0'],
      success(res) {
        // 申请订阅成功
        if (res['kGBn4Ncs8AAWU0WswJpXHUY_OvvLRDQw9B2X2Tty5o0'] === 'accept') {
          // 这里将订阅的课程信息调用云函数存入db
          wx.cloud.callFunction({
              name: 'subscribeMsg',
              data: {
                ...item,
                data: {
                  thing5: {
                    value: "距离任务结束还有不到半小时啦"
                  },
                  thing1: {
                    value: item.title
                  },
                  thing4: {
                    value: item.content
                  },
                  phrase9: {
                    value: item.level
                  },
                  time10: {
                    value: that.data.deadline
                  },
                },
                templateId: 'kGBn4Ncs8AAWU0WswJpXHUY_OvvLRDQw9B2X2Tty5o0',
              },
            })
            .then(() => {
              Toast.success('订阅成功')
            })
            .catch(() => {
              Toast.fail('订阅失败')
            })
        } else {
          Toast.fail('订阅失败')
        }
      },
      fail(err) {
        Toast.fail(`错误代码:${err.errCode}`)
      }
    });
  },

  unsubscribeMsg() {
    // 获取课程信息
    const item = this.data.task
    const templateId = 'kGBn4Ncs8AAWU0WswJpXHUY_OvvLRDQw9B2X2Tty5o0'

    if (!this.data.task.deadline) {
      Toast.fail('这个事项并没有截止日期')
      return
    }
    // 这里将订阅的课程信息调用云函数存入db
    wx.cloud
      .callFunction({
        name: 'unsubscribeMsg',
        data: {
          id: item._id,
          templateId
        },
      })
      .then(() => {
        wx.showToast({
          title: '取消订阅成功',
          icon: 'success',
          duration: 2000,
        });
      })
      .catch(() => {
        wx.showToast({
          title: '取消订阅失败',
          icon: 'success',
          duration: 2000,
        });
      });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})