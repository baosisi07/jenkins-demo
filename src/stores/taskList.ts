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
        {
          title: "待办",
          name: "todo",
          list: [] as Item[],
          loading: false,
          finished: false,
          refreshing: false,
          activeSite: "",
        },
        {
          title: "完成",
          name: "done",
          list: [] as Item[],
          loading: false,
          finished: false,
          refreshing: false,
          activeSite: "",
        },
        {
          title: "超时",
          name: "delayed",
          list: [] as Item[],
          loading: false,
          finished: false,
          refreshing: false,
          activeSite: "",
        },
        {
          title: "临时",
          name: "temp",
          list: [] as Item[],
          loading: false,
          finished: false,
          refreshing: false,
          activeSite: "",
        },
        {
          title: "转派",
          name: "resign",
          list: [] as Item[],
          loading: false,
          finished: false,
          refreshing: false,
          activeSite: "",
        },
        {
          title: "待审核",
          name: "unaudited",
          list: [] as Item[],
          loading: false,
          finished: false,
          refreshing: false,
          activeSite: "",
        },
      ],
      activeType: "todo",
    };
  },
  getters: {
    getCurrentListOption: (state) => {
      return (type: string) => {
        let listOption = null;
        switch (type) {
          case "todo":
            listOption = state.tabList[0];
            break;
          case "done":
            listOption = state.tabList[1];
            break;
          case "delayed":
            listOption = state.tabList[2];
            break;
          case "temp":
            listOption = state.tabList[3];
            break;
          case "resign":
            listOption = state.tabList[4];
            break;
          case "unaudited":
            listOption = state.tabList[5];
            break;
          default:
            listOption = state.tabList[0];
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
            this.tabList[0].list = val;
          } else if (itemname === "loading") {
            this.tabList[0].loading = val;
          } else if (itemname === "finished") {
            this.tabList[0].finished = val;
          } else if (itemname === "refreshing") {
            this.tabList[0].refreshing = val;
          } else if (itemname === "activeSite") {
            if (this.tabList[0].activeSite !== val) {
              this.tabList[0].activeSite = val;
              this.getTaskList({ siteid: val, type });
            }
          }
          break;
        case "done":
          if (itemname === "list") {
            this.tabList[1].list = val;
          } else if (itemname === "loading") {
            this.tabList[1].loading = val;
          } else if (itemname === "finished") {
            this.tabList[1].finished = val;
          } else if (itemname === "refreshing") {
            this.tabList[1].refreshing = val;
          } else if (itemname === "activeSite") {
            if (this.tabList[1].activeSite !== val) {
              this.tabList[1].activeSite = val;
              this.getTaskList({ siteid: val, type });
            }
          }
          break;
        case "delayed":
          if (itemname === "list") {
            this.tabList[2].list = val;
          } else if (itemname === "loading") {
            this.tabList[2].loading = val;
          } else if (itemname === "finished") {
            this.tabList[2].finished = val;
          } else if (itemname === "refreshing") {
            this.tabList[2].refreshing = val;
          } else if (itemname === "activeSite") {
            if (this.tabList[2].activeSite !== val) {
              this.tabList[2].activeSite = val;
              this.getTaskList({ siteid: val, type });
            }
          }
          break;
        case "temp":
          if (itemname === "list") {
            this.tabList[3].list = val;
          } else if (itemname === "loading") {
            this.tabList[3].loading = val;
          } else if (itemname === "finished") {
            this.tabList[3].finished = val;
          } else if (itemname === "refreshing") {
            this.tabList[3].refreshing = val;
          } else if (itemname === "activeSite") {
            if (this.tabList[3].activeSite !== val) {
              this.tabList[3].activeSite = val;
              this.getTaskList({ siteid: val, type });
            }
          }
          break;
        case "resign":
          if (itemname === "list") {
            this.tabList[4].list = val;
          } else if (itemname === "loading") {
            this.tabList[4].loading = val;
          } else if (itemname === "finished") {
            this.tabList[4].finished = val;
          } else if (itemname === "refreshing") {
            this.tabList[4].refreshing = val;
          } else if (itemname === "activeSite") {
            if (this.tabList[4].activeSite !== val) {
              this.tabList[4].activeSite = val;
              this.getTaskList({ siteid: val, type });
            }
          }
          break;
        case "unaudited":
          if (itemname === "list") {
            this.tabList[5].list = val;
          } else if (itemname === "loading") {
            this.tabList[5].loading = val;
          } else if (itemname === "finished") {
            this.tabList[5].finished = val;
          } else if (itemname === "refreshing") {
            this.tabList[5].refreshing = val;
          } else if (itemname === "activeSite") {
            if (this.tabList[5].activeSite !== val) {
              this.tabList[5].activeSite = val;
              this.getTaskList({ siteid: val, type });
            }
          }
          break;
        default:
          if (itemname === "list") {
            this.tabList[0].list = val;
          } else if (itemname === "loading") {
            this.tabList[0].loading = val;
          } else if (itemname === "finished") {
            this.tabList[0].finished = val;
          } else if (itemname === "refreshing") {
            this.tabList[0].refreshing = val;
          } else if (itemname === "activeSite") {
            if (this.tabList[0].activeSite !== val) {
              this.tabList[0].activeSite = val;
              this.getTaskList({ siteid: val, type });
            }
          }
          break;
      }
    },
    async getSiteList(type: string = "todo", refreshing: boolean = false) {
      let list: Item[] = this.getCurrentListOption(type).list;
      // 正常已请求的列表不再请求
      if (list.length > 0 && !refreshing) {
        return;
      }
      // 刷新时候重置激活的task item
      if (refreshing) {
        this.setListOption({
          type,
          itemname: "activeSite",
          val: 0,
        });
      }
      const { data: siteList, code } = await api.task.getSiteList({ type });
      if (+code === 0) {
        if (this.getCurrentListOption(type).refreshing) {
          list = [];
          this.setListOption({ type, itemname: "list", val: [] });
          this.setListOption({ type, itemname: "refreshing", val: false });
        }
        list = siteList;
        this.setListOption({ type, itemname: "list", val: list.slice(0, 20) });
        // 默认展开第一个面板
        if (siteList.length > 0) {
          this.setListOption({
            type,
            itemname: "activeSite",
            val: siteList[0].site,
          });
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
