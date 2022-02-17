import returnReadFile from "./read-file";
import { load } from "js-yaml";

export default async function toJson(
  fileName: string
): Promise<{ games: any[] }> {
  try {
    const contents = (await returnReadFile(fileName)) as string;
    return parseYaml(contents);
  } catch (error) {
    throw new Error(error);
  }
}

const template = { games: [] };

function parseYaml(contents: string): { games: any[] } {
  if (!contents) return template;
  const json = load(contents) as { games: [] } | any[];
  if (!json) return template;
  if ("games" in json) return json;
  else return { games: json };
}
