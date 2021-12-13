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
    const center = {
      x: width / 2,
      y: height / 2,
    };

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    const spacing = {
      h: 12,
      v: 12,
    };

    let prevColorIndex = 0;

    // Add some varying horizontal lines
    _.range(0, Math.min(width, height) * 0.4).forEach((r) => {
      for (let theta = 0; theta < Math.PI * 2; theta += (Math.PI * 4) / r) {
        const x = Math.cos(theta) * r + center.x;
        const y = Math.sin(theta) * r + center.y;

        if (
          r % 12 === 0 &&
          y > margins.top &&
          y < margins.bottom &&
          x > margins.left &&
          x < margins.right
        ) {
          const weights = Array(palette.length).fill(1);
          weights[prevColorIndex] = pick(_.range(50, 500));
          const index = weighted(weights);
          const rgb = palette[index];

          prevColorIndex = index;

          permuteNoise();
          const a = 0.2 + Math.abs(noise2D(x, y, 1, 0.3));

          context.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;

          const radius = pick([2, 3, 4, 5]);

          permuteNoise();
          const vx = noise2D(x, y, 1, 3);
          permuteNoise();
          const vy = noise2D(x, y, 1, 3);

          drawCircle(context, x, y, radius);
          drawCircle(context, x + vx, y + vy, radius);
        }
      }
    });
  };
};

canvasSketch(sketch, settings);
