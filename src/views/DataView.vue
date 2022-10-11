<script setup lang="ts">
import { ref, onMounted } from "vue";
import { dataInfoStore } from "../stores/statistics";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;
const dataInfo = dataInfoStore();

onMounted(async () => {
  await dataInfo.getAllTaskData();
  setTimeout(() => {
    var option: EChartsOption;
    option = {
      title: {
        text: "各类型任务占比",
        // subtext: "Fake Data",
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
  });
});

const active = ref(0);
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
      <van-tab title="柱状图">内容 2</van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.graph-content {
  height: 80vh;
  padding: 20px 15px;
}
</style>
