<template>
  <div ref="containerElRef" class="relative w-full h-auto min-h-400px self-center max-w-3xl 2xl:max-w-4xl sm:p-4 pt-0">
    <div v-if="isFetching" class="absolute w-full h-full flex justify-center items-center z-10 top-0">
      <div class="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
      <i class="fas fa-spinner animate-spin text-4xl z-10"></i>
    </div>

    <div class="flex flex-row items-center gap-2">
      <label for="theme">Theme</label>
      <select id="theme" v-model="state.theme" class="w-[100px] border-2 border-blue-500 rounded"
        @change="handleThemeChange">
         <option value="dark">Dark</option>
        <option value="light">Light</option>
       
      </select>
    </div>
    <StarXYChart v-if="state.chartData" ref="starChartRef" classname="w-full h-auto mt-4" :data="state.chartData"
      :theme="state.theme" :lastRecords="state.lastRecords" />
  </div>
  <div v-if="state.chartData"
    class="relative mt-4 mb-4 w-full px-3 mx-auto max-w-4xl flex flex-row flex-wrap justify-between items-center">

    <div class="flex flex-row flex-wrap justify-end items-center mb-2">
      <button
        class="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
        :class="state.isGeneratingImage ? 'bg-gray-200 cursor-wait' : ''" @click="handleGenerateImageBtnClick">
        <i class="fas fa-download"></i>
        Image
      </button>
      <button
        class="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
        @click="handleExportAsSVGBtnClick">
        <i class="fas fa-download"></i>
        SVG
      </button>
      <button
        class="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
        @click="handleGenEmbedCodeDialogBtnClick">
        <i class="fas fa-code"></i>
        Embed
      </button>
      <button
        class="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
        @click="handleCopyLinkBtnClick">
        <i class="far fa-copy"></i>
        Link
      </button>
      <button
        class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-600 border border-transparent text-white hover:bg-green-700"
        @click="handleShareToTwitterBtnClick">
        <i class="relative -bottom-px fab fa-twitter"></i>
        Share on Twitter
      </button>
    </div>
  </div>
  <EmbedMarkdownSection v-if="state.chartData"></EmbedMarkdownSection>
  <div class="grow"></div>


  <TokenSettingDialog v-if="state.showSetTokenDialog" @close="handleSetTokenDialogClose" />
  <GenerateEmbedCodeDialog v-if="state.showGenEmbedCodeDialog" @close="handleGenEmbedCodeDialogClose" :token="state.token" />
  <!-- embed chart guide dialog -->
  <EmbedChartGuideDialog v-if="state.showEmbedChartGuideDialog" @close="state.showEmbedChartGuideDialog = false" />
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import useAppStore from "../store";
import { IDataType } from "@visactor/vchart";

import utils from "../../common/utils";
import { convertStarDataToChartData, getRepoData } from "../../common/chart";
import api from "../../common/api";
import toast from "../helpers/toast";
import { RepoData } from "../../types/chart";

import StarXYChart from "./Charts/StarXYChart.vue";
import TokenSettingDialog from "./TokenSettingDialog.vue";
import GenerateEmbedCodeDialog from "./GenerateEmbedCodeDialog.vue";
import EmbedMarkdownSection from "./EmbedMarkdownSection.vue";
import EmbedChartGuideDialog from "./EmbedChartGuideDialog.vue";
import { convertVChartToSvg } from '@visactor/vchart-svg-plugin';


interface State {
  repoCacheMap: Map<
    string,
    {
      starData: {
        date: string;
        count: number;
      }[];
      logoUrl: string;
    }
  >;
  chartData: IDataType | undefined;
  isGeneratingImage: boolean;
  showSetTokenDialog: boolean;
  showGenEmbedCodeDialog: boolean;
  showEmbedChartGuideDialog: boolean;
  theme: string;
  lastRecords: any;
  token: string;
}

const state = reactive<State>({
  repoCacheMap: new Map(),
  chartData: undefined,
  isGeneratingImage: false,

  showSetTokenDialog: false,
  showGenEmbedCodeDialog: false,
  showEmbedChartGuideDialog: false,
  theme: "dark",
  lastRecords: [],
  token: "",
});
const store = useAppStore();

const containerElRef = ref<HTMLDivElement | null>(null);
const starChartRef = ref<InstanceType<typeof StarXYChart> | null>(null);

const isFetching = computed(() => {
  return store.isFetching;
  
});

onMounted(() => {
  store.setTheme(state.theme);
  state.token = store.token;
  if (state.token.length === 0) {
    state.showSetTokenDialog = true;
  }
  if (store.repos.length > 0) {
    fetchReposData(store.repos);
  }
});

watch(
  () => store.repos,
  () => {
    fetchReposData(store.repos);
  }
);

const fetchReposData = async (repos: string[]) => {
  store.setIsFetching(true);
  const notCachedRepos: string[] = [];

  for (const repo of repos) {
    const cachedRepo = state.repoCacheMap.get(repo);

    if (!cachedRepo) {
      notCachedRepos.push(repo);
    }
  }

  try {
    if (notCachedRepos.length != 0) {
      const data = await getRepoData(notCachedRepos, store.token);
      for (const { repo, starRecords, logoUrl } of data) {
        state.repoCacheMap.set(repo, {
          starData: starRecords,
          logoUrl,
        });

      }
    }

  } catch (error: any) {
    toast.warn(error.message);

    if (error.status === 401 || error.status === 403) {
      state.showSetTokenDialog = true;
    } else if (error.status === 404 || error.status === 501) {
      store.delRepo(error.repo);
    }
  }
  store.setIsFetching(false);

  const repoData: RepoData[] = [];
  const lastRecords: any = [];

  for (const repo of repos) {
    const cachedRepo = state.repoCacheMap.get(repo);
    if (cachedRepo) {
      repoData.push({
        repo,
        starRecords: cachedRepo.starData,
        logoUrl: cachedRepo.logoUrl,
      });
      lastRecords.push({
        repo,
        date: new Date(cachedRepo.starData[cachedRepo.starData.length - 1].date).getTime(),
        count: cachedRepo.starData[cachedRepo.starData.length - 1].count,
      });
    }
  }
  state.lastRecords = lastRecords;


  if (repoData.length === 0) {
    state.chartData = undefined;
  } else {
    state.chartData = convertStarDataToChartData(repoData);
  }
};

