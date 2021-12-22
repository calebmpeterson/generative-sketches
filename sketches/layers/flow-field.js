import forEachCol from "../../utils/forEachCol";
import forEachRow from "../../utils/forEachRow";
import drawRay from "../../utils/drawRay";
import isWithin from "../../utils/isWithin";

export default function renderFlowField(context, settings, margins, getRay) {
  const { width, height } = settings;

  forEachRow(height, (y) => {
    if (y % spacing.v === 0 && isWithin(margins.top, y, margins.bottom)) {
      forEachCol(width, (x) => {
        if (x % spacing.h === 0 && isWithin(margins.left, x, margins.right)) {
          const { angle, magnitude } = getRay(x, y);

          const radius = magnitude + 1;

          // The angle field
          context.strokeStyle = `rgba(0,0,0,0.5)`;
          drawRay(context, x, y, angle, radius);
        }
      });
    }
  });
}
