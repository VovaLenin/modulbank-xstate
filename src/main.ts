import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Antd from "ant-design-vue";
// import videojs from "video.js";
import "video.js/dist/video-js.css";

import "./assets/styles/styles.scss";

const app = createApp(App);
app.use(Antd);
// app.use(videojs);
app.mount("#app");
