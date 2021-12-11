import canvasSketch from "canvas-sketch";
import { noise1D, noise2D, permuteNoise } from "canvas-sketch-util/random";
import forEachPixel from "../utils/forEachPixel";
import forEachRow from "../utils/forEachRow";

const settings = {
  dimensions: [1024, 768],
};

const sketch = () => {
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

    const h = 0;

    // Add some varying horizontal lines
    forEachRow(height, (y) => {
      if (y % 4 === 0 && y > margins.top && y < margins.bottom) {
        permuteNoise();
        const s = Math.abs(noise1D(y, 1, 25));
        permuteNoise();
        const l = Math.abs(noise1D(y, 1, 100));
        permuteNoise();
        const a = 0.1 + Math.abs(noise1D(y, 1, 0.1));

        context.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
        context.lineWidth = 1;

        const variation = 16;
        permuteNoise();
        const vl = noise2D(0, y, 1, variation);
        permuteNoise();
        const vr = noise2D(width, y, 1, variation);
        context.beginPath();
        context.moveTo(margins.left, y + vl);
        context.lineTo(margins.right, y + vr);
        context.stroke();
      }
    });
  };
};

canvasSketch(sketch, settings);
