import { createRouter, createWebHistory } from "vue-router";
import TheFormView from "../views/TheFormView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/form",
      name: "theform",
      component: TheFormView,
    },
  ],
});

export default router;
