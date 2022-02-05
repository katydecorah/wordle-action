import addGame from "../add-game";

jest.mock("@actions/core");

const mockReadFile = Promise.resolve(
  JSON.stringify([
    {
      board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
      boardWords: [
        "yes no no no no",
        "no no almost yes almost",
        "yes yes yes yes yes",
      ],
      date: "2022-01-17",
      number: 209,
      score: 3,
      won: true,
    },
  ])
);

jest.mock("../read-file", () => {
  return jest.fn().mockImplementation(() => mockReadFile);
});

const sample = {
  board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
  boardWords: [
    "yes no no no no",
    "no no almost yes almost",
    "yes yes yes yes yes",
  ],
  gameNumber: 210,
  score: 3,
  won: true,
};

describe("addGame", () => {
  test("works", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2022-01-18").getTime());

    expect(await addGame({ ...sample, fileName: "my-wordle.yml" })).toEqual([
      {
        board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
        boardWords: [
          "yes no no no no",
          "no no almost yes almost",
          "yes yes yes yes yes",
        ],
        date: "2022-01-17",
        number: 209,
        score: 3,
        won: true,
      },
      {
        board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
        boardWords: [
          "yes no no no no",
          "no no almost yes almost",
          "yes yes yes yes yes",
        ],
        date: "2022-01-18",
        number: 210,
        score: 3,
        won: true,
      },
    ]);
  });
});
