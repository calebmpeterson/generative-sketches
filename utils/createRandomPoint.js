import { noise2D, permuteNoise } from "canvas-sketch-util/random";

export default function createRandomPoint(w, h, size) {
  permuteNoise();
  const x = Math.abs(noise2D(w, h, size / 2, size));
  permuteNoise();
  const y = Math.abs(noise2D(w, h, size / 2, size));
  return { x, y };
}
