import { ref, computed } from "vue";
import { defineStore } from "pinia";

// export const useDetailStore = defineStore("counter", () => {
//   const count = ref(0);
//   const doubleCount = computed(() => count.value * 2);
//   function increment() {
//     count.value++;
//   }

//   return { count, doubleCount, increment };
// });
export const useDetailStore = defineStore("detail", {
  state: () => ({
    taskItems: [
      { name: "任务标题", value: "" },
      { name: "任务等级", value: "" },
      { name: "站点名称", value: "" },
      { name: "指派给", value: "" },
      { name: "起始时间", value: "" },
      { name: "结束时间", value: "" },
      { name: "提醒时间", value: "" },
      { name: "任务描述", value: "", label: "哈哈哈" },
    ],
    locationName: "",
  }),
});
