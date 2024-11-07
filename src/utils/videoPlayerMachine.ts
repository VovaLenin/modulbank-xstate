import { setup, assign } from "xstate";

type VideoPlayerContext = {
  isPlaying: boolean;
};

const videoPlayerMachine = setup({
  types: {
    context: {} as VideoPlayerContext,
    events: {} as
      | { type: "OPEN_MINI" }
      | { type: "OPEN_FULL" }
      | { type: "CLOSE" }
      | { type: "OPEN_MODAL" }
      | { type: "TOGGLE_PLAY" }
      | { type: "TOGGLE_PAUSE" },
  },
  actions: {
    playAction: assign({
      isPlaying: (context) => {
        return (context.context.isPlaying = true);
      },
    }),
    pauseAction: assign({
      isPlaying: (context) => {
        return (context.context.isPlaying = false);
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
        OPEN_MODAL: {
          target: "opened",
          actions: "playAction",
        },
      },
    },
    opened: {
      type: "parallel",
      states: {
        size: {
          initial: "full",
          states: {
            mini: {
              on: {
                OPEN_FULL: "full",
              },
            },
            full: {
              on: {
                OPEN_MINI: "mini",
              },
            },
          },
        },
        playPause: {
          initial: "play",
          states: {
            play: {
              on: {
                TOGGLE_PAUSE: {
                  target: "pause",
                  actions: "pauseAction",
                },
              },
            },
            pause: {
              on: {
                TOGGLE_PLAY: {
                  target: "play",
                  actions: "playAction",
                },
              },
            },
          },
        },
      },
      on: {
        CLOSE: {
          target: "closed",
          actions: "pauseAction",
        },
      },
    },
  },
});

export default videoPlayerMachine;
