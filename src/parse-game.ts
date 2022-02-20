import { Game, Board } from "./index";

export default function parseGame(title: string, body: string): Game {
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
    const altText = boardToAltText(boardWords, won);
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

export function boardToAltText(boardWords: string[], won: boolean) {
  const position = {
    0: "first",
    1: "second",
    2: "third",
    3: "fourth",
    4: "fifth",
    5: "sixth",
  };

  const status = {
    no: "not in the word.",
    yes: "correct.",
    almost: "in the word, but in the wrong spot.",
  };

  const rowToWords = (row: string, index: number) => {
    const wonWithLastGuess = won && index === boardWords.length - 1;
    const describeRow = `${row.split(" ").map(lettertoWords).join(" ")}`;
    return `In the ${position[index]} guess: ${
      wonWithLastGuess ? "All letters are correct." : describeRow
    }`;
  };

  const lettertoWords = (letter: string, index: number) =>
    `The ${position[index]} letter is ${status[letter]}`;

  const describedRows = boardWords.map(rowToWords);
  const luckyGuess = boardWords.length === 1 && won;
  const gameStatus = won ? "won" : "lost";
  const gameGuesses = won
    ? ` in ${boardWords.length} guess${boardWords.length === 1 ? "" : "es"}`
    : "";

  return [
    `The player ${gameStatus} the game${gameGuesses}.`,
    ...(luckyGuess ? [] : [...describedRows]),
  ];
}
