import returnReadFile from "./read-file";
import { load } from "js-yaml";
import { Game } from ".";

export default async function toJson(
  fileName: string
): Promise<{ games: Game[] }> {
  try {
    const contents = (await returnReadFile(fileName)) as string;
    return parseYaml(contents);
  } catch (error) {
    throw new Error(error);
  }
}

const template = { games: [] };

function parseYaml(contents: string): { games: Game[] } {
  if (!contents) return template;
  const json = load(contents) as { games: [] } | Game[];
  if (!json) return template;
  if ("games" in json) return json;
  else return { games: json };
}
