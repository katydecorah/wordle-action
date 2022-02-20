import { Game, Board } from "./index";

export default function parseGame({
  title,
  body,
}: {
  title: string;
  body: string;
}): Game {
  try {
    const split = title.split(" ");
    if (!split || split.length !== 3) {
      throw new Error(
        "The GitHub Issue title is not in the correct format. Must be: `Wordle ### #/#`"
      );
    }
    const number = parseInt(split[1]);
    const score = split[2][0] === "X" ? "X" : parseInt(split[2][0]);
    const board = checkBoard(body);
    const won = score !== "X";
    const boardWords = board.map(emojiToWord);
    const altText = createAltText(boardWords, won);
    return {
      number,
      score,
      won,
      board,
      boardWords,
      altText,
      date: new Date().toISOString().slice(0, 10),
    };
  } catch (error) {
    throw new Error(error);
  }
}

export function checkBoard(body: string): Board {
  const board = body
    .split("\n")
    .map((row) => row.replace(/\r/, "").trim())
    .filter(String)
    .filter((row) => !row.startsWith("Wordle"));
  if (!board.length || board.length < 1 || board.length > 6) {
    throw new Error(`Wordle board is invalid: ${JSON.stringify(board)}`);
  }
  return board as Board;
}

export function emojiToWord(row: string) {
  return row
    .replace(/🟩/g, "yes ")
    .replace(/🟦/g, "yes ")
    .replace(/⬛/g, "no ")
    .replace(/⬜/g, "no ")
    .replace(/🟨/g, "almost ")
    .replace(/🟧/g, "almost ")
    .trim();
}

export function createAltText(boardWords: string[], won: boolean) {
  const gameStatus = won ? "won" : "lost";
  const gameRows = boardWords.length;
  const gameGuesses = won
    ? ` in ${gameRows} guess${gameRows === 1 ? "" : "es"}`
    : "";

  return `The player ${gameStatus} the game${gameGuesses}.`;
}

export function buildGames(previousGames: Game[], newGame: Game) {
  const parseGames = previousGames.map(prepareGameForParsing).map(parseGame);
  parseGames.push(newGame);
  return parseGames.sort((a, b) => a.number - b.number);
}

function prepareGameForParsing(game: Game): { title: string; body: string } {
  return {
    title: `Wordle ${game.number} ${game.score}/6`,
    body: game.board.join("\n"),
  };
}
