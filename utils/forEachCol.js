export default function forEachCol(width, fn) {
  for (let x = 0; x < width; x++) {
    fn(x);
  }
}
