// Select elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");

// Load tasks from Local Storage when page loads
window.addEventListener("load", loadTasks);

// Add a new task
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});

// ✅ Clear all tasks
clearAllBtn.addEventListener("click", function () {
  const confirmed = confirm("Are you sure you want to clear all tasks?");

  if (!confirmed) return; // if user clicks Cancel, do nothing

  // Remove all <li> elements from the list
  taskList.innerHTML = "";

  // Remove tasks from localStorage so they don't come back on refresh
  localStorage.removeItem("tasks");
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
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
  saved.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.onclick = () => {
      li.remove();
      saveTasks();
    };

    li.addEventListener("click", function () {
      li.classList.toggle("completed");
      saveTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}
