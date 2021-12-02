import { noise1D, permuteNoise } from "canvas-sketch-util/random";

export default function strokePath(
  context,
  [start, ...vertices],
  { variance } = { variance: 0 }
) {
  context.beginPath();
  context.moveTo(start.x, start.y);
  vertices.forEach(({ x, y }) => {
    permuteNoise();
    context.lineTo(x + noise1D(x, 1, variance), y + noise1D(y, 1, variance));
  });
  context.closePath();
  context.stroke();
}
