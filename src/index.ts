"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import parseGame from "./parse-game";
import returnWriteFile from "./write-file";
import addGame from "./add-game";

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

export async function wordle() {
  try {
    if (!github.context.payload.issue) {
      setFailed("Cannot find GitHub issue");
      return;
    }
    const { title, number, body } = github.context.payload.issue;
    if (!title || !body) {
      setFailed("Unable to parse GitHub issue.");
      return;
    }
    exportVariable("IssueNumber", number);
    const formattedGame = parseGame(title, body);
    if (formattedGame === undefined) {
      setFailed(
        "The GitHub Issue title is not in the correct format. Must be: `Wordle ### #/#`"
      );
      return;
    }
    exportVariable(
      "WordleSummary",
      `Wordle ${formattedGame.gameNumber} ${formattedGame.score}/6`
    );
    const fileName: string = getInput("wordleFileName");
    const games = (await addGame({
      ...formattedGame,
      fileName,
    })) as Game[];
    await returnWriteFile(fileName, games);
  } catch (error) {
    setFailed(error.message);
  }
}

export default wordle();
