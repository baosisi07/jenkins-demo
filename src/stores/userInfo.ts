import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { encryptDes, encodeUserInfo } from "../utils/crypto.js";
export const userInfoStore = defineStore("create", {
  state: () => ({
    isLoggedIn: true,
    loginInfo: {
      name: "admin",
      password: "admin2",
      backflag: "1",
      assignable: "1",
    },
  }),
  getters: {
    userParams: (state) => {
      return {
        name: "utaLGxlOfh4=",
        password: "FrgEcLSyBgU=",
        // name: encodeUserInfo(state.loginInfo.name),
        // password: encodeUserInfo(state.loginInfo.password),
      };
    },
  },
});
