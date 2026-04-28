import { YankiConnect } from "yanki-connect";
import dotenv from "dotenv";
import { SingleBar, Presets } from "cli-progress";
import { ArgumentParser } from "argparse";
import { pdfCommand } from "./commands/pdf.js";
import { Context } from "./types.js";
import { kanjiCommand } from "./commands/kanji.js";
import { reverseCommand } from "./commands/reverse.js";
import { version } from "../package.json";

dotenv.config();

const argParser = new ArgumentParser();

argParser.add_argument("-v", "--version", { action: "version", version });
// AFTER
argParser.add_argument("script", {
  help: "Choose of which script to run",
  choices: ["pdf", "kanji", "reverse"],
});

const args = argParser.parse_args() as Context["args"];

const anki = new YankiConnect();
const bar = new SingleBar({}, Presets.shades_classic);

(async function () {
  const context = { bar, anki, args };

  switch (args.script) {
    case "pdf":
      await pdfCommand(context);
      break;
    case "kanji":
      await kanjiCommand(context);
      break;
    case "reverse":
      await reverseCommand(context);
      break;
  }
})();
