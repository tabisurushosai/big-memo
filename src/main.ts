import "./styles.css";
import {
  addNote,
  addTodo,
  clearCompletedTodaysTodos,
  deleteNote,
  deleteTodo,
  getTodaysTodos,
  toggleTodo,
  updateNote,
  updateTodo,
} from "./core/memo";
import type { AppData, Note, Todo } from "./core/models";
import {
  PREMIUM_PRICE_USD,
  getTrialStatus,
  isPaymentLinkConfigured,
} from "./core/premium";
import { AppRepository } from "./storage/appRepository";
import { chromeAppStorage } from "./storage/chromeStorage";
import { createTranslator, detectLocale } from "./i18n";

const app = document.querySelector<HTMLDivElement>("#app");
const repository = new AppRepository(chromeAppStorage);
const locale = detectLocale();
const t = createTranslator(locale);

let data: AppData;
let editingNoteId: string | null = null;
let editingTodoId: string | null = null;

async function initialize() {
  renderLoading();
  data = await repository.load();
  render();
}

function renderLoading() {
  if (!app) {
    return;
  }

  app.innerHTML = `
    <section class="panel status-panel" aria-busy="true">
      <p class="eyebrow">${t("appTitle")}</p>
      <p class="empty">${t("loading")}</p>
    </section>
  `;
}

function renderError(error: unknown) {
  if (!app) {
    return;
  }

  app.innerHTML = `
    <section class="panel status-panel" role="alert">
      <p class="eyebrow">${t("appTitle")}</p>
      <h1>${t("loadError")}</h1>
      <p class="empty">${escapeHtml(String(error))}</p>
    </section>
  `;
}

