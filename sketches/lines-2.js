import canvasSketch from "canvas-sketch";
import { noise1D, noise2D, permuteNoise } from "canvas-sketch-util/random";
import fetchRandomPalette from "../utils/fetchRandomPalette";
import forEachCol from "../utils/forEachCol";
import forEachRow from "../utils/forEachRow";
import generateMorse from "../utils/generateMorse";

const settings = {
  dimensions: [1024, 768],
};

const sketch = async () => {
  const palette = await fetchRandomPalette();
  console.log(palette);

  return ({ context, width, height }) => {
    const margin = 0.05;
    const margins = {
      top: height * margin,
      bottom: height * (1.0 - margin),
      left: width * margin,
      right: width * (1.0 - margin),
      width: width * (1.0 - margin * 2),
      height: height * (1.0 - margin * 2),
    };

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    context.font = "16px bold sans-serif";
    context.textAlign = "center";

    const h = 0;

    const spacing = {
      h: 10,
      v: 4,
    };

    const skipCol = Math.floor(Math.random() * margins.width + margins.left);

    // Add some varying horizontal lines
    forEachRow(height, (y) => {
      if (y % spacing.v === 0 && y > margins.top && y < margins.bottom) {
        permuteNoise();
        const s = Math.abs(noise1D(y, 1, 75));
        permuteNoise();
        const l = Math.abs(noise1D(y, 1, 100));
        permuteNoise();
        const a = 0.66 + Math.abs(noise1D(y, 1, 0.1));

        context.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        const text = generateMorse(100);

        forEachCol(width, (x) => {
          if (x % spacing.h === 0 && x > margins.left && x < margins.right) {
            if (x < skipCol || x > skipCol + spacing.h) {
              context.fillText(text[x], x, y);
            }
          }
        });
      }
    });
  };
};

canvasSketch(sketch, settings);
