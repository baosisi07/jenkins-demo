import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { userInfoStore } from "../stores/userInfo";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/detail",
      name: "detail",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/DetailView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/create",
      name: "create",
      component: () => import("../views/CreateView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/statisics",
      name: "statisics",
      component: () => import("../views/DataView.vue"),
    },
  ],
});

router.beforeEach((to) => {
  const userInfo = userInfoStore();
  if (to.meta.requiresAuth && !userInfo.isLoggedIn) return "/login";
});
export default router;
