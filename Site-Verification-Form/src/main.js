import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // Import the CSS

const app = createApp(App);

const toastOptions = {
  timeout: 3000, // 3s duration
  closeOnClick: true, // Close on click
  pauseOnHover: true, // Pause on hover
  draggable: true, // Allow dragging to dismiss
  draggablePercent: 0.6, // 60% drag required to dismiss
  position: "top-right", // Position (top-right, bottom-left, etc.)
};

app.use(Toast, toastOptions); // Initialize with options

app.use(router);

app.mount("#app");
