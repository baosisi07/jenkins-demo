<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { dataInfoStore } from "../stores/statistics";
import { userInfoStore } from "../stores/userInfo";
import type { Sites } from "../stores/userInfo";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;
const dataInfo = dataInfoStore();
const userStore = userInfoStore();
const renderPieGraph = function () {
  var option: EChartsOption;
  option = {
    title: {
      text: "各类型任务占比",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "任务占比",
        type: "pie",
        radius: "50%",
        data: dataInfo.allTaskRates,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  console.log(option);
  var chartDom = document.getElementById("graph1")!;
  var myChart = echarts.init(chartDom, "light");
  option && myChart.setOption(option);
};
const renderBarGraph = function () {
  var chartDom = document.getElementById("graph2")!;
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: dataInfo.taskStateBySite,
    },
    xAxis: { type: "category" },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    dataZoom: [
      {
        show: true,
        start: 94,
        end: 100,
      },
      {
        type: "inside",
        start: 94,
        end: 100,
      },
      {
        show: true,
        yAxisIndex: 0,
        filterMode: "empty",
        width: 30,
        height: "80%",
        showDataShadow: false,
        left: "93%",
      },
    ],
    series: [
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
      { type: "bar" },
    ],
  };

  option && myChart.setOption(option);
};
onMounted(async () => {
  await dataInfo.getAllTaskData();

  setTimeout(() => {
    renderPieGraph();
  });
});

const active = ref("pie");
const isShowSitePicker = ref(false);
const formValues = reactive({
  sites: {} as Sites,
});
const changeGraph = async () => {
  let params = {
    siteid: formValues.sites.siteid || "",
  };
  if (active.value === "pie") {
    await dataInfo.getAllTaskData(params);
    renderPieGraph();
  } else {
    console.log(dataInfo.taskStateBySite);
    await dataInfo.getTaskStateBy(params);
    renderBarGraph();
  }
};
const onConfirm = (value: any) => {
  formValues.sites = value;
  isShowSitePicker.value = false;
  changeGraph();
};

const onClickLeft = () => {
  history.back();
};
</script>

<template>
  <div class="data-wrapper">
    <van-nav-bar title="数据统计" left-arrow @click-left="onClickLeft" />
    <van-tabs color="#169186" v-model:active="active" @change="changeGraph">
      <van-tab title="任务总览饼图" name="pie">
        <van-form>
          <van-cell-group>
            <van-field
              v-model="formValues.sites.sitename"
              is-link
              readonly
              name="sitename"
              label="站点名称"
              placeholder="点击选择站点名称"
              @click="isShowSitePicker = true"
            />
          </van-cell-group>
        </van-form>
        <div class="graph-content" id="graph1"></div>
      </van-tab>
      <van-tab title="柱状图" name="bar">
        <van-form>
          <van-cell-group>
            <van-field
              v-model="formValues.sites.sitename"
              is-link
              readonly
              name="sitename"
              label="站点名称"
              placeholder="点击选择站点名称"
              @click="isShowSitePicker = true"
            />
          </van-cell-group>
        </van-form>
        <div class="graph-content2" id="graph2"></div>
      </van-tab>
    </van-tabs>
    <van-popup v-model:show="isShowSitePicker" position="bottom">
      <van-picker
        :columns="userStore.loginInfo.sites"
        @confirm="onConfirm"
        :columns-field-names="{ text: 'sitename' }"
        @cancel="isShowSitePicker = false"
      />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.graph-content {
  height: 80vh;
  padding: 20px 15px;
}
.graph-content2 {
  height: 80vh;
  padding: 20px 15px;
  overflow-x: scroll;
}
</style>
