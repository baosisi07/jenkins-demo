import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "../http/api";
import { Toast } from "vant";
interface subTasksItem {
  detailid: string;
  detailtitle: string;
  detaildesc: string;
  detaildpath: string;
  fileList: any;
  note: string;
}
export const useDetailStore = defineStore("detail", {
  state: () => ({
    taskItems: [
      { name: "任务标题", itemname: "title", value: "" },
      { name: "任务等级", itemname: "level", value: "" },
      { name: "站点名称", itemname: "site", value: "" },
      { name: "指派给", itemname: "duty", value: "" },
      { name: "起始时间", itemname: "starttime", value: "" },
      { name: "结束时间", itemname: "endtime", value: "" },
      { name: "提醒时间", itemname: "remindtime", value: "" },
      { name: "任务描述", itemname: "desc", value: "", label: "哈哈哈" },
    ],
    locationName: "",
    subTasks: [] as subTasksItem[],
    images: [],
    startIndex: 0,
  }),
  actions: {
    beforeDel(index: number) {
      const that = this;
      return function (file: any, detail: any) {
        that.setFileItemImg(index);
      };
    },

    setFileItemImg(index: number, url: string = "") {
      for (let i = 0; i < this.subTasks.length; i++) {
        if (i === index) {
          this.subTasks[i].fileList = url
            ? [
                {
                  url,
                  deletable: true,
                },
              ]
            : [];
          break;
        }
      }
    },
    beforeRead(index: number) {
      const that = this;
      return async function (file: any, detail: any) {
        console.log("before read", index, file, detail);
        Toast.loading({
          message: "上传中...",
          forbidClick: true,
        });
        const { code, message, path } = await api.task.fileUpload({
          file: file,
          taskdetailid: that.subTasks[index].detailid,
        });
        Toast(message);
        if (code === 0) {
          const url = import.meta.env.VITE_IMG_PRE_PATH + path;
          that.setFileItemImg(index, url);
        }
      };
    },
    afterRead(index: number) {
      const that = this;
      return async function (file: any, detail: any) {
        console.log("after read", file.file);
      };
    },
    async getDetailById(id: string) {
      const { code, ...data } = await api.task.getTaskDetail({ taskid: id });
      if (+code === 0) {
        this.taskItems = [
          { name: "任务标题", itemname: "title", value: data.title },
          {
            name: "任务等级",
            itemname: "level",
            value: data.level === 0 ? "紧急任务" : "普通任务",
          },
          { name: "站点名称", itemname: "site", value: data.site },
          { name: "指派给", itemname: "duty", value: data.duty },
          { name: "起始时间", itemname: "starttime", value: data.starttime },
          { name: "结束时间", itemname: "endtime", value: data.endtime },
          { name: "提醒时间", itemname: "remindtime", value: data.remindtime },
          { name: "任务描述", itemname: "desc", value: data.desc },
        ];
        this.locationName = data.location;
        this.subTasks = data.details;
        console.log(this.subTasks);
        data.details = data.details.map((item: subTasksItem, i: number) => {
          item.detaildpath =
            import.meta.env.VITE_IMG_PRE_PATH + item.detaildpath;
          const that = this;
          item.fileList = [
            {
              url: item.detaildpath,
              deletable: true,
            },
          ];

          return item;
        });
        this.images = data.details.map(
          (item: subTasksItem) => item.detaildpath
        );
      }
    },
  },
});
