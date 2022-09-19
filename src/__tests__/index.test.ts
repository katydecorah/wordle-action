/* eslint-disable no-import-assign */
import { wordle } from "../index";
import * as github from "@actions/github";
import { setFailed, exportVariable } from "@actions/core";
import returnWriteFile from "../write-file";
import { promises } from "fs";

const mockWordleFile = JSON.stringify({
  games: [
    {
      number: 210,
      score: 3,
      board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
      won: true,
      date: "2022-01-15",
    },
  ],
});

jest.mock("@actions/core", () => {
  return {
    getInput: jest.fn().mockImplementation(() => "oh-my-wordle.json"),
    setFailed: jest.fn(),
    exportVariable: jest.fn(),
  };
});
jest.mock("../write-file");

describe("index", () => {
  beforeEach(() => {
    jest.spyOn(promises, "readFile").mockResolvedValue(mockWordleFile);
  });

  test("works", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-01-18").getTime());
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            game: `Wordle 213 5/6

🟩⬛🟨⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛🟨⬛
🟩🟩🟩🟨⬛
🟩🟩🟩🟩🟩`,
          },
        },
      },
    });
    await wordle();
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "WordleSummary",
      "Wordle 213 5/6"
    );
    expect(setFailed).not.toHaveBeenCalledWith();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "oh-my-wordle.json",
        {
          "distribution": {
            "1": 0,
            "2": 0,
            "3": 1,
            "4": 0,
            "5": 1,
            "6": 0,
            "X": 0,
          },
          "distributionPercent": {
            "1": 0,
            "2": 0,
            "3": 100,
            "4": 0,
            "5": 100,
            "6": 0,
            "X": 0,
          },
          "games": [
            {
              "altText": "The player won the game in 3 guesses.",
              "board": [
                "🟩⬛⬛⬛⬛",
                "⬛⬛🟨🟩🟨",
                "🟩🟩🟩🟩🟩",
              ],
              "boardWords": [
                "yes no no no no",
                "no no almost yes almost",
                "yes yes yes yes yes",
              ],
              "date": "2022-01-15",
              "number": 210,
              "score": 3,
              "won": true,
            },
            {
              "altText": "The player won the game in 5 guesses.",
              "board": [
                "🟩⬛🟨⬛⬛",
                "🟩🟩⬛⬛⬛",
                "🟩🟩⬛🟨⬛",
                "🟩🟩🟩🟨⬛",
                "🟩🟩🟩🟩🟩",
              ],
              "boardWords": [
                "yes no almost no no",
                "yes yes no no no",
                "yes yes no almost no",
                "yes yes yes almost no",
                "yes yes yes yes yes",
              ],
              "date": "2022-01-18",
              "number": 213,
              "score": 5,
              "won": true,
            },
          ],
          "streakCurrent": 1,
          "streakMax": 1,
          "totalPlayed": 2,
          "totalWon": 2,
          "totalWonPercent": "100",
        },
      ]
    `);
  });

  test("works, from inputs", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-09-19").getTime());
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            game: `Wordle 457 3/6  ⬛⬛🟨⬛🟩 🟨🟩🟩⬛🟩 🟩🟩🟩🟩🟩`,
          },
        },
      },
    });
    await wordle();
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "WordleSummary",
      "Wordle 457 3/6"
    );
    expect(setFailed).not.toHaveBeenCalledWith();
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "oh-my-wordle.json",
        {
          "distribution": {
            "1": 0,
            "2": 0,
            "3": 2,
            "4": 0,
            "5": 0,
            "6": 0,
            "X": 0,
          },
          "distributionPercent": {
            "1": 0,
            "2": 0,
            "3": 100,
            "4": 0,
            "5": 0,
            "6": 0,
            "X": 0,
          },
          "games": [
            {
              "altText": "The player won the game in 3 guesses.",
              "board": [
                "🟩⬛⬛⬛⬛",
                "⬛⬛🟨🟩🟨",
                "🟩🟩🟩🟩🟩",
              ],
              "boardWords": [
                "yes no no no no",
                "no no almost yes almost",
                "yes yes yes yes yes",
              ],
              "date": "2022-01-15",
              "number": 210,
              "score": 3,
              "won": true,
            },
            {
              "altText": "The player won the game in 3 guesses.",
              "board": [
                "⬛⬛🟨⬛🟩",
                "🟨🟩🟩⬛🟩",
                "🟩🟩🟩🟩🟩",
              ],
              "boardWords": [
                "no no almost no yes",
                "almost yes yes no yes",
                "yes yes yes yes yes",
              ],
              "date": "2022-09-19",
              "number": 457,
              "score": 3,
              "won": true,
            },
          ],
          "streakCurrent": 1,
          "streakMax": 1,
          "totalPlayed": 2,
          "totalWon": 2,
          "totalWonPercent": "100",
        },
      ]
    `);
  });

  test("error, no payload", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {},
      },
    });
    await wordle();
    expect(setFailed).toHaveBeenCalledWith("Missing `inputs`");
  });

  test("error, missing game", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            date: "2022-02-02",
          },
        },
      },
    });
    await wordle();
    expect(setFailed).toHaveBeenCalledWith("Missing `inputs.game`");
  });

  test("error, bad board", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            game: `"Wordle 213 5/6

🟩⬛🟨⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛🟨⬛
🟩🟩🟩🟨⬛
🟩🟩🟩🟩🟩`,
          },
        },
      },
    });
    await wordle();
    expect(setFailed.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Error: Wordle board is invalid: ["\\"","🟩⬛🟨⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛🟨⬛","🟩🟩🟩🟨⬛","🟩🟩🟩🟩🟩"]",
      ]
    `);
  });

  test("error, bad title", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            game: `🟩⬛🟨⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛🟨⬛
🟩🟩🟩🟨⬛
🟩🟩🟩🟩🟩`,
          },
        },
      },
    });
    await wordle();
    expect(setFailed).toHaveBeenCalledWith(
      "Error: The Wordle title is not in the correct format. Must be: `Wordle ### #/#`"
    );
  });
});
