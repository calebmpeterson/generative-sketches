import { loremIpsum as lipsum } from "lorem-ipsum";
import { encode } from "morsee";
import { map } from "lodash";

const DEFAULT_CONVERSIONS = {
  ".": "∙",
  "/": "   ",
};

export default function generateMorse(words) {
  const text = lipsum({ count: words, units: "words", random: Math.random });
  return map(encode(text), (c) => DEFAULT_CONVERSIONS[c] || c);
}
