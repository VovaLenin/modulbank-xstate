<template>
  <div>
    <a-button @click="openModal">Открыть видеоплеер</a-button>
    <a-modal
      v-model:open="isModalVisible"
      :width="isMinimized ? 500 : 950"
      @cancel="closeModal"
      footer="{null}"
      :inert="!isModalVisible"
    >
      <div :class="isMinimized ? 'player-minimized' : 'player-full'">
        <video ref="videoRef" controls></video>
        <a-button @click="toggleSize">
          {{ isMinimized ? "Развернуть" : "Уменьшить" }}
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useMachine } from "@xstate/vue";
import { createMachine } from "xstate";
// import "ant-design-vue/dist/antd.css";
import Hls from "hls.js";

interface VideoPlayerContext {}
type VideoPlayerEvent = { type: "TOGGLE" };

const videoPlayerMachine = createMachine<VideoPlayerContext, VideoPlayerEvent>({
  id: "videoPlayer",
  initial: "full",
  states: {
    full: {
      on: {
        TOGGLE: "minimized",
      },
    },
    minimized: {
      on: {
        TOGGLE: "full",
      },
    },
  },
});

const videoUrl =
  "https://cdn.flowplayer.com/d9cd469f-14fc-4b7b-a7f6-ccbfa755dcb8/hls/383f752a-cbd1-4691-a73f-a4e583391b3d/playlist.m3u8";
const isModalVisible = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const isMinimized = ref(false);

const openModal = (): void => {
  isModalVisible.value = true;
  loadVideo();
};

const closeModal = (): void => {
  isModalVisible.value = false;
};

const loadVideo = (): void => {
  if (videoRef.value) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.value);
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.value.src = videoUrl;
    }
  }
};

const { snapshot: machineSnapshot, send } = useMachine(videoPlayerMachine);

const toggleSize = (): void => {
  send({ type: "TOGGLE" });
};

watch(
  () => machineSnapshot.value,
  (newState) => {
    isMinimized.value = newState.matches("minimized");
  }
);

onMounted(() => {
  loadVideo();
});
</script>

<style scoped>
.player-full {
  width: 100%;
  height: 450px;
}

.player-minimized {
  width: 100%;
  height: 200px;
}

video {
  width: 100%;
}
</style>
