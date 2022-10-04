<script setup lang="ts">
import { ref } from "vue";
import { useDetailStore } from "../stores/taskDetail";
import { userInfoStore } from "../stores/userInfo";
import { useRoute } from "vue-router";
import { getLocation } from "../utils/location";
import { Toast, Dialog } from "vant";

const route = useRoute();
const detailStore = useDetailStore();
const userStore = userInfoStore();
console.log(detailStore, userStore);
const id = route.query.id;
const type = route.query.type;
console.log(id, type);
let isShow = ref(false);
let isShowBackDialog = ref(false);
let isShowAuditDialog = ref(false);
let isShowPersonList = ref(false);
let isShowGetLocation = ref(false);
let isReadOnly = ref(false);
let customFieldName = {
  text: "lowername",
};
detailStore.getDetailById(`${id}`);
detailStore.getTaskRecord(`${id}`);

const onConfirm = async (value: any, index: number) => {
  const duty = userStore.loginInfo.lowers[index].lowerid;
  const { code } = await detailStore.assignTask({ taskid: id, duty });
  if (+code === 0) {
    Toast("指派成功");
    isShowPersonList.value = false;
  }
};

const onCancel = () => {
  isShowPersonList.value = false;
};

const onClickLeft = () => history.back();

const cancel = () => {
  isShowBackDialog.value = false;
};
const cancelAudit = () => {
  isShowAuditDialog.value = false;
};
const submitAudit = async (params: any) => {
  // 不通过 理由必填
  if (params.audit === "0" && !params.reason) {
    Toast("请输入不通过理由");
    return;
  }
  const { code } = await detailStore.auditTask({ taskid: id, ...params });
  if (+code === 0) {
    Toast("审核成功");
    isShowAuditDialog.value = false;
  } else {
    Toast("操作失败");
    return false;
  }
};
const commit = async () => {
  Dialog.confirm({
    title: "提示",
    message: `是否提交 ${detailStore.taskItems[0].value} 任务`,
    beforeClose: async function (action: string): Promise<any> {
      if (action === "confirm") {
        let doneNum = 0;
        // 检查是否有未完成的子任务
        for (let i = 0; i < detailStore.images.length; i++) {
          if (!detailStore.images[i]) {
            Dialog.alert({
              message: `请完成 ${detailStore.subTasks[i].detailtitle} 任务后，再提交任务`,
            }).then(() => {
              // on close
              return true;
            });
            break;
          } else {
            doneNum++;
          }
        }
        if (doneNum === detailStore.images.length) {
          const { code } = await detailStore.commitTask({
            taskid: id,
            location: detailStore.locationName,
            path: "",
          });
          if (+code === 0) {
            Toast("已提交");
          } else {
            Toast("提交失败");
          }
          return true;
        }
      } else {
        return true;
      }
    },
  });
};
const submit = async (text: string) => {
  if (!text) {
    Toast("请输入回退理由");
    return;
  }
  const { code } = await detailStore.backTask({
    taskid: id,
    rollbackreason: text,
  });
  if (+code === 0) {
    Toast("回退成功");
    isShowBackDialog.value = false;
  } else {
    Toast("操作失败");
    return false;
  }
};
const previewImg = (index: number) => {
  isShow.value = true;
  detailStore.$patch({
    startIndex: index,
  });
};

