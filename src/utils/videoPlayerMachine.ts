import { setup, assign } from "xstate";

type VideoPlayerContext = {};

const videoPlayerMachine = setup({
  types: {
    context: {} as VideoPlayerContext,
    events: {} as
      | { type: "OPEN_MINI" }
      | { type: "OPEN_FULL" }
      | { type: "CLOSE" }
      | { type: "TOGGLE_PLAY_PAUSE" },
  },
  actions: {
    togglePlayPause: assign({
      isPlaying: (context) => {
        return !context.context.isPlaying;
      },
    }),
  },
}).createMachine({
  id: "videoPlayer",
  initial: "closed",
  context: {
    isPlaying: false,
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
      },
    },
    full: {
      on: {
        CLOSE: "closed",
        OPEN_MINI: "mini",
        TOGGLE_PLAY_PAUSE: { actions: "togglePlayPause" },
      },
    },
  },
});

export default videoPlayerMachine;
