import buildStatistics from "../statistics";

describe("buildStatistics", () => {
  test("single game, won", () => {
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
        "distributionPercent": Object {
          "1": 0,
          "2": 0,
          "3": 100,
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
  });
  test("single game, lost", () => {
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
        "distributionPercent": Object {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
          "6": 0,
          "X": 100,
        },
        "streakCurrent": 0,
        "streakMax": 0,
        "totalPlayed": 1,
        "totalWon": 0,
        "totalWonPercent": "0",
      }
    `);
  });
  test("won all", () => {
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
        "distributionPercent": Object {
          "1": 0,
          "2": 0,
          "3": 100,
          "4": 0,
          "5": 50,
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
  });
  test("lost 1/3", () => {
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
        "distributionPercent": Object {
          "1": 0,
          "2": 0,
          "3": 100,
          "4": 0,
          "5": 0,
          "6": 0,
          "X": 50,
        },
        "streakCurrent": 1,
        "streakMax": 1,
        "totalPlayed": 3,
        "totalWon": 2,
        "totalWonPercent": "67",
      }
    `);
  });
  test("lost all", () => {
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
        "distributionPercent": Object {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
          "6": 0,
          "X": 100,
        },
        "streakCurrent": 0,
        "streakMax": 0,
        "totalPlayed": 3,
        "totalWon": 0,
        "totalWonPercent": "0",
      }
    `);
  });

  test("lost game in middle", () => {
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
        "distributionPercent": Object {
          "1": 50,
          "2": 50,
          "3": 0,
          "4": 100,
          "5": 50,
          "6": 0,
          "X": 50,
        },
        "streakCurrent": 2,
        "streakMax": 3,
        "totalPlayed": 6,
        "totalWon": 5,
        "totalWonPercent": "83",
      }
    `);
  });

  test("broke streak: missed game #5", () => {
    expect(
      buildStatistics([
        { won: true, score: "1", number: 1 },
        { won: true, score: "4", number: 2 },
        { won: true, score: "4", number: 3 },
        { won: true, score: "2", number: 4 },
        { won: true, score: "5", number: 6 },
        { won: true, score: "5", number: 7 },
      ])
    ).toMatchInlineSnapshot(`
      Object {
        "distribution": Object {
          "1": 1,
          "2": 1,
          "3": 0,
          "4": 2,
          "5": 2,
          "6": 0,
          "X": 0,
        },
        "distributionPercent": Object {
          "1": 50,
          "2": 50,
          "3": 0,
          "4": 100,
          "5": 100,
          "6": 0,
          "X": 0,
        },
        "streakCurrent": 2,
        "streakMax": 4,
        "totalPlayed": 6,
        "totalWon": 6,
        "totalWonPercent": "100",
      }
    `);
  });

  test("broke streak: missed game #5 #6", () => {
    expect(
      buildStatistics([
        { won: true, score: "1", number: 1 },
        { won: true, score: "4", number: 2 },
        { won: true, score: "4", number: 3 },
        { won: true, score: "2", number: 4 },
        { won: true, score: "5", number: 7 },
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
          "X": 0,
        },
        "distributionPercent": Object {
          "1": 50,
          "2": 50,
          "3": 0,
          "4": 100,
          "5": 50,
          "6": 0,
          "X": 0,
        },
        "streakCurrent": 1,
        "streakMax": 4,
        "totalPlayed": 5,
        "totalWon": 5,
        "totalWonPercent": "100",
      }
    `);
  });
});
