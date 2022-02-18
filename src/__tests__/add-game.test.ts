import addGame from "../add-game";

jest.mock("@actions/core");

let mockReadFile = Promise.resolve(
  JSON.stringify({
    games: [
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
    ],
  })
);

jest.mock("../read-file", () => {
  return jest.fn().mockImplementation(() => mockReadFile);
});

const game = {
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
};

describe("addGame", () => {
  test("works", async () => {
    expect(await addGame({ game, fileName: "my-wordle.yml" })).toEqual([
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
    expect(await addGame({ game, fileName: "my-wordle.yml" })).toEqual([
      {
        board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
        boardWords: [
          "yes no no no no",
          "no no almost yes almost",
          "yes yes yes yes yes",
        ],
        date: "2022-01-15",
        number: 210,
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

  test("can add wordle game to empty yaml file", async () => {
    mockReadFile = Promise.resolve("");
    expect(await addGame({ game, fileName: "my-wordle.yml" })).toEqual([
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

  test("can add wordle game to yaml file with whitespace", async () => {
    mockReadFile = Promise.resolve(`

  `);
    expect(await addGame({ game, fileName: "my-wordle.yml" })).toEqual([
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
