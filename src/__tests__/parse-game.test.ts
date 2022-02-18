import parseGame, { checkBoard, emojiToWord } from "../parse-game";

jest.mock("@actions/core");

describe("parseGame", () => {
  jest.useFakeTimers().setSystemTime(new Date("2022-01-18").getTime());
  test("works", () => {
    expect(
      parseGame(
        "Wordle 210 3/6",
        `🟩⬛⬛⬛⬛
⬛⬛🟨🟩🟨
🟩🟩🟩🟩🟩`
      )
    ).toEqual({
      board: ["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"],
      boardWords: [
        "yes no no no no",
        "no no almost yes almost",
        "yes yes yes yes yes",
      ],
      number: 210,
      date: "2022-01-18",
      score: 3,
      won: true,
    });
    expect(
      parseGame(
        "Wordle 208 X/6",
        `⬛⬛⬛⬛🟨
⬛🟨⬛⬛⬛
⬛🟨⬛🟩⬛
🟩⬛⬛⬛🟨
🟩⬛⬛🟩⬛
🟩⬛⬛🟩⬛`
      )
    ).toEqual({
      board: [
        "⬛⬛⬛⬛🟨",
        "⬛🟨⬛⬛⬛",
        "⬛🟨⬛🟩⬛",
        "🟩⬛⬛⬛🟨",
        "🟩⬛⬛🟩⬛",
        "🟩⬛⬛🟩⬛",
      ],
      boardWords: [
        "no no no no almost",
        "no almost no no no",
        "no almost no yes no",
        "yes no no no almost",
        "yes no no yes no",
        "yes no no yes no",
      ],
      date: "2022-01-18",
      number: 208,
      score: "X",
      won: false,
    });
    expect(
      parseGame(
        "Wordle 209 6/6",
        `Wordle 209 6/6

🟩⬛🟨⬛🟨
🟩🟩⬛⬛⬛
🟩🟩⬛⬛⬛
🟩⬛🟩⬛⬛
🟩🟩🟩⬛⬛
🟩🟩🟩🟩🟩
`
      )
    ).toEqual({
      board: [
        "🟩⬛🟨⬛🟨",
        "🟩🟩⬛⬛⬛",
        "🟩🟩⬛⬛⬛",
        "🟩⬛🟩⬛⬛",
        "🟩🟩🟩⬛⬛",
        "🟩🟩🟩🟩🟩",
      ],
      boardWords: [
        "yes no almost no almost",
        "yes yes no no no",
        "yes yes no no no",
        "yes no yes no no",
        "yes yes yes no no",
        "yes yes yes yes yes",
      ],
      date: "2022-01-18",
      number: 209,
      score: 6,
      won: true,
    });
  });
});

describe("checkBoard", () => {
  test("works", () => {
    expect(
      checkBoard(`🟩⬛⬛⬛⬛
⬛⬛🟨🟩🟨
🟩🟩🟩🟩🟩`)
    ).toEqual(["🟩⬛⬛⬛⬛", "⬛⬛🟨🟩🟨", "🟩🟩🟩🟩🟩"]);
  });
  test("error, no value", () => {
    expect(() => checkBoard(``)).toThrow("Wordle board is invalid: []");
  });
  test("error, too many rows", () => {
    expect(() =>
      checkBoard(`🟩⬛⬛⬛⬛
🟩⬛⬛⬛⬛
🟩⬛⬛⬛⬛
🟩⬛⬛⬛⬛
🟩⬛⬛⬛⬛
⬛⬛🟨🟩🟨
🟩🟩🟩🟩🟩`)
    ).toThrow(
      'Wordle board is invalid: ["🟩⬛⬛⬛⬛","🟩⬛⬛⬛⬛","🟩⬛⬛⬛⬛","🟩⬛⬛⬛⬛","🟩⬛⬛⬛⬛","⬛⬛🟨🟩🟨","🟩🟩🟩🟩🟩"]'
    );
  });
});

test("emojiToWord", () => {
  expect(emojiToWord("🟩⬛⬛⬛⬛")).toEqual("yes no no no no");
  expect(emojiToWord("🟦⬜⬜⬜⬜")).toEqual("yes no no no no");
  expect(emojiToWord("🟩🟩🟩🟩🟩")).toEqual("yes yes yes yes yes");
  expect(emojiToWord("🟦🟦🟦🟦🟦")).toEqual("yes yes yes yes yes");
  expect(emojiToWord("⬛⬛⬛⬛⬛")).toEqual("no no no no no");
  expect(emojiToWord("⬜⬜⬜⬜⬜")).toEqual("no no no no no");
  expect(emojiToWord("⬛⬛🟨🟩🟨")).toEqual("no no almost yes almost");
  expect(emojiToWord("⬜⬜🟧🟦🟧")).toEqual("no no almost yes almost");
  expect(emojiToWord("🟨🟨🟨🟨🟨")).toEqual(
    "almost almost almost almost almost"
  );
  expect(emojiToWord("🟧🟧🟧🟧🟧")).toEqual(
    "almost almost almost almost almost"
  );
});
