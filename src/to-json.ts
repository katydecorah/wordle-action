import returnReadFile from "./read-file";
import { load } from "js-yaml";

export default async function toJson(fileName: string) {
  try {
    const contents = (await returnReadFile(fileName)) as string;
    return contents && Array.isArray(load(contents)) ? load(contents) : [];
  } catch (error) {
    throw new Error(error);
  }
}
