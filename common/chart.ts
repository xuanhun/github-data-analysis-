import { IDataType, IDataValues } from "@visactor/vchart";
import { ChartMode, RepoStarData, RepoData } from "../types/chart";
import api from "./api";
import utils from "./utils";

export const DEFAULT_MAX_REQUEST_AMOUNT = 60;

const STAR_HISTORY_LOGO_URL =
  "https://avatars.githubusercontent.com/u/2384516?v=4";

export const getReposStarData = async (
  repos: string[],
  token = "",
  maxRequestAmount = DEFAULT_MAX_REQUEST_AMOUNT
): Promise<RepoStarData[]> => {
  const repoStarDataCacheMap = new Map();

  for (const repo of repos) {
    try {
      const starRecords = await api.getRepoStarRecords(
        repo,
        token,
        maxRequestAmount
      );
      repoStarDataCacheMap.set(repo, starRecords);
    } catch (error: any) {
      let message = "";
      let status = 500;

      if (error?.response?.status === 404) {
        message = `Repo ${repo} not found`;
        status = 404;
      } else if (error?.response?.status === 403) {
        message = "GitHub API rate limit exceeded";
        status = 403;
      } else if (error?.response?.status === 401) {
        message = "Access Token Unauthorized";
        status = 401;
      } else if (Array.isArray(error?.data) && error.data?.length === 0) {
        message = `Repo ${repo} has no star history`;
        status = 501;
      } else {
        message = "Some unexpected error happened, try again later";
      }

      return Promise.reject({
        message,
        status,
        repo,
      });
    }
  }

  const reposStarData: RepoStarData[] = [];
  for (const repo of repos) {
    const records = repoStarDataCacheMap.get(repo);
    if (records) {
      reposStarData.push({
        repo,
        starRecords: records,
      });
    }
  }

  return reposStarData.sort((d1, d2) => {
    return (
      Math.max(...d2.starRecords.map((s) => s.count)) -
      Math.max(...d1.starRecords.map((s) => s.count))
    );
  });
};

export const getRepoData = async (
  repos: string[],
  token = "",
  maxRequestAmount = DEFAULT_MAX_REQUEST_AMOUNT
): Promise<RepoData[]> => {
  const repoDataCacheMap: Map<
    string,
    {
      star: {
        date: string;
        count: number;
      }[];
      logo: string;
    }
  > = new Map();
  // 从 server api 获取Mongo中缓存的数据
  // todo
  const repoDataFromServer = await fetch(`https://gitdata.xuanhun520.com/api/starjson?repos=${repos.join(",")}`);
  const repoDataFromServerJson = await repoDataFromServer.json();
  for (const repo of repos) {
    const repoData = repoDataFromServerJson.repos.find((r: any) => r.repo === repo);
    if (repoData) {
      //判断最后更新日期是不是今天
      const lastDate = new Date(
        repoData.starRecords[repoData.starRecords.length - 1].date
      );
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      if (lastDate < todayStart) {
        // 获取最新的 count 作为当前日期的 count
        const latestCount = await api.getRepoStargazersCount(repo, token);
        repoData.starRecords.push({
          date: utils.getDateString(Date.now(), "yyyy/MM/dd"),
          count: latestCount,
        });
           // 更新Mongo 中的数据
         fetch(`https://gitdata.xuanhun520.com/api/updatestarjson`, {
          method: "POST",
             headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(repoData)
        });
      }
      repoDataCacheMap.set(repo, { star: repoData.starRecords, logo: repoData.logoUrl });
    }
    else {
      try {
        const starRecords = await api.getRepoStarRecords(
          repo,
          token,
          maxRequestAmount
        );
        const logo = await api.getRepoLogoUrl(repo, token);
        repoDataCacheMap.set(repo, { star: starRecords, logo });
        // 更新Mongo 中的数据
         fetch(`https://gitdata.xuanhun520.com/api/updatestarjson`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repo,
            starRecords: starRecords,
            logoUrl: logo,
          } as any),
        });
      } catch (error: any) {
        let message = "";
        let status = 500;

        if (error?.response?.status === 404) {
          message = `Repo ${repo} not found`;
          status = 404;
        } else if (error?.response?.status === 403) {
          message = "GitHub API rate limit exceeded";
          status = 403;
        } else if (error?.response?.status === 401) {
          message = "Access Token Unauthorized";
          status = 401;
        } else if (Array.isArray(error?.data) && error.data?.length === 0) {
          message = `Repo ${repo} has no star history`;
          status = 501;
        } else {
          message = "Some unexpected error happened, try again later";
        }

        console.error("Failed to request data:", status, message);

        // If encountering not found or no star error, we will return an empty image so that cache can be set.
        if (status === 404 || status === 501) {
          return [
            {
              repo,
              starRecords: [
                {
                  date: utils.getDateString(Date.now(), "yyyy/MM/dd"),
                  count: 0,
                },
              ],
              logoUrl: STAR_HISTORY_LOGO_URL,
            },
          ];
        }

        return Promise.reject({
          message,
          status,
          repo,
        });
      }
    }
  }

  const reposStarData: RepoData[] = [];

  for (const repo of repos) {
    const records = repoDataCacheMap.get(repo);
    if (records) {
      reposStarData.push({
        repo,
        starRecords: records.star,
        logoUrl: records.logo,
      });
    }
  }

  return reposStarData.sort((d1, d2) => {
    return (
      Math.max(...d2.starRecords.map((s) => s.count)) -
      Math.max(...d1.starRecords.map((s) => s.count))
    );
  });
};


/**
 * Convert star data to VChart data format
 * 
 * @param reposStarData - Repository star data array
 * @param chartMode - Chart mode: "Date" or "Timeline"
 * @returns IDataType - VChart compatible data format
 * 
 * Note: For time axis (type: "time"), the x field accepts:
 * - Number (timestamp in milliseconds): Recommended for performance
 * - Date object: Will be converted automatically
 * - ISO 8601 string: e.g., "2023-10-05T12:00:00.000Z"
 */
export const convertStarDataToChartData = (
  reposStarData: RepoStarData[]
): IDataType => {

  const datasets: IDataValues = {
    values: [],
  };
  reposStarData.map((item) => {
    const { repo, starRecords } = item;
    starRecords.map((item) => {
      // Convert date to timestamp (milliseconds) for time axis
      // Time axis accepts: number (timestamp), Date object, or ISO 8601 string
      (datasets.values as any[]).push({
        x: new Date(item.date).getTime(),
        y: Number(item.count),
        series: repo,
      });
    })
  });

  return datasets as IDataType;
};
