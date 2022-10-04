import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { encryptDes, encodeUserInfo } from "../utils/crypto.js";
import api from "../http/api";
import { Toast } from "vant";
import "vant/es/toast/style";

export interface dutyPerson {
  lowerid: string;
  lowername: string;
}
export interface Sites {
  siteid: string;
  sitename: string;
}
export const userInfoStore = defineStore("user", {
  state: () => ({
    userParams: {
      name: "",
      password: "",
    },
    loginInfo: {
      backflag: "1",
      assignable: "1",
      lowers: [
        {
          lowerid: "1",
          lowername: "系统管理员",
        },
        {
          lowerid: "1000000318",
          lowername: "运维超管1",
        },
        {
          lowerid: "1000000420",
          lowername: "丰鹤发电",
        },
      ] as dutyPerson[], // 指派人列表
      sites: [
        { siteid: "1000000737", sitename: "点式六参数模板(A类)" },
        { siteid: "1000000738", sitename: "甘肃模板" },
        { siteid: "1000000739", sitename: "网格化小型站（MFC季度的）" },
        { siteid: "1000000740", sitename: "长光程小型站（MFC季度）" },
        { siteid: "1000000741", sitename: "单颗粒物或者两参数颗粒物" },
        {
          siteid: "1000000742",
          sitename: "小型站（MFC季度、颗粒物温度压力两月）",
        },
        { siteid: "1000000743", sitename: "廊坊vocs和小型站" },
        { siteid: "1000000744", sitename: "三参数颗粒物" },
        { siteid: "1000000745", sitename: "苏州两参数（PM2.5+O3）" },
      ] as Sites[],
    },
  }),
  getters: {
    isLoggedIn: (state) => {
      return state.userParams.name && state.userParams.password;
    },
    // userParams: (state) => {
    //   return {
    //     name: "utaLGxlOfh4=",
    //     password: "FrgEcLSyBgU=",
    //     // name: encodeUserInfo(state.loginInfo.name),
    //     // password: encodeUserInfo(state.loginInfo.password),
    //   };
    // },
  },
  actions: {
    async userLogin({ name, password }: any) {
      // test
      const params = {
        name: "utaLGxlOfh4=",
        password: "FrgEcLSyBgU=",
      };
      // test end

      // name = encodeUserInfo(name);
      // password = encodeUserInfo(password);
      const { code, message, data } = await api.user.login(params);
      if (+code === 0) {
        Toast("登录成功");
        this.userParams = params;
        this.loginInfo = data;
      } else {
        Toast(message);
      }
      return { code };
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "loginInfo",
        storage: localStorage,
      },
    ],
  },
});
