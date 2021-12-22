export default function applyCloudHaze(context) {
  context.shadowColor = `rgba(255,255,255,0.8)`;
  context.shadowBlur = Math.random() * 5 + 1;
  context.shadowOffsetX = -1;
  context.shadowOffsetY = -1;
}
