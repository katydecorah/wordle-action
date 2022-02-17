import { Yaml } from ".";
import { writeFile } from "fs/promises";
import { stringify } from "json-to-pretty-yaml";

export default async function returnWriteFile(fileName: string, yaml: Yaml) {
  try {
    const data = stringify(yaml);
    const promise = writeFile(fileName, data);
    await promise;
  } catch (error) {
    throw new Error(error);
  }
}
