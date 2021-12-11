import { loremIpsum as lipsum } from "lorem-ipsum";
import { encode } from "morsee";

export default function generateMorse(words) {
  const text = lipsum({ count: words, units: "words", random: Math.random });
  return encode(text).replace(/\./g, "∙").replace(/\//g, "   ");
}
