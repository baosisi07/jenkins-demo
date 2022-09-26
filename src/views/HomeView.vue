<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import type { Ref } from "vue";
import { useHomeStore } from "../stores/taskList";
import type { Item } from "../stores/taskList";
import { useRouter } from "vue-router";

const router = useRouter();
const homeStore = useHomeStore();
const currentList: Ref<Item[]> = ref([]);
const getSiteList = async (type: string = "todo") => {
  homeStore.getSiteList(type);
};
const switchList = (name: string, title: string) => {
  console.log(name, title);
  homeStore.getSiteList(name);
};
const collapseSwitch = async (name: string) => {
  console.log(name);
  // await api.task.getTaskList({ siteid: name, type: activeType.value });
};
watchEffect(() => {
  currentList.value = homeStore.getCurrentList(homeStore.activeType);
  console.log(currentList.value);
});
watch(
  () => homeStore.activeSite,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      homeStore.getTaskList({ siteid: newVal });
    }
  }
);
const onRefresh = () => {
  homeStore.$patch((state) => {
    // 清空列表数据
    state.finished = false;
    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    state.loading = true;
  });
  homeStore.getSiteList();
};

const toDetail = (item: any) => {
  router.push({
    name: `detail`,
    query: { id: item.id, type: item.type },
  });
};
const createTask = () => {
  router.push({
    name: `create`,
  });
};
</script>

<template>
  <main>
    <van-nav-bar title="运维">
      <template #right>
        <van-icon name="plus" size="20" @click="createTask" />
      </template>
    </van-nav-bar>
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
        <van-pull-refresh v-model="homeStore.refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="homeStore.loading"
            :finished="homeStore.finished"
            finished-text="没有更多了"
            @load="getSiteList"
          >
            <van-collapse
              v-model="homeStore.activeSite"
              accordion
              @change="collapseSwitch"
            >
              <van-collapse-item
                v-for="item in currentList"
                :key="item.site"
                :title="item.sitename"
                :name="item.site"
                size="large"
              >
                <div
                  class="task-subitem"
                  v-for="(s, i) in item.subList"
                  :key="s.id"
                  @click="toDetail(s)"
                >
                  <h3 class="task-subitem-title">{{ s.title }}</h3>
                  <p>站点：{{ s.site }}</p>
                  <p>执行人：{{ s.duty }}</p>
                  <p>结束时间：{{ s.endtime }}</p>
                  <van-divider v-if="i !== item.subList.length - 1">
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
