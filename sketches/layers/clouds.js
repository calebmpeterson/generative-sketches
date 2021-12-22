import {
  noise1D,
  noise2D,
  permuteNoise,
  pick,
} from "canvas-sketch-util/random";
import { makeRectangle } from "fractal-noise";
import _ from "lodash";

import drawCircle from "../../utils/drawCircle";
import isWithin from "../../utils/isWithin";
import applyCloudShadow from "../../utils/styles/applyCloudShadow";
import applyCloudHaze from "../../utils/styles/applyCloudHaze";
import applyCloudGroundShadow from "../../utils/styles/applyCloudGroundShadow";

export default function renderClouds(context, settings, margins) {
  const { width, height, grid } = settings;

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
    frequency: 1,
    octaves: 8,
  });

  const gradeFieldFn = (xIndex, yIndex) => {
    return {
      angle:
        yIndex / height +
        (xIndex / width) * Math.PI +
        noise2D(xIndex, yIndex, 1, Math.PI),
      magnitude: noise2D(xIndex, yIndex, 1, 2),
    };
  };

  const cloudsToRender = pick([1, 5, 10, 25, 50, 100, 250, 500]);

  _.range(0, cloudsToRender).forEach((pathIndex) => {
    const clumpsInCloud = noise1D(pathIndex, 1, 50);

    // Starting point
    let x = margins.left + Math.abs(Math.random() * margins.width);
    let y = margins.top + Math.abs(Math.random() * margins.height);

    const color = [255, 255, 255];
    context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`;

    _.range(0, clumpsInCloud).forEach((step) => {
      if (
        isWithin(margins.left, x, margins.right) &&
        isWithin(margins.top, y, margins.bottom)
      ) {
        const radius = Math.random() * 3;
        applyCloudGroundShadow(context);
        drawCircle(context, x, y, radius);

        applyCloudHaze(context);
        drawCircle(context, x, y, radius);

        applyCloudShadow(context);
        drawCircle(context, x, y, radius);
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
  });
}
