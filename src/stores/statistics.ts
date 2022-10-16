import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "../http/api";
import { Toast } from "vant";
import "vant/es/toast/style";
import { newTaskInfoStore } from "./newTask";
import { number } from "echarts";
const newTaskStore = newTaskInfoStore();
interface taskGraph {
  type: string;
  rate: number;
}
interface Tasks {
  [propname: string]: any;
}
export const dataInfoStore = defineStore("data", {
  state: () => ({
    taskMap: {
      total: "任务总数",
      done: "已完成",
      overtime: "超时",
      todo: "待办",
      checking: "待审核",
      rechecking: "待复核",
      transfer: "转派中",
    } as Tasks,
    allTaskRates: [],
    taskStateBySite: [] as any[][],
  }),
  getters: {},
  actions: {
    async getAllTaskData(params?: any) {
      const { code, message, data } = await api.task.getAllRate(params);
      if (+code === 0) {
        const mapType: any = {};
        newTaskStore.taskTypeList.forEach((item) => {
          mapType[`${item.value}`] = item.name;
        });

        const res = data.map((item: { type: any; rate: any }) => {
          return { name: mapType[item.type], value: item.rate };
        });
        console.log(data, res);
        this.allTaskRates = res;
      } else {
        Toast.fail(message);
      }
    },
    async getTaskStateBy(params?: any) {
      const { code, message, data } = await api.task.getTaskStateBy(params);
      if (+code === 0) {
        const sitesData = [];
        if (data.length > 0) {
          const types = data[0].detail as taskGraph[];
          const taskTypes = types.map((item) => this.taskMap[item.type]);
          sitesData.push(["types", ...taskTypes]);
          data.forEach((item: any) => {
            const itemData = item.detail.map((i: any) => i.rate);
            sitesData.push([item.sitename, ...itemData]);
          });
        }

        this.taskStateBySite = sitesData;
      } else {
        Toast.fail(message);
      }
    },
  },
});
