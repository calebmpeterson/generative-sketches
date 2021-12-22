import _ from "lodash";
import distance from "./distance";

export default function avoidObstacles(obstacles, x, y) {
  let dx = 0;
  let dy = 0;

  _.forEach(obstacles, (obstacle) => {
    const d = distance(x, y, obstacle.x, obstacle.y);
    if (d < obstacle.radius) {
      const theta = Math.atan2(obstacle.y - y, obstacle.x - x);
      dx -= Math.cos(theta) * (obstacle.radius - d);
      dy -= Math.sin(theta) * (obstacle.radius - d);
    }
  });

  return { dx, dy };
}
