import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { encryptDes } from "../utils/crypto.js";
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
        name: encryptDes(state.loginInfo.name),
        password: encryptDes(state.loginInfo.password),
      };
    },
  },
});
