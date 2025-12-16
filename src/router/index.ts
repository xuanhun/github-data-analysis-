import { createRouter, createWebHistory } from "vue-router";
import { i18n, supportedLocales } from "../i18n";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../pages/Home.vue"),
  },
  {
    path: "/embed",
    name: "embed-website",
    component: () => import("../pages/EmbedWebSite.vue"),
  },
  {
    path: "/embed-test",
    name: "embed-test",
    component: () => import("../pages/EmbedTest.vue"),
  },
  {
    path: "/blog",
    name: "blog-list",
    component: () => import("../pages/BlogList.vue"),
  },
  {
    path: "/blog/:blogSlug",
    name: "blog-detail",
    component: () => import("../pages/Blog.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../pages/404.vue"),
  },
  {
    path: "/:pathList(.*)*",
    name: "dynamic-path-matcher",
    component: () => import("../pages/DynamicPathMatcher.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const lang = (to.query.lang || to.query.locale || to.query.hl) as string | undefined;
  if (lang && supportedLocales.includes(lang)) {
    i18n.setLocale(lang);
  }
  next();
});

export default router;
