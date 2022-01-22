import parseGame, {
  checkBoard,
  emojiToWord,
  boardToAltText,
} from "../parse-game";

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
      altText: [
        "The player won the game in 3 guesses.",
        "In the first guess: The first letter is correct. The second letter is not in the word. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is not in the word.",
        "In the second guess: The first letter is not in the word. The second letter is not in the word. The third letter is in the word, but in the incorrect spot. The fourth letter is correct. The fifth letter is in the word, but in the incorrect spot.",
        "In the third guess: All letters are correct.",
      ],
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
      altText: [
        "The player lost the game.",
        "In the first guess: The first letter is not in the word. The second letter is not in the word. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is in the word, but in the incorrect spot.",
        "In the second guess: The first letter is not in the word. The second letter is in the word, but in the incorrect spot. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is not in the word.",
        "In the third guess: The first letter is not in the word. The second letter is in the word, but in the incorrect spot. The third letter is not in the word. The fourth letter is correct. The fifth letter is not in the word.",
        "In the fourth guess: The first letter is correct. The second letter is not in the word. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is in the word, but in the incorrect spot.",
        "In the fifth guess: The first letter is correct. The second letter is not in the word. The third letter is not in the word. The fourth letter is correct. The fifth letter is not in the word.",
        "In the sixth guess: The first letter is correct. The second letter is not in the word. The third letter is not in the word. The fourth letter is correct. The fifth letter is not in the word.",
      ],
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
      altText: [
        "The player won the game in 6 guesses.",
        "In the first guess: The first letter is correct. The second letter is not in the word. The third letter is in the word, but in the incorrect spot. The fourth letter is not in the word. The fifth letter is in the word, but in the incorrect spot.",
        "In the second guess: The first letter is correct. The second letter is correct. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is not in the word.",
        "In the third guess: The first letter is correct. The second letter is correct. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is not in the word.",
        "In the fourth guess: The first letter is correct. The second letter is not in the word. The third letter is correct. The fourth letter is not in the word. The fifth letter is not in the word.",
        "In the fifth guess: The first letter is correct. The second letter is correct. The third letter is correct. The fourth letter is not in the word. The fifth letter is not in the word.",
        "In the sixth guess: All letters are correct.",
      ],
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

test("boardToAltText", () => {
  expect(
    boardToAltText(
      ["yes no no no no", "no no almost yes almost", "yes yes yes yes yes"],
      true
    )
  ).toMatchInlineSnapshot(`
    Array [
      "The player won the game in 3 guesses.",
      "In the first guess: The first letter is correct. The second letter is not in the word. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is not in the word.",
      "In the second guess: The first letter is not in the word. The second letter is not in the word. The third letter is in the word, but in the incorrect spot. The fourth letter is correct. The fifth letter is in the word, but in the incorrect spot.",
      "In the third guess: All letters are correct.",
    ]
  `);
  expect(boardToAltText(["yes yes yes yes yes"], true)).toMatchInlineSnapshot(`
    Array [
      "The player won the game in 1 guess.",
    ]
  `);
  expect(
    boardToAltText(
      [
        "yes no no no no",
        "no no almost yes almost",
        "no no almost yes almost",
        "no no almost yes almost",
        "no no almost yes almost",
        "no yes yes yes yes",
      ],

      false
    )
  ).toMatchInlineSnapshot(`
    Array [
      "The player lost the game.",
      "In the first guess: The first letter is correct. The second letter is not in the word. The third letter is not in the word. The fourth letter is not in the word. The fifth letter is not in the word.",
      "In the second guess: The first letter is not in the word. The second letter is not in the word. The third letter is in the word, but in the incorrect spot. The fourth letter is correct. The fifth letter is in the word, but in the incorrect spot.",
      "In the third guess: The first letter is not in the word. The second letter is not in the word. The third letter is in the word, but in the incorrect spot. The fourth letter is correct. The fifth letter is in the word, but in the incorrect spot.",
      "In the fourth guess: The first letter is not in the word. The second letter is not in the word. The third letter is in the word, but in the incorrect spot. The fourth letter is correct. The fifth letter is in the word, but in the incorrect spot.",
      "In the fifth guess: The first letter is not in the word. The second letter is not in the word. The third letter is in the word, but in the incorrect spot. The fourth letter is correct. The fifth letter is in the word, but in the incorrect spot.",
      "In the sixth guess: The first letter is not in the word. The second letter is correct. The third letter is correct. The fourth letter is correct. The fifth letter is correct.",
    ]
  `);
});
