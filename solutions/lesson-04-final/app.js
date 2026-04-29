import {
  addTodo,
  createTodo,
  deleteTodo,
  filterTodos,
  toggleTodo,
} from "./state.js";

const STORAGE_KEY = "copilot-workshop.todos.v1";

/** @type {{ todos: import('./state.js').Todo[], filter: "all"|"active"|"completed" }} */
const state = {
  todos: loadTodos(),
  filter: "all",
};

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const empty = document.getElementById("todo-empty");
const filterButtons = document.querySelectorAll(".todo-filters__button");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value;
  try {
    state.todos = addTodo(state.todos, createTodo(text));
    input.value = "";
    persistAndRender();
  } catch {
    // Empty input — ignore (the `required` attribute already prevents this).
  }
});

list.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const item = target.closest(".todo-item");
  if (!item) return;
  const id = item.getAttribute("data-id");
  if (!id) return;

  if (target.matches(".todo-item__checkbox")) {
    state.todos = toggleTodo(state.todos, id);
    persistAndRender();
  } else if (target.matches(".todo-item__delete")) {
    state.todos = deleteTodo(state.todos, id);
    persistAndRender();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    if (filter !== "all" && filter !== "active" && filter !== "completed")
      return;
    state.filter = filter;
    filterButtons.forEach((b) =>
      b.classList.toggle(
        "todo-filters__button--active",
        b.getAttribute("data-filter") === filter
      )
    );
    render();
  });
});

function persistAndRender() {
  saveTodos(state.todos);
  render();
}

function render() {
  const visible = filterTodos(state.todos, state.filter);
  list.innerHTML = "";
  visible.forEach((todo) => list.appendChild(renderItem(todo)));
  empty.hidden = visible.length !== 0;
}

function renderItem(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " todo-item--completed" : "");
  li.setAttribute("data-id", todo.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-item__checkbox";
  checkbox.checked = todo.completed;
  checkbox.setAttribute("aria-label", "Mark as completed");

  const text = document.createElement("p");
  text.className = "todo-item__text";
  text.textContent = todo.text;

  const del = document.createElement("button");
  del.type = "button";
  del.className = "todo-item__delete";
  del.setAttribute("aria-label", "Delete task");
  del.textContent = "\u00D7";

  li.append(checkbox, text, del);
  return li;
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage may be unavailable (private mode, quota). Render still works.
  }
}

render();
