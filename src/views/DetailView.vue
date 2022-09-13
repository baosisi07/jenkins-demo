<script setup lang="ts">
import { ref } from "vue";
import { useDetailStore } from "../stores/taskDetail";
import { useRoute } from "vue-router";
// eslint-disable-next-line no-undef
// const VanImagePreview = ImagePreview.Component;
const route = useRoute();
const detailStore = useDetailStore();
const id = route.query.id;
const type = route.query.type;
console.log(id, type);

let show = ref(false);
const index = ref(0);
const images = ["https://unpkg.com/@vant/assets/apple-1.jpeg"];
const onClickLeft = () => history.back();
const previewImg = () => {
  console.log("preview");
  show.value = true;
};
const onChange = (newIndex: number) => {
  index.value = newIndex;
};
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
      <van-cell class="image-cell">
        <template #title>
          <h3 class="photo">CEMS设备参数界面对比照片1</h3>
        </template>
        <template #label>
          <van-divider></van-divider>
          <div class="photo-content">
            <h3>拍摄照片</h3>
            <van-image
              @click="previewImg"
              width="6rem"
              height="6rem"
              fit="cover"
              position="center"
              :src="images[0]"
            />
          </div>
          <van-divider></van-divider>
          <p class="photo-desc">图片描述信息</p>
        </template>
      </van-cell>
      <van-cell label="南京市" class="location-cell">
        <template #title> <h3 class="location">当前定位地点</h3> </template>
        <template #right-icon>
          <van-icon name="location" class="location-icon" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-row justify="center" class="btn-wrapper">
      <van-col span="8"
        ><van-button class="custom-btn" block color="#169186"
          >提交</van-button
        ></van-col
      >
      <van-col span="8" offset="2"
        ><van-button class="custom-btn" color="#FFB12A" block
          >转派</van-button
        ></van-col
      >
    </van-row>
    <!-- 自定义预览 -->
    <van-image-preview v-model:show="show" :images="images" @change="onChange">
      <template v-slot:index>第{{ index }}页</template>
      <!-- <template v-slot:cover>hhhh</template> -->
    </van-image-preview>
    <!-- <img class="demo" src="../assets/WechatIMG223.jpeg" alt="" /> -->
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
