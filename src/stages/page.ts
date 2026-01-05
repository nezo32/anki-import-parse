import { Page } from "pdf2json";
import { Context } from "../types";

const isNumber = (value: unknown) => !isNaN(Number(value));
function containsRussian(text: string) {
  return /[\p{Script=Cyrillic}]/u.test(text);
}

export function processPage({ page, bar }: Pick<Context, "bar"> & { page: Page }) {
  const mappedTexts = page.Texts.map((el) => el.R[0].T);

  mappedTexts.splice(0, 9);

  const startIndex = mappedTexts.findIndex((text) => text.includes("Версия:"));
  mappedTexts.splice(startIndex);

  const splittedTexts = [];

  const lastValue = { Front: "", Back: "" };
  for (let i = 0; i < mappedTexts.length; i++) {
    const value = mappedTexts[i];
    const nextValue = i + 1 < mappedTexts.length ? mappedTexts[i + 1] : null;

    if (nextValue && isNumber(nextValue)) {
      lastValue.Back = value.trim();
      lastValue.Front = lastValue.Front.slice(0, -1).trim();
      lastValue.Back.replace("・", "");
      if (lastValue.Front && lastValue.Back) splittedTexts.push({ ...lastValue });
      lastValue.Front = "";
      lastValue.Back = "";
      continue;
    }

    if (isNumber(value)) {
      continue;
    }

    if (containsRussian(value)) {
      lastValue.Back += value.trim() + " ";
    } else {
      lastValue.Front += value.trim() + "／";
    }
  }

  bar.increment();
  return splittedTexts;
}
