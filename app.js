/* =====================
   DOM ELEMENTS
===================== */
const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

const todayFocusEl = document.getElementById("todayFocus");
const totalFocusEl = document.getElementById("totalFocus");
const topTaskTodayEl = document.getElementById("topTaskToday");
const topTaskEl = document.getElementById("topTask");

/* =====================
   STATE
===================== */
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
   RENDER UI
===================== */
function render() {
  taskList.innerHTML = "";

  Object.entries(tasks).forEach(([id, t]) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="task-header">
        <span class="${t.completed ? "completed" : ""}">${t.text}</span>
        <span class="task-time">${formatTime(t.remaining)}</span>
      </div>

      <div class="progress">
        <div class="progress-bar"
             style="width:${100 - (t.remaining / t.duration) * 100}%">
        </div>
      </div>

      <div class="task-controls">
        <button>${t.running ? "Pause" : "Start"}</button>
        <button>Reset</button>
        <button>Delete</button>
      </div>
    `;

    const [startBtn, resetBtn, deleteBtn] =
      li.querySelectorAll(".task-controls button");

    startBtn.onclick = () => toggleTimer(id);
    resetBtn.onclick = () => resetTask(id);
    deleteBtn.onclick = () => deleteTask(id);

    taskList.appendChild(li);
  });

  renderAnalytics();
}

/* =====================
   TIMER LOGIC (FIXED)
===================== */
function toggleTimer(id) {
  const t = tasks[id];

  if (t.running) {
    clearInterval(intervals[id]);
    t.running = false;
    save();
    return;
  }

  t.running = true;

  intervals[id] = setInterval(() => {
    t.remaining--;
    t.spent++;
    analytics.total++;

    analytics.daily[todayKey] ??= {};
    analytics.daily[todayKey][t.text] =
      (analytics.daily[todayKey][t.text] || 0) + 1;

    if (t.remaining <= 0) {
      clearInterval(intervals[id]);
      t.running = false;
    }

    save(); // 🔥 IMPORTANT: re-render every second
  }, 1000);

  save();
}

function resetTask(id) {
  clearInterval(intervals[id]);
  tasks[id].remaining = tasks[id].duration;
  tasks[id].running = false;
  save();
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
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("analytics", JSON.stringify(analytics));
  render();
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
    running: false,
    completed: false
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
