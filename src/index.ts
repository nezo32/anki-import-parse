import { YankiConnect } from "yanki-connect";
import dotenv from "dotenv";
import { SingleBar, Presets } from "cli-progress";
import { ArgumentParser } from "argparse";
import { pdfCommand } from "./commands/pdf.js";
import { Context } from "./types.js";
import { kanjiCommand } from "./commands/kanji.js";
import { version } from "../package.json";

dotenv.config();

const argParser = new ArgumentParser();

argParser.add_argument("-v", "--version", { action: "version", version });
// PDF
const pdfGroup = argParser.add_argument_group({
  title: "PDF options",
  description: "Settings for PDF vocab parsing",
});
pdfGroup.add_argument("-f", "--file", { help: "File path to vocab PDF to parse", default: process.env.ANIP_FILE_PATH });
// IEBEN
const iebenGroup = argParser.add_argument_group({
  title: "IEBEN options",
  description: "Settings for parsing ieben.net",
});
iebenGroup.add_argument("-g", "--grade", {
  help: "Grade from ieben page",
  choices: ["1", "2", "3", "4", "5", "6"],
  default: process.env.ANIP_IEBEN_GRADE || "1",
});
iebenGroup.add_argument("-d", "--deck", {
  help: "Anki deck name to stash kanjis",
  default: process.env.ANIP_DECK_NAME || "Untitled Deck",
});
// AFTER
argParser.add_argument("script", {
  help: "Choose of which script to run",
  choices: ["pdf", "kanji"],
});
argParser.add_argument("kanjis", {
  help: "Kanjis to add. If not set, will add all of them",
  nargs: "*",
  default: process.env.ANIP_KANJI_SELECTION?.split(/\s+/).filter((el) => el),
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
  }
})();
