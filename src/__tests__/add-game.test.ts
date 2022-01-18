import addGame from "../add-game";

jest.mock("@actions/core");
jest.mock("../to-json", () => {
  return jest.fn(() => [
    {
      board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
      date: "2022-01-17",
      number: 209,
      score: 3,
      won: true,
    },
  ]);
});

const sample = {
  board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
  gameNumber: 210,
  score: 3,
  won: true,
};

describe("addGame", () => {
  test("works", async () => {
    expect(await addGame({ ...sample, fileName: "my-wordle.yml" }))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "board": Array [
            "🟩⬛⬛⬛⬛",
            "⬛⬛🟨🟩🟨",
            "🟩🟩🟩🟩🟩",
          ],
          "date": "2022-01-17",
          "number": 209,
          "score": 3,
          "won": true,
        },
        Object {
          "board": Array [
            "🟩⬛⬛⬛⬛",
            "⬛⬛🟨🟩🟨",
            "🟩🟩🟩🟩🟩",
          ],
          "date": "2022-01-18",
          "number": 210,
          "score": 3,
          "won": true,
        },
      ]
    `);
  });
});
