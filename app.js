const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

const todayFocusEl = document.getElementById("todayFocus");
const totalFocusEl = document.getElementById("totalFocus");
const topTaskTodayEl = document.getElementById("topTaskToday");
const topTaskEl = document.getElementById("topTask");
const chart = document.getElementById("focusChart");

let today = new Date().toDateString();

let analytics = JSON.parse(localStorage.getItem("analytics")) || {
  total: 0,
  daily: {}
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let intervals = {};

/* ---------- Utilities ---------- */
function mins(sec) {
  return `${Math.floor(sec / 60)}m`;
}

/* ---------- Render ---------- */
function render() {
  taskList.innerHTML = "";

  Object.entries(tasks).forEach(([id, t]) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="task-header">
        <span class="${t.completed ? "completed" : ""}">${t.text}</span>
        <span>${mins(t.remaining)}</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width:${100 - (t.remaining / t.duration) * 100}%"></div>
      </div>
      <div class="task-controls">
        <button onclick="toggle('${id}')">${t.running ? "Pause" : "Start"}</button>
        <button onclick="resetTask('${id}')">Reset</button>
        <button onclick="deleteTask('${id}')">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  renderAnalytics();
}

/* ---------- Timer ---------- */
window.toggle = (id) => {
  const t = tasks[id];

  if (t.running) {
    clearInterval(intervals[id]);
    t.running = false;
  } else {
    t.running = true;
    intervals[id] = setInterval(() => {
      t.remaining--;
      t.spent++;

      analytics.total++;
      analytics.daily[today] ??= {};
      analytics.daily[today][t.text] =
        (analytics.daily[today][t.text] || 0) + 1;

      if (t.remaining <= 0) {
        clearInterval(intervals[id]);
        t.running = false;
      }

      save(false);
    }, 1000);
  }

  save();
};

window.resetTask = (id) => {
  tasks[id].remaining = tasks[id].duration;
  save();
};

window.deleteTask = (id) => {
  clearInterval(intervals[id]);
  delete tasks[id];
  save();
};

/* ---------- Analytics ---------- */
function renderAnalytics() {
  todayFocusEl.textContent = mins(
    Object.values(analytics.daily[today] || {}).reduce((a, b) => a + b, 0)
  );
  totalFocusEl.textContent = mins(analytics.total);

  const todayTasks = analytics.daily[today] || {};
  topTaskTodayEl.textContent =
    Object.entries(todayTasks).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  topTaskEl.textContent =
    Object.values(tasks).sort((a, b) => b.spent - a.spent)[0]?.text || "—";

  drawChart(todayTasks);
}

/* ---------- Chart ---------- */
function drawChart(data) {
  chart.innerHTML = "";
  const entries = Object.entries(data);
  if (!entries.length) return;

  const max = Math.max(...entries.map(e => e[1]));
  const barWidth = 100 / entries.length;

  entries.forEach(([task, value], i) => {
    const height = (value / max) * 100;

    chart.innerHTML += `
      <rect
        x="${i * barWidth}%"
        y="${100 - height}%"
        width="${barWidth - 2}%"
        height="${height}%"
      ></rect>
    `;
  });
}

/* ---------- Storage ---------- */
function save(renderUI = true) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("analytics", JSON.stringify(analytics));
  if (renderUI) render();
}

/* ---------- Add Task ---------- */
addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  const min = parseInt(taskTimeInput.value);
  if (!text || !min) return;

  tasks[Date.now()] = {
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

/* ---------- Theme ---------- */
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

render();
