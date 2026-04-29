import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addTodo,
  createTodo,
  deleteTodo,
  toggleTodo,
} from "./state.js";

test("createTodo trims text and starts incomplete", () => {
  const todo = createTodo("  buy milk  ", 1000);
  assert.equal(todo.text, "buy milk");
  assert.equal(todo.completed, false);
  assert.match(todo.id, /^1000-[a-z0-9]+$/);
});

test("createTodo throws on empty input", () => {
  assert.throws(() => createTodo(""));
  assert.throws(() => createTodo("   "));
});

test("addTodo appends without mutating", () => {
  const a = createTodo("a", 1);
  const b = createTodo("b", 2);
  const start = [a];
  const next = addTodo(start, b);
  assert.deepEqual(next.map((t) => t.text), ["a", "b"]);
  assert.equal(start.length, 1);
});

test("toggleTodo flips completed flag", () => {
  const a = createTodo("a", 1);
  const next = toggleTodo([a], a.id);
  assert.equal(next[0].completed, true);
  const back = toggleTodo(next, a.id);
  assert.equal(back[0].completed, false);
});

test("toggleTodo leaves unrelated todos untouched", () => {
  const a = createTodo("a", 1);
  const b = createTodo("b", 2);
  const next = toggleTodo([a, b], a.id);
  assert.equal(next[0].completed, true);
  assert.equal(next[1].completed, false);
});

test("deleteTodo removes the matching id", () => {
  const a = createTodo("a", 1);
  const b = createTodo("b", 2);
  const next = deleteTodo([a, b], a.id);
  assert.deepEqual(next.map((t) => t.text), ["b"]);
});
