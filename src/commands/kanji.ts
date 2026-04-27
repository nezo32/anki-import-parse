import { useDeck } from "../stages/deck";
import { useIebenFetch } from "../stages/ieben_fetch";
import { useIebenParse } from "../stages/ieben_parse";
import { useNotes } from "../stages/notes";
import { promptSelect, promptText } from "../stages/prompt";
import { useSync } from "../stages/sync";
import { Context } from "../types";

const GRADES = ["1", "2", "3", "4", "5", "6"] as const;
const CREATE_NEW_DECK_OPTION = "Create new deck";

export async function kanjiCommand({ anki, bar }: Omit<Context, "openai" | "pdfParser" | "args">) {
  const [grade] = await promptSelect([...GRADES], {
    title: "Select ieben grade:",
  });

  const deckNames = await anki.deck.deckNames();
  const [selectedDeck] = await promptSelect([...deckNames, CREATE_NEW_DECK_OPTION], {
    title: "Select target deck:",
  });

  const deckName =
    selectedDeck === CREATE_NEW_DECK_OPTION
      ? await promptText({ question: "Enter new deck name: " })
      : selectedDeck;

  const kanjisRaw = await promptText({
    question: "Enter specific kanjis separated by spaces (optional, press Enter to import all): ",
    allowEmpty: true,
  });
  const kanjis = kanjisRaw.split(/\s+/).filter((item) => item.length > 0);

  const deck = await useDeck({ anki, title: deckName });
  const ieben = await useIebenFetch({ grade });
  const cards = await useIebenParse({ ieben, kanjis });
  await useNotes({ cards, anki, bar, deck, modelName: "main kanji_words" });
  await useSync({ anki });

  console.log("All done!");
}
