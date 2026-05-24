import { getTodayKey, toIsoString } from "./dates";
import { isRecord } from "./guards";
import type { AppData, Note, PremiumState, Todo } from "./models";

const MAX_NOTE_LENGTH = 500;
const MAX_TODO_LENGTH = 160;

type RandomIdSource = {
  crypto?: {
    randomUUID?: () => string;
  };
};

type EntryBase = Pick<Note, "id" | "text" | "createdAt" | "updatedAt">;
type EntryPrefix = "note" | "todo";
type StoredAppData = {
  notes?: unknown;
  todos?: unknown;
  premium?: unknown;
};

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
  value: unknown,
  now: Date = new Date(),
): AppData {
  const fallback = createEmptyData(now);
  const stored: StoredAppData | undefined = isRecord(value) ? value : undefined;

  return {
    notes: getStoredList<Note>(stored?.notes, fallback.notes),
    todos: getStoredList<Todo>(stored?.todos, fallback.todos),
    premium: normalizePremium(stored?.premium, fallback.premium),
  };
}

export function addNote(data: AppData, text: string, now: Date = new Date()): AppData {
  const note = createEntryBase("note", text, MAX_NOTE_LENGTH, now);
  if (!note) {
    return data;
  }

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
  const baseTodo = createEntryBase("todo", text, MAX_TODO_LENGTH, now);
  if (!baseTodo) {
    return data;
  }

  const todo: Todo = {
    ...baseTodo,
    date: getTodayKey(now),
    done: false,
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
  premium: unknown,
  fallback: PremiumState,
): PremiumState {
  const firstLaunchAt = isRecord(premium) ? premium["firstLaunchAt"] : undefined;
  const purchasedAt = isRecord(premium) ? premium["purchasedAt"] : undefined;

  return {
    firstLaunchAt: isValidDateString(firstLaunchAt) ? firstLaunchAt : fallback.firstLaunchAt,
    ...(isValidDateString(purchasedAt) ? { purchasedAt } : {}),
  };
}

function getStoredList<TEntry>(value: unknown, fallback: TEntry[]): TEntry[] {
  return Array.isArray(value) ? (value as TEntry[]) : fallback;
}

function normalizeText(text: string, maxLength: number): string {
  return text.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function createEntryBase(
  prefix: EntryPrefix,
  text: string,
  maxLength: number,
  now: Date,
): EntryBase | null {
  const normalizedText = normalizeText(text, maxLength);
  if (!normalizedText) {
    return null;
  }

  const timestamp = toIsoString(now);
  return {
    id: createId(prefix, now),
    text: normalizedText,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createId(prefix: EntryPrefix, now: Date): string {
  const random =
    (globalThis as RandomIdSource).crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2, 10);
  return `${prefix}-${now.getTime()}-${random}`;
}

function isValidDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}
