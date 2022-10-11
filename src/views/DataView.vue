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
  var myChart = echarts.init(chartDom, "dark");
  option && myChart.setOption(option);
};
const renderBarGraph = async function (params: any) {
  await dataInfo.getTaskStateBy(params);
  var chartDom = document.getElementById("graph2")!;
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        // ["product", "2015", "2016", "2017"],
        // ["Matcha Latte", 43.3, 85.8, 93.7],
        // ["Milk Tea", 83.1, 73.4, 55.1],
        // ["Cheese Cocoa", 86.4, 65.2, 82.5],
        // ["Walnut Brownie", 72.4, 53.9, 39.1],
      ],
    },
    xAxis: { type: "category" },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
  };

  option && myChart.setOption(option);
};
onMounted(async () => {
  await dataInfo.getAllTaskData();

  setTimeout(() => {
    renderPieGraph();
  });
});

const active = ref(0);
const isShowSitePicker = ref(false);
const isShowCalendar = ref(false);
const minDate = new Date(2020, 0, 1);
const maxDate = new Date();
const formValues = reactive({
  sites: {} as Sites,
  time: "",
});
const onConfirmCalendar = (date: Date[]) => {
  const [start, end] = date;
  formValues.time = `${start.getFullYear()}-${
    start.getMonth() + 1
  }-${start.getDate()},${end.getFullYear()}-${
    end.getMonth() + 1
  }-${end.getDate()}`;

  isShowCalendar.value = false;
};

const onConfirm = (value: any) => {
  formValues.sites = value;
  isShowSitePicker.value = false;
};
const onSubmit = async () => {
  const { time, sites } = formValues;
  const times = time.split(",");
  let params = {
    starttime: times[0],
    endtime: times[1],
    siteid: sites.siteid || "",
  };
  renderBarGraph(params);
};
const onClickLeft = () => {
  history.back();
};
</script>

<template>
  <div class="data-wrapper">
    <van-nav-bar title="数据统计" left-arrow @click-left="onClickLeft" />
    <van-tabs color="#169186" v-model:active="active">
      <van-tab title="饼图">
        <div class="graph-content" id="graph1"></div>
      </van-tab>
      <van-tab title="柱状图">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formValues.sites.sitename"
              is-link
              readonly
              name="sitename"
              label="站点名称"
              placeholder="点击选择站点名称"
              @click="isShowSitePicker = true"
            />
            <van-field
              v-model="formValues.time"
              is-link
              readonly
              name="starttime"
              label="日期区间"
              placeholder="点击选择日期区间"
              :rules="[{ required: true, message: '请选择日期区间' }]"
              @click="isShowCalendar = true"
            />
            <van-calendar
              color="#169186"
              type="range"
              :max-range="365"
              :min-date="minDate"
              :max-date="maxDate"
              v-model:show="isShowCalendar"
              @confirm="onConfirmCalendar"
            />
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              查看图表
            </van-button>
          </div>
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
  height: 100vh;
  padding: 20px 15px;
  overflow-x: scroll;
}
</style>
