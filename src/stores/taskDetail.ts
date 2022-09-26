import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "../http/api";

interface subTasksItem {
  detailid: string;
  detailtitle: string;
  detaildesc: string;
  detaildpath: string;
  note: string;
}
export const useDetailStore = defineStore("detail", {
  state: () => ({
    taskItems: [
      { name: "任务标题", itemname: "title", value: "" },
      { name: "任务等级", itemname: "level", value: "" },
      { name: "站点名称", itemname: "site", value: "" },
      { name: "指派给", itemname: "duty", value: "" },
      { name: "起始时间", itemname: "starttime", value: "" },
      { name: "结束时间", itemname: "endtime", value: "" },
      { name: "提醒时间", itemname: "remindtime", value: "" },
      { name: "任务描述", itemname: "desc", value: "", label: "哈哈哈" },
    ],
    locationName: "",
    subTasks: [] as subTasksItem[],
    images: [],
    startIndex: 0,
  }),
  actions: {
    async getDetailById(id: string) {
      const { data, code } = await api.task.getTaskDetail({ taskid: id });
      if (+code === 0) {
        this.taskItems = [
          { name: "任务标题", itemname: "title", value: data.title },
          {
            name: "任务等级",
            itemname: "level",
            value: data.level === 0 ? "紧急任务" : "普通任务",
          },
          { name: "站点名称", itemname: "site", value: data.site },
          { name: "指派给", itemname: "duty", value: data.duty },
          { name: "起始时间", itemname: "starttime", value: data.starttime },
          { name: "结束时间", itemname: "endtime", value: data.endtime },
          { name: "提醒时间", itemname: "remindtime", value: data.remindtime },
          { name: "任务描述", itemname: "desc", value: "", label: data.desc },
        ];
        this.locationName = data.location;
        this.subTasks = data.details;
        this.images = data.details.map(
          (item: subTasksItem) => item.detaildpath
        );
      }
    },
  },
});
