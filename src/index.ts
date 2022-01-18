"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import parseGame from "./parse-game";
import returnWriteFile from "./write-file";
import addGame from "./add-game";

export type Board = [string, string?, string?, string?, string?, string?];
export type Score = number | string;
export type Game = {
  number: number;
  score: Score;
  board: Board;
  date: string;
  won: boolean;
};
export type SquareEmoji = "⬜" | "⬛" | "🟨" | "🟩";

async function wordle() {
  try {
    if (!github.context.payload.issue) {
      throw new Error("Cannot find GitHub issue");
    }
    const { title, number, body } = github.context.payload.issue;
    if (!title || !body) {
      throw new Error("Unable to parse GitHub issue.");
    }
    exportVariable("IssueNumber", number);
    const { gameNumber, score, board, won } = parseGame(title, body);
    if (!gameNumber || !score || !body) {
      throw new Error("Could not parse GitHub Issue");
    }
    exportVariable("WordleSummary", `Wordle ${gameNumber} ${score}/6`);
    const fileName: string = getInput("wordleFileName");
    const games = (await addGame({
      gameNumber,
      score,
      board,
      fileName,
      won,
    })) as Game[];
    await returnWriteFile(fileName, games);
  } catch (error) {
    setFailed(error.message);
  }
}

export default wordle();
