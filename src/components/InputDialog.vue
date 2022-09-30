<script setup lang="ts">
import { ref } from "vue";
import { Dialog } from "vant";
import "vant/es/dialog/style";
const VanDialog = Dialog.Component;

const props = defineProps<{
  isShow: boolean;
  cancel: Function;
  submit: Function;
  label: string;
  title: string;
}>();
const text = ref("");

const cancelHander = function () {
  props.cancel();
};
const submitForm = function () {
  props.submit(text.value);
};
</script>

<template>
  <!-- 自定义预览 -->
  <van-dialog
    v-model:show="isShow"
    :title="title"
    showCancelButton
    @cancel="cancelHander"
    @confirm="submitForm"
  >
    <van-cell-group inset>
      <!-- 输入任意文本 -->
      <van-field v-model="text" :placeholder="label" />
    </van-cell-group>
  </van-dialog>
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
