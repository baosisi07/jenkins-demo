import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "../http/api";
import { Toast } from "vant";
import "vant/es/toast/style";
export const dataInfoStore = defineStore("data", {
  state: () => ({
    allTaskRates: [],
  }),
  getters: {},
  actions: {
    async getAllTaskData() {
      const { code, message, data } = await api.task.getAllRate();
      if (+code === 0) {
        const res = data.map((item: { type: any; rate: any }) => {
          return { name: item.type, value: item.rate };
        });
        console.log(data, res);
        this.allTaskRates = res;
      } else {
        Toast.fail(message);
      }
    },
  },
});
