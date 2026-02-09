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
let taskEls = {};

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function createTaskElement(id, task) {
  const li = document.createElement("li");
  li.dataset.id = id;

  li.innerHTML = `
    <div class="task-header">
      <span>${task.text}</span>
      <span class="task-time">${formatTime(task.remaining)}</span>
    </div>
    <div class="progress">
      <div class="progress-bar"></div>
    </div>
    <div class="task-controls">
      <button class="start-btn">${task.running ? "Pause" : "Start"}</button>
      <button class="reset-btn">Reset</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  const startBtn = li.querySelector(".start-btn");
  const resetBtn = li.querySelector(".reset-btn");
  const deleteBtn = li.querySelector(".delete-btn");

  startBtn.onclick = () => toggleTimer(id);
  resetBtn.onclick = () => resetTask(id);
  deleteBtn.onclick = () => deleteTask(id);

  taskList.appendChild(li);

  taskEls[id] = {
    li,
    time: li.querySelector(".task-time"),
    bar: li.querySelector(".progress-bar"),
    startBtn
  };

  updateTaskUI(id);
}

function updateTaskUI(id) {
  const t = tasks[id];
  const el = taskEls[id];
  if (!el) return;

  el.time.textContent = formatTime(t.remaining);
  el.bar.style.width = `${100 - (t.remaining / t.duration) * 100}%`;
  el.startBtn.textContent = t.running ? "Pause" : "Start";
}

function toggleTimer(id) {
  const t = tasks[id];

  if (t.running) {
    clearInterval(intervals[id]);
    t.running = false;
    save();
    updateTaskUI(id);
    return;
  }

  t.running = true;
  tick(id);

  intervals[id] = setInterval(() => {
    tick(id);
  }, 1000);

  save();
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
  updateAnalyticsUI();
}

function resetTask(id) {
  clearInterval(intervals[id]);
  const t = tasks[id];
  t.remaining = t.duration;
  t.running = false;
  save();
  updateTaskUI(id);
}

function deleteTask(id) {
  clearInterval(intervals[id]);
  taskEls[id].li.remove();
  delete taskEls[id];
  delete tasks[id];
  save();
}

function updateAnalyticsUI() {
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

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("analytics", JSON.stringify(analytics));
}

addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  const min = parseInt(taskTimeInput.value);
  if (!text || !min) return;

  const id = Date.now().toString();

  const task = {
    text,
    duration: min * 60,
    remaining: min * 60,
    spent: 0,
    running: false
  };

  tasks[id] = task;
  createTaskElement(id, task);
  save();

  taskInput.value = "";
  taskTimeInput.value = "";
};

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

Object.entries(tasks).forEach(([id, task]) => {
  createTaskElement(id, task);
});
updateAnalyticsUI();
