import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Antd from "ant-design-vue";
import VueVideoPlayer from "vue-video-player";
import "video.js/dist/video-js.css";

import "./assets/styles/styles.scss";

const app = createApp(App);
app.use(Antd);
app.use(VueVideoPlayer);
app.mount("#app");
