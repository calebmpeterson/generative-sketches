export default function drawRay(context, x, y, angle, length) {
  const x1 = x + Math.cos(angle) * length;
  const y1 = y + Math.sin(angle) * length;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x1, y1);
  context.stroke();
}
