import { Request } from "./request";
import { userInfoStore } from "../stores/userInfo";
let userInfo = null;

interface TaskParams {
  password?: string;
  name?: string;
  [propname: string]: any;
}
class api {
  public static file = {
    upload: ({ file }: TaskParams): any => {
      userInfo = userInfoStore();
      const param = new FormData();
      param.append("file", file);
      console.log(param.get("file"));
      return Request.post("/fileservice.upload", param, {
        headers: {
          name: userInfo.userParams.name,
          password: userInfo.userParams.password,
          "Content-Type":
            "multipart/form-data;boundary=fdd0f248-41a6-4f72-8c9f-fb1dd696ed84",
        },
      });
    },
  };
  public static user = {
    login: async (params: TaskParams): Promise<any> => {
      return await Request.post("/userservice.login", {
        ...params,
      });
    },
  };
  public static task = {
    getSiteList: async ({ type }: TaskParams): Promise<any> => {
      userInfo = userInfoStore();
      return await Request.post("/taskservice.getsite", {
        type,
        ...userInfo.userParams,
      });
    },
    getTaskList: ({ siteid, type }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.gettasklistbysite", {
        siteid,
        type,
        ...userInfo.userParams,
      });
    },
    getTaskDetail: ({ taskid }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.getdetail", {
        taskid,
        ...userInfo.userParams,
      });
    },
    getRecord: ({ taskid }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.gettaskrecord", {
        taskid,
        ...userInfo.userParams,
      });
    },
    submitTask: ({ taskid, location, path }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.submittask", {
        taskid,
        location,
        path,
        ...userInfo.userParams,
      });
    },

    submitNote: ({ taskid, note }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.submitnote", {
        taskid,
        note,
        ...userInfo.userParams,
      });
    },
    resignTask: ({ taskid }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.resigntask", {
        taskid,
        ...userInfo.userParams,
      });
    },

    assignTask: ({ taskid, duty }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.assigntask", {
        taskid,
        duty,
        ...userInfo.userParams,
      });
    },
    auditTask: ({ taskid, reason, audit }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.audittask", {
        taskid,
        reason,
        audit,
        ...userInfo.userParams,
      });
    },

    rollbackTask: ({ taskid, rollbackreason }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.rollbacktask", {
        taskid,
        rollbackreason,
        ...userInfo.userParams,
      });
    },
    createTask: (params: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.createtask", {
        ...params,
        ...userInfo.userParams,
      });
    },
    submitdetail: ({ file, taskdetailid }: TaskParams): any => {
      userInfo = userInfoStore();
      const param = new FormData();
      param.append("file", file);
      console.log(param.get("file"));
      return Request.post("/taskservice.submitdetail", param, {
        headers: {
          name: userInfo.userParams.name,
          password: userInfo.userParams.password,
          taskdetailid: taskdetailid,
          "Content-Type":
            "multipart/form-data;boundary=fdd0f248-41a6-4f72-8c9f-fb1dd696ed84",
        },
      });
    },
  };
}
export default api;
