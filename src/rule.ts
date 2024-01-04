import { any, escapeRegex } from "./regex";
import { Ruleset } from "./ruleset";

export class Rule {
  constructor(ruleset: Ruleset, line: string) {
    const regex = /^(?<A>.*?)\[(?<B>.+?)\](?<C>.*?)=(?<D>.*?)$/;

    let match = line.match(regex);

    if (match === null) {
      throw new Error(`Invalid rule: ${line}`);
    }

    let backCharStr = match.groups?.A;
    if (backCharStr)
      this.backChar = `(?<=${ruleset.createRegex(backCharStr).source})`;
    else this.backChar = "";
    this.charDef = match.groups?.B!;
    let forCharStr = match.groups?.C;
    if (forCharStr)
      this.forChar = `(?=${ruleset.createRegex(forCharStr).source})`;
    else this.forChar = "";
    this.phoneme = match.groups?.D!;

    // console.debug(`Rule "${line}" -> ${this.getRegex(0)}`);
  }

  backChar: string;
  charDef: string;
  forChar: string;
  phoneme: string;

  getRegex(strIndex: number) {
    return new RegExp(
      `^${any(strIndex)}${this.backChar}${escapeRegex(this.charDef)}${
        this.forChar
      }`,
      ""
    );
  }

  match(str: string, strIndex: number) {
    let regex = this.getRegex(strIndex);
    let match = str.match(regex);

    if (!match) return 0;

    return match[0].length - strIndex;
  }
}
