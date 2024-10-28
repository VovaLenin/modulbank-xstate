import { setup } from "xstate";

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
}).createMachine({
  id: "videoPlayer",
  initial: "closed",
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
        TOGGLE_PLAY_PAUSE: {},
      },
    },
    full: {
      on: {
        CLOSE: "closed",
        OPEN_MINI: "mini",
        TOGGLE_PLAY_PAUSE: {},
      },
    },
  },
});

export default videoPlayerMachine;
