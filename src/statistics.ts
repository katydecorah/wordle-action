import { Game } from ".";

export default function buildStatistics(games: Game[]): Statistics {
  const sorted = games.sort((a, b) => b.number - a.number);
  const totalPlayed = games.length;
  const totalWon = games.filter(({ won }) => won).length;
  return {
    totalPlayed,
    totalWon,
    totalWonPercent: (totalWon / totalPlayed).toFixed(0),
    streakCurrent: calcCurrentStreak(sorted),
    streakMax: calcMaxStreak(sorted),
    distribution: createDistribution(sorted),
  };
}

function createDistribution(games: Game[]) {
  const distribution = { X: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const { score } of games) {
    distribution[score]++;
  }
  return distribution;
}

function calcCurrentStreak(games: Game[]) {
  let currentStreak = 0;
  for (const game of games) {
    if (game.won) currentStreak++;
    else break;
  }
  return currentStreak;
}

function calcMaxStreak(games: Game[]) {
  let maxStreakArr: number[] = [];
  let maxStreakCounter = 0;

  for (const [i, game] of games.entries()) {
    if (game.won) {
      maxStreakCounter++;
    }
    if (game.won === false || games.length - 1 === i) {
      maxStreakArr = [...maxStreakArr, maxStreakCounter];
      maxStreakCounter = 0;
    }
  }
  return maxStreakArr.sort().reverse()[0];
}

export type Statistics = {
  totalPlayed: number;
  totalWon: number;
  totalWonPercent: string;
  streakCurrent: number;
  streakMax: number;
  distribution: {
    X: number;
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
};
