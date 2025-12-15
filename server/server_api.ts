import { getRepoData, RepoCacheData } from "./mongo";

export async function getRepoStarRecordsFromCache(repo: string):Promise<RepoCacheData | null> {
    const repoData = await getRepoData(repo);
    return repoData;
  }