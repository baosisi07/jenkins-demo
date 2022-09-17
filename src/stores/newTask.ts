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
export const useNewTaskStore = defineStore("create", {
  state: () => ({
    taskTypeList: ["临时任务", "每日任务"],
    taskLevelList: ["普通任务", "紧急任务"],
    siteList: ["甘肃模板", "郑州模板"],
    personList: ["章三", "里斯"],
  }),
});
