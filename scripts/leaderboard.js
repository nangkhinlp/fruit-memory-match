import { loadScores, deleteScore, clearAllScores } from "./storage.js";

const tbody = document.getElementById("leaderboard-body");
const emptyMsg = document.getElementById("empty-msg");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const clearBtn = document.getElementById("clear-all");
const modalEl = document.getElementById("leaderboardModal");

function getFilteredScores() {
    const search = searchInput.value.trim().toLowerCase();
    const sort = sortSelect.value;
    let scores = loadScores();

    if (search) {
        scores = scores.filter(s => s.player.toLowerCase().includes(search));
    }

    if (sort === "errors-asc")  scores.sort((a, b) => a.errors - b.errors);
    if (sort === "errors-desc") scores.sort((a, b) => b.errors - a.errors);
    if (sort === "newest")      scores.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    if (sort === "oldest")      scores.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    return scores;
}

function render() {
    const scores = getFilteredScores();
    tbody.innerHTML = "";

    if (scores.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }
    emptyMsg.style.display = "none";

    scores.forEach((s, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.player}</td>
            <td>${s.errors}</td>
            <td>${new Date(s.timestamp).toLocaleString()}</td>
            <td>
              <button class="btn btn-sm btn-outline-danger" data-ts="${s.timestamp}">
                Delete
              </button>
            </td>
        `;
        tbody.append(tr);
    });

    tbody.querySelectorAll("button[data-ts]").forEach(btn => {
        btn.addEventListener("click", () => {
            deleteScore(btn.dataset.ts);
            render();
        });
    });
}

modalEl.addEventListener("show.bs.modal", render);

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);
clearBtn.addEventListener("click", () => {
    if (confirm("Delete all scores? This cannot be undone.")) {
        clearAllScores();
        render();
    }
});