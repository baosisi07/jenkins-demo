<script setup lang="ts">
import { ref, reactive } from "vue";
const active = ref(0);
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const state = reactive({
  tabList: [
    { name: "待办" },
    { name: "完成" },
    { name: "超时" },
    { name: "临时" },
    { name: "转派" },
    { name: "待审核" },
  ],
});
const onLoad = () => {
  setTimeout(() => {
    if (refreshing.value) {
      list.value = [];
      refreshing.value = false;
    }

    for (let i = 0; i < 10; i++) {
      list.value.push(list.value.length + 1);
    }
    loading.value = false;

    if (list.value.length >= 40) {
      finished.value = true;
    }
  }, 1000);
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};
</script>

<template>
  <main>
    <van-nav-bar title="运维" />
    <!-- scrollspy -->
    <van-tabs
      v-model:active="active"
      swipeable
      color="#fff"
      line-height="2px"
      background="#169186"
      title-active-color="#fff"
      title-inactive-color="#5DB7AD"
    >
      <van-tab
        v-for="(item, index) in state.tabList"
        :key="index"
        :title="item.name"
      >
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell v-for="item in list" :key="item" :title="item" />
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- <img class="demo" src="../assets/WechatIMG204.jpeg" alt="" /> -->
  </main>
</template>
<style>
.van-hairline--bottom:after {
  border-bottom-width: 0;
}
.demo {
  width: 100%;
}
</style>
