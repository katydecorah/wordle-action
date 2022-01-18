import { wordle } from "../index";
import * as github from "@actions/github";
import { setFailed, exportVariable } from "@actions/core";
import returnWriteFile from "../write-file";

let mockReadFile = `- number: 210
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
    expect(returnWriteFile.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      "oh-my-wordle.yml",
      Array [
        Object {
          "board": Array [
            "🟩⬛⬛⬛⬛",
            "⬛⬛🟨🟩🟨",
            "🟩🟩🟩🟩🟩",
          ],
          "date": "2022-01-15",
          "number": 210,
          "score": 3,
          "won": true,
        },
        Object {
          "board": Array [
            "🟩⬛🟨⬛⬛",
            "🟩🟩⬛⬛⬛",
            "🟩🟩⬛🟨⬛",
            "🟩🟩🟩🟨⬛",
            "🟩🟩🟩🟩🟩",
          ],
          "date": "2022-01-18",
          "number": 213,
          "score": 5,
          "won": true,
        },
      ],
    ]
  `);
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
      'Wordle board is invalid: ["🟩⬛🟨⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛⬛⬛","🟩🟩⬛🟨⬛","🟩🟩🟩🟨⬛","🟩🟩🟩🟩🟩"]'
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
      "The GitHub Issue title is not in the correct format. Must be: `Wordle ### #/#`"
    );
  });

  test("error, function throws", async () => {
    mockReadFile = Promise.reject({ message: "Error" });
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          issue: goodIsue,
        },
      },
    });
    await wordle();
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
