import canvasSketch from "canvas-sketch";
import { noise1D, noise2D, permuteNoise } from "canvas-sketch-util/random";
import distance from "../utils/distance";
import forEachPixel from "../utils/forEachPixel";
import forEachRow from "../utils/forEachRow";

const settings = {
  dimensions: [4096, 2160],
};

const sketch = () => {
  return ({ context, width, height }) => {
    // Margin in inches
    const margin = 1 / 4;

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    // Gradient foreground
    const fill = context.createLinearGradient(0, 0, width, height);
    fill.addColorStop(0, "#023");
    fill.addColorStop(1, "#001");

    // Fill rectangle
    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

    context.shadowColor = "rgba(0,0,0,0.5)";
    context.shadowBlur = 2;
    context.shadowOffsetY = 1;

    // Add some noise
    forEachPixel(width, height, (x, y) => {
      if (x === 0) {
        permuteNoise();
      }
      const noise = noise2D(x, y, width * height, 1);

      const alpha = distance(0, 0, x, y) / distance(0, 0, width, height);

      context.fillStyle = `rgba(0,48,32,${alpha * noise})`;
      context.fillRect(x, y, 1, 1);
    });

    context.shadowColor = null;
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;

    // Add some noise
    forEachPixel(width, height, (x, y) => {
      if (x === 0) {
        permuteNoise();
      }
      const noise = noise2D(x, y, width * height, 1);

      const alpha = distance(0, 0, x, y) / distance(0, 0, width, height);

      context.fillStyle = `rgba(0,48,32,${alpha * noise})`;
      context.fillRect(x, y, 1, 1);
    });

    // Add some interlacing
    forEachRow(height, (y) => {
      if (y % 8 === 0) {
        context.fillStyle = `rgba(0,0,0,${0.2 + noise1D(y, height, 0.1)})`;
        context.fillRect(0, y, width, 4);
      }
    });
  };
};

canvasSketch(sketch, settings);
