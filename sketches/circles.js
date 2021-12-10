import canvasSketch from "canvas-sketch";
import _ from "lodash";
import { noise1D, noise2D, permuteNoise } from "canvas-sketch-util/random";

import createRandomPointWithin from "../utils/createRandomPointWithin";
import distance from "../utils/distance";
import forEachPixel from "../utils/forEachPixel";
import forEachRow from "../utils/forEachRow";

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

    // Make some random circles
    context.lineWidth = 2;

    _.range(0, 1).forEach((index) => {
      permuteNoise();
      const center = createRandomPointWithin(
        width * 0.1,
        height * 0.4,
        width * 0.9,
        height * 0.6
      );

      const radius = Math.abs(
        noise1D(center.x, 1, Math.min(width, height) / 20)
      );

      for (let a = 0; a < 100; a++) {
        permuteNoise();
        const angle1 = Math.abs(noise1D(a, 1, Math.PI * 2));
        permuteNoise();
        const angle2 = Math.abs(noise1D(a, 1, Math.PI * 2));
        const startAngle = Math.min(angle1, angle2);
        const endAngle = Math.max(angle1, angle2);

        const gradient = context.createConicGradient(
          startAngle + Math.PI / 2,
          width / 2,
          height / 2
        );
        gradient.addColorStop(0, "#fff0");
        gradient.addColorStop(endAngle / (Math.PI * 2), "#ffff");
        context.strokeStyle = gradient;

        context.beginPath();
        context.arc(
          width / 2,
          height / 2,
          radius * 2 + a * 3,
          startAngle,
          endAngle,
          false
        );
        context.stroke();
      }
    });

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
