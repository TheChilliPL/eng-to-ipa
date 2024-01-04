import { before, test, describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { Ruleset } from "../ruleset";
import { combineRegexes } from "../regex";
import { Rule } from "../rule";

describe("Rules", () => {
  let rules: Ruleset;

  before(async () => {
    rules = new Ruleset();

    await rules.addDefaultSymbols();

    await rules.loadFromDir("rules/eng-to-pnm");
  });

  it("should load rules from file", async () => {
    assert.ok(rules.rules.length > 0);
  });

  it("should match rules", () => {
    let matches: [
      word: string,
      index: number,
      pattern: string,
      expected: number
    ][] = [
      // Symbols not allowed inside brackets
      ["BANANA", 2, ".#[.]#.#", 0],
      // Symbols allowed outside brackets
      ["BANANA", 2, ".#[N]#.#", 1],
      // Examples from the raport
      ["COMMA", 1, "C[O]M", 1],
      ["SHE", 2, ":[E]", 1],
      ["THEY", 2, ":[E] ", 0],
      ["THEY", 2, ":[E]", 1],
      ["THEY", 0, " [THEY] ", 4],
      // Full example of RATIO from the raport
      ["RATIO", 0, " [RE]^#", 0],
      ["RATIO", 0, "[R]", 1],
      ["RATIO", 1, "[A] ", 0],
      ["RATIO", 1, "[A]", 1],
      ["RATIO", 2, " [THE] ", 0],
      ["RATIO", 2, "[TI]O", 2],
      ["RATIO", 4, "[O]E", 0],
      ["RATIO", 4, "[O]", 1],
      ["YOU", 0, " [YOU]", 3],
    ];

    for (const [word, index, pattern, expected] of matches) {
      let rule = new Rule(rules, pattern + "=");
      let actual = rule.match(word, index);
      assert.equal(
        actual,
        expected,
        `Rule "${pattern}" returned ${actual} instead of ${expected}.\nRegex: ${rule.getRegex(
          index
        )}`
      );
    }
  });

  it("should convert words", () => {
    let words: [word: string, expected: string][] = [
      ["THEY", "DH EY"],
      ["BANANA", "B AE N AE N AX"],
      ["FATHER", "F AE DH ER"], // F AA DH ER?
      ["RATIO", "R EY SH OW"],
      ["MEAT", "M IY T"],
      ["BITTER", "B IH T T ER"], // Double consonants allowed
      ["ABOUT", "AE B AW T"], // Stress problem,
      ["CHILLI", "CH IH L IH"],
      ["RAVKR", "R AE V K R"],
      ["BAKAMONO", "B AE K AE M AX N OW"],
    ];

    for (const [word, expected] of words) {
      let actual = rules.convert(word);
      actual = actual.replace(/[/\s]+/g, " ").trim();
      assert.equal(actual, expected);
    }
  });
});
