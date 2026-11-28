// ================= 1. GREETING & CLOCK (with Custom Name Challenge) =================
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const greetingEl = document.getElementById('greeting');
const editNameBtn = document.getElementById('edit-name-btn');

let customName = localStorage.getItem('dashboard_username') || '';

function updateDateTime() {
  const now = new Date();

  // Format Clock: HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}:${seconds}`;

  // Format Date: e.g. Wednesday, November 18, 2026
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateEl.textContent = now.toLocaleDateString('en-US', options);

  // Greeting based on time of day
  const hour = now.getHours();
  let greetingText = 'Good Evening';
  if (hour >= 5 && hour < 12) {
    greetingText = 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    greetingText = 'Good Afternoon';
  }

  greetingEl.textContent = customName ? `${greetingText}, ${customName}` : greetingText;
}

editNameBtn.addEventListener('click', () => {
  const newName = prompt('Enter your name for the greeting:', customName);
  if (newName !== null) {
    customName = newName.trim();
    localStorage.setItem('dashboard_username', customName);
    updateDateTime();
  }
});

setInterval(updateDateTime, 1000);
updateDateTime();

// ================= 2. LIGHT / DARK MODE (Challenge) =================
const themeToggleBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('dashboard_theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleBtn.textContent = '☀️ Light Mode';
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('dashboard_theme', isDark ? 'dark' : 'light');
  themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// ================= 3. FOCUS TIMER (25 Minutes) =================
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

const DEFAULT_TIME = 25 * 60; // 25 minutes in seconds
let timeLeft = DEFAULT_TIME;
let timerInterval = null;

function renderTimer() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

startBtn.addEventListener('click', () => {
  if (timerInterval !== null) return; // Prevent multiple intervals
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      renderTimer();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert('Focus session finished! Take a break.');
    }
  }, 1000);
});

stopBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = DEFAULT_TIME;
  renderTimer();
});

renderTimer();

// ================= 4. TO-DO LIST (with LocalStorage & Prevent Duplicates) =================
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskError = document.getElementById('task-error');

let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];

function saveTasks() {
  localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    const leftDiv = document.createElement('div');
    leftDiv.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-sm btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const updatedText = prompt('Edit task:', task.text);
      if (updatedText !== null && updatedText.trim() !== '') {
        const trimmed = updatedText.trim();
        const isDuplicate = tasks.some(
          (t, i) => i !== index && t.text.toLowerCase() === trimmed.toLowerCase()
        );
        if (isDuplicate) {
          taskError.textContent = 'Task already exists!';
          return;
        }
        taskError.textContent = '';
        tasks[index].text = trimmed;
        saveTasks();
        renderTasks();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-sm btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(actionsDiv);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  // Prevent duplicate tasks (Challenge)
  const isDuplicate = tasks.some(
    (task) => task.text.toLowerCase() === text.toLowerCase()
  );

  if (isDuplicate) {
    taskError.textContent = 'Task already exists!';
    return;
  }

  taskError.textContent = '';
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
});

renderTasks();

// ================= 5. QUICK LINKS (with LocalStorage) =================
const linkForm = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const linksContainer = document.getElementById('links-container');

let quickLinks = JSON.parse(localStorage.getItem('dashboard_links')) || [
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'YouTube', url: 'https://youtube.com' }
];

function saveLinks() {
  localStorage.setItem('dashboard_links', JSON.stringify(quickLinks));
}

function renderLinks() {
  linksContainer.innerHTML = '';
  quickLinks.forEach((link, index) => {
    const chip = document.createElement('div');
    chip.className = 'link-chip';

    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.name;

    const delBtn = document.createElement('button');
    delBtn.className = 'link-delete-btn';
    delBtn.textContent = '×';
    delBtn.title = 'Remove link';
    delBtn.addEventListener('click', () => {
      quickLinks.splice(index, 1);
      saveLinks();
      renderLinks();
    });

    chip.appendChild(anchor);
    chip.appendChild(delBtn);
    linksContainer.appendChild(chip);
  });
}

linkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = linkNameInput.value.trim();
  let url = linkUrlInput.value.trim();

  if (!name || !url) return;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  quickLinks.push({ name, url });
  saveLinks();
  renderLinks();
  linkNameInput.value = '';
  linkUrlInput.value = '';
});

renderLinks();