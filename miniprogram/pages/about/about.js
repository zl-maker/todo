import Notify from '@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showGithub: false,
    showGitee: false
  },

  onClose() {
    this.setData({ 
      showGithub: false,
      showGitee: false
    });
  },

  toGithub() {
    this.setData({
      showGithub: true
    })
  },

  toGitee() {
    this.setData({
      showGitee: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})