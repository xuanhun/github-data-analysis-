import { MongoClient, Db, Collection } from "mongodb";
import logger from "./logger";

// Load environment variables from .env file
try {
  // Try to load dotenv if available
  require("dotenv").config();
} catch (error) {
  // dotenv not installed, use environment variables directly
  logger.debug("dotenv not available, using environment variables");
}

// MongoDB 数据结构类型定义
export interface RepoCacheData {
  starLogs: {
    date: string;
    count: number;
  }[];
  logo: string;
}

// MongoDB 文档结构
interface RepoDocument {
  _id: string; // repo name
  starLogs: {
    date: string;
    count: number;
  }[];
  logo: string;
  createdAt: Date;
  expiresAt: Date;
}

// MongoDB 连接配置（从 .env 文件或环境变量读取）
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "gitdata";
const MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME || "repo_cache";

// Log configuration (without sensitive data)
logger.debug(`MongoDB Config - DB: ${MONGODB_DB_NAME}, Collection: ${MONGODB_COLLECTION_NAME}`);
logger.debug(`MongoDB URI: ${MONGODB_URI.replace(/:[^:@]+@/, ":****@")}`); // Hide password in logs

// MongoDB 客户端和数据库实例
let mongoClient: MongoClient | null = null;
let db: Db | null = null;
let collection: Collection<RepoDocument> | null = null;

/**
 * 初始化 MongoDB 连接
 */
export const initMongoDB = async (): Promise<Db> => {
  if (db && mongoClient) {
    return db;
  }

  try {
    mongoClient = new MongoClient(MONGODB_URI);

    await mongoClient.connect();
    db = mongoClient.db(MONGODB_DB_NAME);
    collection = db.collection<RepoDocument>(MONGODB_COLLECTION_NAME);


    // 创建 repo 唯一索引


    logger.info(`MongoDB connected to ${MONGODB_URI}, database: ${MONGODB_DB_NAME}`);
    return db;
  } catch (error) {
    logger.error("Failed to initialize MongoDB:", error);
    throw error;
  }
};

/**
 * 获取 MongoDB 集合实例
 */
const getCollection = async (): Promise<Collection<RepoDocument>> => {
  if (!collection) {
    await initMongoDB();
  }
  if (!collection) {
    throw new Error("MongoDB collection not initialized");
  }
  return collection;
};

/**
 * 存储 repoDataCacheMap 数据到 MongoDB
 * @param repo - Repository name (e.g., "owner/repo")
 * @param data - Repository cache data
 * @param ttl - Time to live in seconds (default: 3 hours = 10800 seconds)
 */
