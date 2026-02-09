const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

const todayFocusEl = document.getElementById("todayFocus");
const totalFocusEl = document.getElementById("totalFocus");
const topTaskTodayEl = document.getElementById("topTaskToday");
const topTaskEl = document.getElementById("topTask");

const todayKey = new Date().toDateString();

let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let analytics = JSON.parse(localStorage.getItem("analytics")) || {
  total: 0,
  daily: {}
};

let intervals = {};

/* =====================
   HELPERS
===================== */
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* =====================
   RENDER (STRUCTURE ONLY)
===================== */
function render() {
  taskList.innerHTML = "";

  Object.entries(tasks).forEach(([id, t]) => {
    const li = document.createElement("li");
    li.dataset.id = id;

    li.innerHTML = `
      <div class="task-header">
        <span>${t.text}</span>
        <span class="task-time">${formatTime(t.remaining)}</span>
      </div>

      <div class="progress">
        <div class="progress-bar"></div>
      </div>

      <div class="task-controls">
        <button>${t.running ? "Pause" : "Start"}</button>
        <button>Reset</button>
        <button>Delete</button>
      </div>
    `;

    const [startBtn, resetBtn, delBtn] =
      li.querySelectorAll(".task-controls button");

    startBtn.onclick = () => toggleTimer(id);
    resetBtn.onclick = () => resetTask(id);
    delBtn.onclick = () => deleteTask(id);

    taskList.appendChild(li);
    updateTaskUI(id);
  });

  renderAnalytics();
}

/* =====================
   FAST UI UPDATE (NO REBUILD)
===================== */
function updateTaskUI(id) {
  const t = tasks[id];
  const li = taskList.querySelector(`li[data-id="${id}"]`);
  if (!li) return;

  li.querySelector(".task-time").textContent = formatTime(t.remaining);
  li.querySelector(".progress-bar").style.width =
    `${100 - (t.remaining / t.duration) * 100}%`;
  li.querySelector(".task-controls button").textContent =
    t.running ? "Pause" : "Start";
}

/* =====================
   TIMER (IMMEDIATE START)
===================== */
function toggleTimer(id) {
  const t = tasks[id];

  // PAUSE
  if (t.running) {
    clearInterval(intervals[id]);
    t.running = false;
    save(false);
    updateTaskUI(id);
    return;
  }

  // START
  t.running = true;

  // 🔥 IMMEDIATE FIRST TICK
  tick(id);

  intervals[id] = setInterval(() => {
    tick(id);
  }, 1000);

  save(false);
  updateTaskUI(id);
}

function tick(id) {
  const t = tasks[id];
  if (!t.running) return;

  t.remaining--;
  t.spent++;
  analytics.total++;

  analytics.daily[todayKey] ??= {};
  analytics.daily[todayKey][t.text] =
    (analytics.daily[todayKey][t.text] || 0) + 1;

  if (t.remaining <= 0) {
    t.remaining = 0;
    t.running = false;
    clearInterval(intervals[id]);
  }

  updateTaskUI(id);
}

/* =====================
   TASK ACTIONS
===================== */
function resetTask(id) {
  clearInterval(intervals[id]);
  const t = tasks[id];
  t.remaining = t.duration;
  t.running = false;
  save(false);
  updateTaskUI(id);
}

function deleteTask(id) {
  clearInterval(intervals[id]);
  delete tasks[id];
  save();
}

/* =====================
   ANALYTICS
===================== */
function renderAnalytics() {
  const todayData = analytics.daily[todayKey] || {};

  todayFocusEl.textContent = formatTime(
    Object.values(todayData).reduce((a, b) => a + b, 0)
  );

  totalFocusEl.textContent = formatTime(analytics.total);

  topTaskTodayEl.textContent =
    Object.entries(todayData).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  topTaskEl.textContent =
    Object.values(tasks).sort((a, b) => b.spent - a.spent)[0]?.text || "—";
}

/* =====================
   STORAGE
===================== */
function save(renderUI = true) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("analytics", JSON.stringify(analytics));
  if (renderUI) render();
}

/* =====================
   ADD TASK
===================== */
addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  const min = parseInt(taskTimeInput.value);
  if (!text || !min) return;

  const id = Date.now().toString();

  tasks[id] = {
    text,
    duration: min * 60,
    remaining: min * 60,
    spent: 0,
    running: false
  };

  taskInput.value = "";
  taskTimeInput.value = "";
  save();
};

/* =====================
   THEME
===================== */
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
};

/* =====================
   INIT
===================== */
render();
