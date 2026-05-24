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
import type { AppData, Note, Todo, TrialStatus } from "./core/models";
import {
  PREMIUM_PRICE_USD,
  getTrialStatus,
  isPaymentLinkConfigured,
} from "./core/premium";
import {
  createTranslator,
  detectLocale,
  formatInteger,
  formatTodayDate,
  formatUsd,
} from "./i18n";
import { getBrowserLanguage } from "./platform/browserLanguage";
import { AppRepository } from "./storage/appRepository";
import { chromeAppStorage } from "./storage/chromeStorage";

const app = document.querySelector<HTMLDivElement>("#app");
const repository = new AppRepository(chromeAppStorage);
const locale = detectLocale(getBrowserLanguage());
const t = createTranslator(locale);

let data: AppData;
let editingNoteId: string | null = null;
let editingTodoId: string | null = null;
let pendingFocusSelectors: string[] = [];
let statusMessage = "";

type TextEntryElement = HTMLInputElement | HTMLTextAreaElement;

async function initialize(): Promise<void> {
  renderLoading();
  data = await repository.load();
  render();
}

function renderLoading(): void {
  if (!app) {
    return;
  }

  app.innerHTML = `
    <section class="panel status-panel" aria-busy="true">
      <p class="eyebrow">${t("appTitle")}</p>
      <h1>${t("loading")}</h1>
      <div class="loading-bar" aria-hidden="true"></div>
    </section>
  `;
}

