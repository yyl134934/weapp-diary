import { updateDailyData } from "../../../apis/diary-api";

const DEFAULT_TYPE = "primary";
const types = {
  primary: { title: "主要任务", style: "primary", key: "primaryTasks" },
  secondary: { title: "次要任务", style: "secondary", key: "secondaryTasks" },
  completeness: {
    placeholder: "任务完成情况",
    style: "completeness",
    key: "taskOfCompleteness",
  },
  summary: {
    placeholder: "分析原因、教训、应对措施",
    style: "summary",
    key: "summary",
  },
};

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tasks: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: 0,
    },
    type: {
      type: String,
      value: DEFAULT_TYPE,
    },
    time: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: "",
    style: "",
    hasTask: "",
    list: [],
    summaryContent: "",
  },

  observers: {
    type: function (type) {
      this.setData({ ...types[type] });
    },
    tasks: function (tasks) {
      this.setData({ list: tasks?.data });
    },
    list: function (list) {
      this.setData({ hasTask: list?.length !== 0 });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 添加任务：跳转到【任务列表】界面，并接收来自任务列表的数据。
     * @param {*} e
     */
    handleAddTask: function (e) {
      const { list } = this.data;
      const { title, time } = this.properties;

      wx.navigateTo({
        url: "../../pages/task-list/task-list",
        success: function (res) {
          res.eventChannel.emit("updateThePlan", {
            tasks: list,
            title,
            time,
          });
        },
        events: {
          updateThePlan: (data) => {
            const {
              tasks: { id },
              type,
            } = this.properties;
            const { list } = this.data;

            const index = list.findIndex((item) => item.id === data.task?.id);

            if (index === -1) {
              updateDailyData(id, [...list, data.task], types[type]?.key);
              this.setData({ list: [...list, data.task] });
              return;
            }

            const updatedList = list.reduce((prev, item) => {
              if (item.id !== data.task?.id) {
                return prev.concat(item);
              }
              if (data.task?.selected) {
                return prev.concat(item);
              }
              return prev;
            }, []);
            updateDailyData(id, updatedList, types[type]?.key);
            this.setData({ list: updatedList });
          },
        },
      });
    },
    /**
     * 完成任务：勾选任务项，视为完成任务。
     * @param {*} e
     */
    handleModifyTaskStatus: function (e) {
      // 获取更新数据项
      const { task: currentTask } = e.currentTarget.dataset || {};
      // 修改【!done】
      currentTask.done = !currentTask.done;
      // 替换全局【tasks】列表对应项
      const updatedList = this.data.list.map((item) =>
        item.id === currentTask?.id ? { ...item, ...currentTask } : item
      );
      // 调用api接口写入storage持久化
      const {
        tasks: { id },
        type,
      } = this.properties;

      updateDailyData(id, updatedList, types[type]?.key);
      wx.showToast({
        title: "更新任务状态",
      });
      this.setData({ list: updatedList });
    },
    /**
     * 写复盘总结：输入框失焦时或组件销毁时持久化保存。
     * @param {*} e
     */
    handleModifySummary: function (e) {
      const { value } = e.detail;
      const {
        tasks: { id },
        type,
      } = this.properties;

      updateDailyData(id, value, types[type]?.key);
      this.setData({ list: value });
    },
  },
});
