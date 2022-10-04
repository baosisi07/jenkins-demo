<script setup lang="ts">
import { Dialog } from "vant";
import { ref, reactive } from "vue";
import { newTaskInfoStore } from "../stores/newTask";
import { userInfoStore } from "../stores/userInfo";
import type { dutyPerson, Sites } from "../stores/userInfo";
import "vant/es/dialog/style";
const newTaskStore = newTaskInfoStore();
const userStore = userInfoStore();

console.log(newTaskStore, userStore);
const formValues = reactive({
  title: "",
  taskType: { value: 1000, name: "临时任务" },
  taskLevel: { value: 1, name: "普通任务" },
  sites: {} as Sites,
  assignTo: {} as dutyPerson,
  starttime: "",
  endtime: "",
  remindtime: "",
  desc: "",
});
const subTask = reactive({
  fileList: [],
  fileInfo: [],
});
const listName = ref("");
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
      subTask.fileInfo.splice(detail.index, 1);
      return true;
    })
    .catch(() => {
      // on cancel
      return false;
    });
};

const onSubmit = async (values: any) => {
  console.log("submit", values, formValues);
  const { taskType, taskLevel, assignTo, sites, ...rest } = formValues;
  const params = {
    ...rest,
    site: sites.sitename || "",
    siteid: sites.siteid || "",
    duty: assignTo.lowerid || "",
    level: taskLevel.value,
    type: taskType.value,
  };
  await newTaskStore.createTask(params);
};

const showPicker1 = ref(false);
const showPicker2 = ref(false);
const showPicker3 = ref(false);
const showPicker4 = ref(false);
const isShowStartCalendar = ref(false);
const isShowEndCalendar = ref(false);
const isShowRemindCalendar = ref(false);
const showPop = (value: string) => {
  listName.value = value;
  switch (value) {
    case "taskTypeList":
      showPicker1.value = true;
      break;
    case "taskLevelList":
      showPicker2.value = true;
      break;
    case "siteList":
      showPicker3.value = true;
      break;
    case "personList":
      showPicker4.value = true;
      break;
  }
};

const onConfirmStartCalendar = (date: Date) => {
  formValues.starttime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  isShowStartCalendar.value = false;
};
const onConfirmEndCalendar = (date: Date) => {
  formValues.endtime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  isShowEndCalendar.value = false;
};
const onConfirmRemindCalendar = (date: Date) => {
  formValues.remindtime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  isShowRemindCalendar.value = false;
};
const onConfirm = (value: any) => {
  console.log(value);
  switch (listName.value) {
    case "taskTypeList":
      formValues.taskType = value;
      showPicker1.value = false;
      break;
    case "taskLevelList":
      formValues.taskLevel = value;
      showPicker2.value = false;
      break;
    case "siteList":
      formValues.sites = value;
      showPicker3.value = false;
      break;
    case "personList":
      formValues.assignTo = value;
      showPicker4.value = false;
      break;
  }
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
          name="title"
          label="任务标题"
          :rules="[{ required: true, message: '请填写任务标题' }]"
        />
        <van-field
          v-model="formValues.taskType.name"
          is-link
          readonly
          name="taskType"
          label="任务类型"
          placeholder="点击选择任务类型"
          @click="showPop('taskTypeList')"
        />
        <van-field
          v-model="formValues.taskLevel.name"
          is-link
          readonly
          name="taskLevel"
          label="任务等级"
          placeholder="点击选择任务等级"
          @click="showPop('taskLevelList')"
        />
        <van-field
          v-model="formValues.sites.sitename"
          is-link
          readonly
          name="sitename"
          label="站点名称"
          placeholder="点击选择站点名称"
          @click="showPop('siteList')"
        />
        <van-field
          v-model="formValues.assignTo.lowername"
          is-link
          readonly
          name="assignTo"
          label="指派给"
          placeholder="点击选择"
          @click="showPop('personList')"
        />
        <van-popup v-model:show="showPicker1" position="bottom">
          <van-picker
            :columns="newTaskStore.taskTypeList"
            :columns-field-names="{ text: 'name' }"
            @confirm="onConfirm"
            :default-index="0"
            @cancel="showPicker1 = false"
          />
        </van-popup>
        <van-popup v-model:show="showPicker2" position="bottom">
          <van-picker
            :columns="newTaskStore.taskLevelList"
            @confirm="onConfirm"
            :columns-field-names="{ text: 'name' }"
            :default-index="0"
            @cancel="showPicker2 = false"
          />
        </van-popup>
        <van-popup v-model:show="showPicker3" position="bottom">
          <van-picker
            :columns="userStore.loginInfo.sites"
            @confirm="onConfirm"
            :columns-field-names="{ text: 'sitename' }"
            @cancel="showPicker3 = false"
          />
        </van-popup>
        <van-popup v-model:show="showPicker4" position="bottom">
          <van-picker
            :columns="userStore.loginInfo.lowers"
            @confirm="onConfirm"
            :columns-field-names="{ text: 'lowername' }"
            @cancel="showPicker4 = false"
          />
        </van-popup>
        <van-field
          v-model="formValues.starttime"
          is-link
          readonly
          name="starttime"
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
          v-model="formValues.endtime"
          is-link
          readonly
          name="endtime"
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
          v-model="formValues.remindtime"
          is-link
          readonly
          name="remindtime"
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
          v-model="formValues.desc"
          rows="1"
          autosize
          name="desc"
          label="任务描述"
          type="textarea"
          placeholder="请输入任务描述"
        />
        <div class="upload-wrapper">
          <van-uploader
            v-model="subTask.fileList"
            preview-size="80"
            :preview-full-image="false"
            :after-read="afterRead"
            :before-delete="beforeDel"
          >
            <template #preview-cover="{}">
              <div class="img-cover-area" @click="showPreview"></div>
            </template>
          </van-uploader>
          <div class="img-desc-list" v-if="subTask.fileList.length > 0">
            <van-field
              v-for="(s, i) in subTask.fileList"
              :key="i"
              class="img-field-item"
              v-model="subTask.fileInfo[i]"
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
      :images="subTask.fileList"
      :startPosition="imgIndex"
      showIndex
    ></preview-imgs>
  </div>
</template>
<style lang="scss" scoped>
.upload-wrapper {
  background-color: #fff;
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
