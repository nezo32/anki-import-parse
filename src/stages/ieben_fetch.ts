import { Context } from "../types";

export async function useIebenFetch({ args }: Pick<Context, "args">) {
  console.log(`Fetching ieben ${args.grade} grade kanji list...`);
  const ieben = await fetch(`https://ieben.net/syou-kanji/2020list-${args.grade}nen/`);
  console.log(`Successfully fetched ieben\n`);

  return ieben;
}
