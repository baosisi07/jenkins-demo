import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { encryptByBase64DES } from "../utils/crypto.js";
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
    location: {
      lng: null,
      lat: null,
    },
    loginInfo: {
      backflag: "1",
      assignable: "1",
      lowers: [] as dutyPerson[], // 指派人列表
      sites: [] as Sites[],
    },
  }),
  getters: {
    isLoggedIn: (state) => {
      return state.userParams.name && state.userParams.password;
    },
  },
  actions: {
    async userLogin({ name, password }: any) {
      const params = {
        name: encryptByBase64DES(name),
        password: encryptByBase64DES(password),
      };
      const { code, message, ...data } = await api.user.login(params);
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
        key: "userParams",
        storage: localStorage,
      },
      {
        key: "loginInfo",
        storage: localStorage,
      },
    ],
  },
});
