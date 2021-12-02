import { noise2D, permuteNoise } from "canvas-sketch-util/random";

export default function createRandomPointWithin(x0, y0, x1, y1) {
  const baseX = Math.min(x0, x1);
  const baseY = Math.min(y0, y1);
  const sizeX = Math.abs(x0 - x1);
  const sizeY = Math.abs(y0 - y1);
  permuteNoise();
  const x = baseX + Math.abs(noise2D(x0, y0, 1, sizeX));
  permuteNoise();
  const y = baseY + Math.abs(noise2D(x1, y1, 1, sizeY));
  return { x, y };
}
