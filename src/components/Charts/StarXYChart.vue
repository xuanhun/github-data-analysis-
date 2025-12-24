<template>
  <div
    ref="chartContainerElRef"
    class="w-full h-auto origin-top-left min-w-600px flex flex-col justify-start items-start overflow-x-auto select-none"
    :class="`${classname}`"
  >
   
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUpdated, ref, PropType, toRaw } from "vue";
// For customizing multi mode chart: base on create date or timeline, we have rewrited the chart.xkcd's XY chart with TypeScript.
// Here are some reasons about this motivation.
//
// The shortcomings of the old chart.xkcd (project link: https://github.com/timqian/chart.xkcd):
// 1. The X axis label string could be only formatted date or raw text;
// 2. It's difficult/not possible to debug and customize;
//
// The advantages of the new one:
// 1. Writing in native TypeScript;
// 2. Easy to debug chart internal;
// 3. Totally customizable.
import XYChart from "../../../packages/xy-chart";
import { MIN_CHART_WIDTH } from "../../helpers/consts";
import { IDataType } from "@visactor/vchart";



const props = defineProps({
  classname: {
    type: String,
    default: "",
  },
  data:  {
    type: Object as PropType<IDataType>,
    required: true,
  },
  theme: {
    type: String,
    default: "light",
  },
  timeFormat: String,
  lastRecords: Array as PropType<unknown>,
});

const chartContainerElRef = ref<HTMLDivElement>();
const chartInstanceRef = ref<any>(null);

// 暴露图表实例给父组件
defineExpose({
  getChartInstance: () => chartInstanceRef.value,
});

const drawStarChart = (data: IDataType, lastRecords?: [{
  repo: string,
  date: number,
  count: number,
}]) => {  
  if (chartContainerElRef.value) {
    chartContainerElRef.value.innerHTML = "";
    chartContainerElRef.value.style.width = "fit-content";
    const chart = XYChart(
      chartContainerElRef.value,
      {
        title: "Star History",
        xLabel: "Date",
        yLabel: "GitHub Stars",
        data: data,
        showDots: true,
        transparent: false,
        theme: props.theme as "light" | "dark",
        lastRecords: lastRecords,
      }
    );
    chartInstanceRef.value = chart;
    chart.renderAsync();
  }
};

onMounted(() => {
  if (props.data) {
    console.log(props.data);
    drawStarChart(toRaw(props.data), toRaw(props.lastRecords as any));
  }
// Scale chart to a suitable mobile view.
  if (window.innerWidth < MIN_CHART_WIDTH) {
    if (chartContainerElRef.value) {
      const scaleRate = window.innerWidth / MIN_CHART_WIDTH;
      chartContainerElRef.value.style.marginTop = "8px";
      chartContainerElRef.value.style.transform = `scale(${scaleRate})`;

      if (chartContainerElRef.value.parentElement) {
        chartContainerElRef.value.parentElement.style.minHeight = "0";
        chartContainerElRef.value.parentElement.style.height = `${
          chartContainerElRef.value.clientHeight * scaleRate + 16
        }px`;
      }
    }
  }
  
});

onUpdated(() => {
  if (props.data) {
    drawStarChart(toRaw(props.data), toRaw(props.lastRecords as any));
  }
});

</script>
