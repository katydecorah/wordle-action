"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import { load } from "js-yaml";
import { stringify } from "json-to-pretty-yaml";
import { readFile, writeFile } from "fs/promises";

type Board = [string, string?, string?, string?, string?, string?];
type Score = number | string;
type Game = {
  number: number;
  score: Score;
  board: Board;
  date: string;
  won: boolean;
};

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

export async function addGame({
  gameNumber,
  score,
  board,
  fileName,
  won,
}: {
  gameNumber: number;
  score: Score;
  board: Board;
  fileName: string;
  won: boolean;
}) {
  const wordleJson = (await toJson(fileName)) as Game[];
  wordleJson.push({
    number: gameNumber,
    score,
    board,
    won,
    date: new Date().toISOString().slice(0, 10),
  });
  return wordleJson.sort((a, b) => a.number - b.number);
}

export async function toJson(fileName: string) {
  try {
    const contents = (await returnReadFile(fileName)) as string;
    return load(contents);
  } catch (error) {
    setFailed(error.message);
  }
}

export function parseGame(
  title: string,
  body: string
): { gameNumber: number; score: Score; won: boolean; board: Board } {
  const split = title.split(" ");
  const gameNumber = parseInt(split[1]);
  const score = split[2][0] === "X" ? "X" : parseInt(split[2][0]);
  const board = checkBoard(body);
  return {
    gameNumber,
    score,
    won: score !== "X",
    board: board,
  };
}

function checkBoard(body: string) {
  const board = body.split("\n").map((row) => row.replace(/\r/, ""));
  if (!board.length || board.length < 1 || board.length > 6)
    throw new Error("Wordle board is invalid");
  return board as Board;
}

export async function returnReadFile(fileName: string) {
  try {
    const promise = readFile(fileName, "utf-8");
    return await promise;
  } catch (error) {
    setFailed(error);
  }
}

export async function returnWriteFile(fileName: string, games: Game[]) {
  try {
    const data = stringify(games);
    const promise = writeFile(fileName, data);
    await promise;
  } catch (error) {
    setFailed(error);
  }
}

export default wordle();
