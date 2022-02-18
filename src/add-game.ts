import { Score, Board, Game } from "./index";
import toJson from "./to-json";

export default async function addGame({
  gameNumber,
  score,
  board,
  boardWords,
  fileName,
  won,
}: {
  gameNumber: number;
  score: Score;
  board: Board;
  boardWords: Board;
  fileName: string;
  won: boolean;
}) {
  const games = (await toJson(fileName)) as Game[];
  return [
    ...games,
    {
      number: gameNumber,
      score,
      board,
      boardWords,
      won,
      date: new Date().toISOString().slice(0, 10),
    },
  ].sort((a, b) => a.number - b.number);
}
