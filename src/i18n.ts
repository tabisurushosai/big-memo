import type { LocaleCode } from "./core/models";

const jaMessages = {
  appTitle: "おおきなメモ",
  subtitle: "家族が書いたメモと今日のやることを、大きな文字で見やすく表示します。",
  notesTitle: "今日のメモ",
  todosTitle: "今日のやること",
  familyEditor: "家族が書き込む欄",
  editorFirstHint: "最初はメモかやることのどちらか1つで十分です。",
  noteLabel: "表示するメモ",
  notePlaceholder: "例: 冷蔵庫に夕食があります",
  todoLabel: "今日のやること",
  todoPlaceholder: "例: 19時に薬を飲む",
  addNote: "メモを追加",
  addTodo: "やることを追加",
  edit: "編集",
  save: "保存",
  cancel: "キャンセル",
  delete: "削除",
  firstGuideEyebrow: "はじめての使い方",
  firstGuideTitle: "まずは1件だけ書けば大丈夫です。",
  firstGuideDetail:
    "下の入力欄に、家族へ見せたい一言か今日の用事を入れると、ここに大きく表示されます。",
  firstGuideNoteAction: "メモを書く",
  firstGuideTodoAction: "やることを書く",
  emptyNotes: "まだメモはありません。",
  emptyNotesDetail: "家族が書き込む欄から、表示したいメモを追加できます。",
  emptyNotesAction: "メモ入力欄へ",
  emptyTodos: "今日のやることはありません。",
  emptyTodosDetail: "今日だけ表示したい予定や用事を追加できます。",
  emptyTodosAction: "やること入力欄へ",
  loading: "読み込み中です。",
  loadError: "読み込みに失敗しました。",
  completedStatus: "完了",
  summaryLabel: "今日の状況",
  notesCountLabel: "メモ",
  remainingTodosLabel: "残り",
  completedTodosLabel: "完了",
  notesCountText: "メモ {count}件",
  notesCountTextOne: "メモ {count}件",
  todoProgress: "{done}/{total}件完了。残り{remaining}件です。",
  todoProgressOne: "{done}/{total}件完了。残り{remaining}件です。",
  allTodosDone: "今日のやることはすべて完了です。",
  markDone: "完了にする",
  markUndone: "未完了に戻す",
  clearDone: "完了した項目を削除",
  noteAdded: "メモを追加しました。",
  todoAdded: "やることを追加しました。",
  noteSaved: "メモを保存しました。",
  todoSaved: "やることを保存しました。",
  noteDeleted: "メモを削除しました。",
  todoDeleted: "やることを削除しました。",
  todoMarkedDone: "やることを完了にしました。",
  todoMarkedUndone: "やることを未完了に戻しました。",
  editCancelled: "編集をキャンセルしました。",
  completedTodosCleared: "完了した項目を削除しました。",
  premiumTitle: "プレミアム",
  premiumActive: "プレミアムが有効です。",
  trialActive: "7日間のトライアル中です。残り{days}日です。",
  trialActiveOne: "7日間のトライアル中です。残り{days}日です。",
  trialEnded: "7日間のトライアルは終了しました。",
  basicStillWorks: "トライアル後も、基本のメモと今日のやることは使えます。",
  paymentUnavailable: "決済リンクは未設定です。",
  price: "買い切り: {price}",
  todayDateLabel: "今日: {date}",
  storageOnly: "内容はこの端末の保存領域だけに保存されます。",
  offline: "ネットワークには送信しません。",
};

type MessageKey = keyof typeof jaMessages;

