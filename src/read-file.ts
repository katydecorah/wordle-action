import { readFile } from "fs/promises";
import { Game } from ".";

export default async function returnReadFile(
  fileName: string
): Promise<Game[]> {
  try {
    const contents = await readFile(fileName, "utf-8");
    return parseJson(contents);
  } catch (error) {
    throw new Error(error);
  }
}

function parseJson(contents: string): Game[] {
  // empty file
  if (!contents) return [];
  contents = contents.trim();
  if (!contents) return [];

  const json = JSON.parse(contents) as { games: [] } | Game[];

  // new format
  if ("games" in json) return json.games;
  // legacy format
  else return json;
}
