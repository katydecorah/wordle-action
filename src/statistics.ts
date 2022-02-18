import { Game } from ".";

export default function buildStatistics(games: Game[]): Statistics {
  const sorted = games.sort((a, b) => b.number - a.number);
  const totalPlayed = games.length;
  const totalWon = games.filter(({ won }) => won).length;
  return {
    totalPlayed,
    totalWon,
    totalWonPercent: ((totalWon / totalPlayed) * 100).toFixed(0),
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
  const lastGame = games[0].number;
  for (const [index, game] of games.entries()) {
    if (game.won && dailyStreak(lastGame, index, game)) currentStreak++;
    else break;
  }
  return currentStreak;
}

function dailyStreak(lastGame: number, index: number, game: Game) {
  return lastGame - index === game.number;
}

function calcMaxStreak(games: Game[]) {
  let maxStreakArr: number[] = [];
  let maxStreakCounter = 0;
  let lastGame = games[0].number;

  for (const [index, game] of games.entries()) {
    if (game.won && dailyStreak(lastGame, index, game)) {
      maxStreakCounter++;
    }
    if (game.won === false || games.length - 1 === index) {
      maxStreakArr = [...maxStreakArr, maxStreakCounter];
      maxStreakCounter = 0;
      lastGame = game.number;
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
    "6": number;
  };
};
