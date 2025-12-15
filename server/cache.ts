
import * as fs from "fs";
import * as path from "path";
import logger from "./logger";

/**
 * A repo star data is type of RepoStarData, and its memory costs might be 896 bytes.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
 */
export interface RepoImage {
  svg: string;
  png: string;
  createdAt: string; // ISO string format
  expiresAt: string; // ISO string format
}

/**
 * Repo Image Cache - 基于文件系统的缓存类
 */
export class RepoImageCache {
  // 缓存目录路径
  private static readonly CACHE_DIR = path.resolve(__dirname, "../cache/repo-images");
  private static readonly DEFAULT_TTL = 8 * 60 * 60 * 1000; // 默认 8 小时过期
  private static initialized = false;

  /**
   * 将 repo 名称转换为安全的文件名
   */
  private static sanitizeRepoName(repo: string): string {
    return repo.replace(/\//g, "_").replace(/[^a-zA-Z0-9_\-]/g, "_");
  }

  /**
   * 获取 repo 的缓存文件路径
   */
  private static getCacheFilePath(repo: string): string {

    const fileName = `${this.sanitizeRepoName(repo)}.json`;
    return path.join(this.CACHE_DIR, fileName);
  }

  /**
   * 确保缓存目录存在
   */
  private static ensureCacheDir(): void {
    if (!fs.existsSync(this.CACHE_DIR)) {
      fs.mkdirSync(this.CACHE_DIR, { recursive: true });
      logger.info(`Created cache directory: ${this.CACHE_DIR}`);
    }
  }

  /**
   * 检查文件是否过期
   */
  private static isExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date();
  }

  /**
   * 初始化缓存目录
   */
  static init(): void {
    if (!this.initialized) {
      this.ensureCacheDir();
      this.initialized = true;
      logger.info("RepoImageCache initialized");
    }
  }

  /**
   * 设置缓存（覆盖已存在的缓存）
   * @param repo - Repository name (e.g., "owner/repo")
   * @param svg - SVG content
   * @param ttl - Time to live in milliseconds (default: 3 hours)
   */
  static set(repo: string, svg:string, png: string, ttl: number = this.DEFAULT_TTL): boolean {
    try {
      this.init();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + ttl);

      const cacheData: RepoImage = {
        svg: svg,
        png: png,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      const filePath = this.getCacheFilePath(repo);
      if(fs.existsSync(filePath)) {
        fs.rmSync(filePath);
      }
      fs.writeFileSync(filePath, JSON.stringify(cacheData, null, 2), "utf-8");
      logger.debug(`Cache SET: ${repo} (expires at ${expiresAt.toISOString()})`);
      return true;
    } catch (error) {
      logger.error(`Failed to set cache for ${repo}:`, error);
      return false;
    }
  }

  /**
   * 获取缓存
   * @param repo - Repository name
   * @returns Cached SVG content or null if not found or expired
   */
  static get(repo: string, imgType: "png" | "svg"): string | null {
    try {
      this.init();
      const filePath = this.getCacheFilePath(repo);

      if (!fs.existsSync(filePath)) {
        logger.debug(`Cache GET: ${repo} - Not found`);
        return null;
      }

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const cacheData: RepoImage = JSON.parse(fileContent);

      // 检查是否过期
      if (this.isExpired(cacheData.expiresAt)) {
        logger.debug(`Cache GET: ${repo} - Expired, deleting file`);
        this.delete(repo);
        return null;
      }

      logger.debug(`Cache GET: ${repo} - Found`);
      return imgType === "png" ? cacheData.png : cacheData.svg;
    } catch (error) {
      logger.error(`Failed to get cache for ${repo}:`, error);
      return null;
    }
  }





  /**
   * 删除缓存
   * @param repo - Repository name
   */
  static delete(repo: string): boolean {
    try {
      this.init();
      const filePath = this.getCacheFilePath(repo);

      if (!fs.existsSync(filePath)) {
        logger.debug(`Cache DELETE: ${repo} - Not found`);
        return false;
      }

      fs.unlinkSync(filePath);
      logger.debug(`Cache DELETE: ${repo} - Deleted`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete cache for ${repo}:`, error);
      return false;
    }
  }

  /**
   * 检查缓存是否存在且未过期
   * @param repo - Repository name
   */
  static exists(repo: string): boolean {
    try {
      this.init();
      const filePath = this.getCacheFilePath(repo);

      if (!fs.existsSync(filePath)) {
        return false;
      }

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const cacheData: RepoImage = JSON.parse(fileContent);

      if (this.isExpired(cacheData.expiresAt)) {
        this.delete(repo);
        return false;
      }

      return true;
    } catch (error) {
      logger.error(`Failed to check existence for ${repo}:`, error);
      return false;
    }
  }

  /**
   * 清理所有过期的缓存文件
   */
  static cleanExpired(): number {
    try {
      this.init();
      let cleanedCount = 0;

      if (!fs.existsSync(this.CACHE_DIR)) {
        return 0;
      }

      const files = fs.readdirSync(this.CACHE_DIR);
      for (const file of files) {
        if (!file.endsWith(".json")) {
          continue;
        }

        const filePath = path.join(this.CACHE_DIR, file);
        try {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const cacheData: RepoImage = JSON.parse(fileContent);

          if (this.isExpired(cacheData.expiresAt)) {
            fs.unlinkSync(filePath);
            cleanedCount++;
            logger.debug(`Cleaned expired cache: ${file}`);
          }
        } catch (error) {
          // 如果文件损坏，也删除它
          logger.warn(`Removing corrupted cache file: ${file}`, error);
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      }

      logger.info(`Cleaned ${cleanedCount} expired cache files`);
      return cleanedCount;
    } catch (error) {
      logger.error("Failed to clean expired cache:", error);
      return 0;
    }
  }

  /**
   * 获取缓存文件的剩余 TTL
   * @param repo - Repository name
   * @returns TTL in milliseconds, -1 if no TTL, -2 if not found
   */
  static getTTL(repo: string): number {
    try {
      this.init();
      const filePath = this.getCacheFilePath(repo);

      if (!fs.existsSync(filePath)) {
        return -2; // Not found
      }

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const cacheData: RepoImage = JSON.parse(fileContent);

      const now = Date.now();
      const expiresAt = new Date(cacheData.expiresAt).getTime();
      const remaining = expiresAt - now;

      return remaining > 0 ? remaining : -2; // Expired or not found
    } catch (error) {
      logger.error(`Failed to get TTL for ${repo}:`, error);
      return -2;
    }
  }
}


