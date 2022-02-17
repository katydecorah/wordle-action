import buildStatistics from "../statistics";

test("buildStatistics", () => {
  expect(buildStatistics([{ won: true, score: 3, date: "2022-01-01" }]))
    .toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 1,
        "4": 0,
        "5": 0,
        "X": 0,
      },
      "streakCurrent": 1,
      "streakMax": 1,
      "totalPlayed": 1,
      "totalWon": 1,
      "totalWonPercent": 1,
    }
  `);
  expect(buildStatistics([{ won: false, score: "X", date: "2022-01-01" }]))
    .toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "X": 1,
      },
      "streakCurrent": 0,
      "streakMax": 0,
      "totalPlayed": 1,
      "totalWon": 0,
      "totalWonPercent": 0,
    }
  `);
  expect(
    buildStatistics([
      { won: true, score: "3", date: "2022-01-01" },
      { won: true, score: "3", date: "2022-01-02" },
      { won: true, score: "5", date: "2022-01-03" },
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 2,
        "4": 0,
        "5": 1,
        "X": 0,
      },
      "streakCurrent": 3,
      "streakMax": 3,
      "totalPlayed": 3,
      "totalWon": 3,
      "totalWonPercent": 1,
    }
  `);
  expect(
    buildStatistics([
      { won: true, score: "3", date: "2022-01-01" },
      { won: false, score: "X", date: "2022-01-02" },
      { won: true, score: "3", date: "2022-01-03" },
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 2,
        "4": 0,
        "5": 0,
        "X": 1,
      },
      "streakCurrent": 1,
      "streakMax": 1,
      "totalPlayed": 3,
      "totalWon": 2,
      "totalWonPercent": 0.6666666666666666,
    }
  `);
  expect(
    buildStatistics([
      { won: false, score: "X", date: "2022-01-01" },
      { won: false, score: "X", date: "2022-01-02" },
      { won: false, score: "X", date: "2022-01-03" },
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "X": 3,
      },
      "streakCurrent": 0,
      "streakMax": 0,
      "totalPlayed": 3,
      "totalWon": 0,
      "totalWonPercent": 0,
    }
  `);
  expect(
    buildStatistics([
      { won: true, score: "1", date: "2022-01-01" },
      { won: true, score: "4", date: "2022-01-02" },
      { won: true, score: "4", date: "2022-01-03" },
      { won: false, score: "X", date: "2022-01-04" },
      { won: true, score: "2", date: "2022-01-05" },
      { won: true, score: "5", date: "2022-01-06" },
    ])
  ).toMatchInlineSnapshot(`
    Object {
      "distribution": Object {
        "1": 1,
        "2": 1,
        "3": 0,
        "4": 2,
        "5": 1,
        "X": 1,
      },
      "streakCurrent": 2,
      "streakMax": 3,
      "totalPlayed": 6,
      "totalWon": 5,
      "totalWonPercent": 0.8333333333333334,
    }
  `);
});
