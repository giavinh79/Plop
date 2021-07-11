export const particleParams = {
  fpsLimit: 60,
  particles: {
    color: {
      value: "#ffffff",
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    move: {
      direction: "top",
      enable: true,
      outMode: "out",
      random: false,
      speed: 1,
    },
    number: {
      density: {
        enable: false,
      },
      value: 20,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: 8,
      random: true,
      anim: {
        speed: 4,
        size_min: 0.3,
      },
    },
  },
};
