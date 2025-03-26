import { createRouter, createWebHistory } from "vue-router";
import TheFormView from "../views/TheFormView.vue";
import TheMapView from "@/views/TheMapView.vue";
import SuccessPageView from "@/views/Success-Page-View.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/form",
      name: "theform",
      component: TheFormView,
    },
    {
      path: "/Map",
      name: "theMap",
      component: TheMapView,
    },
    {
      path: "/Submitted",
      name: "Submitted",
      component: SuccessPageView,
    },
  ],
});

export default router;
