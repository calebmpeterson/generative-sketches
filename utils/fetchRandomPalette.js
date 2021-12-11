import { pick } from "canvas-sketch-util/random";

async function fetchResult(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  return data.result;
}

export default async function fetchRandomPalette(model = "default") {
  if (model === "random") {
    const models = await fetchResult("http://colormind.io/list/");
    console.log(models);
    model = pick(models);
  }

  const palette = await fetchResult("http://colormind.io/api/", {
    method: "POST",
    body: JSON.stringify({ model }),
  });
  return palette;
}
