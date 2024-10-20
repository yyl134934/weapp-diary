import { getToday } from "@/utils/day";

const DIARY_DATA = "diary_data";

function getRecentDailyData() {
  try {
    const data = wx.getStorageSync(DIARY_DATA) || [];
    return data.pop() || {};
  } catch (error) {
    console.error("获取日记数据失败：", error);
    return {};
  }
}
function getDailyData(dateStr = "19491001") {
  try {
    const dailyData = wx.getStorageSync(DIARY_DATA) || [];
    return dailyData.find((item) => dateStr === item.create_date) || {};
  } catch (error) {
    console.error("获取日记数据失败：", error);
    return {};
  }
}
function getAllDailyData() {
  try {
    return wx.getStorageSync(DIARY_DATA) || [];
  } catch (error) {
    console.error("获取日记数据失败：", error);
    return {};
  }
}
function createDailyData(data) {
  const todayStr = getToday();

  try {
    const allData = wx.getStorageSync(DIARY_DATA);
    wx.setStorageSync(DIARY_DATA, [
      ...allData,
      {
        create_date: todayStr,
        daily_data: data,
      },
    ]);
    return true;
  } catch (error) {
    console.error("创建日记数据失败：", error);
    return false;
  }
}
function updateDailyData(id, task = {}, type = "") {
  const recentData = getRecentDailyData();
  const { daily_data: dailyData } = recentData;

  const newData = dailyData?.map((item) => {
    return {
      ...item,
      [type]: item[type]?.id === id ? { id, data: task } : item[type],
    };
  });

  try {
    const allData = getAllDailyData();
    allData.pop();
    allData.push({ ...recentData, daily_data: newData });
    wx.setStorageSync(DIARY_DATA, allData);
    return true;
  } catch (error) {
    console.error("更新任务数据成功：", error);
    return false;
  }
}

export {
  createDailyData,
  getAllDailyData,
  getDailyData,
  getRecentDailyData,
  updateDailyData,
};
