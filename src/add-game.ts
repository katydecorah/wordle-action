import { Game } from "./index";
import toJson from "./to-json";

export default async function addGame({
  game,
  fileName,
}: {
  game: Game;
  fileName: string;
}): Promise<Game[]> {
  const wordleJson = (await toJson(fileName)) as Game[];
  wordleJson.push(game);
  return wordleJson.sort((a, b) => a.number - b.number);
}
