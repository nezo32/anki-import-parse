import { parse } from "node-html-parser";
import { Context } from "../types";

export async function useIebenParse({ ieben, args }: Pick<Context, "args"> & { ieben: Response }) {
  console.log(`Parsing fetched HTML...`);
  const document = parse(await ieben.text());
  const data = document
    .getElementById("kakusuu-zen")
    ?.children.filter((el) => el.rawTagName == "div")
    .map((el) => {
      const list = el.children[0].children;
      list.pop();
      const Kanji = list.shift()!.textContent.replace("「 ", "").replace(" 」", "");

      const yomi = list.map((el) => el.children[1].textContent);
      const On = yomi.filter((el) => /[\p{Script=Katakana}]/u.test(el)).join("、");
      const Kun = yomi.filter((el) => /[\p{Script=Hiragana}]/u.test(el)).join("、");

      return {
        Kanji,
        On,
        Kun,
      };
    });
  if (!data?.length) {
    console.error("Something went wrong while parsing HTML\n");
    process.exit(1);
  }
  console.log(`Parsed ${data.length} kanjis\n`);

  return args.kanjis.length ? data.filter((card) => args.kanjis.includes(card.Kanji)) : data;
}
