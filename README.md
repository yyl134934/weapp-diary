# weapp-diary

## 功能模块设计

- 积分足迹（默认展示）：主要展示自己设定的奖励、规则以及积分打卡记录。
  - 每天统计日常任务完成情况，并且计算获得积分的情况
  - 计分规则：正向主导加分，负面主导减分
  - [ ] 额外积分：连续 n 天（天数可以自己设置）完成所有任务，获得额外积分
  - [ ] 自动记分：根据格子任务中的任务完成情况，自动计算得分情况
- 格子日记：主要是做日常的规划，例如某某时间段做什么事情，最后的完成情况怎么样，分析原因、教训、应对措施。
  - 任务列表：点击新增任务时，跳转到任务列表界面。
    - 输入框中可输入想要规划的任务，点击输入框右侧的【添加】按钮，将任务添加到任务列表中。
      - [x] 添加操作完成后，清除输入框内容。
    - 输入框输入内容时，同时会触发任务列表的搜索功能。
    - 点击任务项右侧的【+】号，可以将任务添加到日常规划中。同时【+】变为【-】，点击【-】可以将任务移出日常规划。
    - 如果任务项被添加到日常规划中，将置顶显示。
      - [ ] 其它未在规划中的任务，将按照日期排布。
      - [ ] 添加使用频率字段，任务每被添加一次，权重就+1，权重越高的排序越靠前。
    - 输入框失去焦点时，保存内容。
    - [ ] 任务列表删除任务项
      - [ ] 如果在当日某计划中的任务被删除，则展示时任务项进入幽灵状态
        - [ ] 文字颜色变浅（有区分）。
        - [ ] 不可删除幽灵任务，也不可添加计划当中。
      - [x] 点击右上角管理按钮，进入管理状态，按钮变为删除功能。
        - [x] 删除按钮右侧统计删除的数量。
        - [x] checkbox 在删除状态时显示，退出时隐藏。
        - [x] 在删除状态，隐藏加入退出计划按钮。
    - [ ] 自动任务
      - 任务列表中的任务可以分为自动任务和手动任务。自动任务是指每天会自动添加到你的日记任务中，不需要手动操作。反之，手动任务则需要手动添加。
    - [ ] 任务列表 UI
    - 任务完成：勾选任务项 checkbox 视为任务完成。
    - 日常总结：内容字数暂时无限制。
    - [ ] 模版选择功能
    - [ ] 自定义模版功能
- 积分商城：可自行添加商品，设定兑换积分以及查看兑换历史。
  - [ ] 添加商品：点击右上角的【+】跳转到添加商品界面。输入商品名称、价格、描述、图表，点击添加按钮可以添加对应商品。
  - [ ] 兑换历史：展示积分商品兑换历史。

## 数据结构设计

程序设计为单机应用，所有的数据都存储在 LocalStorage 里。

### 足迹

```javascript
const footmark_data=[{
  id: "1";
  date:"1" || "20240808",
  clockInDate:"20240808",
  points: 2,
}]
```

### 日记

```javascript
const task = {
  id: "1723567978053",
  areaId: phasedTasks.id,
  content: "任务描述",
  done: false,
  auto: false,
  selected:false
};
const task_list= [task1,...,tastn];
const dairy_data=[{createDate:"20240815", phasedTasks:[...phasedTasks]}]
const phased_tasks={
    id:"1723567978433",
    type: "tasks" | "summary",
    timePeriod: ['8','9'] | "复盘",
    primaryTasks: {id:"pt1",data:[task1,...,tastn]},
    secondaryTasks: {id:"st1",data:[task1,...,tastn]},
    taskOfCompleteness:{id:"tc1",data:"任务完成情况的描述"},
    summary:{id:"s1",data:"任务总结及其应对措施"},
    total: 4,
    index: 0,
}
```

## 接口设计
