<script setup lang="ts">
import { ref, reactive } from "vue";
import { useHomeStore } from "../stores/taskList";
import { useRouter } from "vue-router";
interface subItem {
  id: number;
  type: number;
  title: string;
  site: string;
  excutor: string;
  endTime: string;
}
interface Item {
  id: number;
  name: string;
  subList: subItem[];
}

const router = useRouter();
const homeStore = useHomeStore();
const active = ref(0);
const activeNames = ref(["1"]);
let list: Item[] = reactive([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = () => {
  setTimeout(() => {
    if (refreshing.value) {
      list = [];
      refreshing.value = false;
    }

    for (let i = 0; i < 10; i++) {
      list.push({
        name: `标题${list.length + 1}`,
        id: list.length + 1,
        subList: [
          {
            id: 1,
            type: 1,
            title: "hhh你好",
            site: "111",
            excutor: "bbb",
            endTime: "2021-09-13",
          },
          {
            id: 2,
            type: 2,
            title: "ddd",
            site: "222",
            excutor: "bbb",
            endTime: "2021-09-13",
          },
        ],
      });
    }
    loading.value = false;

    if (list.length >= 40) {
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

const toDetail = (item: any) => {
  router.push({
    name: `detail`,
    query: { id: item.id, type: item.type },
  });
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
        v-for="(item, index) in homeStore.tabList"
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
            <van-collapse v-model="activeNames">
              <van-collapse-item
                v-for="item in list"
                :key="item.id"
                :title="item.name"
                :name="item.id"
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
                  <p>执行人：{{ s.excutor }}</p>
                  <p>结束时间：{{ s.endTime }}</p>
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
