import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { encryptDes, encodeUserInfo } from "../utils/crypto.js";
export const userInfoStore = defineStore("create", {
  state: () => ({
    isLoggedIn: true,
    loginInfo: {
      name: "admin",
      password: "admin2",
    },
  }),
  getters: {
    userParams: (state) => {
      return {
        name: "MEenL9FKdYw=",
        password: "QzMvrGAX6i0=",
        // name: encodeUserInfo(state.loginInfo.name),
        // password: encodeUserInfo(state.loginInfo.password),
      };
    },
  },
});
