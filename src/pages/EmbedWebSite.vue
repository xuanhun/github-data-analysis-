<template>
  <a
    ref="containerElRef"
    class="relative w-full h-full min-w-600px min-h-400px p-4 pt-0 flex flex-col bg-white"
    :href="starHistoryLink"
    target="_blank"
  >
    <div
      v-if="state.isFetching"
      class="absolute w-full h-full flex justify-center items-center z-10 top-0"
    >
      <div class="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
      <i class="fas fa-spinner animate-spin text-4xl z-10"></i>
    </div>
    <StarXYChart
      v-if="state.chartData"
      classname="w-full h-auto"
      :data="state.chartData as IDataType"
      :theme="state.theme"
      :lastRecords="state.lastRecords"
    />
  </a>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ChartMode, RepoStarData } from "../../types/chart";
import { IDataType } from "@visactor/vchart";
import {
  convertStarDataToChartData,
  getRepoData,
} from "../../common/chart";
import { MIN_CHART_WIDTH } from "../helpers/consts";
import toast from "../helpers/toast";
import StarXYChart from "../components/Charts/StarXYChart.vue";

const toastWarn = (message: string) => {
  toast.warn(message, -1);
};

interface State {
  chartData: IDataType | undefined;
  chartMode: ChartMode;
  isFetching: boolean;
  repos: string[];
  theme: string;
  lastRecords: { repo: string, date: number, count: number }[];
}

const state = reactive<State>({
  chartData: undefined,
  chartMode: "Date",
  isFetching: true,
  repos: [],
  theme: "light",
  lastRecords: [],
});
const containerElRef = ref<HTMLDivElement | null>(null);
const starHistoryLink = computed(() => {
  return `https://gitdata.xuanhun520.com?repos=${state.repos.join(",")}&type=${
    state.chartMode
  }&theme=${state.theme}`;
});

onMounted(() => {
  if (!containerElRef.value) {
    return;
  }

  document.body
    .querySelector("#app")
    ?.setAttribute(
      "style",
      "position:absolute;width:100%;height:100%;top:0;left:0;background-color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;"
    );
  const bounding = containerElRef.value.getBoundingClientRect();
  let width = Math.min(bounding.width, bounding.height * 1.5);
  if (width < MIN_CHART_WIDTH) {
    width = MIN_CHART_WIDTH;
  }
  const height = width / 1.5;
  containerElRef.value.style.width = `${width}px`;
  containerElRef.value.style.height = `${height}px`;

  const search = window.location.search.slice(1);

  const params = search.split("&").filter((i) => Boolean(i));
  const repos: string[] = [];
  let token = "";

  

  for (const value of params) {
    if (value === "type=Date" || value === "type=Timeline") {
      state.chartMode = value.split("=")[1] as ChartMode;
      continue;
    }
    if (value.startsWith("theme=")) {
      state.theme = value.split("=")[1];
      continue;
    }
    if (value.startsWith("repos=") && !repos.includes(value)) {
      repos.push(...value.split("=")[1].split(","));
      continue;
    }
    if (value.startsWith("secret=")) {
      token = value.split("=")[1];
      continue;
    }
  }

  state.repos = repos;
  fetchReposStarData(repos, token);
});

const fetchReposStarData = async (repos: string[], token: string) => {
  state.isFetching = true;
  const reposStarData: RepoStarData[] = [];
  try {
    const data = await getRepoData(repos, token);
    for (const d of data) {
      reposStarData.push(d);
      state.lastRecords.push({
        repo: d.repo,
        date: new Date(d.starRecords[d.starRecords.length - 1].date).getTime(),
        count: d.starRecords[d.starRecords.length - 1].count,
      });
    }
  } catch (error: any) {
    toastWarn(error.message);
    return;
  }
  state.isFetching = false;

  
    state.chartData = convertStarDataToChartData(
      reposStarData
    );
  
};
</script>
