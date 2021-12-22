import { noise1D, noise2D, permuteNoise } from "canvas-sketch-util/random";
import { makeRectangle } from "fractal-noise";
import _ from "lodash";

import isWithin from "../../utils/isWithin";

export default function renderRivers(context, settings, margins) {
  const { width, height, grid } = settings;

  // Flow field angles
  const angleNoiseFn = (x, y) => noise2D(x, y, 1, Math.PI);
  const angleField = makeRectangle(width, height, angleNoiseFn, {
    frequency: 0.005,
    octaves: 3,
  });

  const gradeFieldFn = (xIndex, yIndex) => {
    return {
      angle:
        yIndex / height +
        (xIndex / width) * Math.PI +
        noise2D(xIndex, yIndex, 1, Math.PI),
      magnitude: noise2D(xIndex, yIndex, 1, grid),
    };
  };

  permuteNoise();

  // Flow field magnitudes
  const magnitudeNoiseFn = (x, y) => Math.abs(noise2D(x, y, 1, grid / 2));
  const magnitudeField = makeRectangle(width, height, magnitudeNoiseFn, {
    frequency: 0.005,
    octaves: 3,
  });

  // Render a path through the flow field
  const pathsToRender = 50;
  const stepsInPath = 500;

  _.range(0, pathsToRender).forEach((pathIndex) => {
    // Starting point
    let x = margins.left + Math.abs(Math.random() * margins.width);
    let y = margins.top + Math.abs(Math.random() * margins.height);

    const hue = 206 + (Math.random() - 0.5) * 20;
    const color = `hsla(${hue}, 76%, 50%, ${Math.random()})`;
    context.strokeStyle = color;

    const lineWidth = noise1D(pathIndex, 1, 5);
    context.lineWidth = lineWidth;
    context.lineCap = "round";

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
}
