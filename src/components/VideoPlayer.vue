<template>
  <div>
    <!-- Кнопка открытия плеера -->
    <button v-if="currentState === 'closed'" @click="openPlayer('minimized')">
      Open Player
    </button>

    <!-- Модальное окно для видеоплеера -->
    <a-modal
      :open="currentState !== 'closed'"
      :width="currentState === 'fullscreen' ? '100vw' : '50vw'"
      :style="{ top: currentState === 'fullscreen' ? '0' : '10vh' }"
      @cancel="closePlayer"
      title="VIDEO PLAYER"
      footer="{null}"
      destroyOnClose
    >
      <div
        :class="{
          minimized: currentState === 'minimized',
          fullscreen: currentState === 'fullscreen',
        }"
      >
        <!-- Видеоплеер -->
        <video-player
          ref="videoPlayer"
          class="video-player"
          :options="videoOptions"
          @ready="onPlayerReady"
        ></video-player>

        <!-- Контролы плеера -->
        <div class="controls">
          <button @click="toggleSize">
            {{ currentState === "fullscreen" ? "Minimize" : "Fullscreen" }}
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useMachine } from "@xstate/vue";
import videoPlayerMachine from "../utils/videoPlayerMachine";
import { Modal } from "ant-design-vue"; // Импортируем модуль Modal

export default defineComponent({
  components: { Modal },
  setup() {
    type VideoPlayerState = "closed" | "minimized" | "fullscreen";
    const { snapshot, send } = useMachine(videoPlayerMachine);
    const isPlaying = ref(false);
    const videoOptions = {
      autoplay: false,
      controls: true,
      sources: [
        {
          src: "https://cdn.flowplayer.com/d9cd469f-14fc-4b7b-a7f6-ccbfa755dcb8/hls/383f752a-cbd1-4691-a73f-a4e583391b3d/playlist.m3u8",
          type: "application/x-mpegURL",
        },
      ],
    };

    const currentState = ref<VideoPlayerState>(snapshot.value.value);
    watch(
      () => snapshot.value.value,
      (newState) => {
        currentState.value = newState;
      }
    );

    const videoPlayer = ref<any | null>(null);

    function onPlayerReady() {
      // Проверяем, что videoPlayer уже инициализирован
      if (videoPlayer.value && videoPlayer.value.player) {
        videoPlayer.value.player.on("play", () => {
          isPlaying.value = true;
        });
        videoPlayer.value.player.on("pause", () => {
          isPlaying.value = false;
        });
      } else {
        console.error("Video player is not ready yet.");
      }
    }

    // function togglePlayPause() {
    //   if (videoPlayer.value) {
    //     if (isPlaying.value) {
    //       videoPlayer.value.player.pause();
    //     } else {
    //       videoPlayer.value.player.play();
    //     }
    //   }
    // }

    function toggleSize() {
      if (currentState.value === "fullscreen") {
        send({ type: "OPEN_MINIMIZED" });
      } else {
        send({ type: "OPEN_FULLSCREEN" });
      }
    }

    function openPlayer(size: string) {
      send({
        type: size === "fullscreen" ? "OPEN_FULLSCREEN" : "OPEN_MINIMIZED",
      });
    }

    function closePlayer() {
      if (videoPlayer.value) {
        videoPlayer.value.player.pause();
      }
      send({ type: "CLOSE" });
    }

    return {
      currentState,
      videoOptions,
      // togglePlayPause,
      toggleSize,
      openPlayer,
      closePlayer,
      onPlayerReady,
      send,
    };
  },
});
</script>

<style>
.minimized {
  width: 320px;
  height: 180px;
}

.fullscreen {
  width: 100%;
  height: 100vh;
}

.video-player {
  max-width: 100%;
  width: 100%;
  height: 100%;
}

.controls {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

video {
  width: 100%;
}

.ant-modal-body {
  padding: 20px;
}
</style>
