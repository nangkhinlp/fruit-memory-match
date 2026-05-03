
export function saveHighScore(score) {
    localStorage.setItem("highScore", score);
}

export function loadHighScore() {
    return parseInt(localStorage.getItem("highScore")) || 0;
}

export function savePlayerName(name) {
    localStorage.setItem("playerName", name);
}

export function loadPlayerName() {
    return localStorage.getItem("playerName") || "";
}

export function saveProgress(state) {
  sessionStorage.setItem("gameState", JSON.stringify(state));
}

export function loadProgress() {
    const saved = sessionStorage.getItem("gameState");
    return saved ? JSON.parse(saved) : null;
}

export function clearProgress() {
  sessionStorage.removeItem("gameState");
}

const LEADERBOARD_KEY = "leaderboard";

export function saveScore(scoreRecord) {
    const scores = loadScores();
    scores.push(scoreRecord);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores));
}

export function loadScores() {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    return data ? JSON.parse(data) : [];
}

export function deleteScore(timestamp) {
    const scores = loadScores().filter(s => s.timestamp !== timestamp);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores));
}

export function clearAllScores() {
    localStorage.removeItem(LEADERBOARD_KEY);
}