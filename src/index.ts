"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import parseGame from "./parse-game";
import toJson from "./to-json";
import returnWriteFile from "./write-file";
import buildStatistics, { Statistics } from "./statistics";

export async function wordle() {
  try {
    const fileName: string = getInput("wordleFileName");

    if (!github.context.payload.issue) {
      setFailed("Cannot find GitHub issue");
      return;
    }
    const { title, number, body } = github.context.payload.issue;

    if (!title || !body) {
      throw new Error("Unable to parse GitHub issue.");
    }
    const newGame = parseGame({ title, body });
    exportVariable("IssueNumber", number);
    exportVariable(
      "WordleSummary",
      `Wordle ${newGame.number} ${newGame.score}/6`
    );

    const currentGames = (await toJson(fileName)) as Game[];
    const combineGames = [...currentGames, newGame].map(
      prepareGamesForFormatting
    );
    const games = combineGames
      .map(parseGame)
      .sort((a, b) => a.number - b.number);

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

function prepareGamesForFormatting(game): { title: string; body: string } {
  return {
    title: `Wordle ${game.number} ${game.score}/6`,
    body: game.board.join("\n"),
  };
}
