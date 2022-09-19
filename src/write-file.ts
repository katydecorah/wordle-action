import { Json } from ".";
import { writeFile } from "fs/promises";

export default async function returnWriteFile(fileName: string, data: Json) {
  try {
    await writeFile(fileName, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(error);
  }
}
