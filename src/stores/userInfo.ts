import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { encryptDes, encodeUserInfo } from "../utils/crypto.js";
interface dutyPerson {
  lowerid: string;
  lowername: string;
}
export const userInfoStore = defineStore("create", {
  state: () => ({
    isLoggedIn: true,
    loginInfo: {
      name: "admin",
      password: "admin2",
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
