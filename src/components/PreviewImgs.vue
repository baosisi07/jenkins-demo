<script setup lang="ts">
import { ref } from "vue";
import { ImagePreview } from "vant";
import "vant/es/image-preview/style";

const VanImagePreview = ImagePreview.Component;
defineProps<{
  isShow: boolean;
  images: any[];
  startPosition: number;
  showIndex: boolean;
}>();

let deg = ref(0);
let currentImg = ref();

const rotateImg = () => {
  deg.value = deg.value + 90;
  if (!currentImg.value) {
    const parentEl = document.querySelector(".user-upload-img");
    const img = parentEl?.querySelectorAll("img")[0] as Record<string, any>;
    currentImg.value = img;
  }
  currentImg.value.style.setProperty(
    "transform",
    `rotate(${deg.value % 360}deg)`
  );
  console.log(currentImg.value.style.transform);
};
const switchImg = (index: number) => {
  deg.value = 0;
  const parentEl = document.querySelector(".user-upload-img");
  const img = parentEl?.querySelectorAll("img")[index] as Record<string, any>;
  currentImg.value = img;
};
</script>

<template>
  <!-- 自定义预览 -->
  <van-image-preview
    v-model:show="isShow"
    :show-index="false"
    :images="images"
    :startPosition="startPosition"
    :showIndex="showIndex"
    @change="switchImg"
    class-name="user-upload-img"
  >
    <template v-slot:cover>
      <div class="action-bar">
        <div class="rotate-action" @click="rotateImg">
          <van-icon name="replay" size="24px" color="#fff" />
          <span class="rotate-txt">旋转</span>
        </div>
      </div>
    </template>
  </van-image-preview>
</template>

<style lang="scss" scoped>
.action-bar {
  width: 100vw;
  display: flex;
  justify-content: end;
  padding: 20px;
  color: #fff;
  .rotate-action {
    display: flex;
  }
  .rotate-txt {
    margin-left: 6px;
  }
}
</style>
