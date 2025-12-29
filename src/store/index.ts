import { createPinia, defineStore } from "pinia";
import storage from "../helpers/storage";
import { ChartMode } from "../../types/chart";

export const piniaInstance = createPinia();

interface AppState {
  isFetching: boolean;
  token: string;
  repos: string[];
  chartMode: ChartMode;
  theme: string;
}

const useAppStore = defineStore("appStore", {
  state: (): AppState => {
    const { accessTokenCache } = storage.get(["accessTokenCache"]);
    const search = window.location.search.slice(1);
    const params = search.split("&").filter((i) => Boolean(i));
    const repos: string[] = [];
    let chartMode: ChartMode = "Date";
    let theme: string = "light";
    for (const value of params) {
      if (value === "type=Date" || value === "type=Timeline") {
        chartMode = value.split("=")[1] as ChartMode;
        continue;
      }
      if (value.startsWith("theme=")) {
          theme = value.split("=")[1];
          continue;
      }
      if (value.startsWith("repos=") && !repos.includes(value)) {
        repos.push(...value.split("=")[1].split(","));
      }
    }

    return {
      isFetching: false,
      token: accessTokenCache || "",
      repos: repos,
      chartMode: chartMode,
      theme: theme,
    };
  },
  actions: {
    addRepo(repo: string) {
      if (!this.repos.includes(repo)) {
        this.repos.push(repo);
      }
      this.repos = [...this.repos];
    },
    delRepo(repo: string) {
      if (this.repos.includes(repo)) {
        this.repos.splice(this.repos.indexOf(repo), 1);
      }
      this.repos = [...this.repos];
    },
    setRepos(repos: string[]) {
      this.repos = repos;
    },
    setToken(token: string) {
      this.token = token;
    },
    setIsFetching(isFetching: boolean) {
      this.isFetching = isFetching;
    },
    setChartMode(chartMode: ChartMode) {
      this.chartMode = chartMode;
    },
    setTheme(theme: string) {
      this.theme = theme;
    },
  },
});

export default useAppStore;
