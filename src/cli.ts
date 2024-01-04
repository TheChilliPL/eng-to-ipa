import { program } from "@commander-js/extra-typings";
import { version } from "../package.json";
import { Ruleset } from "./ruleset";

async function main() {
  program.version(version);
  program.configureHelp({});
  let x = program
    .command("trans <input>")
    .description("transliterate input text")
    .option(
      "-r, --rules <path>",
      "path to ruleset directory. Defaults to rules/eng-to-pnm relative to this package's root directory"
    )
    .action(async (input, options) => {
      let rulesPath = options.rules ?? "rules/eng-to-pnm";

      let ruleset = new Ruleset();

      await ruleset.addDefaultSymbols();

      await ruleset.loadFromDir(rulesPath!);

      console.log(
        ruleset
          .convert(input.toUpperCase())
          .replace(/[/\s]+/g, " ")
          .trim()
      );
    });
  await program.parseAsync(process.argv);
}

main().catch(console.error);
