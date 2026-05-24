import type { LocaleCode } from "./core/models";

type MessageKey =
  | "appTitle"
  | "subtitle"
  | "notesTitle"
  | "todosTitle"
  | "familyEditor"
  | "noteLabel"
  | "todoLabel"
  | "addNote"
  | "addTodo"
  | "edit"
  | "save"
  | "cancel"
  | "delete"
  | "firstGuideEyebrow"
  | "firstGuideTitle"
  | "firstGuideDetail"
  | "firstGuideNoteAction"
  | "firstGuideTodoAction"
  | "emptyNotes"
  | "emptyNotesDetail"
  | "emptyNotesAction"
  | "emptyTodos"
  | "emptyTodosDetail"
  | "emptyTodosAction"
  | "loading"
  | "loadError"
  | "completedStatus"
  | "summaryLabel"
  | "notesCountLabel"
  | "remainingTodosLabel"
  | "completedTodosLabel"
  | "todoProgress"
  | "allTodosDone"
  | "markDone"
  | "markUndone"
  | "clearDone"
  | "premiumTitle"
  | "premiumActive"
  | "trialActive"
  | "trialEnded"
  | "basicStillWorks"
  | "paymentUnavailable"
  | "price"
  | "today"
  | "storageOnly"
  | "offline";

const messages: Record<LocaleCode, Record<MessageKey, string>> = {
  ja: {
    appTitle: "おおきなメモ",
    subtitle: "家族が書いた大きな文字のメモと、今日のやることを見やすく表示します。",
    notesTitle: "今日のメモ",
    todosTitle: "今日のやること",
    familyEditor: "家族用の入力欄",
    noteLabel: "表示するメモ",
    todoLabel: "今日のやること",
    addNote: "メモを追加",
    addTodo: "やることを追加",
    edit: "編集",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    firstGuideEyebrow: "はじめての使い方",
    firstGuideTitle: "まずは1つだけ書けば大丈夫です。",
    firstGuideDetail:
      "下の入力欄に、家族へ見せたい一言か今日の用事を入れると、ここに大きく表示されます。",
    firstGuideNoteAction: "メモを書く",
    firstGuideTodoAction: "やることを書く",
    emptyNotes: "まだメモはありません。",
    emptyNotesDetail: "家族用の入力欄から、表示したいメモを追加できます。",
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
    todoProgress: "{done} / {total} 完了。残り {remaining}件です。",
    allTodosDone: "今日のやることはすべて完了です。",
    markDone: "完了にする",
    markUndone: "未完了に戻す",
    clearDone: "完了した項目を削除",
    premiumTitle: "プレミアム",
    premiumActive: "プレミアムが有効です。",
    trialActive: "7日トライアル中です。残り {days} 日。",
    trialEnded: "7日トライアルは終了しました。",
    basicStillWorks: "トライアル後も、基本のメモと今日のやることは使えます。",
    paymentUnavailable: "決済リンクは未設定です。",
    price: "買い切り {price}",
    today: "今日",
    storageOnly: "内容はこの端末の保存領域だけに保存されます。",
    offline: "ネットワークには送信しません。",
  },
  en: {
    appTitle: "Big Memo",
    subtitle: "Displays large, easy-to-read notes and today's to-dos written by family.",
    notesTitle: "Today's notes",
    todosTitle: "Today's to-dos",
    familyEditor: "Family input",
    noteLabel: "Note to display",
    todoLabel: "Today's to-do",
    addNote: "Add note",
    addTodo: "Add to-do",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    firstGuideEyebrow: "Getting started",
    firstGuideTitle: "Start with just one item.",
    firstGuideDetail:
      "Use the input area below to add a note for family or one task for today, and it will appear here in large text.",
    firstGuideNoteAction: "Write a note",
    firstGuideTodoAction: "Add a to-do",
    emptyNotes: "No notes yet.",
    emptyNotesDetail: "Use the family input area to add a note to display here.",
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
    todoProgress: "{done} of {total} completed. {remaining} remaining.",
    allTodosDone: "Everything for today is complete.",
    markDone: "Mark done",
    markUndone: "Mark not done",
    clearDone: "Clear completed",
    premiumTitle: "Premium",
    premiumActive: "Premium is active.",
    trialActive: "Your 7-day trial is active. {days} days remaining.",
    trialEnded: "The 7-day trial has ended.",
    basicStillWorks: "Basic notes and today's to-dos still work after the trial.",
    paymentUnavailable: "Payment link is not configured.",
    price: "One-time purchase: {price}",
    today: "Today",
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
    month: "short",
    day: "numeric",
    weekday: "short",
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