const handleCopyLinkBtnClick = async () => {
  await utils.copyTextToClipboard(window.location.href);
  toast.succeed("Link copied");
};

const handleGenerateImageBtnClick = async () => {
  if (state.isGeneratingImage) {
    return;
  }
  state.isGeneratingImage = true;

  let destoryGeneratingToast = () => {
    // do nth
  };
  setTimeout(() => {
    if (state.isGeneratingImage) {
      const cbs = toast.warn(
        `<i class="fas fa-spinner animate-spin text-2xl mr-3"></i>Generating image`,
        -1
      );
      destoryGeneratingToast = cbs.destory;
    }
  }, 2000);

  try {
    // 获取图表实例
    const chartInstance = starChartRef.value?.getChartInstance();

    if (!chartInstance) {
      toast.warn("Chart not ready");
      state.isGeneratingImage = false;
      destoryGeneratingToast();
      return;
    }



    // 获取图片的 data URL
    const dataURL = await chartInstance.getDataURL();

    // 将 data URL 转换为 Blob
    const response = await fetch(dataURL);
    const blob = await response.blob();

    // 创建 ObjectURL
    const objectURL = URL.createObjectURL(blob);

    // 创建下载链接并自动下载
    const link = document.createElement("a");
    link.href = objectURL;
    link.download = `star-history-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 清理 ObjectURL
    setTimeout(() => {
      URL.revokeObjectURL(objectURL);
    }, 100);

    toast.succeed("Image downloaded successfully");
    state.isGeneratingImage = false;
    destoryGeneratingToast();
  } catch (error: any) {
    console.error("Failed to generate image:", error);
    toast.warn(error.message || "Failed to generate image");
    state.isGeneratingImage = false;
    destoryGeneratingToast();
  }
};

const handleExportAsSVGBtnClick = () => {
  let CSVContent = "";
  state.isGeneratingImage = true;

  let destoryGeneratingToast = () => {
    // do nth
  };
  setTimeout(() => {
    if (state.isGeneratingImage) {
      const cbs = toast.warn(
        `<i class="fas fa-spinner animate-spin text-2xl mr-3"></i>Generating SVG`,
        -1
      );
      destoryGeneratingToast = cbs.destory;
    }
  }, 2000);
  try {
    // 获取图表实例
    const chartInstance = starChartRef.value?.getChartInstance();
    if (!chartInstance) {
      toast.warn("Chart not ready");
      state.isGeneratingImage = false;
      destoryGeneratingToast();
      return;
    }
    const svg = convertVChartToSvg(chartInstance);
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.download = `star-history-${utils.getDateString(
      Date.now(),
      "yyyyMMdd"
    )}.svg`;
    link.href = svgUrl;
    link.click();
    toast.succeed("SVG Downloaded");
  } catch (error: any) {
    console.error("Failed to export SVG:", error);
    toast.warn(error.message || "Failed to export SVG");
    state.isGeneratingImage = false;
  } finally {
    state.isGeneratingImage = false;
    destoryGeneratingToast();
  }


};

const handleShareToTwitterBtnClick = async () => {
  const repos = store.repos;
  if (repos.length === 0) {
    toast.error("No repo found");
    return;
  }

  const starhistoryLink = encodeURIComponent(window.location.href);
  let text = "";

  if (repos.length === 1) {
    const repo = repos[0];
    let starCount = 0;

    try {
      starCount = await api.getRepoStargazersCount(repo, store.token);
    } catch (error) {
      // do nth
    }

    let starText = "";
    if (starCount > 0) {
      starText = `${(starCount < 1000 ? starCount : (starCount / 1000).toFixed(1) + "K") +
        " ⭐️ "
        }`;
    }
    text = `${starText}Thank you! 🙏%0A${starhistoryLink}%0A%0A`;
  } else {
    text = repos.join(" vs ") + "%0A%0A";
  }

  const addtionLink =
    repos.length === 1 ? `github.com/${repos[0]}` : starhistoryLink;
  text += `${addtionLink}%0A%0A`;
  text += `${encodeURIComponent("#starhistory #GitHub #OpenSource #DataVisualization #VChart #VisActor #XuanHun")}`;
  const tweetShareLink = `https://twitter.com/intent/tweet?text=${text}%0A&via=xuanhun1`;
  const link = document.createElement("a");
  link.href = tweetShareLink;
  link.target = "_blank";
  link.click();
};

const handleGenEmbedCodeDialogBtnClick = () => {
  state.showGenEmbedCodeDialog = true;
};

const handleGenEmbedCodeDialogClose = () => {
  state.showGenEmbedCodeDialog = false;
};


const handleSetTokenDialogClose = () => {
  state.showSetTokenDialog = false;
};

const handleThemeChange = (event: Event) => {
  state.theme = (event.target as HTMLSelectElement).value;
  store.setTheme(state.theme);
};
</script>
