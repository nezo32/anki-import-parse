import { SingleBar } from "cli-progress";
import OpenAI from "openai";
import PDFParser from "pdf2json";
import { YankiConnect } from "yanki-connect";

export type Context = {
  openai: OpenAI;
  bar: SingleBar;
  anki: YankiConnect;
  pdfParser: PDFParser;
  args: {
    [key: string]: unknown | undefined;
    script: "pdf" | "kanji";
    kanjis: string[];
  };
};
