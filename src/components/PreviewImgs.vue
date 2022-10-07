<script setup lang="ts">
import { ref, watch } from "vue";
import { ImagePreview } from "vant";
import "vant/es/image-preview/style";

const VanImagePreview = ImagePreview.Component;
const props = defineProps<{
  isShow: boolean;
  images: any[];
  startPosition: number;
  showIndex: boolean;
  closeFn: Function;
}>();
let isShowPreview = ref(false);
let deg = ref(0);
let currentImg = ref();

watch(
  () => props.isShow,
  (val) => {
    isShowPreview.value = val;
  }
);

const rotateImg = () => {
  deg.value = deg.value + 90;
  if (!currentImg.value) {
    const parentEl = document.querySelector(".user-upload-img");
    const imgWapper = parentEl?.querySelectorAll(".van-swipe-item")[
      props.startPosition || 0
    ] as Record<string, any>;
    console.log(imgWapper);
    const img = imgWapper.querySelector("img");

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
  if (!parentEl) return;
  const imgWapper = parentEl?.querySelectorAll(".van-swipe-item")[
    index
  ] as Record<string, any>;
  const img = imgWapper.querySelector("img");
  currentImg.value = img;
};
</script>

<template>
  <!-- 自定义预览 -->
  <van-image-preview
    v-model:show="isShowPreview"
    :images="images"
    :startPosition="startPosition"
    :showIndex="showIndex"
    @change="switchImg"
    @closed="closeFn"
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
