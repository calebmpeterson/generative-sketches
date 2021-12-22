import "../utils/devtools";

import canvasSketch from "canvas-sketch";
import {
  noise2D,
  pick,
  permuteNoise,
  weighted,
} from "canvas-sketch-util/random";
import _ from "lodash";
import fetchRandomPalette from "../utils/fetchRandomPalette";
import forEachCol from "../utils/forEachCol";
import forEachRow from "../utils/forEachRow";
import drawCircle from "../utils/drawCircle";

const settings = {
  dimensions: [1280, 1024],
};

const sketch = async () => {
  const palette = await fetchRandomPalette("random");

  return ({ context, width, height }) => {
    const margin = 64; // px
    const margins = {
      top: margin,
      bottom: height - margin,
      left: margin,
      right: width - margin,
      width: width - margin * 2,
      height: height - margin * 2,
    };

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    const spacing = {
      h: 16,
      v: 8,
    };

    let prevColorIndex = 0;

    // Add some varying horizontal lines
    forEachRow(height, (y) => {
      // The focus is higher the closer to the middle row
      const focus = Math.abs(height / 2 - y);

      // 1 is fully focused, 0 is fully out-of-focus
      const focusFactor = 1 - focus / (height / 2);
      // 1 is fully out-of-focus, 0 is fully focused
      const unfocusFactor = focus / (height / 2);

      const depthScale = (1.5 * y) / height;

      const blur = focus / 100;

      if (y % spacing.v === 0 && y > margins.top && y < margins.bottom) {
        forEachCol(width, (x) => {
          if (x % spacing.h === 0 && x > margins.left && x < margins.right) {
            const weights = Array(palette.length).fill(1);
            weights[prevColorIndex] = pick(_.range(50, 100));
            const index = weighted(weights);
            const rgb = palette[index];

            prevColorIndex = index;

            permuteNoise();
            const a = 0.2 + Math.abs(noise2D(x, y, 1, 0.3));

            context.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;

            const radius = pick([4, 5, 6, 7]) * depthScale;

            permuteNoise();
            const vx = noise2D(x, y, 1, 3);
            permuteNoise();
            const vy = noise2D(x, y, 1, 3);

            const vy2 = Math.sin((x * width) / focus) * 8;

            const grayscaleFactor = unfocusFactor * 100;
            context.filter = `blur(${blur}px) grayscale(${grayscaleFactor}%)`;
            drawCircle(context, x, y + vy2, radius);

            permuteNoise();
            const hueRotate = Math.abs(noise2D(x, y, 1, 180));
            context.filter = `blur(${blur}px) grayscale(${grayscaleFactor}%) hue-rotate(${hueRotate}deg)`;
            drawCircle(context, x + vx, y + vy + vy2, radius);
          }
        });
      }
    });
  };
};

canvasSketch(sketch, settings);
