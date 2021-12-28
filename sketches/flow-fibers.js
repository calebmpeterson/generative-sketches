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
import distance from "../utils/distance";
import avoidObstacles from "../utils/avoidObstacles";

const settings = {
  dimensions: [1280, 1024],
};

const debug = {
  flow: false,
  obstacles: false,
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
    const angleFieldFrequency = pick([0.005]);
    const angleFieldOctaves = pick([1, 2, 3, 4, 5, 6, 7, 8]);
    const angleField = makeRectangle(width, height, angleNoiseFn, {
      frequency: angleFieldFrequency,
      octaves: angleFieldOctaves,
    });

    permuteNoise();

    // Flow field magnitudes
    const magnitudeNoiseFn = (x, y) => Math.abs(noise2D(x, y, 1, grid / 2));
    const magnitudeFieldFrequency = pick([0.005, 0.05, 0.5, 5, 50]);
    const magnitudeFieldOctaves = pick([1, 2, 3, 4, 5, 6, 7, 8]);
    const magnitudeField = makeRectangle(width, height, magnitudeNoiseFn, {
      frequency: magnitudeFieldFrequency,
      octaves: magnitudeFieldOctaves,
    });

    // Grade field fns
    const gradeFieldFn1 = (xIndex, yIndex) => {
      return {
        angle:
          yIndex / height +
          (xIndex / width) * Math.PI +
          noise2D(xIndex, yIndex, 1, Math.PI),
        magnitude: noise2D(xIndex, yIndex, 1, grid / 4),
      };
    };

    const gradeFieldFn2 = (xIndex, yIndex) => {
      return {
        angle: (yIndex / height) * Math.PI,
        magnitude: xIndex / width,
      };
    };

    const gradeFieldFn3 = (xIndex, yIndex) => {
      const centerX = width / 2;
      const centerY = height / 2;

      return {
        angle: Math.atan2(centerY - yIndex, centerX - xIndex),
        magnitude: 2,
      };
    };

    const gradeFieldFn = pick([gradeFieldFn1, gradeFieldFn2, gradeFieldFn3]);

    const obstaclesToAvoid = pick([103, 221]);
    const obstacles = _.range(0, obstaclesToAvoid).map((index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.ceil(Math.random() * grid * 3),
    }));

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

    // Render the obstacles
    if (debug.obstacles) {
      _.forEach(obstacles, (obstacle) => {
        context.fillStyle = "rgba(255,255,255,0.8)";
        context.shadowColor = "rgba(0,0,0,0.1)";
        context.shadowBlur = 5;
        drawCircle(context, obstacle.x, obstacle.y, obstacle.radius);
      });
    }

    // Render paths through the flow field
    const pathsToRender = pick([1000, 5000, 25000]);
    const stepsInPath = pick([25, 100, 250, 500]);
    _.range(0, pathsToRender).forEach((pathIndex) => {
      // Starting point
      let x = margins.left + Math.abs(Math.random() * margins.width);
      let y = margins.top + Math.abs(Math.random() * margins.height);
      const initialAvoidance = avoidObstacles(obstacles, x, y);
      x += initialAvoidance.dx;
      y += initialAvoidance.dy;

      // The focus is higher the closer to the middle row
      const focus = Math.abs(height / 2 - y);
      // 1 is fully focused, 0 is fully out-of-focus
      const focusFactor = 1 - focus / (height / 2);
      // 1 is fully out-of-focus, 0 is fully focused
      const unfocusFactor = focus / (height / 2);
      const depthScale = (1.5 * y) / height;
      const blur = focus / 100;

      const grayscaleFactor = unfocusFactor * 100;
      const hueRotate = Math.abs(noise2D(x, y, 1, 180));
      context.filter = `grayscale(${grayscaleFactor}%) hue-rotate(${hueRotate}deg)`;

      const color = pick(palette);
      context.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.33)`;
      context.shadowColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`;
      context.shadowBlur = pick([3, 5, 7]);

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
          const magnitude = magnitudeField[xIndex][yIndex];
          const grade = gradeFieldFn(xIndex, yIndex);
          x =
            x +
            Math.cos(angle) * magnitude +
            Math.cos(grade.angle) * grade.magnitude;
          y =
            y +
            Math.sin(angle) * magnitude +
            Math.sin(grade.angle) * grade.magnitude;

          const { dx, dy } = avoidObstacles(obstacles, x, y);
          x += dx;
          y += dy;
        }
      });
      context.stroke();
    });

    console.log(
      `Params`,
      JSON.stringify(
        {
          palette,
          angleFieldFrequency,
          angleFieldOctaves,
          magnitudeFieldFrequency,
          magnitudeFieldOctaves,
          gradeFieldFn: gradeFieldFn.name,
          pathsToRender,
          stepsInPath,
        },
        null,
        2
      )
    );
  };
};

canvasSketch(sketch, settings);
