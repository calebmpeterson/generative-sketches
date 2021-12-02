export default function forEachRow(height, fn) {
  for (let y = 0; y < height; y++) {
    fn(y);
  }
}
