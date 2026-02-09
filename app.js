const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let interval = null;
let remaining = 0;

/* ---------- helpers ---------- */
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ---------- render ---------- */
function renderTask(name) {
  taskList.innerHTML = `
    <li>
      <div class="task-header">
        <span>${name}</span>
        <span class="task-time">${formatTime(remaining)}</span>
      </div>

      <div class="progress">
        <div class="progress-bar"></div>
      </div>

      <div class="task-controls">
        <button id="startBtn">Start</button>
        <button id="resetBtn">Reset</button>
      </div>
    </li>
  `;

  document.getElementById("startBtn").onclick = startTimer;
  document.getElementById("resetBtn").onclick = resetTimer;
}

/* ---------- timer ---------- */
function startTimer() {
  if (interval) return;

  tick(); // 🔥 IMMEDIATE TICK

  interval = setInterval(tick, 1000);
}

function tick() {
  remaining--;

  if (remaining < 0) {
    clearInterval(interval);
    interval = null;
    return;
  }

  document.querySelector(".task-time").textContent =
    formatTime(remaining);

  document.querySelector(".progress-bar").style.width =
    `${100 - (remaining / startTime) * 100}%`;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  remaining = startTime;

  document.querySelector(".task-time").textContent =
    formatTime(remaining);

  document.querySelector(".progress-bar").style.width = "0%";
}

/* ---------- add task ---------- */
let startTime = 0;

addTaskBtn.onclick = () => {
  const name = taskInput.value.trim();
  const min = parseInt(taskTimeInput.value);

  if (!name || !min) return;

  startTime = min * 60;
  remaining = startTime;

  renderTask(name);
};
