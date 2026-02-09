/* =====================
   ELEMENTS
===================== */
const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

/* =====================
   STATE
===================== */
let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
let intervals = {};

/* =====================
   UTIL
===================== */
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* =====================
   RENDER
===================== */
function renderTasks() {
  taskList.innerHTML = "";

  Object.entries(tasks).forEach(([id, task]) => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = task.text;
    if (task.completed) name.classList.add("completed");
    name.onclick = () => {
      task.completed = !task.completed;
      save();
    };

    const timer = document.createElement("span");
    timer.className = "task-timer";
    timer.textContent = formatTime(task.remaining);

    const controls = document.createElement("div");
    controls.className = "task-controls";

    const start = document.createElement("button");
    start.textContent = task.running ? "Pause" : "Start";
    start.onclick = () => toggleTimer(id);

    const reset = document.createElement("button");
    reset.textContent = "Reset";
    reset.onclick = () => {
      stopTimer(id);
      task.remaining = task.duration;
      save();
    };

    const del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => {
      stopTimer(id);
      delete tasks[id];
      save();
    };

    controls.append(start, reset, del);
    li.append(name, timer, controls);
    taskList.appendChild(li);
  });
}

/* =====================
   TIMER LOGIC
===================== */
function toggleTimer(id) {
  const task = tasks[id];

  if (task.running) {
    stopTimer(id);
  } else {
    task.running = true;
    intervals[id] = setInterval(() => {
      task.remaining--;

      if (task.remaining <= 0) {
        stopTimer(id);
        alert(`Task "${task.text}" completed! 🎉`);
      }
      save(false);
    }, 1000);
  }
  save();
}

function stopTimer(id) {
  clearInterval(intervals[id]);
  delete intervals[id];
  if (tasks[id]) tasks[id].running = false;
}

/* =====================
   STORAGE
===================== */
function save(render = true) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  if (render) renderTasks();
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
    completed: false,
    duration: min * 60,
    remaining: min * 60,
    running: false
  };

  taskInput.value = "";
  taskTimeInput.value = "";
  save();
};

/* =====================
   THEME
===================== */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") document.body.classList.add("light");

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
renderTasks();
