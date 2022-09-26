import { Request } from "./request";
import { userInfoStore } from "../stores/userInfo";
let userInfo = null;

interface TaskParams {
  password?: string;
  name?: string;
  [propname: string]: any;
}
class api {
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
    submitTask: ({ taskid, location, path }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.submittask", {
        taskid,
        location,
        path,
        ...userInfo.userParams,
      });
    },
    submitDetail: ({ taskdetailid }: TaskParams): any => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.submitdetail", {
        taskdetailid,
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
  };
}
export default api;