function render() {
  if (!app) {
    return;
  }

  const todayTodos = getTodaysTodos(data);
  const trialStatus = getTrialStatus(data.premium);
  const completedTodoCount = todayTodos.filter((todo) => todo.done).length;

  app.innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">${t("today")}</p>
        <h1>${t("appTitle")}</h1>
        <p class="subtitle">${t("subtitle")}</p>
      </div>
    </section>

    <section class="panel" aria-labelledby="notes-heading">
      <h2 id="notes-heading">${t("notesTitle")}</h2>
      <div class="stack" data-notes></div>
    </section>

    <section class="panel" aria-labelledby="todos-heading">
      <div class="section-header">
        <h2 id="todos-heading">${t("todosTitle")}</h2>
        <button class="secondary small" data-action="clear-done" ${completedTodoCount === 0 ? "disabled" : ""}>${t("clearDone")}</button>
      </div>
      <div class="stack" data-todos></div>
    </section>

    <section class="panel editor" aria-labelledby="editor-heading">
      <h2 id="editor-heading">${t("familyEditor")}</h2>
      <label>
        <span>${t("noteLabel")}</span>
        <textarea id="note-input" rows="3" maxlength="500"></textarea>
      </label>
      <button data-action="add-note">${t("addNote")}</button>

      <label>
        <span>${t("todoLabel")}</span>
        <input id="todo-input" type="text" maxlength="160" />
      </label>
      <button data-action="add-todo">${t("addTodo")}</button>
    </section>

    <section class="panel premium" aria-labelledby="premium-heading">
      <h2 id="premium-heading">${t("premiumTitle")}</h2>
      <p class="price">${t("price", { price: PREMIUM_PRICE_USD })}</p>
      <p>${getPremiumMessage(trialStatus)}</p>
      <p>${t("basicStillWorks")}</p>
      <p>${isPaymentLinkConfigured() ? "" : t("paymentUnavailable")}</p>
      <p class="quiet">${t("storageOnly")} ${t("offline")}</p>
    </section>
  `;

  renderNotes();
  renderTodos(todayTodos);
  bindActions();
}

function renderNotes() {
  const container = document.querySelector<HTMLDivElement>("[data-notes]");
  if (!container) {
    return;
  }

  if (data.notes.length === 0) {
    container.innerHTML = `<p class="empty">${t("emptyNotes")}</p>`;
    return;
  }

  container.innerHTML = data.notes.map(renderNote).join("");
}

function renderNote(note: Note): string {
  if (editingNoteId === note.id) {
    return `
      <article class="card">
        <textarea class="edit-field" data-note-edit="${escapeHtml(note.id)}" rows="4" maxlength="500">${escapeHtml(note.text)}</textarea>
        <div class="actions">
          <button data-action="save-note" data-id="${escapeHtml(note.id)}">${t("save")}</button>
          <button class="secondary" data-action="cancel-edit">${t("cancel")}</button>
        </div>
      </article>
    `;
  }

  return `
    <article class="card">
      <p class="large-text">${escapeHtml(note.text)}</p>
      <div class="actions">
        <button class="secondary" data-action="edit-note" data-id="${escapeHtml(note.id)}">${t("edit")}</button>
        <button class="danger" data-action="delete-note" data-id="${escapeHtml(note.id)}">${t("delete")}</button>
      </div>
    </article>
  `;
}

function renderTodos(todayTodos: Todo[]) {
  const container = document.querySelector<HTMLDivElement>("[data-todos]");
  if (!container) {
    return;
  }

  if (todayTodos.length === 0) {
    container.innerHTML = `<p class="empty">${t("emptyTodos")}</p>`;
    return;
  }

  container.innerHTML = todayTodos.map(renderTodo).join("");
}

function renderTodo(todo: Todo): string {
  if (editingTodoId === todo.id) {
    return `
      <article class="card todo-card">
        <input class="edit-field" data-todo-edit="${escapeHtml(todo.id)}" type="text" maxlength="160" value="${escapeHtml(todo.text)}" />
        <div class="actions">
          <button data-action="save-todo" data-id="${escapeHtml(todo.id)}">${t("save")}</button>
          <button class="secondary" data-action="cancel-edit">${t("cancel")}</button>
        </div>
      </article>
    `;
  }

  const doneClass = todo.done ? "done" : "";
  return `
    <article class="card todo-card ${doneClass}">
      <button class="check-button" data-action="toggle-todo" data-id="${escapeHtml(todo.id)}" aria-pressed="${todo.done}">
        ${todo.done ? t("markUndone") : t("markDone")}
      </button>
      <div class="todo-content">
        ${todo.done ? `<span class="status-badge">${t("completedStatus")}</span>` : ""}
        <p class="large-text">${escapeHtml(todo.text)}</p>
      </div>
      <div class="actions">
        <button class="secondary" data-action="edit-todo" data-id="${escapeHtml(todo.id)}">${t("edit")}</button>
        <button class="danger" data-action="delete-todo" data-id="${escapeHtml(todo.id)}">${t("delete")}</button>
      </div>
    </article>
  `;
}

function bindActions() {
  document.querySelectorAll<HTMLElement>("[data-action]").forEach((element) => {
    element.addEventListener("click", async () => {
      const action = element.dataset.action;
      const id = element.dataset.id;

      if (action === "add-note") {
        await mutate((current) => addNote(current, getInputValue("note-input")));
        clearInput("note-input");
      }
      if (action === "add-todo") {
        await mutate((current) => addTodo(current, getInputValue("todo-input")));
        clearInput("todo-input");
      }
      if (action === "toggle-todo" && id) {
        await mutate((current) => toggleTodo(current, id));
      }
      if (action === "delete-note" && id) {
        await mutate((current) => deleteNote(current, id));
      }
      if (action === "delete-todo" && id) {
        await mutate((current) => deleteTodo(current, id));
      }
      if (action === "edit-note" && id) {
        editingNoteId = id;
        editingTodoId = null;
        render();
      }
      if (action === "edit-todo" && id) {
        editingTodoId = id;
        editingNoteId = null;
        render();
      }
      if (action === "save-note" && id) {
        const value = getEditableValue(`[data-note-edit="${cssEscape(id)}"]`);
        await mutate((current) => updateNote(current, id, value));
        editingNoteId = null;
      }
      if (action === "save-todo" && id) {
        const value = getEditableValue(`[data-todo-edit="${cssEscape(id)}"]`);
        await mutate((current) => updateTodo(current, id, value));
        editingTodoId = null;
      }
      if (action === "cancel-edit") {
        editingNoteId = null;
        editingTodoId = null;
        render();
      }
      if (action === "clear-done") {
        await mutate((current) => clearCompletedTodaysTodos(current));
      }
    });
  });
}

async function mutate(updater: (current: AppData) => AppData) {
  data = updater(data);
  await repository.save(data);
  render();
}

function getInputValue(id: string): string {
  const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  return input?.value ?? "";
}

function clearInput(id: string) {
  const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
  if (input) {
    input.value = "";
  }
}

function getEditableValue(selector: string): string {
  const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
  return input?.value ?? "";
}

function getPremiumMessage(status: ReturnType<typeof getTrialStatus>): string {
  if (status.isPremiumActive) {
    return t("premiumActive");
  }
  if (status.isTrialActive) {
    return t("trialActive", { days: status.remainingDays });
  }
  return t("trialEnded");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cssEscape(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

initialize().catch((error) => {
  renderError(error);
});
