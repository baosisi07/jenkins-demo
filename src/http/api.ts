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
    getTaskList: (params: TaskParams) => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.getsite", {
        ...params,
        ...userInfo.userParams,
      });
    },
    getTaskDetail: ({ taskid }: TaskParams) => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.getdetail", {
        taskid,
        ...userInfo.userParams,
      });
    },
    submitTask: ({ taskid, location, path }: TaskParams) => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.submittask", {
        taskid,
        location,
        path,
        ...userInfo.userParams,
      });
    },
    submitDetail: ({ taskdetailid }: TaskParams) => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.submitdetail", {
        taskdetailid,
        ...userInfo.userParams,
      });
    },
    submitNote: ({ taskid, note }: TaskParams) => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.submitnote", {
        taskid,
        note,
        ...userInfo.userParams,
      });
    },
    resignTask: ({ taskid }: TaskParams) => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.resigntask", {
        taskid,
        ...userInfo.userParams,
      });
    },

    assignTask: ({ taskid, duty }: TaskParams) => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.assigntask", {
        taskid,
        duty,
        ...userInfo.userParams,
      });
    },
    auditTask: ({ taskid, reason, audit }: TaskParams) => {
      userInfo = userInfoStore();
      return Request.post("/taskservice.audittask", {
        taskid,
        reason,
        audit,
        ...userInfo.userParams,
      });
    },

    rollbackTask: ({ taskid, rollbackreason }: TaskParams) => {
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
