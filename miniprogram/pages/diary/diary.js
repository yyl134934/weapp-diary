import { getRecentDailyData, createDailyData } from "../../apis/diary-api";
import { getToday } from "@/utils/day.js";
import templates from "./template.config.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dailyData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      create_date: createDate = "",
      daily_data: dailyData = [],
    } = getRecentDailyData();
    // 新用户
    if (!createDate) {
      wx.showToast({
        title: "欢迎使用~",
      });
      const temp = templates["default"];
      createDailyData(temp);
      this.setData({ dailyData: temp });
      return;
    }
    // 当天第2+次登录
    if (createDate === getToday()) {
      this.setData({ dailyData });
      return;
    }
    // 非今日数据，询问是否需要进行更改
    wx.showModal({
      title: "积分结算",
      content: "昨日数据尚未结算，是否进行结算？",
      complete: (res) => {
        if (res.cancel) {
          this.setData({ dailyData });
        }

        if (res.confirm) {
          //TODO 走结算流程
          wx.showToast({
            title: "结算完成~",
          });
          //初始化当日数据
          const temp = templates["default"];
          createDailyData(temp);
          this.setData({ dailyData: temp });
        }
      },
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
