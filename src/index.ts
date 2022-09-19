"use strict";

import { getInput, exportVariable, setFailed, info } from "@actions/core";
import * as github from "@actions/github";
import parseGame, { buildGames } from "./parse-game";
import toJson from "./to-json";
import returnWriteFile from "./write-file";
import buildStatistics, { Statistics } from "./statistics";

export async function wordle() {
  try {
    info(JSON.stringify(github.context.payload, null, 2));

    // Get client_payload
    const payload = github.context.payload.inputs as Inputs;
    // Validate client_payload
    if (!payload) return setFailed("Missing `client_payload`");
    const { game, date } = payload;
    if (!game) return setFailed("Missing `game` in `client_payload`");

    const fileName: string = getInput("wordleFileName");

    const newGame = parseGame({ game, date });
    exportVariable(
      "WordleSummary",
      `Wordle ${newGame.number} ${newGame.score}/6`
    );

    const previousGames = (await toJson(fileName)) as Game[];
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

export interface Yaml extends Statistics {
  games: Game[];
}
