const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

const totalFocusEl = document.getElementById("totalFocus");
const topTaskEl = document.getElementById("topTask");

let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let analytics = JSON.parse(localStorage.getItem("analytics")) || {
  totalFocus: 0,
  sessions: 0
};
let intervals = {};

/* ---------- Utilities ---------- */
function format(sec) {
  const m = Math.floor(sec / 60);
  return `${m}m`;
}

/* ---------- Render ---------- */
function render() {
  taskList.innerHTML = "";

  Object.entries(tasks).forEach(([id, t]) => {
    const li = document.createElement("li");

    const header = document.createElement("div");
    header.className = "task-header";

    const name = document.createElement("span");
    name.textContent = t.text;
    name.tabIndex = 0;
    if (t.completed) name.classList.add("completed");
    name.onclick = () => {
      t.completed = !t.completed;
      save();
    };

    const time = document.createElement("span");
    time.textContent = format(t.remaining);

    header.append(name, time);

    const progress = document.createElement("div");
    progress.className = "progress";

    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.width = `${100 - (t.remaining / t.duration) * 100}%`;

    progress.append(bar);

    const controls = document.createElement("div");
    controls.className = "task-controls";

    const start = document.createElement("button");
    start.textContent = t.running ? "Pause" : "Start";
    start.onclick = () => toggle(id);

    const reset = document.createElement("button");
    reset.textContent = "Reset";
    reset.onclick = () => {
      stop(id);
      t.remaining = t.duration;
      save();
    };

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = () => {
      stop(id);
      delete tasks[id];
      save();
    };

    controls.append(start, reset, del);
    li.append(header, progress, controls);
    taskList.append(li);
  });

  renderAnalytics();
}

/* ---------- Timer Logic ---------- */
function toggle(id) {
  const t = tasks[id];

  if (t.running) {
    stop(id);
  } else {
    t.running = true;
    intervals[id] = setInterval(() => {
      t.remaining--;
      t.spent++;
      analytics.totalFocus++;

      if (t.remaining <= 0) {
        stop(id);
        analytics.sessions++;
        alert(`"${t.text}" completed 🎉`);
      }

      save(false);
    }, 1000);
  }
  save();
}

function stop(id) {
  clearInterval(intervals[id]);
  delete intervals[id];
  if (tasks[id]) tasks[id].running = false;
}

/* ---------- Analytics ---------- */
function renderAnalytics() {
  totalFocusEl.textContent = format(analytics.totalFocus);

  let top = "—";
  let max = 0;

  Object.values(tasks).forEach(t => {
    if (t.spent > max) {
      max = t.spent;
      top = t.text;
    }
  });

  topTaskEl.textContent = top;
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

  const id = Date.now().toString();
  tasks[id] = {
    text,
    completed: false,
    duration: min * 60,
    remaining: min * 60,
    running: false,
    spent: 0
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
