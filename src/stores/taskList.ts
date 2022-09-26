import { defineStore } from "pinia";
import api from "../http/api";
interface subItem {
  id: number;
  site: string;
  siteid: string;
  type: string;
  title: string;
  message: string;
  duty: string;
  starttime: string;
  remindtime: string;
  endtime: string;
  submittime: string;
  audittime: string;
  level: string; // 0：紧急任务 1：普通任务
}
export interface Item {
  site: string;
  sitename: string;
  subList: subItem[];
}
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
      activeType: "todo",
      activeSite: "",
      list: {
        todoList: [],
      },
      todoList: [] as Item[],
      doneList: [] as Item[],
      delayedList: [] as Item[],
      tempList: [] as Item[],
      resignList: [] as Item[],
      unauditedList: [] as Item[],
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  getters: {
    getCurrentList: (state) => {
      return (type: string) => {
        let list: Item[] = [];
        switch (type) {
          case "todo":
            list = state.todoList;
            break;
          case "done":
            list = state.doneList;
            break;
          case "delayed":
            list = state.delayedList;
            break;
          case "temp":
            list = state.tempList;
            break;
          case "resign":
            list = state.resignList;
            break;
          case "unaudited":
            list = state.unauditedList;
            break;
          default:
            list = state.todoList;
            break;
        }
        return list;
      };
    },
  },
  actions: {
    setList(type: string, list: Item[]) {
      switch (type) {
        case "todo":
          this.todoList = list;
          break;
        case "done":
          this.doneList = list;
          break;
        case "delayed":
          this.delayedList = list;
          break;
        case "temp":
          this.tempList = list;
          break;
        case "resign":
          this.resignList = list;
          break;
        case "unaudited":
          this.unauditedList = list;
          break;
        default:
          this.todoList = list;
          break;
      }
    },
    async getSiteList(type: string = "todo") {
      let list: Item[] = this.getCurrentList(type);
      const { data: siteList, code } = await api.task.getSiteList({ type });
      if (+code === 0) {
        if (this.refreshing) {
          list = [];
          this.setList(type, []);
          this.refreshing = false;
        }
        list = siteList.slice(0, 10);
        this.setList(type, list);
        console.log(list, this.todoList);
        // 默认展开第一个面板
        if (siteList.length > 0) {
          this.activeSite = siteList[0].site;
        }
      }
      this.loading = false;
      // 因为没有分页
      this.finished = true;
    },
    async getTaskList({ siteid, type }: any) {
      const taskType = type || this.activeType;
      const { data: taskList, code } = await api.task.getTaskList({
        siteid,
        type: taskType,
      });
      const currentList = this.getCurrentList(type);
      if (+code === 0) {
        for (let i = 0; i < currentList.length; i++) {
          if (currentList[i].site === siteid) {
            currentList[i].subList = taskList;
            break;
          }
        }
      }
    },
  },
});