function renderError(error: unknown): void {
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

function render(): void {
  if (!app) {
    return;
  }

  const now = new Date();
  const todayTodos = getTodaysTodos(data, now);
  const trialStatus = getTrialStatus(data.premium, now);
  const completedTodoCount = todayTodos.filter((todo) => todo.done).length;
  const remainingTodoCount = todayTodos.length - completedTodoCount;
  const noteCountText = formatInteger(locale, data.notes.length);
  const remainingTodoCountText = formatInteger(locale, remainingTodoCount);
  const completedTodoCountText = formatInteger(locale, completedTodoCount);
  const notesHeadingCountText = t(
    data.notes.length === 1 ? "notesCountTextOne" : "notesCountText",
    { count: data.notes.length },
  );
  const todoProgressText = t(
    remainingTodoCount === 1 ? "todoProgressOne" : "todoProgress",
    { done: completedTodoCount, total: todayTodos.length, remaining: remainingTodoCount },
  );
  const isFirstExperience = data.notes.length === 0 && data.todos.length === 0;
  const announcement = statusMessage;
  statusMessage = "";

  app.innerHTML = `
    <p class="sr-only" role="status" aria-live="polite" aria-atomic="true">${escapeHtml(announcement)}</p>
    <section class="hero">
      <div>
        <p class="eyebrow">${t("todayDateLabel", { date: formatTodayDate(locale, now) })}</p>
        <h1>${t("appTitle")}</h1>
        <p class="subtitle">${t("subtitle")}</p>
      </div>
      <div class="summary-grid" aria-label="${t("summaryLabel")}">
        ${renderSummaryItem(t("notesCountLabel"), noteCountText)}
        ${renderSummaryItem(t("remainingTodosLabel"), remainingTodoCountText)}
        ${renderSummaryItem(t("completedTodosLabel"), completedTodoCountText)}
      </div>
    </section>

    ${isFirstExperience ? renderFirstGuide() : ""}

    <section class="panel" aria-labelledby="notes-heading">
      <div class="section-title">
        <p class="eyebrow panel-eyebrow">${notesHeadingCountText}</p>
        <h2 id="notes-heading" class="focus-target" tabindex="-1">${t("notesTitle")}</h2>
      </div>
      <div class="stack" data-notes></div>
    </section>

    <section class="panel" aria-labelledby="todos-heading">
      <div class="section-header">
        <div class="section-title">
          <p class="eyebrow panel-eyebrow">${todoProgressText}</p>
          <h2 id="todos-heading" class="focus-target" tabindex="-1">${t("todosTitle")}</h2>
        </div>
        <button class="secondary small" data-action="clear-done" ${completedTodoCount === 0 ? "disabled" : ""}>${t("clearDone")}</button>
      </div>
      ${todayTodos.length > 0 && remainingTodoCount === 0 ? `<p class="done-message" role="status">${t("allTodosDone")}</p>` : ""}
      <div class="stack" data-todos></div>
    </section>

    <section class="panel editor" aria-labelledby="editor-heading">
      <h2 id="editor-heading" class="focus-target" tabindex="-1">${t("familyEditor")}</h2>
      ${isFirstExperience ? `<p class="editor-hint">${t("editorFirstHint")}</p>` : ""}
      <label>
        <span>${t("noteLabel")}</span>
        <textarea id="note-input" rows="3" maxlength="500" placeholder="${escapeHtml(t("notePlaceholder"))}"></textarea>
      </label>
      <button data-action="add-note">${t("addNote")}</button>

      <label>
        <span>${t("todoLabel")}</span>
        <input id="todo-input" type="text" maxlength="160" placeholder="${escapeHtml(t("todoPlaceholder"))}" />
      </label>
      <button data-action="add-todo">${t("addTodo")}</button>
    </section>

    <section class="panel premium" aria-labelledby="premium-heading">
      <h2 id="premium-heading" class="focus-target" tabindex="-1">${t("premiumTitle")}</h2>
      <p class="price">${t("price", { price: formatUsd(locale, PREMIUM_PRICE_USD) })}</p>
      <p>${getPremiumMessage(trialStatus)}</p>
      <p>${t("basicStillWorks")}</p>
      <p>${isPaymentLinkConfigured() ? "" : t("paymentUnavailable")}</p>
      <p class="quiet">${t("storageOnly")} ${t("offline")}</p>
    </section>
  `;

  renderNotes();
  renderTodos(todayTodos);
  bindActions();
  bindFocusLinks();
  focusPendingElement();
}

function renderNotes(): void {
  const container = document.querySelector<HTMLDivElement>("[data-notes]");
  if (!container) {
    return;
  }

  if (data.notes.length === 0) {
    container.removeAttribute("role");
    container.removeAttribute("aria-label");
    container.innerHTML = renderEmptyState(
      t("emptyNotes"),
      t("emptyNotesDetail"),
      "#note-input",
      t("emptyNotesAction"),
    );
    return;
  }

  container.setAttribute("role", "list");
  container.setAttribute("aria-label", t("notesTitle"));
  container.innerHTML = data.notes.map(renderNote).join("");
}

function renderNote(note: Note): string {
  if (editingNoteId === note.id) {
    return `
      <article class="card" role="listitem">
        <textarea class="edit-field" data-note-edit="${escapeHtml(note.id)}" rows="4" maxlength="500" aria-label="${escapeHtml(t("noteLabel"))}">${escapeHtml(note.text)}</textarea>
        <div class="actions">
          <button data-action="save-note" data-id="${escapeHtml(note.id)}">${t("save")}</button>
          <button class="secondary" data-action="cancel-edit">${t("cancel")}</button>
        </div>
      </article>
    `;
  }

  return `
    <article class="card" role="listitem">
      <p class="large-text">${escapeHtml(note.text)}</p>
      <div class="actions">
        <button class="secondary" data-action="edit-note" data-id="${escapeHtml(note.id)}" aria-label="${escapeHtml(createActionLabel(t("edit"), note.text))}">${t("edit")}</button>
        <button class="danger" data-action="delete-note" data-id="${escapeHtml(note.id)}" aria-label="${escapeHtml(createActionLabel(t("delete"), note.text))}">${t("delete")}</button>
      </div>
    </article>
  `;
}

function renderTodos(todayTodos: Todo[]): void {
  const container = document.querySelector<HTMLDivElement>("[data-todos]");
  if (!container) {
    return;
  }

  if (todayTodos.length === 0) {
    container.removeAttribute("role");
    container.removeAttribute("aria-label");
    container.innerHTML = renderEmptyState(
      t("emptyTodos"),
      t("emptyTodosDetail"),
      "#todo-input",
      t("emptyTodosAction"),
    );
    return;
  }

  container.setAttribute("role", "list");
  container.setAttribute("aria-label", t("todosTitle"));
  container.innerHTML = todayTodos.map(renderTodo).join("");
}

function renderTodo(todo: Todo): string {
  if (editingTodoId === todo.id) {
    return `
      <article class="card todo-card" role="listitem">
        <input class="edit-field" data-todo-edit="${escapeHtml(todo.id)}" type="text" maxlength="160" value="${escapeHtml(todo.text)}" aria-label="${escapeHtml(t("todoLabel"))}" />
        <div class="actions">
          <button data-action="save-todo" data-id="${escapeHtml(todo.id)}">${t("save")}</button>
          <button class="secondary" data-action="cancel-edit">${t("cancel")}</button>
        </div>
      </article>
    `;
  }

  const doneClass = todo.done ? "done" : "";
  return `
    <article class="card todo-card ${doneClass}" role="listitem">
      <button class="check-button" data-action="toggle-todo" data-id="${escapeHtml(todo.id)}" aria-pressed="${todo.done}" aria-label="${escapeHtml(createActionLabel(todo.done ? t("markUndone") : t("markDone"), todo.text))}">
        ${todo.done ? t("markUndone") : t("markDone")}
      </button>
      <div class="todo-content">
        ${todo.done ? `<span class="status-badge">${t("completedStatus")}</span>` : ""}
        <p class="large-text">${escapeHtml(todo.text)}</p>
      </div>
      <div class="actions">
        <button class="secondary" data-action="edit-todo" data-id="${escapeHtml(todo.id)}" aria-label="${escapeHtml(createActionLabel(t("edit"), todo.text))}">${t("edit")}</button>
        <button class="danger" data-action="delete-todo" data-id="${escapeHtml(todo.id)}" aria-label="${escapeHtml(createActionLabel(t("delete"), todo.text))}">${t("delete")}</button>
      </div>
    </article>
  `;
}

function bindActions(): void {
  document.querySelectorAll<HTMLElement>("[data-action]").forEach((element) => {
    element.addEventListener("click", async () => {
      const action = element.dataset["action"];
      const id = element.dataset["id"];

      if (action === "add-note") {
        const value = getInputValue("note-input");
        if (hasMeaningfulInput(value)) {
          statusMessage = t("noteAdded");
        }
        queueFocusAfterRender("#note-input");
        await mutate((current) => addNote(current, value));
        clearInput("note-input");
      }
      if (action === "add-todo") {
        const value = getInputValue("todo-input");
        if (hasMeaningfulInput(value)) {
          statusMessage = t("todoAdded");
        }
        queueFocusAfterRender("#todo-input");
        await mutate((current) => addTodo(current, value));
        clearInput("todo-input");
      }
      if (action === "toggle-todo" && id) {
        const todo = data.todos.find((item) => item.id === id);
        statusMessage = todo?.done ? t("todoMarkedUndone") : t("todoMarkedDone");
        queueFocusAfterRender(
          `[data-action="toggle-todo"][data-id="${cssEscape(id)}"]`,
          "#todos-heading",
        );
        await mutate((current) => toggleTodo(current, id));
      }
      if (action === "delete-note" && id) {
        statusMessage = t("noteDeleted");
        queueFocusAfterRender("#notes-heading");
        await mutate((current) => deleteNote(current, id));
      }
      if (action === "delete-todo" && id) {
        statusMessage = t("todoDeleted");
        queueFocusAfterRender("#todos-heading");
        await mutate((current) => deleteTodo(current, id));
      }
      if (action === "edit-note" && id) {
        editingNoteId = id;
        editingTodoId = null;
        queueFocusAfterRender(`[data-note-edit="${cssEscape(id)}"]`);
        render();
      }
      if (action === "edit-todo" && id) {
        editingTodoId = id;
        editingNoteId = null;
        queueFocusAfterRender(`[data-todo-edit="${cssEscape(id)}"]`);
        render();
      }
      if (action === "save-note" && id) {
        const value = getEditableValue(`[data-note-edit="${cssEscape(id)}"]`);
        editingNoteId = null;
        statusMessage = hasMeaningfulInput(value) ? t("noteSaved") : t("noteDeleted");
        queueFocusAfterRender(
          `[data-action="edit-note"][data-id="${cssEscape(id)}"]`,
          "#notes-heading",
        );
        await mutate((current) => updateNote(current, id, value));
      }
      if (action === "save-todo" && id) {
        const value = getEditableValue(`[data-todo-edit="${cssEscape(id)}"]`);
        editingTodoId = null;
        statusMessage = hasMeaningfulInput(value) ? t("todoSaved") : t("todoDeleted");
        queueFocusAfterRender(
          `[data-action="edit-todo"][data-id="${cssEscape(id)}"]`,
          "#todos-heading",
        );
        await mutate((current) => updateTodo(current, id, value));
      }
      if (action === "cancel-edit") {
        queueFocusAfterRender(
          ...(editingNoteId
            ? [`[data-action="edit-note"][data-id="${cssEscape(editingNoteId)}"]`, "#notes-heading"]
            : []),
          ...(editingTodoId
            ? [`[data-action="edit-todo"][data-id="${cssEscape(editingTodoId)}"]`, "#todos-heading"]
            : []),
        );
        statusMessage = t("editCancelled");
        editingNoteId = null;
        editingTodoId = null;
        render();
      }
      if (action === "clear-done") {
        statusMessage = t("completedTodosCleared");
        queueFocusAfterRender("#todos-heading");
        await mutate((current) => clearCompletedTodaysTodos(current));
      }
    });
  });
}

function bindFocusLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href")?.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ block: "nearest" });
      target.focus();
    });
  });
}

