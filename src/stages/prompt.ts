import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type PromptSelectOptions = {
  title: string;
  multiple?: boolean;
  allowAll?: boolean;
};

export async function promptText({
  question,
  allowEmpty = false,
}: {
  question: string;
  allowEmpty?: boolean;
}) {
  const rl = createInterface({ input, output });
  try {
    while (true) {
      const answer = (await rl.question(question)).trim();
      if (allowEmpty || answer.length > 0) {
        return answer;
      }
      console.log("Input cannot be empty.");
    }
  } finally {
    rl.close();
  }
}

export async function promptSelect(items: string[], options: PromptSelectOptions) {
  if (!items.length) {
    return [] as string[];
  }

  const { title, multiple = false, allowAll = false } = options;
  const rl = createInterface({ input, output });

  try {
    console.log(`\n${title}`);
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });

    if (multiple) {
      if (allowAll) {
        console.log('\nSelect one or more by numbers (example: 1,3,5) or type "all":');
      } else {
        console.log('\nSelect one or more by numbers (example: 1,3,5):');
      }
    } else {
      console.log("\nSelect one by number:");
    }

    while (true) {
      const answer = (await rl.question("> ")).trim();
      const normalized = answer.toLowerCase();

      if (multiple && allowAll && (normalized === "all" || normalized === "*")) {
        return items;
      }

      const parts = answer
        .split(/[,\s]+/)
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      if (!parts.length) {
        console.log("Please provide a selection.");
        continue;
      }

      const indices = [...new Set(parts.map((part) => Number(part)))];
      const hasInvalid = indices.some((index) => !Number.isInteger(index) || index < 1 || index > items.length);
      if (hasInvalid) {
        console.log("Invalid selection. Use numbers from the list.");
        continue;
      }
      if (!multiple && indices.length !== 1) {
        console.log("Please select exactly one item.");
        continue;
      }

      return indices.map((index) => items[index - 1]);
    }
  } finally {
    rl.close();
  }
}
