import { Game } from "./index";
import toJson from "./to-json";

export default async function addGame({
  game,
  fileName,
}: {
  game: Game;
  fileName: string;
}): Promise<Game[]> {
  const games = (await toJson(fileName)) as Game[];
  return [...games, game].sort((a, b) => a.number - b.number);
}
