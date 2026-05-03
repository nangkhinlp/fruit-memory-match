import {
    saveHighScore,
    loadHighScore,
    savePlayerName,
    loadPlayerName,
    saveProgress,
    loadProgress,
    clearProgress,
    saveScore,
} from "./storage.js";

import { getData, fruits } from "./data.js";

import "./leaderboard.js";

await getData();
console.log(fruits);

const ROWS = 4;
const COLS = 5;

let cardSet  = [];
let board    = [];
let errors   = 0;
let matches  = 0;
let card1    = null;
let card2    = null;
let busy     = false; 

function init(freshStart = true) {
    card1   = null;
    card2   = null;
    busy    = false;

    document.getElementById("board").innerHTML = "";

    const saved = freshStart ? null : loadProgress();
  
    if (saved) { //resume
        board = saved.board;
        errors  = saved.errors;
        matches = saved.matches;

        renderFromSaved(saved.matchedPositions);
    } else { //restarts
        clearProgress();
        errors = 0;
        matches = 0;
        board   = [];

        shuffleCards();
        renderBoard();

        setTimeout(hideCards, 1000);
    }

    updateStats();

    document.getElementById("high-score").innerText = loadHighScore() || "—";

    const savedName = loadPlayerName();
    if (savedName) {
        document.getElementById("player-name").value = savedName;
    }
}

function shuffleCards() {
    cardSet = fruits.concat(fruits);
    for (let i = 0; i < cardSet.length; i++) {
        const j = Math.floor(Math.random() * cardSet.length);

        let temp    = cardSet[i];
        cardSet[i]  = cardSet[j];
        cardSet[j]  = temp;
    }
}

function renderFromSaved(matchedPositions) {
    const boardEl = document.getElementById("board");

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cardData = board[r][c];
            const positionKey = `${r}-${c}`;
            const isRevealed = matchedPositions.includes(positionKey);

            const img = document.createElement("img");
            img.id = positionKey;

            if (isRevealed) {
                // Already matched — show fruit
                img.src = cardData.img;
                img.alt = cardData.name;
            } else {
                // Still hidden
                img.src = "images/back.jpg";
                img.alt = "Hidden card — click to reveal";
            }

            img.classList.add("card");
            img.addEventListener("click", selectCard);
            boardEl.append(img);
        }
    }
}

function renderBoard() {
    const boardEl = document.getElementById("board");

    for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
            const cardData = cardSet.pop();
            row.push(cardData);

            const img = document.createElement("img");
            img.id        = `${r}-${c}`;
            img.src       = cardData.img;
            img.alt       = cardData.name;
            img.classList.add("card");
            img.addEventListener("click", selectCard);

            boardEl.append(img);
        }
        board.push(row);
    }
}


function hideCards() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const card = document.getElementById(`${r}-${c}`);
            card.src = "images/back.jpg";
            card.alt = "Hidden card — click to reveal";
        }
    }
}


function selectCard() {
  
    if (busy || !this.src.includes("back")) return;

    if (!card1) {
        card1 = this;
        revealCard(card1);
    } else if (this !== card1) {
        card2 = this;
        revealCard(card2);
        busy = true; 
        setTimeout(checkMatch, 1000);
    }
}


function revealCard(card) {
    const [r, c] = card.id.split("-").map(Number);
    card.src = board[r][c].img;
    card.alt = board[r][c].name;
}


function checkMatch() {
    if (card1.src === card2.src) {
        matches++;

        if (matches === fruits.length) {
            handleWin();
        }
    } else {
        card1.src = "images/back.jpg";
        card1.alt = "Hidden card — click to reveal";
        card2.src = "images/back.jpg";
        card2.alt = "Hidden card — click to reveal";
        errors++;
    }

    card1 = null;
    card2 = null;
    busy  = false;

    saveProgress(getCurrentState());
    updateStats();
}

function getCurrentState() {
    const matchedPositions = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cardEl = document.getElementById(`${r}-${c}`);
            if (cardEl && !cardEl.src.includes("back")) {
                matchedPositions.push(`${r}-${c}`);
            }
        }
    }

    return {
        board: board,
        matchedPositions: matchedPositions,
        errors: errors,
        matches: matches
    };
}

function updateStats() {
    document.getElementById("errors").innerText  = errors;
    document.getElementById("matches").innerText = matches;
}

function handleWin() {
    const current = loadHighScore();

    if (current === 0 || errors < current) {
        saveHighScore(errors);
        document.getElementById("high-score").innerText = errors;
    }

    const scoreRecord = {
        player: loadPlayerName() || "Anonymous",
        errors: errors,
        matches: matches,
        timestamp: new Date().toISOString(),
    };
    console.log("New score record:", JSON.stringify(scoreRecord, null, 2));
    saveScore(scoreRecord);

    clearProgress();

    setTimeout(() => alert(`You won! Finished with ${errors} error(s).`), 300);
}

function handleSettingsSubmit(e) {
    e.preventDefault();

    const form       = e.target;
    const nameInput  = document.getElementById("player-name");


    if (!form.checkValidity()) {
        nameInput.classList.add("is-invalid");
        return;
    }

    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");

    savePlayerName(nameInput.value.trim());

    document.getElementById("settings-status").innerText =
        `Settings saved!`;
}

document.getElementById("btn-play").addEventListener("click", () => init(true));
document.getElementById("settings-form").addEventListener("submit", handleSettingsSubmit);

init(false);