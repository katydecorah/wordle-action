"use strict";

import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import { load } from "js-yaml";
import { stringify } from "json-to-pretty-yaml";
import { readFile, writeFile } from "fs/promises";

export type Board = [string, string?, string?, string?, string?, string?];

export type Score = {
  number: number;
  score: string;
  board: Board;
  date: string;
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
    const { gameNumber, score, board } = parseGame(title, body);
    if (!gameNumber || !score || !body) {
      throw new Error("Could not parse GitHub Issue");
    }
    exportVariable("WordleGameNumber", gameNumber);
    const fileName: string = getInput("wordleFileName");
    const scores = (await addScore({
      gameNumber,
      score,
      board,
      fileName,
    })) as Score[];
    await returnWriteFile(fileName, scores);
  } catch (error) {
    setFailed(error.message);
  }
}

export async function addScore({
  gameNumber,
  score,
  board,
  fileName,
}: {
  gameNumber: number;
  score: string;
  board: Board;
  fileName: string;
}) {
  const wordleJson = (await toJson(fileName)) as Score[];
  wordleJson.push({
    number: gameNumber,
    score,
    board,
    date: new Date().toISOString().slice(0, 10),
  });
  return wordleJson;
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
): { gameNumber: number; score: string; board: Board } {
  const split = title.split(" ");
  const gameNumber = parseInt(split[1]);
  const score = split[2];
  const board = checkBoard(body);
  return {
    gameNumber,
    score,
    board: board,
  };
}

function checkBoard(body: string) {
  const board = body.split("\n");
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

export async function returnWriteFile(fileName: string, scores: Score[]) {
  try {
    const data = stringify(scores);
    const promise = writeFile(fileName, data);
    await promise;
  } catch (error) {
    setFailed(error);
  }
}

export default wordle();
