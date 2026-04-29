// Pure state operations for the to-do app.
// No DOM access; safe to import from Node tests and from the browser.

/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 */

/**
 * Create a new todo. The id is derived from `now`; pass a fixed value in tests.
 * @param {string} text
 * @param {number} [now=Date.now()]
 * @returns {Todo}
 */
export function createTodo(text, now = Date.now()) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) {
    throw new Error("Todo text cannot be empty");
  }
  return {
    id: String(now) + "-" + Math.random().toString(36).slice(2, 8),
    text: trimmed,
    completed: false,
  };
}

/** @param {Todo[]} todos @param {Todo} todo @returns {Todo[]} */
export function addTodo(todos, todo) {
  return [...todos, todo];
}

/** @param {Todo[]} todos @param {string} id @returns {Todo[]} */
export function toggleTodo(todos, id) {
  return todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
}

/** @param {Todo[]} todos @param {string} id @returns {Todo[]} */
export function deleteTodo(todos, id) {
  return todos.filter((t) => t.id !== id);
}

/**
 * @param {Todo[]} todos
 * @param {"all"|"active"|"completed"} filter
 * @returns {Todo[]}
 */
export function filterTodos(todos, filter) {
  if (filter === "active") return todos.filter((t) => !t.completed);
  if (filter === "completed") return todos.filter((t) => t.completed);
  return todos;
}
