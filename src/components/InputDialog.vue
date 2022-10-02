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
  type: string;
}>();
const text = ref("");
const checked = ref("1");
const reason = ref("");
const cancelHander = function () {
  props.cancel();
};

const closeHandler = function (action: string) {
  if (action === "confirm") {
    if (props.type === "audit") {
      props.submit({ audit: checked.value, reason: reason.value });
    } else {
      props.submit(text.value);
    }
  } else {
    props.cancel();
  }
};
</script>

<template>
  <!-- 自定义预览 -->
  <van-dialog
    v-model:show="isShow"
    :title="title"
    showCancelButton
    @cancel="cancelHander"
    :before-close="closeHandler"
  >
    <van-cell-group inset>
      <template v-if="type === 'audit'">
        <van-field name="radio" label="">
          <template #input>
            <van-radio-group v-model="checked" direction="horizontal">
              <van-radio name="1">通过</van-radio>
              <van-radio name="0">不通过</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <template v-if="checked == '0'">
          <van-field v-model="reason" :placeholder="label" />
        </template>
      </template>
      <template v-else>
        <van-field v-model="text" :placeholder="label" />
      </template>
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
