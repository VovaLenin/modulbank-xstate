<template>
  <div>
    <!-- Кнопка открытия плеера -->
    <div class="closed-modal">
      <PlayCircleOutlined
        v-if="currentState === 'closed'"
        class="playing-icon"
        @click="openPlayer('full')"
      />
    </div>

    <!-- Модальное окно для видеоплеера -->
    <a-modal
      :open="currentState !== 'closed'"
      :width="currentState === 'full' ? '1000px' : '500px'"
      :style="{ top: currentState === 'full' ? '0' : '10vh' }"
      @cancel="closePlayer"
      title="YOU GOT RICKROLLED"
      destroyOnClose
    >
      <!-- Видеоплеер -->
      <video-player
        ref="videoPlayer"
        class="video-player"
        :options="videoOptions"
        @ready="onPlayerReady"
      ></video-player>

      <template #footer>
        <a-button key="screen-size" @click="toggleSize" shape="circle">
          <template v-slot:icon>
            <component
              :is="
                currentState === 'full' ? 'ShrinkOutlined' : 'ArrowsAltOutlined'
              "
            />
          </template>
        </a-button>
        <!-- <a-button
          key="play-pause"
          @click="togglePlayPause"
          shape="circle"
          :icon="playingVideo ? <PauseOutlined /> : <CaretRightFilled />"
        > -->
        <!-- <template v-slot:icon>
            <component
              :is="playingVideo ? 'PauseOutlined' : 'CaretRightFilled'"
            />
          </template> -->
        <!-- </a-button> -->
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useMachine } from "@xstate/vue";
import { Modal } from "ant-design-vue";
import {
  CaretRightFilled,
  ShrinkOutlined,
  PauseOutlined,
  ArrowsAltOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons-vue";
import videoPlayerMachine from "../utils/videoPlayerMachine";

export default defineComponent({
  components: {
    Modal,
    CaretRightFilled,
    ShrinkOutlined,
    PauseOutlined,
    ArrowsAltOutlined,
    PlayCircleOutlined,
  },
  setup() {
    type VideoPlayerState = "closed" | "mini" | "full";
    const { snapshot, send } = useMachine(videoPlayerMachine);
    const isPlaying = ref(false);
    const videoOptions = {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      loop: true,
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

    function toggleSize() {
      if (currentState.value === "full") {
        send({ type: "OPEN_MINI" });
      } else {
        send({ type: "OPEN_FULL" });
      }
    }

    function openPlayer(size: string) {
      send({
        type: size === "full" ? "OPEN_FULL" : "OPEN_MINI",
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
.closed-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #8585ff;
  border-radius: 5px;
  height: 150px;
  width: 300px;
}

.playing-icon {
  font-size: 50px;
  color: #8585ff;
}
</style>