export const setRepoData = async (
  repo: string,
  data: RepoCacheData,
  ttl: number = -1
): Promise<boolean> => {
  try {
    const coll = await getCollection();
    const now = new Date();
    const expiresAt = ttl > 0 ? new Date(now.getTime() + ttl * 1000) : new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // 100年后过期（相当于不过期）

    const document: RepoDocument = {
      _id: repo,
      starLogs: data.starLogs,
      logo: data.logo,
      createdAt: now,
      expiresAt: expiresAt,
    };

    await coll.replaceOne(
      { _id: repo },
      document,
      { upsert: true }
    );

    logger.debug(`MongoDB SET: ${repo} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    logger.error(`Failed to set repo data for ${repo}:`, error);
    return false;
  }
};

/**
 * 查询 repoDataCacheMap 数据从 MongoDB
 * @param repo - Repository name
 * @returns Repository cache data or null if not found
 */
export const getRepoData = async (
  repo: string
): Promise<RepoCacheData | null> => {
  try {
    const coll = await getCollection();
    const document = await coll.findOne({ _id: repo });

    if (!document) {
      logger.debug(`MongoDB GET: ${repo} - Not found`);
      return null;
    }

    // 检查是否过期
    if (document.expiresAt && document.expiresAt < new Date()) {
      logger.debug(`MongoDB GET: ${repo} - Expired`);
      await coll.deleteOne({ _id: repo });
      return null;
    }

    const data: RepoCacheData = {
      starLogs: document.starLogs,
      logo: document.logo,
    };

    logger.debug(`MongoDB GET: ${repo} - Found`);
    return data;
  } catch (error) {
    logger.error(`Failed to get repo data for ${repo}:`, error);
    return null;
  }
};

/**
 * 批量查询多个 repo 的数据
 * @param repos - Repository names array
 * @returns Map of repo name to cache data
 */
export const getMultipleRepoData = async (
  repos: string[]
): Promise<Map<string, RepoCacheData>> => {
  const result = new Map<string, RepoCacheData>();

  if (repos.length === 0) {
    return result;
  }

  try {
    const coll = await getCollection();
    const documents = await coll.find({
      _id: { $in: repos },
      expiresAt: { $gt: new Date() }, // 只查询未过期的
    }).toArray();

    for (const doc of documents) {
      result.set(doc._id, {
        starLogs: doc.starLogs,
        logo: doc.logo,
      });
    }

    logger.debug(`MongoDB FIND: ${repos.length} repos, ${result.size} found`);
    return result;
  } catch (error) {
    logger.error("Failed to get multiple repo data:", error);
    return result;
  }
};

/**
 * 删除 repoDataCacheMap 数据从 MongoDB
 * @param repo - Repository name
 */
export const deleteRepoData = async (repo: string): Promise<boolean> => {
  try {
    const coll = await getCollection();
    const result = await coll.deleteOne({ _id: repo });

    logger.debug(`MongoDB DELETE: ${repo} - ${result.deletedCount > 0 ? "Deleted" : "Not found"}`);
    return result.deletedCount > 0;
  } catch (error) {
    logger.error(`Failed to delete repo data for ${repo}:`, error);
    return false;
  }
};

/**
 * 批量删除多个 repo 的数据
 * @param repos - Repository names array
 */
export const deleteMultipleRepoData = async (
  repos: string[]
): Promise<number> => {
  if (repos.length === 0) {
    return 0;
  }

  try {
    const coll = await getCollection();
    const result = await coll.deleteMany({ _id: { $in: repos } });

    logger.debug(`MongoDB DELETE: ${repos.length} repos, ${result.deletedCount} deleted`);
    return result.deletedCount;
  } catch (error) {
    logger.error("Failed to delete multiple repo data:", error);
    return 0;
  }
};

/**
 * 修改 repoDataCacheMap 数据（部分更新）
 * @param repo - Repository name
 * @param updates - Partial data to update
 * @param ttl - Time to live in seconds (optional, will keep existing TTL if not provided)
 */
export const updateRepoData = async (
  repo: string,
  updates: Partial<RepoCacheData>,
  ttl?: number
): Promise<boolean> => {
  try {
    const coll = await getCollection();
    const existingDoc = await coll.findOne({ _id: repo });

    if (!existingDoc) {
      logger.warn(`Cannot update non-existent repo data: ${repo}`);
      return await setRepoData(repo, { starLogs: updates.starLogs ?? [], logo: updates.logo ?? "" });
    }

    // 合并更新
    const updatedData: RepoCacheData = {
      starLogs: updates.starLogs ?? existingDoc.starLogs,
      logo: updates.logo ?? existingDoc.logo,
    };

    // 计算新的过期时间
    let expiresAt: Date;
    if (ttl !== undefined) {
      expiresAt = new Date(Date.now() + ttl * 1000);
    } else {
      // 保持现有 TTL（计算剩余时间）
      const remainingTTL = existingDoc.expiresAt.getTime() - Date.now();
      expiresAt = new Date(Date.now() + remainingTTL);
    }

    const updatedDoc: RepoDocument = {
      _id: repo,
      starLogs: updatedData.starLogs,
      logo: updatedData.logo,
      createdAt: existingDoc.createdAt,
      expiresAt: expiresAt,
    };

    await coll.replaceOne({ _id: repo }, updatedDoc);

    logger.debug(`MongoDB UPDATE: ${repo} (TTL: ${ttl !== undefined ? ttl + 's' : 'keeping existing'})`);
    return true;
  } catch (error) {
    logger.error(`Failed to update repo data for ${repo}:`, error);
    return false;
  }
};

/**
 * 检查 repo 数据是否存在
 * @param repo - Repository name
 */
export const existsRepoData = async (repo: string): Promise<boolean> => {
  try {
    const coll = await getCollection();
    const document = await coll.findOne({ _id: repo });

    if (!document) {
      return false;
    }

    // 检查是否过期
    if (document.expiresAt && document.expiresAt < new Date()) {
      await coll.deleteOne({ _id: repo });
      return false;
    }

    return true;
  } catch (error) {
    logger.error(`Failed to check existence for ${repo}:`, error);
    return false;
  }
};

/**
 * 获取 repo 数据的剩余 TTL
 * @param repo - Repository name
 * @returns TTL in seconds, -1 if key exists but has no TTL, -2 if key doesn't exist
 */
export const getRepoDataTTL = async (repo: string): Promise<number> => {
  try {
    const coll = await getCollection();
    const document = await coll.findOne({ _id: repo });

    if (!document) {
      return -2; // Key doesn't exist
    }

    if (!document.expiresAt) {
      return -1; // No TTL
    }

    const now = Date.now();
    const expiresAt = document.expiresAt.getTime();
    const remainingSeconds = Math.floor((expiresAt - now) / 1000);

    return remainingSeconds > 0 ? remainingSeconds : -2; // Expired or doesn't exist
  } catch (error) {
    logger.error(`Failed to get TTL for ${repo}:`, error);
    return -2;
  }
};

/**
 * 设置 repo 数据的 TTL
 * @param repo - Repository name
 * @param ttl - Time to live in seconds
 */
export const setRepoDataTTL = async (
  repo: string,
  ttl: number
): Promise<boolean> => {
  try {
    const coll = await getCollection();
    const document = await coll.findOne({ _id: repo });

    if (!document) {
      logger.warn(`Cannot set TTL for non-existent repo: ${repo}`);
      return false;
    }

    const expiresAt = new Date(Date.now() + ttl * 1000);
    await coll.updateOne(
      { _id: repo },
      { $set: { expiresAt } }
    );

    logger.debug(`MongoDB EXPIRE: ${repo} - ${ttl}s`);
    return true;
  } catch (error) {
    logger.error(`Failed to set TTL for ${repo}:`, error);
    return false;
  }
};

/**
 * 关闭 MongoDB 连接
 */
export const closeMongoDB = async (): Promise<void> => {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    db = null;
    collection = null;
    logger.info("MongoDB connection closed");
  }
};

// 导出默认的 MongoDB 数据库实例（用于直接操作）
export default getCollection;

