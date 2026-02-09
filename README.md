# 🚀 FocusFlow – Personal Productivity App

![GitHub stars](https://img.shields.io/github/stars/CODExGAMERZ/focusflow?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/CODExGAMERZ/focusflow?style=flat-square)
![License](https://img.shields.io/github/license/CODExGAMERZ/focusflow?style=flat-square)

🔗 **Live Demo:** [https://codexgamerz.github.io/focusflow/](https://codexgamerz.github.io/focusflow/)

---

## 📌 Overview

**FocusFlow** is a feature-rich personal productivity web app that combines task management with **independent per-task stopwatches**, real-time progress visualization, and productivity analytics.

The project was engineered with a strong focus on:

* Precise timer behavior (no freezes, jumps, or delays)
* Smooth UI animations without re-render jank
* Scalable state management without frameworks

---

## ✨ Key Features

### 📝 Task Management

* Add multiple tasks with custom time (minutes)
* Independent stopwatch for every task
* Start / Pause / Resume / Reset per task
* Delete tasks anytime

### ⏱️ Accurate Timers

* **Immediate start** (no 1-second delay)
* `mm:ss` stopwatch display
* Smooth progress bar synced with time
* Timers do not interfere with each other

### 📊 Productivity Analytics

* Today’s focus time
* All-time focus time
* Top task today
* Top task overall
* Analytics update live as timers run

### 🎨 UI / UX

* Clean card-based layout
* Micro-interactions and smooth animations
* Responsive (mobile + desktop)
* No animation resets during timer updates

### 💾 Persistence

* Tasks and analytics stored in **LocalStorage**
* State restored safely on page refresh

---

## 🧠 Technical Highlights

* Built **without frameworks** to demonstrate strong Vanilla JavaScript fundamentals
* DOM updates are **localized** (no full re-renders during timer ticks)
* Timer architecture designed to avoid UI jank and race conditions
* Immediate-tick strategy for realistic stopwatch behavior

---

## 🛠️ Tech Stack

| Technology         | Usage                                  |
| ------------------ | -------------------------------------- |
| HTML5              | Semantic structure                     |
| CSS3               | Styling, animations, responsive layout |
| Vanilla JavaScript | State, timers, analytics               |
| LocalStorage API   | Persistent data                        |
| GitHub Pages       | Deployment                             |

---

## 📂 Project Structure

```
focusflow/
├── index.html   # App layout
├── style.css    # Styling & animations
├── app.js       # Application logic
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/CODExGAMERZ/focusflow.git
cd focusflow
```

Open `index.html` in your browser.

No build tools or dependencies required.

---

## 🌍 Deployment

This project is deployed using **GitHub Pages**:

🔗 [https://codexgamerz.github.io/focusflow/](https://codexgamerz.github.io/focusflow/)

---

## 💼 Resume / Interview Talking Points

* Designed and implemented **independent per-task stopwatches** with precise timing
* Solved real-world UI jank caused by full re-renders during intervals
* Implemented **live productivity analytics** without external libraries
* Optimized DOM updates for smooth animations
* Debugged and resolved GitHub Pages caching and deployment issues

---

## 🔮 Future Enhancements

* Weekly / monthly analytics view
* Export productivity data (CSV)
* PWA support (offline + installable)
* React version with identical behavior

---

## 📜 License

MIT License

---

## 👤 Author

**Aryan Sinha**
GitHub: [https://github.com/CODExGAMERZ](https://github.com/CODExGAMERZ)

---

⭐ If you like this project, consider starring the repository!
