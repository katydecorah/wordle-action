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

  for (const [index, game] of games.entries()) {
    // if you lost a game or missed a game, end the current streak.
    if (lostOrBrokeStreak({ index, games, game })) {
      maxStreakArr = [...maxStreakArr, maxStreakCounter];
      maxStreakCounter = 0;
    }

    // if you win, add to streak counter.
    // if a game broke streak, but won then this will start a new streak.
    if (statusWon(game)) {
      maxStreakCounter++;
    }

    // if it's the last game, end the current streak.
    if (lastGame({ games, index })) {
      maxStreakArr = [...maxStreakArr, maxStreakCounter];
    }
  }
  return Math.max(...maxStreakArr);
}

function lostOrBrokeStreak({ index, games, game }) {
  return statusBrokeStreak({ index, games, game }) || statusLost(game);
}

function statusBrokeStreak({ index, games, game }) {
  return index !== 0 && games[index - 1].number !== game.number + 1;
}

function statusWon(game) {
  return game.won;
}

function statusLost(game) {
  return game.won === false;
}

function lastGame({ games, index }) {
  return games.length - 1 === index;
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
