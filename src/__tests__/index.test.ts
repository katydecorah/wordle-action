/* eslint-disable no-import-assign */
import { wordle } from "../index";
import * as github from "@actions/github";
import { setFailed, exportVariable } from "@actions/core";
import returnWriteFile from "../write-file";

const mockReadFile = `- number: 210
  score: 3
  board:
    - "🟩⬛⬛⬛⬛"
    - "⬛⬛🟨🟩🟨"
    - "🟩🟩🟩🟩🟩"
  won: true
  date: "2022-01-15"
`;
jest.mock("@actions/core", () => {
  return {
    getInput: jest.fn().mockImplementation(() => "oh-my-wordle.yml"),
    setFailed: jest.fn(),
    exportVariable: jest.fn(),
  };
});
jest.mock("../write-file");
jest.mock("../read-file", () => {
  return jest.fn().mockImplementation(() => mockReadFile);
});

const goodIsue = {
  title: "Wordle 213 5/6",
  body: `🟩⬛🟨⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛🟨⬛
🟩🟩🟩🟨⬛
🟩🟩🟩🟩🟩`,
  number: 1,
};

describe("index", () => {
  test("works", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-01-18").getTime());
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          issue: goodIsue,
        },
      },
    });
    await wordle();
    expect(exportVariable).toHaveBeenNthCalledWith(1, "IssueNumber", 1);
    expect(exportVariable).toHaveBeenNthCalledWith(
      2,
      "WordleSummary",
      "Wordle 213 5/6"
    );
    expect(setFailed).not.toHaveBeenCalledWith();
    expect(returnWriteFile.mock.calls[0]).toEqual([
      "oh-my-wordle.yml",
      [
        {
          board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
          date: "2022-01-15",
          number: 210,
          score: 3,
          won: true,
        },
        {
          altText: [
            "The player won the game in 5 guesses.",
            "In the first guess: The first letter is correct. The second letter is not in the word. The third letter is in the word, but in the wrong spot. The fourth letter is not in the word. The fifth letter is not in the word.",
            "In the second guess: The first letter is correct. The second letter is correct. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is not in the word.",
            "In the third guess: The first letter is correct. The second letter is correct. The third letter is not in the word. The fourth letter is in the word, but in the wrong spot. The fifth letter is not in the word.",
            "In the fourth guess: The first letter is correct. The second letter is correct. The third letter is correct. The fourth letter is in the word, but in the wrong spot. The fifth letter is not in the word.",
            "In the fifth guess: All letters are correct.",
          ],
          board: [
            "🟩⬛🟨⬛⬛",
            "🟩🟩⬛⬛⬛",
            "🟩🟩⬛🟨⬛",
            "🟩🟩🟩🟨⬛",
            "🟩🟩🟩🟩🟩",
          ],
          boardWords: [
            "yes no almost no no",
            "yes yes no no no",
            "yes yes no almost no",
            "yes yes yes almost no",
            "yes yes yes yes yes",
          ],
          date: "2022-01-18",
          number: 213,
          score: 5,
          won: true,
        },
      ],
    ]);
  });

  test("error, no payload", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          issue: {
            number: 1,
          },
        },
      },
    });
    await wordle();
    expect(setFailed).toHaveBeenCalledWith("Unable to parse GitHub issue.");
  });

  test("error, bad board", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          issue: {
            title: "Wordle 213 5/6",
            body: `🟩⬛🟨⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛⬛⬛
🟩🟩⬛🟨⬛
🟩🟩🟩🟨⬛
🟩🟩🟩🟩🟩`,
            number: 1,
          },
        },
      },
    });
    await wordle();
    expect(setFailed).toHaveBeenCalledWith(
      'Error: Wordle board is invalid: ["🟩⬛🟨⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛🟨⬛","🟩🟩🟩🟨⬛","🟩🟩🟩🟩🟩"]'
    );
  });

  test("error, bad title", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          issue: {
            ...goodIsue,
            title: "Wordle",
          },
        },
      },
    });
    await wordle();
    expect(setFailed).toHaveBeenCalledWith(
      "Error: The GitHub Issue title is not in the correct format. Must be: `Wordle ### #/#`"
    );
  });
});
