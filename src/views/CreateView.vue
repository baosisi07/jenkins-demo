<script setup lang="ts">
// import { ref } from "vue";
// import { useDetailStore } from "../stores/taskDetail";
// import { useRoute } from "vue-router";

// const route = useRoute();
// const detailStore = useDetailStore();
const onClickLeft = () => history.back();
</script>

<template>
  <div class="create-wrapper">
    <van-nav-bar title="新建任务" left-arrow @click-left="onClickLeft" />
  </div>
</template>

<style lang="scss" scoped></style>
