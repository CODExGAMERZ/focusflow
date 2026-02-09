const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

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

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

let time = 25 * 60;
let interval = null;

const timerDisplay = document.getElementById("timer");
const startTimer = document.getElementById("startTimer");

function updateTimer() {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

startTimer.addEventListener("click", () => {
  if (interval) return;

  interval = setInterval(() => {
    time--;
    updateTimer();

    if (time === 0) {
      clearInterval(interval);
      alert("Pomodoro complete! Take a break ☕");
      interval = null;
      time = 25 * 60;
      updateTimer();
    }
  }, 1000);
});

updateTimer();
