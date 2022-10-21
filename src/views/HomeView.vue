<script setup lang="ts">
import { ref } from "vue";
import { useHomeStore } from "../stores/taskList";
import { userInfoStore } from "../stores/userInfo";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
const isShowPopMenu = ref(false);
const router = useRouter();
const route = useRoute();
const homeStore = useHomeStore();
const userStore = userInfoStore();

const token: string = route.query.token as string;
if (token) {
  userStore.$patch((state) => {
    state.userParams.ssotoken = token;
  });
} else {
  // token为空时
  Toast("token为空");
  // 用户名密码也为空时 跳转登录页
  if (!userStore.isLoggedIn) {
    setTimeout(function () {
      router.push({
        name: `login`,
      });
    }, 1000);
  }
}
const getSiteList = async (type: string = "todo") => {
  homeStore.getSiteList(type);
};
const switchList = (name: string, title: string) => {
  console.log(name, title);
  homeStore.setListOption({ type: name, itemname: "loading", val: true });
  homeStore.getSiteList(name);
};
const collapseSwitch = async (name: string) => {
  console.log("sss", name);
  if (name) {
    homeStore.setListOption({
      type: homeStore.activeType,
      itemname: "activeSite",
      val: name,
    });
  }
};

const onRefresh = (type: string, isRefresh: boolean) => {
  homeStore.setListOption({
    type: homeStore.activeType,
    itemname: "finished",
    val: false,
  });
  homeStore.setListOption({
    type: homeStore.activeType,
    itemname: "loading",
    val: false,
  });
  homeStore.getSiteList(type, isRefresh);
};

const toDetail = (item: any) => {
  router.push({
    name: `detail`,
    query: { id: item.id, type: homeStore.activeType },
  });
};
const createTask = () => {
  router.push({
    name: `create`,
  });
};
const toStatisics = () => {
  router.push({
    name: `statisics`,
  });
};
const logOut = () => {
  userStore.$patch({
    userParams: { name: "", password: "" },
    location: {},
    loginInfo: {},
  });
  router.push({
    name: `login`,
  });
};
</script>

<template>
  <main>
    <van-nav-bar title="运维">
      <template #left>
        <van-icon name="wap-nav" size="20" @click="isShowPopMenu = true" />
      </template>
      <template #right>
        <van-icon name="plus" size="20" @click="createTask" />
      </template>
    </van-nav-bar>
    <van-popup
      v-model:show="isShowPopMenu"
      position="left"
      :style="{ width: '40%', height: '100vh' }"
    >
      <van-cell-group title="运维管理">
        <van-cell title="数据统计" @click="toStatisics" />
        <!-- <van-cell title="退出登录" @click="logOut" /> -->
      </van-cell-group>
    </van-popup>
    <!-- scrollspy -->
    <van-tabs
      v-model:active="homeStore.activeType"
      swipeable
      @change="switchList"
      color="#fff"
      line-height="2px"
      background="#169186"
      title-active-color="#fff"
      title-inactive-color="#5DB7AD"
    >
      <van-tab
        v-for="(item, index) in homeStore.tabList"
        :key="index"
        :title="item.title"
        :name="item.name"
      >
        <van-pull-refresh
          v-model="item.refreshing"
          @refresh="onRefresh(item.name, true)"
        >
          <van-list
            v-model:loading="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="getSiteList"
          >
            <van-collapse
              v-model="item.activeSite"
              accordion
              @change="collapseSwitch"
            >
              <van-collapse-item
                v-for="subitem in item.list"
                :key="subitem.site"
                :title="subitem.sitename"
                :name="subitem.site"
                size="large"
              >
                <div
                  class="task-subitem"
                  v-for="(s, i) in subitem.subList"
                  :key="s.id"
                  @click="toDetail(s)"
                >
                  <h3 class="task-subitem-title">{{ s.title }}</h3>
                  <p>站点：{{ s.site }}</p>
                  <p>执行人：{{ s.duty }}</p>
                  <p>结束时间：{{ s.endtime }}</p>
                  <van-divider v-if="i !== subitem.subList.length - 1">
                  </van-divider>
                </div>
              </van-collapse-item>
            </van-collapse>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- <img class="demo" src="../assets/WechatIMG204.jpeg" alt="" /> -->
  </main>
</template>
<style lang="scss" scoped>
.van-hairline--bottom:after {
  border-bottom-width: 0;
}
.demo {
  width: 100%;
}
.task-subitem {
  p {
    line-height: 1.8;
  }
}
.task-subitem-title {
  color: var(--van-main-color);
}
</style>
