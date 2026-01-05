import { Context } from "../types";

export async function useSync({ anki }: Pick<Context, "anki">) {
  console.log("Syncing Anki...");
  await anki.invoke("sync");
  console.log("Anki synced successfully.\n");
}
