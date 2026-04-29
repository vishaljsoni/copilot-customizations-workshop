import {
  addTodo,
  createTodo,
  deleteTodo,
  toggleTodo,
} from "./state.js";

/** @type {{ todos: import('./state.js').Todo[] }} */
const state = {
  todos: [],
};

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const empty = document.getElementById("todo-empty");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value;
  try {
    state.todos = addTodo(state.todos, createTodo(text));
    input.value = "";
    render();
  } catch {
    // Empty input — ignored.
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
    render();
  } else if (target.matches(".todo-item__delete")) {
    state.todos = deleteTodo(state.todos, id);
    render();
  }
});

function render() {
  list.innerHTML = "";
  state.todos.forEach((todo) => list.appendChild(renderItem(todo)));
  empty.hidden = state.todos.length !== 0;
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

render();
