import returnReadFile from "../read-file";
import { promises } from "fs";

jest.mock("@actions/core");

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

describe("returnReadFile", () => {
  test("works", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(mockWordleFile);
    expect(await returnReadFile("my-file.json")).toMatchInlineSnapshot(`
      [
        {
          "board": [
            "🟩⬛⬛⬛⬛",
            "⬛⬛🟨🟩🟨",
            "🟩🟩🟩🟩🟩",
          ],
          "date": "2022-01-15",
          "number": 210,
          "score": 3,
          "won": true,
        },
      ]
    `);
  });

  test("works, legacy", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(
      JSON.stringify([
        {
          number: 210,
          score: 3,
          board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
          won: true,
          date: "2022-01-15",
        },
      ])
    );
    expect(await returnReadFile("my-file.json")).toMatchInlineSnapshot(`
      [
        {
          "board": [
            "🟩⬛⬛⬛⬛",
            "⬛⬛🟨🟩🟨",
            "🟩🟩🟩🟩🟩",
          ],
          "date": "2022-01-15",
          "number": 210,
          "score": 3,
          "won": true,
        },
      ]
    `);
  });

  test("error", async () => {
    jest.spyOn(promises, "readFile").mockRejectedValue("Error");
    await expect(returnReadFile("my-file.json")).rejects.toThrow("Error");
  });

  test("can add wordle game to empty json file", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce();
    expect(await returnReadFile("my-file.json")).toMatchInlineSnapshot(`[]`);
  });

  test("can add wordle game to json file with whitespace", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(`

  `);
    expect(await returnReadFile("my-file.json")).toMatchInlineSnapshot(`[]`);
  });
});
