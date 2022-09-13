<script setup lang="ts">
// import { watch } from "vue";
import { useDetailStore } from "../stores/taskDetail";
import { useRoute } from "vue-router";

const route = useRoute();
const detailStore = useDetailStore();
const id = route.query.id;
console.log(id);

const onClickLeft = () => history.back();

// watch(
//   () => route.query.id,
//   async (newId) => {
//     console.log("new", newId);
//     // userData.value = await fetchUser(newId)
//   }
// );
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
.location-cell {
  margin-top: 30px;
}
.location,
.location-icon {
  color: var(--van-main-color);
}
.location-icon {
  font-size: 24px;
}
</style>
