"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const totalEntries = document.getElementById("totalEntries");
const happyCount = document.getElementById("happyCount");
const calmCount = document.getElementById("calmCount");
const stressedCount = document.getElementById("stressedCount");

const moodForm = document.getElementById("moodForm");

const moodInput = document.getElementById("moodInput");
const noteInput = document.getElementById("noteInput");
const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll("[data-filter]");

const moodGrid = document.getElementById("moodGrid");

// ======================================================
// MOOD STATE
// ======================================================

let moods = [];

let currentFilter = "all";

// ======================================================
// STORAGE SYSTEM
// ======================================================

function saveMoods() {
  localStorage.setItem("moodTracker", JSON.stringify(moods));
}

function loadMoods() {
  const storedMoods = localStorage.getItem("moodTracker");

  if (moods) {
    moods = JSON.parse(storedMoods);
  }
}

// ======================================================
// MOOD ACTIONS
// ======================================================

function addMood() {
  const mood = {
    id: Date.now(),
    mood: moodInput.value,
    note: noteInput.value.trim(),
    date: new Date().toLocaleDateString(),
  };

  moods.push(mood);

  saveMoods();
  renderMoods();
  renderStats();

  moodForm.reset();
}

function deleteMood(id) {
  moods = moods.filter((mood) => {
    return mood.id !== id;
  });

  saveMoods();
  renderMoods();
  renderStats();
}

// ======================================================
// FILTERING SYSTEM
// ======================================================

function getFilteredMoods() {
  let filteredMoods = [...moods];

  const searchValue = searchInput.value.toLowerCase().trim();

  if (searchValue !== "") {
    filteredMoods = filteredMoods.filter((mood) => {
      return mood.note.toLowerCase().includes(searchValue);
    });
  }

  if (currentFilter !== "all") {
    filteredMoods = filteredMoods.filter((mood) => {
      return mood.mood === currentFilter;
    });
  }

  return filteredMoods;
}

// ======================================================
// HELPERS
// ======================================================

function getMoodEmoji(mood) {
  const emojis = {
    happy: "😄",
    calm: "😌",
    tired: "😴",
    stressed: "😤",
    sad: "😢",
  };

  return emojis[mood];
}

// ======================================================
// UI RENDERING
// ======================================================

function renderMoods() {
  moodGrid.innerHTML = "";

  const filteredMoods = getFilteredMoods();

  if (filteredMoods.length === 0) {
    moodGrid.innerHTML = `
      <div class="empty-moods">
        <h3>No mood entries found</h3>
        <p>Add your first mood entry or try another search/filter.</p>
      </div>
    `;

    return;
  }

  filteredMoods.forEach((mood) => {
    moodGrid.innerHTML += `
      <article class="mood-card ${mood.mood}">
        <div class="mood-top">
          <h3 class="mood-title">${mood.mood}</h3>
          <span class="mood-emoji">${getMoodEmoji(mood.mood)}</span>
        </div>

        <p class="mood-note">
          ${mood.note}
        </p>

        <span class="mood-date">
          ${mood.date}
        </span>

        <button class="delete-mood" data-id="${mood.id}">
          Delete
        </button>
      </article>
    `;
  });
}

function renderStats() {
  const happyMoods = moods.filter((mood) => {
    return mood.mood === "happy";
  }).length;

  const calmMoods = moods.filter((mood) => {
    return mood.mood === "calm";
  }).length;

  const stressedMoods = moods.filter((mood) => {
    return mood.mood === "stressed";
  }).length;

  totalEntries.textContent = moods.length;
  happyCount.textContent = happyMoods;
  calmCount.textContent = calmMoods;
  stressedCount.textContent = stressedMoods;
}

// ======================================================
// FORM HANDLING
// ======================================================

moodForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (noteInput.value.trim() === "") return;

  addMood();
});

// ======================================================
// EVENT LISTENERS
// ======================================================

searchInput.addEventListener("input", renderMoods);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderMoods();
  });
});

moodGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-mood")) {
    const id = Number(e.target.dataset.id);

    deleteMood(id);
  }
});

// ======================================================
// INITIAL LOAD
// ======================================================

loadMoods();
renderMoods();
renderStats();
