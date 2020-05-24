export const particleParams = {
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    size: {
      value: 8,
      random: true,
      anim: {
        speed: 4,
        size_min: 0.3,
      },
    },
    line_linked: {
      enable: false,
    },
    shape: {
      type: ['circle'],
      image: [],
    },
    move: {
      random: true,
      speed: 1,
      direction: 'top',
      out_mode: 'out',
    },
  },
};
