import { Context } from "../types";

export async function useNotes({
  cards,
  anki,
  bar,
  deck: deckName,
  modelName = "Basic (and reversed card)",
}: Pick<Context, "anki" | "bar"> & {
  cards: Array<Record<string, string>>;
  deck: string;
  modelName?: string;
}) {
  console.log("Adding flashcards to Anki...");
  bar.start(cards.length, 0);
  let i = 0;
  for (const card of cards) {
    const params: Parameters<typeof anki.note.addNote>[0] = {
      note: {
        deckName,
        modelName,
        fields: card,
        options: {
          duplicateScope: "deck",
        },
      },
    };

    const canAdd = await anki.note.canAddNotes({
      notes: [params.note],
    });
    if (!canAdd[0]) {
      bar.increment();
      continue;
    }

    await anki.note.addNote(params);
    i++;
    bar.increment();
  }
  bar.stop();
  console.log(`Added ${i} flashcards to Anki.\n`);
}
