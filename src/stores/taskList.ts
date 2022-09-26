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

      todoList: {
        list: [] as Item[],
        loading: false,
        finished: false,
        refreshing: false,
      },
      doneList: {
        list: [] as Item[],
        loading: false,
        finished: false,
        refreshing: false,
      },
      delayedList: {
        list: [] as Item[],
        loading: false,
        finished: false,
        refreshing: false,
      },
      tempList: {
        list: [] as Item[],
        loading: false,
        finished: false,
        refreshing: false,
      },
      resignList: {
        list: [] as Item[],
        loading: false,
        finished: false,
        refreshing: false,
      },
      unauditedList: {
        list: [] as Item[],
        loading: false,
        finished: false,
        refreshing: false,
      },
    };
  },
  getters: {
    getCurrentListOption: (state) => {
      return (type: string) => {
        let listOption = null;
        switch (type) {
          case "todo":
            listOption = state.todoList;
            break;
          case "done":
            listOption = state.doneList;
            break;
          case "delayed":
            listOption = state.delayedList;
            break;
          case "temp":
            listOption = state.tempList;
            break;
          case "resign":
            listOption = state.resignList;
            break;
          case "unaudited":
            listOption = state.unauditedList;
            break;
          default:
            listOption = state.todoList;
            break;
        }
        return listOption;
      };
    },
  },
  actions: {
    setListOption({ type, itemname, val }: any) {
      // itemname: list, loading, finished, refreshing

      switch (type) {
        case "todo":
          if (itemname === "list") {
            this.todoList.list = val;
          } else if (itemname === "loading") {
            this.todoList.loading = val;
          } else if (itemname === "finished") {
            this.todoList.finished = val;
          } else if (itemname === "refreshing") {
            this.todoList.refreshing = val;
          }
          break;
        case "done":
          if (itemname === "list") {
            this.doneList.list = val;
          } else if (itemname === "loading") {
            this.doneList.loading = val;
          } else if (itemname === "finished") {
            this.doneList.finished = val;
          } else if (itemname === "refreshing") {
            this.doneList.refreshing = val;
          }
          break;
        case "delayed":
          if (itemname === "list") {
            this.delayedList.list = val;
          } else if (itemname === "loading") {
            this.delayedList.loading = val;
          } else if (itemname === "finished") {
            this.delayedList.finished = val;
          } else if (itemname === "refreshing") {
            this.delayedList.refreshing = val;
          }
          break;
        case "temp":
          if (itemname === "list") {
            this.tempList.list = val;
          } else if (itemname === "loading") {
            this.tempList.loading = val;
          } else if (itemname === "finished") {
            this.tempList.finished = val;
          } else if (itemname === "refreshing") {
            this.tempList.refreshing = val;
          }
          break;
        case "resign":
          if (itemname === "list") {
            this.resignList.list = val;
          } else if (itemname === "loading") {
            this.resignList.loading = val;
          } else if (itemname === "finished") {
            this.resignList.finished = val;
          } else if (itemname === "refreshing") {
            this.resignList.refreshing = val;
          }
          break;
        case "unaudited":
          if (itemname === "list") {
            this.unauditedList.list = val;
          } else if (itemname === "loading") {
            this.unauditedList.loading = val;
          } else if (itemname === "finished") {
            this.unauditedList.finished = val;
          } else if (itemname === "refreshing") {
            this.unauditedList.refreshing = val;
          }
          break;
        default:
          if (itemname === "list") {
            this.todoList.list = val;
          } else if (itemname === "loading") {
            this.todoList.loading = val;
          } else if (itemname === "finished") {
            this.todoList.finished = val;
          } else if (itemname === "refreshing") {
            this.todoList.refreshing = val;
          }
          break;
      }
    },
    async getSiteList(type: string = "todo") {
      let list: Item[] = this.getCurrentListOption(type).list;
      const { data: siteList, code } = await api.task.getSiteList({ type });
      if (+code === 0) {
        if (this.getCurrentListOption(type).refreshing) {
          list = [];
          this.setListOption({ type, itemname: "list", val: [] });
          this.setListOption({ type, itemname: "refreshing", val: false });
        }
        list = siteList;
        this.setListOption({ type, itemname: "list", val: list.slice(0, 20) });
        console.log(list, this.todoList);
        // 默认展开第一个面板
        if (siteList.length > 0) {
          this.activeSite = siteList[0].site;
        }
      }
      this.setListOption({ type, itemname: "loading", val: false });
      // 因为没有分页
      this.setListOption({ type, itemname: "finished", val: true });
    },
    async getTaskList({ siteid, type }: any) {
      const taskType = type || this.activeType;
      const { data: taskList, code } = await api.task.getTaskList({
        siteid,
        type: taskType,
      });
      const currentList = this.getCurrentListOption(type).list;
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