const resignTask = () => {
  Dialog.confirm({
    title: "提示",
    message: `是否转派 ${detailStore.taskItems[0].value} 任务`,
    beforeClose: async function (action: string): Promise<any> {
      if (action === "confirm") {
        const { code } = await detailStore.resignTask({ taskid: id });
        if (+code === 0) {
          Toast("已转派");
          Promise.resolve(true);
        } else {
          Toast("操作失败");
          Promise.resolve(false);
        }
      } else {
        return true;
      }
    },
  });
};
// 表单只读
if (type === "done" || type === "unaudited") {
  isReadOnly.value = true;
}
// 非完成状态且地址为空时，获取实时地址
if (type !== "done" && !detailStore.locationName) {
  console.log("location");
  isShowGetLocation.value = true;
  getLocation();
}
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
      <van-cell v-if="detailStore.records.length > 0">
        <h3>操作记录</h3>
        <div
          class="records-item"
          v-for="(item, i) in detailStore.records"
          :key="i"
        >
          {{ item.createtime }} {{ item.createuser }} {{ item.recordtype }}
          {{ item.remarks }}
        </div>
      </van-cell>
      <!-- 仅显示子任务 -->
      <template v-if="isReadOnly">
        <van-cell
          v-for="(item, i) in detailStore.subTasks"
          :key="i"
          class="image-cell"
        >
          <template #title>
            <h3 class="photo">{{ item.detailtitle }}</h3>
          </template>
          <template #label>
            <van-divider></van-divider>
            <div class="photo-content">
              <h4>{{ item.note }}</h4>
              <van-image
                @click="previewImg(i)"
                width="6rem"
                height="6rem"
                fit="cover"
                position="center"
                :src="item.detaildpath"
              />
            </div>
          </template>
        </van-cell>
      </template>
      <!-- 可编辑子任务 -->
      <template v-else>
        <van-cell
          v-for="(item, i) in detailStore.subTasks"
          :key="i"
          class="image-cell"
        >
          <template #title>
            <h3 class="photo">{{ item.detailtitle }}</h3>
          </template>
          <template #label>
            <van-divider></van-divider>
            <div class="photo-content">
              <h4>拍摄照片</h4>

              <van-uploader
                v-model="item.fileList"
                preview-size="6rem"
                :max-count="1"
                :before-delete="detailStore.beforeDel(i)"
                :after-read="detailStore.afterRead(i)"
                :before-read="detailStore.beforeRead(i)"
                result-type="file"
                :preview-full-image="false"
                @click-preview="previewImg(i)"
              />
            </div>
            <van-divider></van-divider>
            <van-field
              class="desc-input"
              v-model="item.note"
              center
              clearable
              placeholder="请输入描述信息"
            >
              <template #button>
                <van-button
                  size="small"
                  @click="detailStore.submitNote(i, item.note)"
                  type="primary"
                  >提交</van-button
                >
              </template>
            </van-field>
          </template>
        </van-cell>
      </template>
      <van-cell :label="detailStore.locationName" class="location-cell">
        <template #title> <h3 class="location">当前定位地点</h3> </template>
        <template v-if="isShowGetLocation" #right-icon>
          <van-icon
            name="location"
            class="location-icon"
            @click="getLocation"
          />
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 完成 -->
    <van-row
      v-if="type === 'done' && userStore.loginInfo.backflag == '1'"
      justify="center"
      class="btn-wrapper"
    >
      <van-col span="14">
        <van-button
          class="custom-btn"
          color="#FFB12A"
          @click="isShowBackDialog = true"
          block
          >回退</van-button
        >
      </van-col>
    </van-row>
    <!-- 待办 -->
    <van-row v-else-if="type === 'todo'" justify="center" class="btn-wrapper">
      <template v-if="userStore.loginInfo.assignable == '1'">
        <van-col span="8">
          <van-button class="custom-btn" color="#169186" @click="commit" block
            >提交</van-button
          >
        </van-col>
        <van-col span="8" offset="2">
          <van-button
            class="custom-btn"
            color="#FFB12A"
            @click="resignTask"
            block
            >转派</van-button
          >
        </van-col>
      </template>
      <van-col span="14" v-else>
        <van-button class="custom-btn" color="#169186" @click="commit" block
          >提交</van-button
        >
      </van-col>
    </van-row>
    <!-- 超时 -->
    <van-row
      v-else-if="type === 'delayed'"
      justify="center"
      class="btn-wrapper"
    >
      <template v-if="userStore.loginInfo.assignable == '1'">
        <van-col span="8">
          <van-button class="custom-btn" color="#169186" @click="commit" block
            >提交</van-button
          >
        </van-col>
        <van-col span="8" offset="2">
          <van-button
            class="custom-btn"
            color="#FFB12A"
            @click="resignTask"
            block
            >转派</van-button
          >
        </van-col>
      </template>
      <van-col span="14" v-else>
        <van-button class="custom-btn" color="#169186" @click="commit" block
          >提交</van-button
        >
      </van-col>
    </van-row>
    <!-- 转派 -->
    <van-row
      v-else-if="type === 'resign' && userStore.loginInfo.assignable == '1'"
      justify="center"
      class="btn-wrapper"
    >
      <van-col span="14">
        <van-button
          class="custom-btn"
          color="#FFB12A"
          @click="isShowPersonList = true"
          block
          >指派</van-button
        >
      </van-col>
    </van-row>
    <!-- 待审核 -->
    <van-row
      v-else-if="type === 'unaudited' && userStore.loginInfo.assignable == '1'"
      justify="center"
      class="btn-wrapper"
    >
      <van-col span="14">
        <van-button
          class="custom-btn"
          color="#FFB12A"
          @click="isShowAuditDialog = true"
          block
          >审核</van-button
        >
      </van-col>
    </van-row>
    <!-- 其他 -->
    <van-row v-else-if="type === 'temp'" justify="center" class="btn-wrapper">
      <van-col span="14">
        <van-button class="custom-btn" color="#FFB12A" @click="commit" block
          >提交</van-button
        >
      </van-col>
    </van-row>

    <!-- 自定义预览 -->
    <preview-imgs
      :isShow="isShow"
      :images="detailStore.images"
      :startPosition="detailStore.startIndex"
      showIndex
    ></preview-imgs>
    <!-- 回退弹框 -->
    <input-dialog
      :isShow="isShowBackDialog"
      :cancel="cancel"
      :submit="submit"
      title="回退"
      label="请输入回退理由"
    ></input-dialog>
    <!-- 审核弹框 -->
    <input-dialog
      :isShow="isShowAuditDialog"
      :cancel="cancelAudit"
      :submit="submitAudit"
      type="audit"
      title="审核意见"
      label="请输入不通过的理由"
    ></input-dialog>
    <!-- 选择弹框 -->
    <van-popup
      v-model:show="isShowPersonList"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-picker
        title="标题"
        :columns="userStore.loginInfo.lowers"
        :columns-field-names="customFieldName"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
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
.location-cell,
.image-cell {
  margin-top: 30px;
}
.location,
.photo,
.location-icon {
  color: var(--van-main-color);
}
.location-icon {
  font-size: 24px;
}
.photo-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.desc-input {
  padding: 0;
}
.records-item {
  padding: 10px 0;
  color: var(--van-cell-value-color);
  border-bottom: solid 1px var(--van-cell-border-color);
  &:last-child {
    border-bottom: 0;
  }
}
</style>
