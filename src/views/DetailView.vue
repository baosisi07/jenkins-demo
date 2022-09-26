<script setup lang="ts">
import { ref } from "vue";
import { useDetailStore } from "../stores/taskDetail";
import { useRoute } from "vue-router";

import { getLocation } from "../utils/location";
const route = useRoute();
const detailStore = useDetailStore();
const id = route.query.id;
const type = route.query.type;
console.log(id, type);
let isShow = ref(false);
detailStore.getDetailById(`${id}`);

const onClickLeft = () => history.back();
const previewImg = (index: number) => {
  isShow.value = true;
  detailStore.$patch({
    startIndex: index,
  });
};
// 非完成状态获取实时地址
type !== "done" && getLocation();
</script>

<template>
  <div class="detail-wrapper">
    <van-nav-bar title="任务详情" left-arrow @click-left="onClickLeft" />
    <!-- taskItems -->
    <van-cell-group class="cell-group-wrapper">
      <van-cell
        v-for="(item, i) in detailStore.taskItems"
        :key="i"
        :title="item.name"
        :value="item.value"
        size="large"
        :label="item.label"
      />
      <van-cell
        v-for="(item, i) in detailStore.subTasks"
        :key="i"
        class="image-cell"
      >
        <template #title>
          <h3 class="photo">{{ item.detailtitle }}</h3>
        </template>
        <template #label>
          <van-divider></van-divider>
          <div class="photo-content">
            <h4>拍摄照片</h4>
            <van-image
              @click="previewImg(i)"
              width="6rem"
              height="6rem"
              fit="cover"
              position="center"
              :src="item.detaildpath"
            />
          </div>
          <van-divider></van-divider>
          <p class="photo-desc">{{ item.detaildesc }}</p>
        </template>
      </van-cell>
      <van-cell :label="detailStore.locationName" class="location-cell">
        <template #title> <h3 class="location">当前定位地点</h3> </template>
        <template #right-icon>
          <van-icon
            name="location"
            class="location-icon"
            @click="getLocation"
          />
        </template>
      </van-cell>
    </van-cell-group>
    <van-row v-if="type === 'delayed'" justify="center" class="btn-wrapper">
      <van-col span="8">
        <van-button class="custom-btn" block color="#169186">提交</van-button>
      </van-col>
      <van-col span="8" offset="2">
        <van-button class="custom-btn" color="#FFB12A" block>转派</van-button>
      </van-col>
    </van-row>
    <van-row v-else-if="type === 'resign'" justify="center" class="btn-wrapper">
      <van-col span="14">
        <van-button class="custom-btn" color="#FFB12A" block>指派</van-button>
      </van-col>
    </van-row>
    <van-row
      v-else-if="type === 'unaudited'"
      justify="center"
      class="btn-wrapper"
    >
      <van-col span="14">
        <van-button class="custom-btn" color="#FFB12A" block>审核</van-button>
      </van-col>
    </van-row>
    <!-- 自定义预览 -->
    <preview-imgs
      :isShow="isShow"
      :images="detailStore.images"
      :startPosition="detailStore.startIndex"
    ></preview-imgs>
  </div>
</template>

<style lang="scss" scoped>
.demo {
  width: 100%;
}
.cell-group-wrapper {
  background: transparent;
}
.btn-wrapper {
  margin: 20px;
}
.custom-btn {
  border-radius: 4px;
  font-size: 18px;
}
.location-cell,
.image-cell {
  margin-top: 30px;
}
.location,
.photo,
.location-icon {
  color: var(--van-main-color);
}
.location-icon {
  font-size: 24px;
}
.photo-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
