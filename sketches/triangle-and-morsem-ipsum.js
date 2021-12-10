import canvasSketch from "canvas-sketch";
import { noise1D, noise2D, permuteNoise } from "canvas-sketch-util/random";

import createRandomPointWithin from "../utils/createRandomPointWithin";
import distance from "../utils/distance";
import forEachPixel from "../utils/forEachPixel";
import forEachRow from "../utils/forEachRow";
import generateMorse from "../utils/generateMorse";
import strokePath from "../utils/strokePath";

const settings = {
  dimensions: [1024, 768],
};

const sketch = () => {
  return ({ context, width, height }) => {
    // Margin in inches
    const margin = 1 / 4;

    // Off-white background
    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height);

    // Gradient background
    const bg = context.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#023");
    bg.addColorStop(1, "#001");

    // Fill the background
    context.fillStyle = bg;
    context.fillRect(margin, margin, width - margin * 2, height - margin * 2);

    // Gradient horizon
    const horizon = height;
    const fill = context.createLinearGradient(0, 0, 0, horizon);
    fill.addColorStop(0, "#0018");
    fill.addColorStop(0.85, "#123");
    fill.addColorStop(0.95, "#134");
    fill.addColorStop(1, "#146");

    // Fill the horizon
    context.fillStyle = fill;
    context.fillRect(margin, margin, width - margin * 2, horizon);

    // Add some noise
    context.shadowColor = "rgba(0,0,0,0.5)";
    context.shadowBlur = 2;
    context.shadowOffsetY = 1;

    forEachPixel(width, height, (x, y) => {
      if (x === 0) {
        permuteNoise();
      }
      const noise = noise2D(x, y, width * height, 1);

      const alpha = distance(0, 0, x, y) / distance(0, 0, width, height);

      context.fillStyle = `rgba(0,48,32,${alpha * noise})`;
      context.fillRect(x, y, 1, 1);
    });

    // Add some noise
    context.shadowColor = null;
    context.shadowBlur = 0;
    context.shadowOffsetY = 0;

    forEachPixel(width, height, (x, y) => {
      if (x === 0) {
        permuteNoise();
      }
      const noise = noise2D(x, y, width * height, 1);

      const alpha = distance(0, 0, x, y) / distance(0, 0, width, height);

      context.fillStyle = `rgba(0,48,32,${alpha * noise})`;
      context.fillRect(x, y, 1, 1);
    });

    // Add some text
    context.fillStyle = "#8fd8";
    context.fillText(generateMorse(20), 0, height / 2 - 5);
    context.fillText(generateMorse(20), 0, height / 2);
    context.fillText(generateMorse(20), 0, height / 2 + 5);

    // Make a random triangle
    const v0 = createRandomPointWithin(
      width * 0.3,
      height * 0.3,
      width * 0.5,
      height * 0.5
    );
    const v1 = createRandomPointWithin(
      width * 0.5,
      height * 0.3,
      width * 0.8,
      height * 0.5
    );
    const v2 = createRandomPointWithin(
      width * 0.45,
      height * 0.6,
      width * 0.55,
      height * 0.8
    );

    context.lineWidth = 5;
    context.shadowBlur = 10;

    // Cyan triangle variation
    context.strokeStyle = "#ff0040";
    context.shadowColor = "#ff0040";
    strokePath(context, [v0, v1, v2], { variance: 20 });

    // Red triangle variation
    context.strokeStyle = "#0fc";
    context.shadowColor = "#0fc";
    strokePath(context, [v0, v1, v2], { variance: 20 });

    // White triangle
    context.strokeStyle = "#ffffff";
    context.shadowColor = "#ffffff";
    strokePath(context, [v0, v1, v2]);

    context.shadowColor = null;
    context.shadowBlur = 0;

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