async function mutate(updater: (current: AppData) => AppData): Promise<void> {
  data = updater(data);
  await repository.save(data);
  render();
}

function getInputValue(id: string): string {
  const input = getTextEntryElementById(id);
  return input?.value ?? "";
}

function clearInput(id: string): void {
  const input = getTextEntryElementById(id);
  if (input) {
    input.value = "";
  }
}

function queueFocusAfterRender(...selectors: string[]): void {
  pendingFocusSelectors = selectors;
}

function focusPendingElement(): void {
  if (pendingFocusSelectors.length === 0) {
    return;
  }

  const selectors = pendingFocusSelectors;
  pendingFocusSelectors = [];

  for (const selector of selectors) {
    const target = document.querySelector<HTMLElement>(selector);
    if (target) {
      target.focus();
      return;
    }
  }
}

function getEditableValue(selector: string): string {
  const input = document.querySelector<TextEntryElement>(selector);
  return input?.value ?? "";
}

function getTextEntryElementById(id: string): TextEntryElement | null {
  const element = document.getElementById(id);
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
    ? element
    : null;
}

function getPremiumMessage(status: TrialStatus): string {
  if (status.isPremiumActive) {
    return t("premiumActive");
  }
  if (status.isTrialActive) {
    return t(status.remainingDays === 1 ? "trialActiveOne" : "trialActive", {
      days: status.remainingDays,
    });
  }
  return t("trialEnded");
}

