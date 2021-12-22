import "../utils/devtools";

import canvasSketch from "canvas-sketch";
import {
  noise1D,
  noise2D,
  pick,
  permuteNoise,
  weighted,
  setSeed,
} from "canvas-sketch-util/random";
import { radToDeg } from "canvas-sketch-util/math";
import { makeRectangle } from "fractal-noise";
import _ from "lodash";
import fetchRandomPalette from "../utils/fetchRandomPalette";
import forEachCol from "../utils/forEachCol";
import forEachRow from "../utils/forEachRow";
import drawCircle from "../utils/drawCircle";
import drawRay from "../utils/drawRay";
import isWithin from "../utils/isWithin";

const settings = {
  dimensions: [1280, 1024],
};

const debug = {
  flow: false,
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

    const grid = 16;
    const spacing = {
      h: grid,
      v: grid,
    };

    // Flow field angles
    const angleNoiseFn = (x, y) => noise2D(x, y, 1, Math.PI);
    const angleField = makeRectangle(width, height, angleNoiseFn, {
      frequency: pick([0.005, 0.05, 0.5, 5, 50]),
      octaves: 3,
    });

    const gradeFieldFn = (xIndex, yIndex) => {
      return {
        angle:
          yIndex / height +
          (xIndex / width) * Math.PI +
          noise2D(xIndex, yIndex, 1, Math.PI),
        magnitude: noise2D(xIndex, yIndex, 1, grid / 4),
      };
    };

    permuteNoise();

    // Flow field magnitudes
    const magnitudeNoiseFn = (x, y) => Math.abs(noise2D(x, y, 1, grid / 2));
    const magnitudeField = makeRectangle(width, height, magnitudeNoiseFn, {
      frequency: pick([0.005, 0.05, 0.5, 5, 50]),
      octaves: 3,
    });

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    // Render the raw flow field
    if (debug.flow) {
      forEachRow(height, (y) => {
        if (y % spacing.v === 0 && isWithin(margins.top, y, margins.bottom)) {
          forEachCol(width, (x) => {
            if (
              x % spacing.h === 0 &&
              isWithin(margins.left, x, margins.right)
            ) {
              const angle = angleField[x][y];
              const grade = gradeFieldFn(x, y);

              const radius = magnitudeField[x][y] + 1;

              // The angle field
              context.strokeStyle = `rgba(0,0,0,0.5)`;
              drawRay(context, x, y, angle, radius);

              // The grade field
              context.strokeStyle = `rgb(255,80,0)`;
              drawRay(context, x, y, grade.angle, grade.magnitude);
            }
          });
        }
      });
    }

    // Render a path through the flow field
    const pathsToRender = 5000;
    const stepsInPath = 250;
    _.range(0, pathsToRender).forEach((pathIndex) => {
      // Starting point
      let x = margins.left + Math.abs(Math.random() * margins.width);
      let y = margins.top + Math.abs(Math.random() * margins.height);

      // The focus is higher the closer to the middle row
      const focus = Math.abs(height / 2 - y);

      // 1 is fully focused, 0 is fully out-of-focus
      const focusFactor = 1 - focus / (height / 2);
      // 1 is fully out-of-focus, 0 is fully focused
      const unfocusFactor = focus / (height / 2);

      const depthScale = (1.5 * y) / height;

      const blur = focus / 100;
      const grayscaleFactor = unfocusFactor * 100;
      const hueRotate = Math.abs(noise2D(x, y, 1, 90));
      context.filter = `blur(${blur}px) grayscale(${grayscaleFactor}%) hue-rotate(${hueRotate}deg)`;

      const color = pick(palette);
      context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.33)`;
      context.beginPath();
      context.moveTo(x, y);
      _.range(0, stepsInPath).forEach((step) => {
        if (
          isWithin(margins.left, x, margins.right) &&
          isWithin(margins.top, y, margins.bottom)
        ) {
          // Line to (x,y)
          context.lineTo(x, y);
        } else {
          context.moveTo(x, y);
        }

        // Step to next (x,y)
        const xIndex = Math.floor(x);
        const yIndex = Math.floor(y);
        if (
          isWithin(margins.left, xIndex, margins.right) &&
          isWithin(margins.top, yIndex, margins.bottom)
        ) {
          const angle = angleField[xIndex][yIndex];
          const grade = gradeFieldFn(xIndex, yIndex);
          const magnitude = magnitudeField[xIndex][yIndex];
          x =
            x +
            Math.cos(angle) * magnitude +
            Math.cos(grade.angle) * grade.magnitude;
          y =
            y +
            Math.sin(angle) * magnitude +
            Math.sin(grade.angle) * grade.magnitude;
        }
      });
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
