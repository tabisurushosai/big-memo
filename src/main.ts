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

document.documentElement.lang = locale;

let data: AppData;
let editingNoteId: string | null = null;
let editingTodoId: string | null = null;
let pendingFocusSelectors: string[] = [];
let statusMessage = "";

type TextEntryElement = HTMLInputElement | HTMLTextAreaElement;
const ACTIONS = [
  "toggle-todo",
  "delete-note",
  "delete-todo",
  "edit-note",
  "edit-todo",
  "save-note",
  "save-todo",
  "cancel-edit",
  "clear-done",
] as const;
type Action = (typeof ACTIONS)[number];
type FocusAction = Extract<Action, "toggle-todo" | "edit-note" | "edit-todo">;
const ENTRY_FORM_KINDS = ["note", "todo"] as const;
type EntryFormKind = (typeof ENTRY_FORM_KINDS)[number];

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
      <h1 id="app-heading">${t("loading")}</h1>
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
      <h1 id="app-heading">${t("loadError")}</h1>
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
    <nav class="skip-links" aria-label="${escapeHtml(t("skipNavigationLabel"))}">
      <a class="skip-link" href="#editor-heading">${escapeHtml(t("skipToEditor"))}</a>
      <a class="skip-link" href="#todos-heading">${escapeHtml(t("skipToTodos"))}</a>
    </nav>
    <section class="hero">
      <div>
        <p class="eyebrow">${t("todayDateLabel", { date: formatTodayDate(locale, now) })}</p>
        <h1 id="app-heading">${t("appTitle")}</h1>
        <p class="subtitle">${t("subtitle")}</p>
        ${isFirstExperience ? `<p class="start-hint">${t("firstStartHint")}</p>` : ""}
      </div>
      <div class="summary-grid" role="list" aria-label="${t("summaryLabel")}">
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
      <div id="notes-list" class="stack" data-notes></div>
    </section>

    <section class="panel" aria-labelledby="todos-heading">
      <div class="section-header">
        <div class="section-title">
          <p class="eyebrow panel-eyebrow">${todoProgressText}</p>
          <h2 id="todos-heading" class="focus-target" tabindex="-1">${t("todosTitle")}</h2>
        </div>
        <button class="secondary small" data-action="clear-done" aria-controls="todos-list" ${completedTodoCount === 0 ? "disabled" : ""}>${t("clearDone")}</button>
      </div>
      ${todayTodos.length > 0 && remainingTodoCount === 0 ? `<p class="done-message" role="status">${t("allTodosDone")}</p>` : ""}
      <div id="todos-list" class="stack" data-todos></div>
    </section>

    <section class="panel editor" aria-labelledby="editor-heading">
      <h2 id="editor-heading" class="focus-target" tabindex="-1">${t("familyEditor")}</h2>
      ${isFirstExperience ? `<p class="editor-hint">${t("editorFirstHint")}</p>` : ""}
      <form class="entry-form" data-entry-form="note" aria-describedby="note-input-help">
        <label for="note-input">
          <span>${t("noteLabel")}</span>
        </label>
        <textarea id="note-input" rows="3" maxlength="500" placeholder="${escapeHtml(t("notePlaceholder"))}" aria-describedby="note-input-help"></textarea>
        <p id="note-input-help" class="field-help">${t("noteInputHelp")}</p>
        <button type="submit" aria-controls="notes-list">${t("addNote")}</button>
      </form>

      <form class="entry-form" data-entry-form="todo" aria-describedby="todo-input-help">
        <label for="todo-input">
          <span>${t("todoLabel")}</span>
        </label>
        <input id="todo-input" type="text" maxlength="160" placeholder="${escapeHtml(t("todoPlaceholder"))}" aria-describedby="todo-input-help" />
        <p id="todo-input-help" class="field-help">${t("todoInputHelp")}</p>
        <button type="submit" aria-controls="todos-list">${t("addTodo")}</button>
      </form>
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
  bindEntryForms();
  bindActions();
  bindEditShortcuts();
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
    const editHelpId = `note-edit-help-${note.id}`;
    return `
      <article class="card" role="listitem">
        <textarea class="edit-field" data-note-edit="${escapeHtml(note.id)}" rows="4" maxlength="500" aria-label="${escapeHtml(t("noteLabel"))}" aria-describedby="${escapeHtml(editHelpId)}">${escapeHtml(note.text)}</textarea>
        <p id="${escapeHtml(editHelpId)}" class="sr-only">${t("editKeyboardHelp")}</p>
        <div class="actions" role="group" aria-label="${escapeHtml(t("editActionsLabel"))}">
          <button data-action="save-note" data-id="${escapeHtml(note.id)}">${t("save")}</button>
          <button class="secondary" data-action="cancel-edit">${t("cancel")}</button>
        </div>
      </article>
    `;
  }

  const noteTextId = `note-text-${note.id}`;
  return `
    <article class="card" role="listitem" aria-labelledby="${escapeHtml(noteTextId)}">
      <p id="${escapeHtml(noteTextId)}" class="large-text">${escapeHtml(note.text)}</p>
      <div class="actions" role="group" aria-label="${escapeHtml(t("noteActionsLabel"))}" aria-describedby="${escapeHtml(noteTextId)}">
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
    const editHelpId = `todo-edit-help-${todo.id}`;
    return `
      <article class="card todo-card" role="listitem">
        <input class="edit-field" data-todo-edit="${escapeHtml(todo.id)}" type="text" maxlength="160" value="${escapeHtml(todo.text)}" aria-label="${escapeHtml(t("todoLabel"))}" aria-describedby="${escapeHtml(editHelpId)}" />
        <p id="${escapeHtml(editHelpId)}" class="sr-only">${t("editKeyboardHelp")}</p>
        <div class="actions" role="group" aria-label="${escapeHtml(t("editActionsLabel"))}">
          <button data-action="save-todo" data-id="${escapeHtml(todo.id)}">${t("save")}</button>
          <button class="secondary" data-action="cancel-edit">${t("cancel")}</button>
        </div>
      </article>
    `;
  }

  const doneClass = todo.done ? "done" : "";
  const todoTextId = `todo-text-${todo.id}`;
  return `
    <article class="card todo-card ${doneClass}" role="listitem" aria-labelledby="${escapeHtml(todoTextId)}">
      <button class="check-button" data-action="toggle-todo" data-id="${escapeHtml(todo.id)}" aria-pressed="${todo.done}" aria-describedby="${escapeHtml(todoTextId)}" aria-label="${escapeHtml(createActionLabel(todo.done ? t("markUndone") : t("markDone"), todo.text))}">
        ${todo.done ? t("markUndone") : t("markDone")}
      </button>
      <div class="todo-content">
        ${todo.done ? `<span class="status-badge">${t("completedStatus")}</span>` : ""}
        <p id="${escapeHtml(todoTextId)}" class="large-text">${escapeHtml(todo.text)}</p>
      </div>
      <div class="actions" role="group" aria-label="${escapeHtml(t("todoActionsLabel"))}" aria-describedby="${escapeHtml(todoTextId)}">
        <button class="secondary" data-action="edit-todo" data-id="${escapeHtml(todo.id)}" aria-label="${escapeHtml(createActionLabel(t("edit"), todo.text))}">${t("edit")}</button>
        <button class="danger" data-action="delete-todo" data-id="${escapeHtml(todo.id)}" aria-label="${escapeHtml(createActionLabel(t("delete"), todo.text))}">${t("delete")}</button>
      </div>
    </article>
  `;
}

function bindActions(): void {
  document.querySelectorAll<HTMLElement>("[data-action]").forEach((element) => {
    element.addEventListener("click", () => {
      void handleActionClick(element);
    });
  });
}

async function handleActionClick(element: HTMLElement): Promise<void> {
  const action = getAction(element);
  if (!action) {
    return;
  }

  const id = element.dataset["id"];
  switch (action) {
    case "toggle-todo": {
      if (!id) {
        return;
      }

      const todo = data.todos.find((item) => item.id === id);
      statusMessage = todo?.done ? t("todoMarkedUndone") : t("todoMarkedDone");
      queueFocusAfterRender(actionSelector("toggle-todo", id), "#todos-heading");
      await mutate((current) => toggleTodo(current, id));
      return;
    }
    case "delete-note":
      if (!id) {
        return;
      }

      statusMessage = t("noteDeleted");
      queueFocusAfterRender("#notes-heading");
      await mutate((current) => deleteNote(current, id));
      return;
    case "delete-todo":
      if (!id) {
        return;
      }

      statusMessage = t("todoDeleted");
      queueFocusAfterRender("#todos-heading");
      await mutate((current) => deleteTodo(current, id));
      return;
    case "edit-note":
      if (!id) {
        return;
      }

      editingNoteId = id;
      editingTodoId = null;
      queueFocusAfterRender(noteEditSelector(id));
      render();
      return;
    case "edit-todo":
      if (!id) {
        return;
      }

      editingTodoId = id;
      editingNoteId = null;
      queueFocusAfterRender(todoEditSelector(id));
      render();
      return;
    case "save-note": {
      if (!id) {
        return;
      }

      await saveNoteEdit(id);
      return;
    }
    case "save-todo": {
      if (!id) {
        return;
      }

      await saveTodoEdit(id);
      return;
    }
    case "cancel-edit":
      cancelEditing();
      return;
    case "clear-done":
      statusMessage = t("completedTodosCleared");
      queueFocusAfterRender("#todos-heading");
      await mutate((current) => clearCompletedTodaysTodos(current));
      return;
  }
}

function bindEntryForms(): void {
  document.querySelectorAll<HTMLFormElement>("[data-entry-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formKind = getEntryFormKind(form);
      switch (formKind) {
        case "note":
          await submitNote();
          return;
        case "todo":
          await submitTodo();
          return;
        case null:
          return;
      }
    });
  });
}

function bindEditShortcuts(): void {
  document.querySelectorAll<TextEntryElement>(".edit-field").forEach((field) => {
    addKeydownListener(field, (event) => {
      if (event.isComposing) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        cancelEditing();
        return;
      }

      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        void saveEditFromField(field);
      }
    });
  });
}

function addKeydownListener(
  field: TextEntryElement,
  listener: (event: KeyboardEvent) => void,
): void {
  const eventListener: EventListener = (event) => {
    if (event instanceof KeyboardEvent) {
      listener(event);
    }
  };

  field.addEventListener("keydown", eventListener);
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

async function submitNote(): Promise<void> {
  const value = getInputValue("note-input");
  if (hasMeaningfulInput(value)) {
    statusMessage = t("noteAdded");
  }
  queueFocusAfterRender("#note-input");
  await mutate((current) => addNote(current, value));
  clearInput("note-input");
}

async function submitTodo(): Promise<void> {
  const value = getInputValue("todo-input");
  if (hasMeaningfulInput(value)) {
    statusMessage = t("todoAdded");
  }
  queueFocusAfterRender("#todo-input");
  await mutate((current) => addTodo(current, value));
  clearInput("todo-input");
}

function cancelEditing(): void {
  queueFocusAfterRender(
    ...(editingNoteId
      ? [actionSelector("edit-note", editingNoteId), "#notes-heading"]
      : []),
    ...(editingTodoId
      ? [actionSelector("edit-todo", editingTodoId), "#todos-heading"]
      : []),
  );
  statusMessage = t("editCancelled");
  editingNoteId = null;
  editingTodoId = null;
  render();
}

async function saveEditFromField(field: TextEntryElement): Promise<void> {
  const noteId = field.dataset["noteEdit"];
  if (noteId) {
    await saveNoteEdit(noteId);
    return;
  }

  const todoId = field.dataset["todoEdit"];
  if (todoId) {
    await saveTodoEdit(todoId);
  }
}

async function saveNoteEdit(id: string): Promise<void> {
  const value = getEditableValue(noteEditSelector(id));
  editingNoteId = null;
  statusMessage = hasMeaningfulInput(value) ? t("noteSaved") : t("noteDeleted");
  queueFocusAfterRender(actionSelector("edit-note", id), "#notes-heading");
  await mutate((current) => updateNote(current, id, value));
}

async function saveTodoEdit(id: string): Promise<void> {
  const value = getEditableValue(todoEditSelector(id));
  editingTodoId = null;
  statusMessage = hasMeaningfulInput(value) ? t("todoSaved") : t("todoDeleted");
  queueFocusAfterRender(actionSelector("edit-todo", id), "#todos-heading");
  await mutate((current) => updateTodo(current, id, value));
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

function getAction(element: HTMLElement): Action | null {
  return getKnownValue(element.dataset["action"], ACTIONS);
}

function getEntryFormKind(form: HTMLFormElement): EntryFormKind | null {
  return getKnownValue(form.dataset["entryForm"], ENTRY_FORM_KINDS);
}

function getKnownValue<TKnownValue extends string>(
  value: string | undefined,
  knownValues: readonly TKnownValue[],
): TKnownValue | null {
  return knownValues.find((knownValue) => knownValue === value) ?? null;
}

function actionSelector(action: FocusAction, id: string): string {
  return `[data-action="${action}"][data-id="${cssEscape(id)}"]`;
}

function noteEditSelector(id: string): string {
  return `[data-note-edit="${cssEscape(id)}"]`;
}

function todoEditSelector(id: string): string {
  return `[data-todo-edit="${cssEscape(id)}"]`;
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
    <div class="summary-item" role="listitem" aria-label="${escapeHtml(t("summaryItemLabel", { label, value }))}">
      <span class="summary-value">${escapeHtml(value)}</span>
      <span class="summary-label">${escapeHtml(label)}</span>
    </div>
  `;
}

function renderFirstGuide(): string {
  return `
    <section class="panel first-guide" aria-labelledby="first-guide-heading" aria-describedby="first-guide-tip first-guide-route">
      <p class="eyebrow panel-eyebrow">${t("firstGuideEyebrow")}</p>
      <h2 id="first-guide-heading">${t("firstGuideTitle")}</h2>
      <p id="first-guide-tip" class="guide-tip">${t("firstGuideTip")}</p>
      <p id="first-guide-route" class="guide-route">${t("firstGuideRoute")}</p>
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
  return t("actionTargetLabel", { action, target: text });
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
