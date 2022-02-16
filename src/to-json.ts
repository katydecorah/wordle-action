import returnReadFile from "./read-file";
import { load } from "js-yaml";

export default async function toJson(fileName: string) {
  try {
    const contents = (await returnReadFile(fileName)) as string;
    return contents && typeof load(contents.trim()) === "object"
      ? load(contents)
      : [];
  } catch (error) {
    throw new Error(error);
  }
}
