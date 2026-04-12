
import {
    saveHighScore,
    loadHighScore,
    savePlayerName,
    loadPlayerName,
    saveDifficulty,
    loadDifficulty,
} from "./storage.js";

const cardList = [
    { name: "papaya",     img: "images/papaya.jpg" },
    { name: "banana",     img: "images/banana.jpg" },
    { name: "orange",     img: "images/orange.jpg" },
    { name: "pineapple",  img: "images/pineapple.jpg" },
    { name: "cherry",     img: "images/cherry.jpg" },
    { name: "strawberry", img: "images/strawberry.jpg" },
    { name: "pear",       img: "images/pear.jpg" },
    { name: "raspberry",  img: "images/raspberry.jpg" },
    { name: "fig",        img: "images/fig.jpg" },
    { name: "grapes",     img: "images/grapes.jpg" },
];

const ROWS = 4;
const COLS = 5;

let cardSet  = [];
let board    = [];
let errors   = 0;
let matches  = 0;
let card1    = null;
let card2    = null;
let busy     = false; 

const difficultyDelay = {
    easy:   2000,
    normal: 1000,
    hard:   400,
};

function init() {
  
    errors  = 0;
    matches = 0;
    card1   = null;
    card2   = null;
    busy    = false;
    board   = [];


    document.getElementById("board").innerHTML = "";

    updateStats();

    document.getElementById("high-score").innerText = loadHighScore() || "—";

    const savedName = loadPlayerName();
    if (savedName) {
        document.getElementById("player-name").value = savedName;
    }

    const savedDifficulty = loadDifficulty();
    document.getElementById("difficulty").value = savedDifficulty;

    shuffleCards();
    renderBoard();

    const delay = difficultyDelay[savedDifficulty] ?? 1000;
    setTimeout(hideCards, delay);
}

function shuffleCards() {
    cardSet = cardList.concat(cardList);
    for (let i = 0; i < cardSet.length; i++) {
        const j = Math.floor(Math.random() * cardSet.length);

        let temp    = cardSet[i];
        cardSet[i]  = cardSet[j];
        cardSet[j]  = temp;
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

        if (matches === cardList.length) {
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

    updateStats();
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

    setTimeout(() => alert(`You won! Finished with ${errors} error(s).`), 300);
}

function handleSettingsSubmit(e) {
    e.preventDefault();

    const form       = e.target;
    const nameInput  = document.getElementById("player-name");
    const difficulty = document.getElementById("difficulty").value;


    if (!form.checkValidity()) {
        nameInput.classList.add("is-invalid");
        return;
    }

    nameInput.classList.remove("is-invalid");
    nameInput.classList.add("is-valid");

    savePlayerName(nameInput.value.trim());
    saveDifficulty(difficulty);

    document.getElementById("settings-status").innerText =
        `Settings saved! Difficulty set to ${difficulty}.`;
}

document.getElementById("btn-play").addEventListener("click", init);
document.getElementById("settings-form").addEventListener("submit", handleSettingsSubmit);

init();