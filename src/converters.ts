import { ConversionResult } from "./ruleset";

export const pnmXsampaMap: { pnm: string; xsampa: string }[] = [
  { pnm: "IY", xsampa: "i:" },
  { pnm: "IH", xsampa: "I" },
  { pnm: "EY", xsampa: "eI" },
  { pnm: "EH", xsampa: "E" },
  { pnm: "AE", xsampa: "{" },
  { pnm: "AA", xsampa: "A:" },
  { pnm: "AO", xsampa: "Q" },
  { pnm: "OW", xsampa: "oU" },
  { pnm: "UH", xsampa: "U" },
  { pnm: "UW", xsampa: "u:" },
  { pnm: "ER", xsampa: "@`" },
  { pnm: "AX", xsampa: "@" },
  { pnm: "AH", xsampa: "V" },
  { pnm: "AY", xsampa: "aI" },
  { pnm: "AW", xsampa: "aU" },
  { pnm: "OY", xsampa: "OI" },
  { pnm: "P", xsampa: "p" },
  { pnm: "B", xsampa: "b" },
  { pnm: "T", xsampa: "t" },
  { pnm: "D", xsampa: "d" },
  { pnm: "K", xsampa: "k" },
  { pnm: "G", xsampa: "g" },
  { pnm: "F", xsampa: "f" },
  { pnm: "V", xsampa: "v" },
  { pnm: "TH", xsampa: "T" },
  { pnm: "DH", xsampa: "D" },
  { pnm: "S", xsampa: "s" },
  { pnm: "Z", xsampa: "z" },
  { pnm: "SH", xsampa: "S" },
  { pnm: "ZH", xsampa: "Z" },
  { pnm: "HH", xsampa: "h" },
  { pnm: "M", xsampa: "m" },
  { pnm: "N", xsampa: "n" },
  { pnm: "NX", xsampa: "N" },
  { pnm: "L", xsampa: "l" },
  { pnm: "W", xsampa: "w" },
  { pnm: "Y", xsampa: "j" },
  { pnm: "R", xsampa: "r\\" },
  { pnm: "CH", xsampa: "t_S" },
  { pnm: "JH", xsampa: "d_Z" },
  { pnm: "WH", xsampa: "W" },
];

export const xsampaIpaMap: Record<string, string> = {
  ":": "ː",
  I: "ɪ",
  E: "ɛ",
  "{": "æ",
  A: "ɑ",
  Q: "ɒ",
  U: "ʊ",
  "@": "ə",
  // Rhotic diacritic
  "`": "˞",
  V: "ʌ",
  O: "ɔ",
  g: "ɡ",
  T: "θ",
  D: "ð",
  S: "ʃ",
  Z: "ʒ",
  N: "ŋ",
  "r\\": "ɹ",
  _: "͡",
  W: "ʍ",
};

export function pnmToXsampa(pnm: ConversionResult[]) {
  return pnm
    .map((result) => {
      if (result.rule == null) return result.input;

      if (result.output.startsWith("/")) result.output = result.output.slice(1);

      if (result.output.endsWith("/"))
        result.output = result.output.slice(0, -1);

      if (result.output.startsWith("<") && result.output.endsWith(">"))
        return result.output.slice(1, -1);

      return result.output
        .split(/[\/\s]+/g)
        .map((phoneme) => phoneme.trim())
        .filter((phoneme) => phoneme.length > 0)
        .map((phoneme) => {
          let conversion = pnmXsampaMap.find((c) => c.pnm === phoneme);
          if (conversion == null) {
            console.warn(`No conversion for ${phoneme}`);
            return phoneme;
          }
          return conversion.xsampa;
        })
        .join("");
    })
    .join("");
}

export function xsampaToIpa(xsampa: string) {
  let phonemeRegex = /[\w{:]\\?`?|./g;
  let phonemes = xsampa.match(phonemeRegex);

  return phonemes!
    .map((phoneme) => {
      let conversion = xsampaIpaMap[phoneme];
      if (conversion == null) {
        return phoneme;
      }
      return conversion;
    })
    .join("");
}
