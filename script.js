// Select elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");
let currentFilter = "all";


// Load tasks from Local Storage when page loads
window.addEventListener("load", () => {
  loadTasks();
  updateUI();
});

// Filter buttons: All / Pending / Completed
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter; // "all" | "pending" | "completed"
    applyFilter();

    // Update active button style
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Add a new task
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});

// ✅ Clear all tasks (with confirmation)
clearAllBtn.addEventListener("click", function () {
  const confirmed = confirm("Are you sure you want to clear all tasks?");
  if (!confirmed) return;

  // Remove all <li> elements from the list
  taskList.innerHTML = "";

  // Remove tasks from localStorage so they don't come back on refresh
  localStorage.removeItem("tasks");

  // Update UI (disable button, show 'No tasks yet! 🎉')
  updateUI();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return alert("Please enter a task!");

  const li = document.createElement("li");

  // Task text (inside a span)
  const textSpan = document.createElement("span");
  textSpan.textContent = taskText;

  // Timestamp (inside a small)
  const small = document.createElement("small");
  small.textContent = "Added on: " + new Date().toLocaleString();

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
    updateUI();
  };

  // Toggle complete when clicking text (not the delete button)
  textSpan.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
    updateUI();
  });

  // Build the li
  li.appendChild(textSpan);
  li.appendChild(deleteBtn);
  li.appendChild(small);

  taskList.appendChild(li);

  taskInput.value = "";
  saveTasks();
  updateUI();
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    const textEl = li.querySelector("span");
    const dateEl = li.querySelector("small");

    tasks.push({
      text: textEl ? textEl.textContent : "",
      // strip the label to keep clean date
      date: dateEl
        ? dateEl.textContent.replace("Added on: ", "")
        : new Date().toLocaleString(),
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");

  saved.forEach(task => {
    const li = document.createElement("li");

    // Text
    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;

    // 👉 If task.date is missing (old data), use current time
    const dateText = task.date || new Date().toLocaleString();

    const small = document.createElement("small");
    small.textContent = "Added on: " + dateText;

    if (task.completed) li.classList.add("completed");

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.onclick = () => {
      li.remove();
      saveTasks();
      updateUI();
    };

    // Toggle complete
    textSpan.addEventListener("click", function () {
      li.classList.toggle("completed");
      saveTasks();
      updateUI();
    });

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    li.appendChild(small);

    taskList.appendChild(li);
  });

  updateUI();
}

// 🔍 Apply current filter to tasks
function applyFilter() {
  Array.from(taskList.children).forEach(li => {
    const isCompleted = li.classList.contains("completed");
    let shouldShow = false;

    if (currentFilter === "all") {
      shouldShow = true;
    } else if (currentFilter === "completed") {
      shouldShow = isCompleted;
    } else if (currentFilter === "pending") {
      shouldShow = !isCompleted;
    }

    li.style.display = shouldShow ? "" : "none";
  });
}

// ✅ Handle empty message + Clear All button state + filter
function updateUI() {
  const hasTasks = taskList.children.length > 0;

  // Show/hide "No tasks yet!" message
  emptyMessage.style.display = hasTasks ? "none" : "block";

  // Enable/disable Clear All button
  clearAllBtn.disabled = !hasTasks;

  // Apply current filter
  applyFilter();
}
