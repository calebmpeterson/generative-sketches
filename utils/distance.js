export default function distance(x1, y1, x2, y2) {
  const xDistance = x2 - x1;
  const yDistance = y2 - y1;
  return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}