function renderSummaryItem(label: string, value: string): string {
  return `
    <div class="summary-item">
      <span class="summary-value">${value}</span>
      <span class="summary-label">${label}</span>
    </div>
  `;
}

function renderFirstGuide(): string {
  return `
    <section class="panel first-guide" aria-labelledby="first-guide-heading">
      <p class="eyebrow panel-eyebrow">${t("firstGuideEyebrow")}</p>
      <h2 id="first-guide-heading">${t("firstGuideTitle")}</h2>
      <p>${t("firstGuideDetail")}</p>
      <div class="guide-actions">
        <a class="guide-link guide-link-primary" href="#note-input">${t("firstGuideNoteAction")}</a>
        <a class="guide-link" href="#todo-input">${t("firstGuideTodoAction")}</a>
      </div>
    </section>
  `;
}

function renderEmptyState(
  title: string,
  detail: string,
  actionHref: string,
  actionLabel: string,
): string {
  return `
    <div class="empty-state" role="status">
      <p class="empty-title">${title}</p>
      <p class="empty-detail">${detail}</p>
      <a class="empty-link" href="${escapeHtml(actionHref)}">${actionLabel}</a>
    </div>
  `;
}

function createActionLabel(action: string, text: string): string {
  return `${action}: ${text}`;
}

function hasMeaningfulInput(value: string): boolean {
  return value.trim().length > 0;
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
