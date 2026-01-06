import { useDeck } from "../stages/deck";
import { useIebenFetch } from "../stages/ieben_fetch";
import { useIebenParse } from "../stages/ieben_parse";
import { useNotes } from "../stages/notes";
import { useSync } from "../stages/sync";
import { Context } from "../types";

export async function kanjiCommand({ anki, bar, args }: Omit<Context, "openai" | "pdfParser">) {
  if (!args.deck || typeof args.deck !== "string") {
    console.error("\nArgument DECK must be non empty string\n");
    process.exit(1);
  }
  if (!args.grade) {
    console.error("\nArgument GRADE cannot be empty\n");
    process.exit(1);
  }

  const deck = await useDeck({ anki, title: args.deck });
  const ieben = await useIebenFetch({ args });
  const cards = await useIebenParse({ ieben, args });
  await useNotes({ cards, anki, bar, deck, modelName: "main kanji_words" });
  await useSync({ anki });

  console.log("All done!");
}
