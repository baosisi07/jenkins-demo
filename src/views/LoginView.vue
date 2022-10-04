<script setup lang="ts">
import { ref } from "vue";
import { userInfoStore } from "../stores/userInfo";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = userInfoStore();
const username = ref("");
const password = ref("");
const onSubmit = async (values: any) => {
  console.log("submit", values, userStore);
  const { code } = await userStore.userLogin({ ...values });
  if (+code === 0) {
    router.push({
      name: "home",
    });
  }
};
</script>
<template>
  <div class="login-wrapper">
    <div class="login-content">
      <h3 class="login-title">在线数据运维系统</h3>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="name"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button block type="primary" color="#169186" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-title {
  text-align: center;
  color: #169186;
  font-size: 24px;
  margin-bottom: 30px;
}
.login-content {
  .van-cell {
    background-color: #f0f6f6;
  }
}
</style>
