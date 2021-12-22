import "../utils/devtools";

import canvasSketch from "canvas-sketch";
import { noise2D, permuteNoise, pick } from "canvas-sketch-util/random";
import { makeRectangle } from "fractal-noise";
import _ from "lodash";

import renderClouds from "./layers/clouds";
import renderFlowField from "./layers/flow-field";
import renderRivers from "./layers/rivers";

const settings = {
  dimensions: [1280, 1024],
};

const debug = {
  flow: false,
};

const sketch = async () => {
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

    // Flow field angles
    const angleNoiseFn = (x, y) => noise2D(x, y, 1, Math.PI);
    const angleField = makeRectangle(width, height, angleNoiseFn, {
      frequency: 100,
      octaves: 3,
    });

    permuteNoise();

    // Flow field magnitudes
    const magnitudeNoiseFn = (x, y) => Math.abs(noise2D(x, y, 1, grid / 2));
    const magnitudeField = makeRectangle(width, height, magnitudeNoiseFn, {
      frequency: 0.1,
      octaves: 8,
    });

    const gradeFieldFn = (xIndex, yIndex) => {
      return {
        angle: yIndex / height + xIndex / width + Math.random(),
        magnitude: 2,
      };
    };

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    // Earth
    const hue = pick([5, 15, 81]) + (Math.random() - 0.5) * 10;
    context.fillStyle = `hsl(${hue}, 12%, 69%)`;
    context.fillRect(margins.left, margins.top, margins.width, margins.height);

    // Render the raw flow field
    if (debug.flow) {
      renderFlowField(context, margins, { width, height }, (x, y) => ({
        angle: angleField[x][y],
        magnitude: magnitudeField[x][y],
      }));
    }

    renderRivers(context, { width, height, grid }, margins);

    renderClouds(context, { width, height, grid }, margins);
  };
};

canvasSketch(sketch, settings);
