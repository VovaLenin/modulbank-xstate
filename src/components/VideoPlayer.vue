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
            <component
              :is="
                snapshot.context.isPlaying
                  ? 'PauseOutlined'
                  : 'CaretRightFilled'
              "
            />
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
  nextTick,
  onBeforeUnmount,
  computed,
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
    const player = ref<videojs.Player | null>(null);

    const videoOptions: videojs.PlayerOptions = {
      sources: [
        {
          // src: "/hls/playlist.m3u8",
          src: "https://cdn.flowplayer.com/d9cd469f-14fc-4b7b-a7f6-ccbfa755dcb8/hls/383f752a-cbd1-4691-a73f-a4e583391b3d/playlist.m3u8",
          type: "application/x-mpegURL",
        },
      ],
      autoplay: true,
      controls: false,
      fluid: true,
      loop: true,
    };

    const initPlayer = () => {
      nextTick(() => {
        if (!videoPlayer.value) return;
        player.value = videojs(videoPlayer.value, videoOptions);
      });
    };

    const { snapshot, send } = useMachine(videoPlayerMachine);

    const currentState = computed(() => {
      if (snapshot.value.matches("closed")) {
        return "closed";
      } else if (snapshot.value.matches({ opened: { size: "full" } })) {
        return "full";
      } else if (snapshot.value.matches({ opened: { size: "mini" } })) {
        return "mini";
      }
    });

    watch(
      () => snapshot.value.context.isPlaying,
      () => {
        if (snapshot.value.context.isPlaying) {
          player.value?.play();
        } else {
          player.value?.pause();
        }
      }
    );

    function toggleSize() {
      if (snapshot.value.matches({ opened: { size: "full" } })) {
        send({ type: "OPEN_MINI" });
      } else {
        send({ type: "OPEN_FULL" });
      }
    }

    function togglePlayPause() {
      if (snapshot.value.matches({ opened: { playPause: "play" } })) {
        send({ type: "TOGGLE_PAUSE" });
      } else {
        send({ type: "TOGGLE_PLAY" });
      }
    }

    function openPlayer(size: "full" | "mini") {
      send({ type: "OPEN_MODAL" });
      if (size === "mini") {
        send({ type: "OPEN_MINI" });
      }
      nextTick(() => {
        if (!player.value) {
          initPlayer();
        }
      });
    }

    function closePlayer() {
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
      videoPlayer,
      snapshot,
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
