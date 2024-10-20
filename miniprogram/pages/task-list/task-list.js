import {
  loadTaskList,
  addTask,
  getTaskList,
  deleteTask,
} from "@/apis/task-list-api.js";
import _ from "lodash";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    alternateList: [],
    iTaskContent: "",
    planId: "",
    isMngStatus: false,
    selectedSum: 0,
    removeList: [],
    title: "",
    onSearch: () => {},
  },
  _sort(list = [], plans = []) {
    list
      .sort((a, b) => {
        //创建日期（日期越老越靠前）
        return a.createDate - b.createDate;
      })
      .sort((a, b) => {
        //添加频率(越高越靠前)
        return b.weight - a.weight;
      })
      .sort((a, b) => {
        //是否在计划内
        if ((b.selected && a.selected) || !(b.selected || a.selected)) {
          return 0;
        } else if (a.selected) {
          return -1;
        } else {
          return 1;
        }
      });

    if (plans.length === 0) {
      return list;
    }

    //是否在列表
    return list?.reduce((prev, item) => {
      const isIncludes = plans?.some((selected) => selected.id === item.id);
      return isIncludes
        ? [{ ...item, selected: true }, ...prev]
        : [...prev, item];
    }, []);
  },
  _onPlan(list) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel?.on("updateThePlan", (data) => {
      const { tasks: selectedTasks, title, time } = data;
      const updatedList = this._sort(list, selectedTasks);
      this.setData({
        taskList: updatedList,
        alternateList: updatedList,
        title,
        time,
      });
    });
  },
  _updatePlan(task) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit("updateThePlan", { task });
  },
  _upateList(taskContent) {
    const list = getTaskList(taskContent);
    const updatedList = list?.reduce((prev, item) => {
      const isIncludes = this.data.alternateList?.some(
        (selected) => selected.id === item.id && selected.selected
      );
      return isIncludes
        ? [{ ...item, selected: true }, ...prev]
        : [...prev, item];
    }, []);
    this.setData({
      taskList: updatedList,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const list = loadTaskList();
    this._onPlan(list);
    this.setData({
      onSearch: _.debounce(this._upateList, 250),
    });
  },
  /**
   * 添加或移出计划
   * @param {*} e
   */
  handleModifyList(e) {
    const {
      currentTarget: {
        dataset: { task },
      },
    } = e;
    const { taskList, alternateList } = this.data;
    const updatedList = taskList?.map((item) => {
      return item.id === task.id
        ? { ...item, selected: !item?.selected, weight: item?.weight + 1 }
        : item;
    });
    this._sort(updatedList);

    const updatedAltList = alternateList?.map((item) => {
      return item.id === task.id
        ? { ...item, selected: !item?.selected, weight: item?.weight + 1 }
        : item;
    });
    this._sort(updatedAltList);

    this._updatePlan({ ...task, selected: !task?.selected });
    this.setData({ taskList: updatedList, alternateList: updatedAltList });
  },
  handleAddTask(e) {
    const { value = "" } = e.detail;
    if (value === "") {
      return;
    }
    function createTask(content = "") {
      const newTask = {
        id: new Date().getTime(),
        content: content,
        done: false,
        auto: false,
        selected: false,
        weight: 1,
        createDate: new Date().getTime(),
      };

      return newTask;
    }
    const newTask = createTask(value);
    addTask(newTask);
    this.setData({
      taskList: this.data.alternateList.concat(newTask),
      alternateList: this.data.alternateList.concat(newTask),
      iTaskContent: "",
    });
  },
  handleSearch(e) {
    const { value: taskContent = "" } = e.detail;

    this.data.onSearch(taskContent);
  },
  handleManage(e) {
    this.setData({ isMngStatus: true });
  },
  /**
   * 1.删除勾选任务；2.退出管理状态。
   * @param {*} e
   */
  handleRemoveTask(e) {
    const { alternateList, removeList } = this.data;
    const remain = alternateList.filter(
      (item) => !removeList.includes(`${item.id}`)
    );
    deleteTask(remain);
    this.setData({
      isMngStatus: false,
      selectedSum: 0,
      removeList: [],
      taskList: remain,
      alternateList: remain,
    });
  },
  /**
   * 选中任务项触发，统计需要删除的任务项。
   * @param {*} e
   */
  handleSelectTask(e) {
    const { value: selectedList = [] } = e.detail;

    this.setData({
      selectedSum: selectedList.length,
      removeList: selectedList,
    });
  },
  onUnload() {
    const ec = this.getOpenerEventChannel();
    ec.off("updateThePlan");
  },
});
