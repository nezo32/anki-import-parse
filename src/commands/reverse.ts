import { useSync } from "../stages/sync";
import { Context } from "../types";
import { promptSelect } from "../stages/prompt";

const SOURCE_MODEL = "Простая";
const TARGET_MODEL = "Простая (с обратной карточкой)";
const BATCH_SIZE = 250;

function chunkIds(ids: number[], size: number) {
  const chunks: number[][] = [];
  for (let i = 0; i < ids.length; i += size) {
    chunks.push(ids.slice(i, i + size));
  }
  return chunks;
}

function escapeQueryValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function reverseCommand({ anki, bar }: Omit<Context, "openai" | "pdfParser" | "args">) {
  console.log(`Preparing migration from "${SOURCE_MODEL}" to "${TARGET_MODEL}"...`);

  const modelNames = await anki.model.modelNames();
  if (!modelNames.includes(TARGET_MODEL)) {
    console.error(`\nTarget model "${TARGET_MODEL}" does not exist in Anki.\n`);
    process.exit(1);
  }

  const deckNames = await anki.deck.deckNames();
  if (!deckNames.length) {
    console.log("No decks found in Anki.");
    return;
  }

  const selectedDecks = await promptSelect(deckNames, {
    title: "Available decks:",
    multiple: true,
    allowAll: true,
  });
  if (!selectedDecks.length) {
    console.log("No decks selected.");
    return;
  }

  const noteIdsSet = new Set<number>();
  for (const deckName of selectedDecks) {
    const query = `deck:"${escapeQueryValue(deckName)}" note:"${SOURCE_MODEL}"`;
    const deckNoteIds = await anki.note.findNotes({ query });
    for (const noteId of deckNoteIds) {
      noteIdsSet.add(noteId);
    }
  }

  const noteIds = [...noteIdsSet];
  if (!noteIds.length) {
    console.log(`No "${SOURCE_MODEL}" notes found in selected decks.`);
    return;
  }

  console.log(`Selected decks (${selectedDecks.length}): ${selectedDecks.join(", ")}`);
  console.log(`Converting ${noteIds.length} notes to "${TARGET_MODEL}"...`);
  bar.start(noteIds.length, 0);

  let converted = 0;
  const chunks = chunkIds(noteIds, BATCH_SIZE);
  for (const noteChunk of chunks) {
    const notes = await anki.note.notesInfo({ notes: noteChunk });

    for (const note of notes) {
      const fields = Object.fromEntries(
        Object.entries(note.fields).map(([fieldName, fieldData]) => [fieldName, fieldData.value]),
      );

      await anki.note.updateNoteModel({
        note: {
          id: note.noteId,
          modelName: TARGET_MODEL,
          fields,
          tags: note.tags,
        },
      });

      converted++;
      bar.increment();
    }
  }

  bar.stop();
  console.log(`Converted ${converted} notes to "${TARGET_MODEL}".`);

  await useSync({ anki });
  console.log("All done!");
}
