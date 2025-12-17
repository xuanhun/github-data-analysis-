import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import bodyParser from "@koa/bodyparser";
import dotenv from 'dotenv'

const initEnv = () => {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, "../../.env"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      break;
    }
  }
}
initEnv();



import { optimize, Config } from 'svgo';
import logger from "./logger";
import XYChart from "../packages/xy-chart";
import { convertStarDataToChartData, getRepoData } from "../common/chart";
const Canvas = require('canvas');
const { convertVChartToSvg } = require('@visactor/vchart-svg-plugin');
import { RepoData } from "../types/chart";
import {
  getChartWidthWithSize,
  replaceSVGContentFilterWithCamelcase,
  getBase64Image,
} from "./utils";
import { getNextToken, initTokenFromEnv } from "./token";
import { ChartMode } from "../types/chart";
import { CHART_SIZES, CHART_TYPES, MAX_REQUEST_AMOUNT } from "./const";
import { getRepoStarRecordsFromCache } from "./server_api";
import api from "../common/api";
import { updateRepoData } from "./mongo";

import { RepoImageCache } from "./cache";
import { trackApiEvent } from "./analytics";



const startServer = async () => {
  
  await initTokenFromEnv();

  const app = new Koa();
  app.use(cors());
  const router = new Router();

  const ALLOWED_ORIGINS = new Set([
    "https://gitdata.xuanhun520.com",
    "https://localhost:3000",
  ]);
  const isAllowedOrigin = (origin?: string, host?: string) => {
    // If origin is provided, check it against allowed origins
    if (origin) {
      return ALLOWED_ORIGINS.has(origin);
    }
    // If origin is not provided, check host against allowed origins (add protocol)
    if (host) {
      // Try both http and https protocols since host doesn't include protocol
      return ALLOWED_ORIGINS.has(`https://${host}`) || ALLOWED_ORIGINS.has(`http://${host}`);
    }
    // If neither origin nor host is provided, deny access
    return false;
  };

  // Example request link:
  // /starimg?repos=star-history/star-history&type=Date&theme=light&transparent=false
  router.get("/api/starimg", async (ctx) => {
    const theme = `${ctx.
      query["theme"]}`;
    const transparent = `${ctx.query["transparent"]}`
    const repos = `${ctx.query["repos"]}`.split(",");
    let type = `${ctx.query["type"]}` as ChartMode;
    let size = `${ctx.query["size"]}`;
    let imgType = `${ctx.query["imgtype"]}` == "undefined" ? "png" : `${ctx.query["imgtype"]}`; //png or svg

    if (!CHART_TYPES.includes(type)) {
      type = "Date";
    }

    if (!CHART_SIZES.includes(size)) {
      size = "laptop";
    }

    if (repos.length === 0) {
      ctx.throw(400, `${http.STATUS_CODES[400]}: Repo name required`);
      return;
    }
    const repoData: RepoData[] = [];

    let imageContent = "";
    if (imgType === "png") {
      imageContent = RepoImageCache.get(repos.join(",") + theme, "png");
    }
    else if (imgType === "svg") {
      imageContent = RepoImageCache.get(repos.join(",") + theme, "svg");
    }
    if (!imageContent) {
      try {
        const token = getNextToken();
        // 先从mongo中获取数据
        for (const repo of repos) {
          const repoDataFromMongo = await getRepoStarRecordsFromCache(repo);
          //如果数据最新时间在7天前，则不添加到repoData
          if (!repoDataFromMongo || repoDataFromMongo && new Date(repoDataFromMongo.starLogs[repoDataFromMongo.starLogs.length - 1].date) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
            const data = await getRepoData([repo], token, MAX_REQUEST_AMOUNT);
            repoData.push(data[0]);
          }
          else if (repoDataFromMongo && repoDataFromMongo.starLogs?.length > 0) {
            var repoDataItem = {
              repo,
              starRecords: repoDataFromMongo.starLogs,
              logoUrl: repoDataFromMongo.logo,
            };
            repoData.push(repoDataItem);
            //如果最新数据不是今天，获取最新Count数据，更新到repodata和repoDataFromMongo
            if (new Date(repoDataFromMongo.starLogs[repoDataFromMongo.starLogs.length - 1].date) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
              const count = await api.getRepoStargazersCount(repo, token);
              repoDataItem.starRecords.push({ date: new Date().toISOString(), count });
            }
          }

        }
        //根据repoData 更新mongo
        for (const repoDataItem of repoData) {
          await updateRepoData(repoDataItem.repo, { starLogs: repoDataItem.starRecords, logo: repoDataItem.logoUrl });
        }

        const chart = XYChart(
          null,
          {
            title: "Star History",
            xLabel: "",
            yLabel: "GitHub Stars",
            data: convertStarDataToChartData(repoData),
            showDots: true,
            transparent: false,
            theme: theme as "light" | "dark",
            mode: "node",
            modeParams: Canvas
          }
        );

        await chart.renderAsync();
        const pngBuffer = chart.getImageBuffer();
        const png = pngBuffer.toString("base64");
        const svg = convertVChartToSvg(chart);
        // Optimizing SVG to save bandwidth
        const svgC = replaceSVGContentFilterWithCamelcase(svg);
        //写入缓存
        RepoImageCache.set(repos.join(",") + theme, svgC, png);
        void trackApiEvent(ctx, "generate_chart_img", { repo: repos.join(","), type, size, theme, transparent, imgType });

      }
      catch (error: any) {
        const status = error.status || 400;
        const message =
          error.message || "Some unexpected error happened, try again later";

        ctx.status = status;
        ctx.message = `${http.STATUS_CODES[status]}: ${message}`;
        return;
      }
    }

    imageContent = RepoImageCache.get(repos.join(",") + theme, imgType as "png" | "svg");

    try {
      const options: Config = {
        multipass: true, // Apply optimizations multiple times
      };

      const now = new Date();
      if (imgType === "svg") {
        const optimized = optimize(imageContent, options).data;

        ctx.type = "image/svg+xml;charset=utf-8";
        ctx.set("cache-control", "no-cache");
        ctx.set("date", `${now}`);
        ctx.set("expires", `${now}`);
        ctx.body = optimized;
      }
      else if (imgType === "png") {
        const pngBuffer = Buffer.from(imageContent, "base64");
        ctx.type = "image/png";
        ctx.set("cache-control", "no-cache");
        ctx.set("date", `${now}`);
        ctx.set("expires", `${now}`);
        ctx.body = pngBuffer;
      }
    } catch (error) {
      ctx.throw(
        500,
        `${http.STATUS_CODES[500]}: Failed to generate chart, ${error}`
      );
      return;
    }

  });

  //get star data  from mongo by repo name, return the star data as json
  router.get("/api/starjson", async (ctx) => {
    const origin = ctx.headers.origin;
    const host = ctx.headers.host;
    if (!isAllowedOrigin(origin, host)) {
      ctx.throw(403, `${http.STATUS_CODES[403]}: origin ${origin || `host ${host}`} is not allowed`);
      return;
    }
    const repos = `${ctx.query["repos"]}`.split(",");
    const repoData: RepoData[] = [];
    const responseData: any = {
      repos: repoData,
    };
    for (const repo of repos) {
      const repoDataFromMongo = await getRepoStarRecordsFromCache(repo);
      const lastDate = repoDataFromMongo ? new Date(repoDataFromMongo.starLogs[repoDataFromMongo.starLogs.length - 1].date) : null;
      //如果数据最新时间在7天前，则不添加到repoData
      if (lastDate && lastDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        responseData.repos.push({
          repo,
          starRecords: repoDataFromMongo.starLogs,
          logoUrl: repoDataFromMongo.logo
        });
      }
    }

    const now = new Date();
    ctx.type = "application/json";
    ctx.set("cache-control", "no-cache");
    ctx.set("date", `${now}`);
    ctx.set("expires", `${now}`);
    ctx.body = responseData;
    void trackApiEvent(ctx, "starjson", { repos: repos.join(","), returned: responseData.repos.length });
  });

  //更新star 数据
  router.post("/api/updatestarjson", async (ctx) => {
    const origin = ctx.headers.origin;
    const host = ctx.headers.host;
    if (!isAllowedOrigin(origin, host)) {
      ctx.throw(403, `${http.STATUS_CODES[403]}: origin ${origin || `host ${host}`} is not allowed`);
      return;
    }
    const repoData: RepoData = ctx.request.body;
    if (!repoData || !repoData.repo || !repoData.starRecords || repoData.starRecords.length === 0 || !repoData.logoUrl) {
      ctx.throw(400, `${http.STATUS_CODES[400]}: Bad Request`);
      return;
    } else {
      await updateRepoData(repoData.repo, { starLogs: repoData.starRecords, logo: repoData.logoUrl });
    }

    const now = new Date();
    ctx.type = "application/json";
    ctx.set("cache-control", "no-cache");
    ctx.set("date", `${now}`);
    ctx.set("expires", `${now}`);
    ctx.body = { message: "success" };
    void trackApiEvent(ctx, "updatestarjson", { repo: repoData.repo, records: repoData.starRecords.length });
  });



  app.on("error", (err) => {
    logger.error("server error: ", err);
  });

  app.use(bodyParser({ enableTypes: ["json"], jsonLimit: "10mb" }));

  app.use(router.routes()).use(router.allowedMethods());

  const port = parseInt(process.env.PORT || "8080", 10);
  const useHttps = true;

  if (useHttps) {
    // 尝试加载 SSL 证书
    const certPath = process.env.SSL_CERT_PATH || path.resolve(__dirname, "../certs/server.crt");
    const keyPath = process.env.SSL_KEY_PATH || path.resolve(__dirname, "../certs/server.key");

    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      const options = {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
      };

      https.createServer(options, app.callback()).listen(port, () => {
        logger.info(`HTTPS server running on port ${port}`);
      });
    } else {
      logger.warn(`SSL certificate files not found at ${certPath} and ${keyPath}. Falling back to HTTP.`);
      logger.warn(`To enable HTTPS, set SSL_CERT_PATH and SSL_KEY_PATH environment variables or place certificates in certs/ directory.`);
      http.createServer(app.callback()).listen(port, () => {
        logger.info(`HTTP server running on port ${port}`);
      });
    }
  } else {
    http.createServer(app.callback()).listen(port, () => {
      logger.info(`HTTP server running on port ${port}`);
    });
  }
};

startServer();
