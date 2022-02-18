import buildStatistics from "../statistics";

test("buildStatistics", () => {
  expect(buildStatistics([{ won: true, score: 3, number: 1 }]))
    .toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 1,
        "4": 0,
        "5": 0,
        "6": 0,
        "X": 0,
      },
      "streakCurrent": 1,
      "streakMax": 1,
      "totalPlayed": 1,
      "totalWon": 1,
      "totalWonPercent": "100",
    }
  `);
  expect(buildStatistics([{ won: false, score: "X", number: 1 }]))
    .toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "X": 1,
      },
      "streakCurrent": 0,
      "streakMax": 0,
      "totalPlayed": 1,
      "totalWon": 0,
      "totalWonPercent": "0",
    }
  `);
  expect(
    buildStatistics([
      { won: true, score: "3", number: 1 },
      { won: true, score: "3", number: 2 },
      { won: true, score: "5", number: 3 },
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 2,
        "4": 0,
        "5": 1,
        "6": 0,
        "X": 0,
      },
      "streakCurrent": 3,
      "streakMax": 3,
      "totalPlayed": 3,
      "totalWon": 3,
      "totalWonPercent": "100",
    }
  `);
  expect(
    buildStatistics([
      { won: true, score: "3", number: 1 },
      { won: false, score: "X", number: 2 },
      { won: true, score: "3", number: 3 },
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 2,
        "4": 0,
        "5": 0,
        "6": 0,
        "X": 1,
      },
      "streakCurrent": 1,
      "streakMax": 1,
      "totalPlayed": 3,
      "totalWon": 2,
      "totalWonPercent": "67",
    }
  `);
  expect(
    buildStatistics([
      { won: false, score: "X", number: 1 },
      { won: false, score: "X", number: 2 },
      { won: false, score: "X", number: 3 },
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "X": 3,
      },
      "streakCurrent": 0,
      "streakMax": 0,
      "totalPlayed": 3,
      "totalWon": 0,
      "totalWonPercent": "0",
    }
  `);
  expect(
    buildStatistics([
      { won: true, score: "1", number: 1 },
      { won: true, score: "4", number: 2 },
      { won: true, score: "4", number: 3 },
      { won: false, score: "X", number: 4 },
      { won: true, score: "2", number: 5 },
      { won: true, score: "5", number: 6 },
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 1,
        "2": 1,
        "3": 0,
        "4": 2,
        "5": 1,
        "6": 0,
        "X": 1,
      },
      "streakCurrent": 2,
      "streakMax": 2,
      "totalPlayed": 6,
      "totalWon": 5,
      "totalWonPercent": "83",
    }
  `);
});
