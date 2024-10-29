import { setup, assign } from "xstate";

type VideoPlayerContext = {
  isPlaying: boolean;
  isInitialized: boolean;
};

const videoPlayerMachine = setup({
  types: {
    context: {} as VideoPlayerContext,
    events: {} as
      | { type: "OPEN_MINI" }
      | { type: "OPEN_FULL" }
      | { type: "CLOSE" }
      | { type: "TOGGLE_PLAY_PAUSE" }
      | { type: "INIT_PLAYER" },
  },
  actions: {
    togglePlayPause: assign({
      isPlaying: (context) => {
        return !context.context.isPlaying;
      },
    }),
    initializePlayer: assign({
      isInitialized: () => {
        return true;
      },
    }),
  },
}).createMachine({
  id: "videoPlayer",
  initial: "closed",
  context: {
    isPlaying: false,
    isInitialized: false,
  },
  states: {
    closed: {
      on: {
        OPEN_MINI: "mini",
        OPEN_FULL: "full",
      },
    },
    mini: {
      on: {
        CLOSE: "closed",
        OPEN_FULL: "full",
        TOGGLE_PLAY_PAUSE: { actions: "togglePlayPause" },
        INIT_PLAYER: { actions: "initializePlayer" },
      },
    },
    full: {
      on: {
        CLOSE: "closed",
        OPEN_MINI: "mini",
        TOGGLE_PLAY_PAUSE: { actions: "togglePlayPause" },
        INIT_PLAYER: { actions: "initializePlayer" },
      },
    },
  },
});

export default videoPlayerMachine;
