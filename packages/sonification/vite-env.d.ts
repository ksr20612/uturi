/// <reference types="vite/client" />

declare module '*.worker' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

declare module '*.worker?worker' {
  class ViteWorker extends Worker {
    constructor();
  }
  export default ViteWorker;
}
