const SAMPLE_RATE = 10000;

let count = 0;

export default function log(...args) {
  if (count % SAMPLE_RATE === 0) {
    console.log(`LOG`, ...args);
  }
  count++;
}