const messages: Record<LocaleCode, Record<MessageKey, string>> = {
  ja: jaMessages,
  en: {
    appTitle: "Big Memo",
    subtitle: "Shows large, easy-to-read family notes and today's to-dos.",
    notesTitle: "Today's notes",
    todosTitle: "Today's to-dos",
    familyEditor: "Family entry area",
    editorFirstHint: "One note or one to-do is enough to get started.",
    noteLabel: "Note to display",
    notePlaceholder: "Example: Dinner is in the fridge",
    todoLabel: "Today's to-do",
    todoPlaceholder: "Example: Take medicine at 7 PM",
    addNote: "Add note",
    addTodo: "Add to-do",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    firstGuideEyebrow: "Getting started",
    firstGuideTitle: "Start with just one item.",
    firstGuideDetail:
      "Use the entry area below to add a note for family or a task for today. It will appear here in large text.",
    firstGuideNoteAction: "Write a note",
    firstGuideTodoAction: "Add a to-do",
    emptyNotes: "No notes yet.",
    emptyNotesDetail: "Use the family entry area to add a note to display here.",
    emptyNotesAction: "Go to note input",
    emptyTodos: "No to-dos for today.",
    emptyTodosDetail: "Add appointments or tasks that should appear today.",
    emptyTodosAction: "Go to to-do input",
    loading: "Loading.",
    loadError: "Could not load data.",
    completedStatus: "Completed",
    summaryLabel: "Today's status",
    notesCountLabel: "Notes",
    remainingTodosLabel: "Remaining",
    completedTodosLabel: "Completed",
    notesCountText: "{count} notes",
    notesCountTextOne: "{count} note",
    todoProgress: "{done} of {total} completed. {remaining} to-dos remaining.",
    todoProgressOne: "{done} of {total} completed. {remaining} to-do remaining.",
    allTodosDone: "Everything for today is complete.",
    markDone: "Mark as done",
    markUndone: "Mark as not done",
    clearDone: "Clear completed",
    noteAdded: "Note added.",
    todoAdded: "To-do added.",
    noteSaved: "Note saved.",
    todoSaved: "To-do saved.",
    noteDeleted: "Note deleted.",
    todoDeleted: "To-do deleted.",
    todoMarkedDone: "To-do marked done.",
    todoMarkedUndone: "To-do marked not done.",
    editCancelled: "Edit canceled.",
    completedTodosCleared: "Completed items cleared.",
    premiumTitle: "Premium",
    premiumActive: "Premium is active.",
    trialActive: "Your 7-day trial is active. {days} days remaining.",
    trialActiveOne: "Your 7-day trial is active. {days} day remaining.",
    trialEnded: "The 7-day trial has ended.",
    basicStillWorks: "Basic notes and today's to-dos still work after the trial.",
    paymentUnavailable: "Payment link is not configured.",
    price: "One-time purchase: {price}",
    todayDateLabel: "Today, {date}",
    storageOnly: "Content is saved only to this device's storage.",
    offline: "Nothing is sent over the network.",
  },
};

const LOCALE_TAGS: Record<LocaleCode, string> = {
  ja: "ja-JP",
  en: "en-US",
};

const INTEGER_FORMATTERS: Record<LocaleCode, Intl.NumberFormat> = {
  ja: new Intl.NumberFormat(LOCALE_TAGS.ja, { maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat(LOCALE_TAGS.en, { maximumFractionDigits: 0 }),
};

const USD_FORMATTERS: Record<LocaleCode, Intl.NumberFormat> = {
  ja: new Intl.NumberFormat(LOCALE_TAGS.ja, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }),
  en: new Intl.NumberFormat(LOCALE_TAGS.en, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }),
};

const TODAY_DATE_FORMATTERS: Record<LocaleCode, Intl.DateTimeFormat> = {
  ja: new Intl.DateTimeFormat(LOCALE_TAGS.ja, {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }),
  en: new Intl.DateTimeFormat(LOCALE_TAGS.en, {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }),
};

export function detectLocale(language: string): LocaleCode {
  return language.toLowerCase().startsWith("en") ? "en" : "ja";
}

export function createTranslator(locale: LocaleCode) {
  return (key: MessageKey, values: Record<string, string | number> = {}) => {
    let message = messages[locale][key];
    for (const [name, value] of Object.entries(values)) {
      const formattedValue =
        typeof value === "number" ? formatInteger(locale, value) : value;
      message = message.replaceAll(`{${name}}`, formattedValue);
    }
    return message;
  };
}

export function formatInteger(locale: LocaleCode, value: number): string {
  return INTEGER_FORMATTERS[locale].format(value);
}

export function formatUsd(locale: LocaleCode, value: number): string {
  return USD_FORMATTERS[locale].format(value);
}

export function formatTodayDate(locale: LocaleCode, date: Date): string {
  return TODAY_DATE_FORMATTERS[locale].format(date);
}
