<script setup lang="ts">
import { ref } from "vue";
const active = ref(0);
</script>

<template>
  <main>
    <van-nav-bar title="标题" />
    <van-tabs v-model:active="active" swipeable>
      <van-tab v-for="index in 4" :title="'选项 ' + index">
        内容 {{ index }}
      </van-tab>
    </van-tabs>
  </main>
</template>
