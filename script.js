// Select elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");
const emptyMessage = document.getElementById("emptyMessage");

// Load tasks from Local Storage when page loads
window.addEventListener("load", () => {
  loadTasks();
  updateUI();
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
  li.textContent = taskText;

  // Add delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
    updateUI();
  };

  // Toggle complete
  li.addEventListener("click", function () {
    li.classList.toggle("completed");
    saveTasks();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  saveTasks();
  updateUI();
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
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

    // Date
    const dateSpan = document.createElement("small");
    dateSpan.textContent = "Added on: " + task.date;

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
    });

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    li.appendChild(dateSpan);

    taskList.appendChild(li);
  });

  updateUI();
}


// ✅ Handle empty message + Clear All button state
function updateUI() {
  const hasTasks = taskList.children.length > 0;

  // Show/hide "No tasks yet! 🎉" message
  emptyMessage.style.display = hasTasks ? "none" : "block";

  // Enable/disable Clear All button
  clearAllBtn.disabled = !hasTasks;
}
