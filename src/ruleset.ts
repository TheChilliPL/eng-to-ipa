import * as fs from "fs/promises";
import * as path from "path";
import { Rule } from "./rule";
import { combineRegexes, escapeRegex } from "./regex";

export class Ruleset {
  constructor() {
    // console.debug("Ruleset created");
  }

  rules: Rule[] = [];
  symbols: Map<string, RegExp> = new Map();

  async loadFromFile(path: string) {
    // console.debug(`Loading ruleset from file: ${path}`);
    let data = await fs.readFile(path, {
      encoding: "utf-8",
      flag: fs.constants.O_RDONLY,
    });
    let ruleStrings = data
      .split(/\r\n?|\n/g)
      .filter((line) => line.includes("="));
    let rules = ruleStrings.map((line) => new Rule(this, line));
    this.rules.push(...rules);
    // console.debug(`Loaded ${ruleStrings.length} valid lines`);
    // console.debug(`First line: "${ruleStrings[0]}"`);
  }

  async loadFromDir(dirPath: string) {
    // console.debug(`Loading rulesets from directory: ${dirPath}`);
    let files = await fs.readdir(dirPath);
    for (let fileName of files) {
      let filePath = path.join(dirPath, fileName);
      await this.loadFromFile(filePath);
    }
  }

  async addSymbol(symbol: string, regex: RegExp) {
    if (this.rules.length > 0) {
      throw new Error("Cannot add symbol after rules have been loaded");
    }

    if (symbol.length !== 1) {
      throw new Error(`Symbol must be a single character: ${symbol}`);
    }

    if (this.symbols.has(symbol)) {
      throw new Error(`Symbol already exists: ${symbol}`);
    }

    this.symbols.set(symbol, regex);
    // console.log("Added symbol:", symbol);
  }

  async addSymbols(
    symbols: ({ symbol: string; regex: RegExp } | [string, RegExp])[]
  ) {
    if (this.rules.length > 0)
      throw new Error("Cannot add symbols after rules have been loaded!");

    for (let symbol of symbols) {
      let symbolName: string;
      let regex: RegExp;
      if (Array.isArray(symbol)) {
        [symbolName, regex] = symbol;
      } else {
        symbolName = symbol.symbol;
        regex = symbol.regex;
      }
      await this.addSymbol(symbolName, regex);
    }
  }

  createRegex(pattern: string): RegExp {
    let regexStr = "";
    for (let char of pattern) {
      let symbol = this.symbols.get(char);

      if (symbol) {
        regexStr += symbol.source;
      } else {
        regexStr += escapeRegex(char);
      }
    }

    return new RegExp(regexStr);
  }

  match(str: string, strIndex: number): [rule: Rule, match: number] | null {
    for (const rule of this.rules) {
      let match = rule.match(str, strIndex);
      if (match > 0) return [rule, match];
    }
    return null;
  }

  convert(str: string): string {
    let result = "";
    let strIndex = 0;
    while (strIndex < str.length) {
      let match = this.match(str, strIndex);
      if (match) {
        let [rule, matchLength] = match;
        result += rule.phoneme;
        strIndex += matchLength;
      } else {
        result += str[strIndex];
        strIndex++;
      }
    }
    return result;
  }

  async addDefaultSymbols() {
    const vowel = /[AEIOUY]/;
    const vowels = combineRegexes([vowel, "+"]);
    const consonant = /[BCDFGHJKLMNPQRSTVWXZ]/;
    const consonants = combineRegexes([consonant, "+"]);
    const voicedConsonant = /[BDVGJLMNRWZ]/;
    const consonantThenEOrI = combineRegexes([consonant, "[EI]"]);
    const suffix = /(?:ER|E|ES|ED|ING|ELY)/;
    const sibilant = /(?:[CS]H|[SCGZXJ])/;
    const consonantInfluencingU = /(?:[TCS]H|[TSRDLZNJ])/;
    const frontVowel = /[EIY]/;
    const maybeConsonants = combineRegexes([consonant, "*"]);
    const wordBoundary = /\b/;

    await this.addSymbols([
      ["#", vowels],
      ["*", consonants],
      [".", voicedConsonant],
      ["$", consonantThenEOrI],
      ["%", suffix],
      ["&", sibilant],
      ["@", consonantInfluencingU],
      ["^", consonant],
      ["+", frontVowel],
      [":", maybeConsonants],
      [" ", wordBoundary],
    ]);
  }
}
