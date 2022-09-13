import { defineStore } from "pinia"

export const useHomeStore = defineStore('home', {
    state: () => {
        return {
          // 所有这些属性都将自动推断其类型
          tabList: [
            { name: "待办" },
            { name: "完成" },
            { name: "超时" },
            { name: "临时" },
            { name: "转派" },
            { name: "待审核" },
          ]
        }
      }
  })