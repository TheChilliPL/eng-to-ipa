export function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export function combineRegexes(
  regexes: (RegExp | string)[],
  flags: string = ""
): RegExp {
  let regexStrings = regexes.map((regex) => {
    if (typeof regex === "string") {
      return regex;
    } else {
      return regex.source;
    }
  });
  return new RegExp(regexStrings.join(""), flags);
}

export function combineRegexesAndStrings(
  regexes: (RegExp | string)[],
  flags: string = ""
): string {
  let regexStrings = regexes.map((regex) => {
    if (typeof regex === "string") {
      return escapeRegex(regex);
    } else {
      return regex.source;
    }
  });
  return regexStrings.join("");
}

export function any(n = 1): string {
  if (n < 0) throw new Error("n must be >= 0");

  switch (n) {
    case 0:
      return "";
    case 1:
      return ".";
    case 2:
      return "..";
    case 3:
      return "...";
    default:
      return `.{${n}}`;
  }
}
