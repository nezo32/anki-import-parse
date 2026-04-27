export async function useIebenFetch({ grade }: { grade: string }) {
  console.log(`Fetching ieben ${grade} grade kanji list...`);
  const ieben = await fetch(`https://ieben.net/syou-kanji/2020list-${grade}nen/`);
  console.log(`Successfully fetched ieben\n`);

  return ieben;
}
