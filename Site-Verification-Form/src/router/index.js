import { createRouter, createWebHistory } from "vue-router";
import TheFormView from "../views/TheFormView.vue";
import SuccessPageView from "@/views/Success-Page-View.vue";
import NavMapView from "@/views/Nav-Map-View.vue";
import RecordsListView from "@/views/Records-List-View.vue";
import RecordDetailsView from "@/views/Record-Details-View.vue";

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
      component: NavMapView,
    },
    {
      path: "/Submitted",
      name: "Submitted",
      component: SuccessPageView,
    },
    {
      path: "/Records",
      name: "Records",
      component: RecordsListView,
    },
    {
      path: '/records/:id',
      name: 'record-detail',
      component: RecordDetailsView,
      props: true,
    },
  ],
});

export default router;
