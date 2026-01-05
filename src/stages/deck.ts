import { Context } from "../types";

export async function useDeck({ title, anki }: Pick<Context, "anki"> & { title?: string }) {
  console.log("Creating/Using Anki deck...");
  const deck = title || `! Untitled Deck`;
  const deckConfig = await anki.deck.getDeckConfig({ deck });
  if (!deckConfig) {
    await anki.deck.createDeck({ deck });
    console.log(`Created new deck: ${deck}\n`);
  } else {
    console.log(`Using deck: ${deck}\n`);
  }

  return deck;
}
