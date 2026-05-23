import { getTodayKey, toIsoString } from "./dates";
import type { AppData, Note, PremiumState, Todo } from "./models";

const MAX_NOTE_LENGTH = 500;
const MAX_TODO_LENGTH = 160;

export function createEmptyData(now: Date = new Date()): AppData {
  return {
    notes: [],
    todos: [],
    premium: {
      firstLaunchAt: toIsoString(now),
    },
  };
}

export function normalizeData(
  value: Partial<AppData> | undefined,
  now: Date = new Date(),
): AppData {
  const fallback = createEmptyData(now);
  return {
    notes: Array.isArray(value?.notes) ? value.notes : fallback.notes,
    todos: Array.isArray(value?.todos) ? value.todos : fallback.todos,
    premium: normalizePremium(value?.premium, fallback.premium),
  };
}

export function addNote(data: AppData, text: string, now: Date = new Date()): AppData {
  const normalizedText = normalizeText(text, MAX_NOTE_LENGTH);
  if (!normalizedText) {
    return data;
  }

  const timestamp = toIsoString(now);
  const note: Note = {
    id: createId("note", now),
    text: normalizedText,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...data,
    notes: [note, ...data.notes],
  };
}

export function updateNote(
  data: AppData,
  id: string,
  text: string,
  now: Date = new Date(),
): AppData {
  const normalizedText = normalizeText(text, MAX_NOTE_LENGTH);
  if (!normalizedText) {
    return deleteNote(data, id);
  }

  return {
    ...data,
    notes: data.notes.map((note) =>
      note.id === id ? { ...note, text: normalizedText, updatedAt: toIsoString(now) } : note,
    ),
  };
}

export function deleteNote(data: AppData, id: string): AppData {
  return {
    ...data,
    notes: data.notes.filter((note) => note.id !== id),
  };
}

export function addTodo(data: AppData, text: string, now: Date = new Date()): AppData {
  const normalizedText = normalizeText(text, MAX_TODO_LENGTH);
  if (!normalizedText) {
    return data;
  }

  const timestamp = toIsoString(now);
  const todo: Todo = {
    id: createId("todo", now),
    text: normalizedText,
    date: getTodayKey(now),
    done: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...data,
    todos: [todo, ...data.todos],
  };
}

export function updateTodo(
  data: AppData,
  id: string,
  text: string,
  now: Date = new Date(),
): AppData {
  const normalizedText = normalizeText(text, MAX_TODO_LENGTH);
  if (!normalizedText) {
    return deleteTodo(data, id);
  }

  return {
    ...data,
    todos: data.todos.map((todo) =>
      todo.id === id ? { ...todo, text: normalizedText, updatedAt: toIsoString(now) } : todo,
    ),
  };
}

export function toggleTodo(
  data: AppData,
  id: string,
  now: Date = new Date(),
): AppData {
  return {
    ...data,
    todos: data.todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done, updatedAt: toIsoString(now) } : todo,
    ),
  };
}

export function deleteTodo(data: AppData, id: string): AppData {
  return {
    ...data,
    todos: data.todos.filter((todo) => todo.id !== id),
  };
}

export function getTodaysTodos(data: AppData, now: Date = new Date()): Todo[] {
  const today = getTodayKey(now);
  return data.todos.filter((todo) => todo.date === today);
}

export function clearCompletedTodaysTodos(
  data: AppData,
  now: Date = new Date(),
): AppData {
  const today = getTodayKey(now);
  return {
    ...data,
    todos: data.todos.filter((todo) => todo.date !== today || !todo.done),
  };
}

function normalizePremium(
  premium: Partial<PremiumState> | undefined,
  fallback: PremiumState,
): PremiumState {
  return {
    firstLaunchAt: isValidDateString(premium?.firstLaunchAt)
      ? premium.firstLaunchAt
      : fallback.firstLaunchAt,
    purchasedAt: isValidDateString(premium?.purchasedAt) ? premium.purchasedAt : undefined,
  };
}

function normalizeText(text: string, maxLength: number): string {
  return text.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function createId(prefix: string, now: Date): string {
  const random =
    globalThis.crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2, 10);
  return `${prefix}-${now.getTime()}-${random}`;
}

function isValidDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}
