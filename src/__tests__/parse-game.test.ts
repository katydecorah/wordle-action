import parseGame, { checkBoard, emojiToWord } from "../parse-game";
import { setFailed } from "@actions/core";

jest.mock("@actions/core");

describe("parseGame", () => {
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
      gameNumber: 210,
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
      gameNumber: 208,
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
      gameNumber: 209,
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
    checkBoard(``);
    expect(setFailed).toHaveBeenCalledWith("Wordle board is invalid: []");
  });
  test("error, too many rows", () => {
    checkBoard(`🟩⬛⬛⬛⬛
🟩⬛⬛⬛⬛
🟩⬛⬛⬛⬛
🟩⬛⬛⬛⬛
🟩⬛⬛⬛⬛
⬛⬛🟨🟩🟨
🟩🟩🟩🟩🟩`);
    expect(setFailed).toHaveBeenCalledWith(
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
