import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { encryptDes, encodeUserInfo } from "../utils/crypto.js";
export const userInfoStore = defineStore("create", {
  state: () => ({
    isLoggedIn: true,
    loginInfo: {
      name: "admin",
      password: "123456",
    },
  }),
  getters: {
    userParams: (state) => {
      return {
        name: encodeUserInfo(state.loginInfo.name),
        password: encodeUserInfo(state.loginInfo.password),
      };
    },
  },
});
