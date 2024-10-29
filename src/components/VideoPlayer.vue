<template>
  <div>
    <div class="closed-modal">
      <PlayCircleOutlined
        v-if="currentState === 'closed'"
        class="playing-icon"
        @click="openPlayer('full')"
      />
    </div>
    <a-modal
      :open="currentState !== 'closed'"
      :width="currentState === 'full' ? '1000px' : '500px'"
      :style="{ top: currentState === 'full' ? '0' : '10vh' }"
      @cancel="closePlayer"
      title="YOU GOT RICKROLLED"
      destroyOnClose
    >
      <video ref="videoPlayer" class="video-js"></video>
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
        <a-button key="play-pause" @click="togglePlayPause" shape="circle">
          <template v-slot:icon>
            <component :is="isPlaying ? 'PauseOutlined' : 'CaretRightFilled'" />
          </template>
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  computed,
  nextTick,
  onBeforeUnmount,
} from "vue";
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
import videojs from "video.js";

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
    const videoPlayer = ref<HTMLVideoElement | null>(null);
    const isPlaying = ref(false);
    const player = ref<videojs.Player | null>(null);

    const videoOptions: videojs.PlayerOptions = {
      sources: [
        {
          src: "https://cdn.flowplayer.com/d9cd469f-14fc-4b7b-a7f6-ccbfa755dcb8/hls/383f752a-cbd1-4691-a73f-a4e583391b3d/playlist.m3u8",
          type: "application/x-mpegURL",
        },
      ],
      autoplay: true,
      controls: false,
      fluid: true,
      loop: true,
    };

    const setupPlayerEventListeners = () => {
      if (!player.value) return;
      player.value.on("play", () => (isPlaying.value = true));
      player.value.on("pause", () => (isPlaying.value = false));
    };

    const initPlayer = () => {
      nextTick(() => {
        if (!videoPlayer.value) return;
        player.value = videojs(
          videoPlayer.value,
          videoOptions,
          setupPlayerEventListeners
        );
      });
    };

    type VideoPlayerState = "closed" | "mini" | "full";
    const { snapshot, send } = useMachine(videoPlayerMachine);

    const currentState = computed(
      () => snapshot.value.value as VideoPlayerState
    );

    watch(
      () => snapshot.value.value,
      () => {
        isPlaying.value = snapshot.value.context.isPlaying;
      }
    );

    function toggleSize() {
      send({ type: currentState.value === "full" ? "OPEN_MINI" : "OPEN_FULL" });
    }

    function togglePlayPause() {
      send({ type: "TOGGLE_PLAY_PAUSE" });
      isPlaying.value ? player.value?.pause() : player.value?.play();
    }

    function openPlayer(size: VideoPlayerState) {
      send({ type: size === "full" ? "OPEN_FULL" : "OPEN_MINI" });
      initPlayer();
    }

    function closePlayer() {
      player.value?.pause();
      send({ type: "CLOSE" });
    }

    onBeforeUnmount(() => {
      player.value?.dispose();
    });

    return {
      currentState,
      toggleSize,
      openPlayer,
      closePlayer,
      send,
      togglePlayPause,
      isPlaying,
      videoPlayer,
      initPlayer,
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
