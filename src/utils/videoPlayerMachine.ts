import { setup } from "xstate";

type VideoPlayerContext = {};

const videoPlayerMachine = setup({
  types: {
    context: {} as VideoPlayerContext,
    events: {} as
      | { type: "OPEN_MINIMIZED" }
      | { type: "OPEN_FULLSCREEN" }
      | { type: "CLOSE" }
      | { type: "TOGGLE_PLAY_PAUSE" },
  },
}).createMachine({
  id: "videoPlayer",
  initial: "closed",
  states: {
    closed: {
      on: {
        OPEN_MINIMIZED: "minimized",
        OPEN_FULLSCREEN: "fullscreen",
      },
    },
    minimized: {
      on: {
        CLOSE: "closed",
        OPEN_FULLSCREEN: "fullscreen",
        TOGGLE_PLAY_PAUSE: {},
      },
    },
    fullscreen: {
      on: {
        CLOSE: "closed",
        OPEN_MINIMIZED: "minimized",
        TOGGLE_PLAY_PAUSE: {},
      },
    },
  },
});

export default videoPlayerMachine;
