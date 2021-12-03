import { loremIpsum as lipsum } from "lorem-ipsum";
import { encode } from "morsee";

export default function generateMorse(words) {
  const text = lipsum({ count: words, units: "words" });
  return encode(text).replace(/\./g, "∙").replace(/\//g, "   ");
}
