import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "../http/api";
import { Toast } from "vant";
import "vant/es/toast/style";
export const newTaskInfoStore = defineStore("create", {
  state: () => ({
    taskTypeList: [
      { value: 1000, name: "临时任务" },
      { value: 1001, name: "每日任务" },
      { value: 1007, name: "周任务" },
      { value: 1030, name: "月任务" },
      { value: 2030, name: "手工任务" },
      { value: 1365, name: "其他任务" },
      { value: 1015, name: "半月任务" },
      { value: 1060, name: "两月任务" },
      { value: 1090, name: "季任务" },
      { value: 1180, name: "半年任务" },
    ],
    taskLevelList: [
      { value: 1, name: "普通任务" },
      { value: 0, name: "紧急任务" },
    ],
  }),
  getters: {},
  actions: {
    async createTask(params: any) {
      const { code } = await api.task.createTask(params);
      if (+code === 0) {
        Toast("任务创建成功");
      } else {
        Toast.fail("任务创建失败");
      }
    },
  },
});
