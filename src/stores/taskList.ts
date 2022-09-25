import { defineStore } from "pinia";

export const useHomeStore = defineStore("home", {
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      tabList: [
        { title: "待办", name: "todo" },
        { title: "完成", name: "done" },
        { title: "超时", name: "delayed" },
        { title: "临时", name: "temp" },
        { title: "转派", name: "resign" },
        { title: "待审核", name: "unaudited" },
      ],
    };
  },
});
