export default function applyCloudGroundShadow(context) {
  context.shadowColor = `rgba(0,0,0,0.25)`;
  context.shadowBlur = 3;
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 5;
}
