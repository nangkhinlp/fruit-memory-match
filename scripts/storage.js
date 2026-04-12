
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

export function saveDifficulty(difficulty) {
    localStorage.setItem("difficulty", difficulty);
}

export function loadDifficulty() {
    return localStorage.getItem("difficulty") || "normal";
}