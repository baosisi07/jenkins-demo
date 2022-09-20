<script setup lang="ts">
import { Dialog } from "vant";
import { ref, reactive } from "vue";
import { useNewTaskStore } from "../stores/newTask";
import "vant/es/dialog/style";

const newTaskStore = useNewTaskStore();

const formValues = reactive({
  title: "",
  taskType: "",
  taskLevel: "",
  sitename: "",
  assignTo: "",
  startTime: "",
  endTime: "",
  remindTime: "",
  taskDesc: "",
  listName: "",
  calendarName: "",
  fileList: [],
  fileInfo: [],
});

const isShowPreview = ref(false);
const imgIndex = ref(0);
const showPreview = () => {
  isShowPreview.value = true;
};

const afterRead = (file: any, detail: any) => {
  // 此时可以自行将文件上传至服务器
  console.log(file, detail);

  imgIndex.value = detail.index;
};
const beforeDel = (file: any, detail: any) => {
  return Dialog.confirm({
    message: "删除当前子任务？",
    confirmButtonColor: "#169186",
  })
    .then(() => {
      // on confirm
      formValues.fileInfo.splice(detail.index, 1);
      return true;
    })
    .catch(() => {
      // on cancel
      return false;
    });
};

const onSubmit = (values: any) => {
  console.log("submit", values, formValues);
};

const showPicker = ref(false);
const isShowStartCalendar = ref(false);
const isShowEndCalendar = ref(false);
const isShowRemindCalendar = ref(false);
const showPop = (value: string) => {
  formValues.listName = value;
  showPicker.value = true;
};

const onConfirmStartCalendar = (date: Date) => {
  formValues.startTime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  isShowStartCalendar.value = false;
};
const onConfirmEndCalendar = (date: Date) => {
  formValues.endTime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  isShowEndCalendar.value = false;
};
const onConfirmRemindCalendar = (date: Date) => {
  formValues.remindTime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  isShowRemindCalendar.value = false;
};
const onConfirm = (value: string) => {
  switch (formValues.listName) {
    case "taskTypeList":
      formValues.taskType = value;
      break;
    case "taskLevelList":
      formValues.taskLevel = value;
      break;
    case "siteList":
      formValues.sitename = value;
      break;
    case "personList":
      formValues.assignTo = value;
      break;
  }
  showPicker.value = false;
};

const onClickLeft = () => {
  Dialog.confirm({
    message: "确定放弃当前任务的修改吗？",
    confirmButtonColor: "#169186",
  })
    .then(() => {
      history.back();
    })
    .catch(() => {});
};
</script>

<template>
  <div class="create-wrapper">
    <van-nav-bar title="新建任务" left-arrow @click-left="onClickLeft" />
    <van-form @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="formValues.title"
          name="taskTitle"
          label="任务标题"
          :rules="[{ required: true, message: '请填写任务标题' }]"
        />
        <van-field
          v-model="formValues.taskType"
          is-link
          readonly
          name="taskType"
          label="任务类型"
          placeholder="点击选择任务类型"
          @click="showPop('taskTypeList')"
        />
        <van-field
          v-model="formValues.taskLevel"
          is-link
          readonly
          name="taskLevel"
          label="任务等级"
          placeholder="点击选择任务等级"
          @click="showPop('taskLevelList')"
        />
        <van-field
          v-model="formValues.sitename"
          is-link
          readonly
          name="sitename"
          label="站点名称"
          placeholder="点击选择站点名称"
          @click="showPop('siteList')"
        />
        <van-field
          v-model="formValues.assignTo"
          is-link
          readonly
          name="assignTo"
          label="指派给"
          placeholder="点击选择"
          @click="showPop('personList')"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker
            :columns="newTaskStore[formValues.listName]"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>

        <van-field
          v-model="formValues.startTime"
          is-link
          readonly
          name="startTime"
          label="起始时间"
          placeholder="点击选择日期"
          @click="isShowStartCalendar = true"
        />
        <van-calendar
          color="#169186"
          v-model:show="isShowStartCalendar"
          @confirm="onConfirmStartCalendar"
        />
        <van-field
          v-model="formValues.endTime"
          is-link
          readonly
          name="endTime"
          label="结束时间"
          placeholder="点击选择日期"
          @click="isShowEndCalendar = true"
        />
        <van-calendar
          color="#169186"
          v-model:show="isShowEndCalendar"
          @confirm="onConfirmEndCalendar"
        />
        <van-field
          v-model="formValues.remindTime"
          is-link
          readonly
          name="remindTime"
          label="提醒时间"
          placeholder="点击选择日期"
          @click="isShowRemindCalendar = true"
        />
        <van-calendar
          color="#169186"
          v-model:show="isShowRemindCalendar"
          @confirm="onConfirmRemindCalendar"
        />
        <van-field
          v-model="formValues.taskDesc"
          rows="1"
          autosize
          name="taskDesc"
          label="任务描述"
          type="textarea"
          placeholder="请输入任务描述"
        />
        <div class="upload-wrapper">
          <van-uploader
            v-model="formValues.fileList"
            preview-size="80"
            :preview-full-image="false"
            :after-read="afterRead"
            :before-delete="beforeDel"
          >
            <template #preview-cover="{}">
              <div class="img-cover-area" @click="showPreview"></div>
              <!-- <van-field
                class="img-field"
                v-model="formValues.fileInfo[imgIndex]"
                rows="1"
                name="imgDesc"
                type="textarea"
                :autosize="{ maxHeight: 44 }"
                placeholder="请输入描述信息"
              /> -->
            </template>
          </van-uploader>
          <div class="img-desc-list" v-if="formValues.fileList.length > 0">
            <van-field
              v-for="(s, i) in formValues.fileList"
              :key="i"
              class="img-field-item"
              v-model="formValues.fileInfo[i]"
              rows="1"
              name="imgDesc"
              type="textarea"
              :autosize="{ maxHeight: 44 }"
              placeholder="请输入描述信息"
            />
          </div>
        </div>
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    <preview-imgs
      :isShow="isShowPreview"
      :images="formValues.fileList"
      :startPosition="imgIndex"
      showIndex
    ></preview-imgs>
  </div>
</template>
<style lang="scss" scoped>
.upload-wrapper {
  position: relative;
  padding: 18px 16px;
}
.img-cover-area {
  width: 100%;
  height: 100%;
}
.img-desc-list {
  position: absolute;
  padding: 18px 0;
  left: 96px;
  top: 0;
  right: 16px;
}
.img-field-item {
  display: flex;
  height: 80px;
  margin-bottom: 8px;
}
.img-field {
  position: absolute;
  left: 80px;
  box-sizing: border-box;
  width: calc(100vw - 112px);
}
</style>

<style lang="scss">
.van-uploader__wrapper {
  flex-direction: column;
}
.van-uploader__preview-image {
  display: flex;
  overflow: visible;
}
.van-uploader__preview-cover {
  display: flex;
  align-items: center;
}
</style>
