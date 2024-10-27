<template>
  <div>
    <!-- Кнопка открытия плеера -->
    <button
      v-if="currentState === 'closed'"
      @click="send({ type: 'OPEN_MINIMIZED' })"
    >
      Open Player
    </button>

    <!-- Контейнер для видеоплеера -->
    <div
      v-if="currentState !== 'closed'"
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
      <button @click="togglePlayPause">
        {{ isPlaying ? "Pause" : "Play" }}
      </button>
      <button @click="toggleSize">
        {{ currentState === "fullscreen" ? "Minimize" : "Fullscreen" }}
      </button>
      <button @click="closePlayer">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useMachine } from "@xstate/vue";
import { videoPlayerMachine } from "../utils/videoPlayerMachine";

export default defineComponent({
  setup() {
    const { snapshot, send } = useMachine(videoPlayerMachine);
    const isPlaying = ref(false); // Отслеживание состояния воспроизведения
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

    // Управление текущим состоянием
    const currentState = ref(snapshot.value.value);
    watch(
      () => snapshot.value.value,
      (newState) => {
        currentState.value = newState;
      }
    );

    const videoPlayer = ref<InstanceType<typeof VueVideoPlayer> | null>(null);

    function onPlayerReady() {
      if (videoPlayer.value) {
        videoPlayer.value.player.on("play", () => {
          isPlaying.value = true;
        });
        videoPlayer.value.player.on("pause", () => {
          isPlaying.value = false;
        });
      }
    }

    // Переключение воспроизведения видео
    function togglePlayPause() {
      if (videoPlayer.value) {
        if (isPlaying.value) {
          videoPlayer.value.player.pause();
        } else {
          videoPlayer.value.player.play();
        }
      }
    }

    // Переключение размера плеера
    function toggleSize() {
      if (currentState.value === "fullscreen") {
        send({ type: "OPEN_MINIMIZED" });
      } else {
        send({ type: "OPEN_FULLSCREEN" });
      }
    }

    // Закрытие плеера
    function closePlayer() {
      if (videoPlayer.value) {
        videoPlayer.value.player.pause();
      }
      send({ type: "CLOSE" });
    }

    return {
      currentState,
      videoOptions,
      togglePlayPause,
      toggleSize,
      closePlayer,
      onPlayerReady,
      isPlaying,
      send,
    };
  },
});
</script>

<style scoped>
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
}
</style>
