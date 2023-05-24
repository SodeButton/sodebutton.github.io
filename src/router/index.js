import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Apps from "../views/Apps.vue";
import Articles from "../views/Articles.vue";
import ArticlesDev from "../views/ArticlesDev.vue";
import NotFound from "../views/404.vue";
import EnvironmentPTV from "../views/articles/environments/ptv/index.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
      desc: "ホーム",
    },
  },
  {
    path: "/apps",
    name: "Apps",
    component: Apps,
    meta: {
      title: "Apps",
      desc: "アプリ",
    },
  },
  {
    path: "/articles-dev",
    name: "ArticlesDev",
    component: ArticlesDev,
    meta: {
      title: "Dev",
      desc: "Dev",
    },
  },
  {
    path: "/articles",
    children: [
      {
        path: "",
        name: "Articles",
        component: Articles,
        meta: {
          title: "Articles",
          desc: "記事",
        },
      },
      {
        path: "ptv",
        name: "Phaser + TypeScript + Vite",
        component: EnvironmentPTV,
        meta: {
          title: "Phaser + TypeScript + Viteの環境設定",
          desc: "Phaser + TypeScript + Viteの環境を構築します",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: NotFound,
    meta: {
      title: "404",
      desc: "404",
    },
  },
];

const router = new createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const DEFAULT_TITLE = "Buttome";

router.afterEach((to) => {
  if (!to.meta.hasOwnProperty("title")) return;
  const title = to.meta.title;
  document.title = title + " | " + DEFAULT_TITLE;
});

export default router;
