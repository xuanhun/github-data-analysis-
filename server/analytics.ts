import fetch from "node-fetch";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

interface GaWebOptions {
  measurementId: string;
  apiSecret: string;
}

interface GaFirebaseOptions {
  firebaseAppId: string;
  apiSecret: string;
}

type GaEvent = {
  name: string;
  params?: Record<string, any>;
};

const GA_MP_ENDPOINT = "https://www.google-analytics.com/mp/collect";

export const initAnalyticsFromEnv = () => {
 
  const firebase: GaFirebaseOptions | null = process.env.GOOGLE_ANALYTICS_FIREBASE_APP_ID && process.env.GOOGLE_ANALYTICS_API_SECRET
    ? { firebaseAppId: process.env.GOOGLE_ANALYTICS_FIREBASE_APP_ID!, apiSecret: process.env.GOOGLE_ANALYTICS_API_SECRET! }
    : null;
  return firebase;
};

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export const buildClientId = (ip?: string, ua?: string) => {
  const base = `${ip || ""}|${ua || ""}`;
  return hash(base || String(Date.now()));
};



export const sendFirebaseEvent = async (appInstanceId: string, events: GaEvent[], options: GaFirebaseOptions) => {
  const url = `${GA_MP_ENDPOINT}?firebase_app_id=${encodeURIComponent(options.firebaseAppId)}&api_secret=${encodeURIComponent(options.apiSecret)}`;
  const body = {
    app_instance_id: appInstanceId,
    events: events.map((e) => ({ name: e.name, params: { ...(e.params || {}) } })),
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GA MP firebase event failed: ${res.status} ${text}`);
  }
};

// Koa integration helpers
export const trackApiEvent = async (ctx: any, name: string, params?: Record<string, any>) => {

  const ip = (ctx.headers["x-forwarded-for"] as string) || ctx.ip;
  const ua = ctx.headers["user-agent"] as string;
  const cid = buildClientId(ip, ua);
  try {
    const firebase = initAnalyticsFromEnv();
    if (!firebase) return;
    await sendFirebaseEvent(cid, [{ name, params }], firebase);
  } catch (_e) {
    // swallow errors to avoid impacting API
  }
};
