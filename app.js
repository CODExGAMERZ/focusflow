// =====================
// ELEMENTS
// =====================
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

const timerDisplay = document.getElementById("timer");
const startTimerBtn = document.getElementById("startTimer");

// =====================
// TASK LOGIC
// =====================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) span.classList.add("completed");

    span.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
});

renderTasks();

// =====================
// THEME LOGIC
// =====================
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
});

// =====================
// POMODORO LOGIC
// =====================
let time = 25 * 60;
let interval = null;

function updateTimer() {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

startTimerBtn.addEventListener("click", () => {
  if (interval) return;

  interval = setInterval(() => {
    time--;
    updateTimer();

    if (time === 0) {
      clearInterval(interval);
      interval = null;
      alert("Pomodoro complete! Take a break ☕");
      time = 25 * 60;
      updateTimer();
    }
  }, 1000);
});

updateTimer();
