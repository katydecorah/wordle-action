"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import parseGame, { buildGames } from "./parse-game";
import returnWriteFile from "./write-file";
import buildStatistics, { Statistics } from "./statistics";
import returnReadFile from "./read-file";

export async function wordle() {
  try {
    // Get inputs
    const inputs = github.context.payload.inputs as Inputs;
    // Validate inputs
    if (!inputs) return setFailed("Missing `inputs`");
    const { game, date } = inputs;
    if (!game) return setFailed("Missing `inputs.game`");

    const fileName: string = getInput("wordleFileName");

    const newGame = parseGame({ game, date });
    exportVariable(
      "WordleSummary",
      `Wordle ${newGame.number} ${newGame.score}/6`
    );

    const previousGames = (await returnReadFile(fileName)) as Game[];

    const games = buildGames(previousGames, newGame);

    await returnWriteFile(fileName, {
      ...buildStatistics(games),
      games,
    });
  } catch (error) {
    setFailed(error.message);
  }
}

export default wordle();

export type Board = string[];

export type Inputs = {
  game: string;
  date?: string;
};

export type Score = number | string;

export type Game = {
  number: number;
  score: Score;
  board: Board;
  boardWords: Board;
  date: string;
  won: boolean;
  altText: string;
};

export type SquareEmoji = "⬜" | "⬛" | "🟨" | "🟩";

export interface Json extends Statistics {
  games: Game[];
}
