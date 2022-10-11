import App from './App.svelte';

const app = new App({
  target: document.getElementById('app'),
  props: {
    ready: false,
  },
});

// @ts-ignore
window.initMap = function ready() {
  app.$set({ ready: true });
};

export default app;
