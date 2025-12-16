import { reactive } from "vue";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";
import es from "./locales/es.json";
import ar from "./locales/ar.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import ru from "./locales/ru.json";
import ko from "./locales/ko.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";

const messages: Record<string, any> = {
  en,
  zh,
  ja,
  es,
  ar,
  it,
  pt,
  ru,
  ko,
  fr,
  de,
};

const getQueryLang = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const keys = ["lang", "locale", "hl"]; // common param names
  for (const k of keys) {
    const v = (params.get(k) || "").toLowerCase();
    if (v && messages[v]) return v;
  }
  return undefined;
};

const detect = (): string => {
  const fromQuery = getQueryLang();
  if (fromQuery) return fromQuery;
  const saved = typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
  if (saved && messages[saved]) return saved;
  const navLangs: string[] = (typeof navigator !== "undefined" && (navigator as any).languages) || [];
  for (const lang of navLangs) {
    const lower = (lang || "").toLowerCase();
    if (lower.startsWith("zh")) return "zh";
    const code = lower.split("-")[0];
    if (messages[code]) return code;
  }
  const nav = typeof navigator !== "undefined" ? navigator.language?.toLowerCase() : "en";
  if (nav && nav.startsWith("zh")) return "zh";
  const code = (nav || "en").split("-")[0];
  return messages[code] ? code : "en";
};

const state = reactive({ locale: detect() });

export const supportedLocales = Object.keys(messages);

export const i18n = {
  get locale() {
    return state.locale;
  },
  setLocale(locale: string) {
    if (!messages[locale]) return;
    state.locale = locale;
    localStorage.setItem("lang", locale);
  },
  t(key: string): string {
    const dict = messages[state.locale] || messages["en"];
    const parts = key.split(".");
    let cur: any = dict;
    for (const p of parts) cur = cur?.[p];
    return typeof cur === "string" ? cur : key;
  },
};

export const useI18n = () => i18n;
