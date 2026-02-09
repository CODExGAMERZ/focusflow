# 🚀 FocusFlow – Personal Productivity App

![GitHub stars](https://img.shields.io/github/stars/CODExGAMERZ/focusflow?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/CODExGAMERZ/focusflow?style=flat-square)
![License](https://img.shields.io/github/license/CODExGAMERZ/focusflow?style=flat-square)

🔗 **Live Demo:** [https://codexgamerz.github.io/focusflow/](https://codexgamerz.github.io/focusflow/)

---

## 📌 Overview

**FocusFlow** is a clean, minimal, and powerful personal productivity web app designed to help users manage tasks and focus effectively.

Unlike basic to-do apps, **each task in FocusFlow has its own independent, customizable timer**, allowing users to track time spent on specific tasks with precision.

This project emphasizes:

* Strong JavaScript fundamentals
* Clean state management
* Practical UI/UX design
* Real-world deployment experience

---

## ✨ Features

### 📝 Task Management

* Add tasks with a **custom time duration (minutes)**
* Delete tasks instantly
* Mark tasks as completed

### ⏱️ Per-Task Timers

* Each task has its **own independent countdown timer**
* Start, pause, and reset timers individually
* Multiple timers can exist without interfering with each other

### 🌙 Theme System

* Dark / Light mode toggle
* Theme preference is **persisted automatically**

### 💾 Persistence

* All tasks, timers, and UI state are saved using **LocalStorage**
* Data remains intact after page refresh or browser restart

### 🎨 UI & UX

* Clean, minimal interface
* Smooth micro-animations
* Clear visual hierarchy
* Distraction-free design

---

## 🧠 How It Works (Architecture)

Each task is stored as an object with the following state:

```js
{
  text: "Study Algorithms",
  completed: false,
  duration: 1500,
  remaining: 1200,
  running: false
}
```

### Key Design Decisions

* **Independent timers** managed via controlled intervals
* **Centralized state storage** using LocalStorage
* **No frameworks** to demonstrate strong Vanilla JavaScript fundamentals
* Modular, readable code structure for easy future upgrades

---

## 🛠️ Tech Stack

| Technology           | Purpose                             |
| -------------------- | ----------------------------------- |
| HTML5                | Semantic structure                  |
| CSS3                 | Styling, theming, animations        |
| JavaScript (Vanilla) | App logic, timers, state management |
| LocalStorage API     | Persistent data storage             |
| GitHub Pages         | Deployment                          |

---

## 📂 Project Structure

```
focusflow/
├── index.html      # Main HTML file
├── style.css       # Styling and theming
├── app.js          # Application logic
├── assets/
│   └── icons/
├── README.md
├── .gitignore
└── LICENSE
```

---

## 🚀 Getting Started

### Run Locally

1. Clone the repository

   ```bash
   git clone https://github.com/CODExGAMERZ/focusflow.git
   ```

2. Navigate to the project folder

   ```bash
   cd focusflow
   ```

3. Open the app

   * Open `index.html` directly in your browser
     *(No build tools or dependencies required)*

---

## 🌍 Deployment

This project is deployed using **GitHub Pages**.

Live URL:

```
https://codexgamerz.github.io/focusflow/
```

---

## 💼 Resume Highlights

* Built a **feature-rich productivity web app** using Vanilla JavaScript
* Designed and implemented **independent per-task countdown timers**
* Managed complex UI and timer state with **LocalStorage persistence**
* Created a **dark/light theming system** with saved user preferences
* Focused on clean UX, modular code, and scalability
* Deployed a live production app using **GitHub Pages**

---

## 🔮 Future Improvements

* 📊 Visual progress bars for each task timer
* 🔔 Browser notifications on timer completion
* 📱 Mobile-first responsive layout
* ⚛️ React version with component-based architecture
* ☁️ Cloud sync using Firebase
* 📈 Productivity analytics (time spent per task)

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Aryan Sinha**
GitHub: [https://github.com/CODExGAMERZ](https://github.com/CODExGAMERZ)

---

⭐ If you found this project useful or interesting, consider starring the repository!
