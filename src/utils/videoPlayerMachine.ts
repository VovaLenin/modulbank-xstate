// videoPlayerMachine.ts
import { createMachine } from "xstate";

interface VideoPlayerContext {}

type VideoPlayerEvent =
  | { type: "OPEN_MINIMIZED" }
  | { type: "OPEN_FULLSCREEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE_PLAY_PAUSE" };

export const videoPlayerMachine = createMachine<
  VideoPlayerContext,
  VideoPlayerEvent
>({
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
