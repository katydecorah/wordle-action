import toJson from "../to-json";

jest.mock("@actions/core");

let mockReadFile = Promise.resolve("- number: 100");

jest.mock("../read-file", () => {
  return jest.fn().mockImplementation(() => mockReadFile);
});

describe("toJson", () => {
  test("works", async () => {
    expect(await toJson("my-file.yml")).toEqual([{ number: 100 }]);
  });
  test("error", async () => {
    mockReadFile = Promise.reject("Error");
    await expect(toJson("my-file.yml")).rejects.toThrow("Error");
  });

  test("can add wordle game to filled yaml file", async () => {
    mockReadFile = Promise.resolve(`  - number: 210
    score: 3
    board:
      - "🟩⬛⬛⬛⬛"
      - "⬛⬛🟨🟩🟨"
      - "🟩🟩🟩🟩🟩"
    won: true
    date: "2022-01-15"
    boardWords:
      - "yes no no no no"
      - "no no almost yes almost"
      - "yes yes yes yes yes"
`);
    expect(await toJson("my-file.yml")).toMatchInlineSnapshot(`
      [
        {
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
      ]
    `);
  });

  test("can add wordle game to empty yaml file", async () => {
    mockReadFile = Promise.resolve("");
    expect(await toJson("my-file.yml")).toMatchInlineSnapshot(`[]`);
  });

  test("can add wordle game to yaml file with whitespace", async () => {
    mockReadFile = Promise.resolve(`

  `);
    expect(await toJson("my-file.yml")).toMatchInlineSnapshot(`[]`);
  });
});
