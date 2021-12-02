export default function forEachPixel(width, height, fn) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      fn(x, y);
    }
  }
}
