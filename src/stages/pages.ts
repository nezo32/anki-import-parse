import { Output } from "pdf2json";
import { processPage } from "./page.js";
import { Context } from "../types.js";

export async function usePages({ data, bar }: Pick<Context, "bar"> & { data: Output }) {
  console.log("Processing pages...");
  bar.start(data.Pages.length, 0);
  const res = (
    await Promise.all(data.Pages.map((page) => new Promise((res) => res(processPage({ page, bar })))))
  ).flat() as Array<{ Front: string; Back: string }>;
  bar.stop();
  console.log(`Processed ${res.length} flashcards.\n`);

  return res;
}
