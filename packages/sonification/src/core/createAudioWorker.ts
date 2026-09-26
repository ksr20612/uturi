import AudioWorker from './audioWorker?worker&inline';

export default function createAudioWorker(): Worker {
  return new AudioWorker();
}
