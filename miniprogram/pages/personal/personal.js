import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
const db = wx.cloud.database()
const _ = db.command
const todos = db.collection('todos')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeBar: 'personal',
    count: '0'
  },

  async getTasksCount() {
    let openid = wx.getStorageSync('openid')
    if (!openid) {
      await wx.cloud.callFunction({
        name: 'getOpenid'
      }).then((res) => {
      wx.setStorageSync('openid', res.result.openid)
      }).then(() => {
        this.setData({
          openid: wx.getStorageSync('openid')
        })
      })
    } else {
      this.setData({
        openid
      })
    }

    todos.where({
      _openid: this.data.openid
    })
    .count()
    .then((res) => {
      this.setData({
        count: res.total
      })
    })
  },

  getUserProfile() {
    if (!this.data.userInfo) {
      wx.getUserProfile({
        desc: '获取用户基本信息',
        success: (res) => {
          wx.setStorage({
            key: 'userInfo',
            data: res.userInfo
          }).then(() => {
            Toast.success('成功登录')
          }).then( () => {
            let userInfo = wx.getStorageSync('userInfo')
            this.setData({
              userInfo
            })
          }).catch(() => {
            Toast.fail('登录失败')
          })
        },
        fail: () => {
          Toast.fail('登录失败')
        }
      })
    } else {
      return
    }
    
  },


  onChange(event) {
    wx.redirectTo({
      url: `../${event.detail}/${event.detail}`,
    })
  },

  showAuthorWX() {
    Dialog({
      title: '请备注来意哦',
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
    this.getTasksCount()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '快来试试这个todo吧!',
      path: '/miniprogram/pages/index/index',
      imageUrl: 'https://ftp.bmp.ovh/imgs/2021/10/9603399be3dea6dc.jpeg'
    }
  }
})