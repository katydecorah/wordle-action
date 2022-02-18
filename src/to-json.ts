import returnReadFile from "./read-file";
import { load } from "js-yaml";
import { Game } from ".";

export default async function toJson(fileName: string): Promise<Game[]> {
  try {
    const contents = (await returnReadFile(fileName)) as string;
    return parseYaml(contents);
  } catch (error) {
    throw new Error(error);
  }
}

function parseYaml(contents: string): Game[] {
  // empty file
  if (!contents) return [];
  const json = load(contents) as { games: [] } | Game[];
  // unable to parse file
  if (!json) return [];
  // new format
  if ("games" in json) return json.games;
  // legacy format
  else return json;
}
