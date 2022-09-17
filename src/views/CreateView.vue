<script setup lang="ts">
import { ref, reactive } from "vue";
import { useNewTaskStore } from "../stores/newTask";
// import { useRoute } from "vue-router";

// const route = useRoute();
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
});

const onSubmit = (values: any) => {
  console.log("submit", values);
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

const onClickLeft = () => history.back();
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
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped></style>
