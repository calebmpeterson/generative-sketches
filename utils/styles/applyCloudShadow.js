export default function applyCloudShadow(context) {
  context.shadowColor = `rgba(220,220,220,0.9)`;
  context.shadowBlur = 2;
  context.shadowOffsetX = Math.ceil(Math.random() * 3);
  context.shadowOffsetY = Math.ceil(Math.random() * 3);
}
