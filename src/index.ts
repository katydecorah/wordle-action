"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import parseGame from "./parse-game";
import returnWriteFile from "./write-file";
import addGame from "./add-game";

export async function wordle() {
  try {
    if (!github.context.payload.issue) {
      setFailed("Cannot find GitHub issue");
      return;
    }
    const { title, number, body } = github.context.payload.issue;
    if (!title || !body) {
      throw new Error("Unable to parse GitHub issue.");
    }
    const game = parseGame(title, body);
    const fileName: string = getInput("wordleFileName");
    const games = (await addGame({
      game,
      fileName,
    })) as Game[];
    exportVariable("IssueNumber", number);
    exportVariable("WordleSummary", `Wordle ${game.number} ${game.score}/6`);
    await returnWriteFile(fileName, games);
  } catch (error) {
    setFailed(error.message);
  }
}

export default wordle();

export type Board = string[];

export type Score = number | string;

export type Game = {
  number: number;
  score: Score;
  board: Board;
  boardWords: Board;
  date: string;
  won: boolean;
};

export type SquareEmoji = "⬜" | "⬛" | "🟨" | "🟩";
