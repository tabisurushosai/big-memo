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
  | "emptyNotes"
  | "emptyTodos"
  | "loading"
  | "loadError"
  | "completedStatus"
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
    subtitle: "家族が書いた大きな文字のメモと、今日のやることを表示します。",
    notesTitle: "今日のメモ",
    todosTitle: "今日のやること",
    familyEditor: "家族が書き込む",
    noteLabel: "伝えたいメモ",
    todoLabel: "今日のやること",
    addNote: "メモを追加",
    addTodo: "やることを追加",
    edit: "直す",
    save: "保存",
    cancel: "やめる",
    delete: "削除",
    emptyNotes: "まだメモはありません。",
    emptyTodos: "今日のやることはありません。",
    loading: "読み込み中です。",
    loadError: "読み込みに失敗しました。",
    completedStatus: "完了",
    markDone: "できた",
    markUndone: "戻す",
    clearDone: "できた項目を消す",
    premiumTitle: "Premium",
    premiumActive: "Premium は有効です。",
    trialActive: "7日トライアル中です。残り {days} 日。",
    trialEnded: "7日トライアルは終了しました。",
    basicStillWorks: "トライアル後も、基本のメモと今日のやることは使えます。",
    paymentUnavailable: "Stripe本番リンクは未設定です。",
    price: "買い切り $3",
    today: "今日",
    storageOnly: "内容はこのブラウザの保存領域だけに保存されます。",
    offline: "ネットワーク送信はありません。",
  },
  en: {
    appTitle: "Big Memo",
    subtitle: "Shows large-text notes and today's to-dos written by family members.",
    notesTitle: "Today's notes",
    todosTitle: "Today's to-dos",
    familyEditor: "Family editor",
    noteLabel: "Note to show",
    todoLabel: "Today's to-do",
    addNote: "Add note",
    addTodo: "Add to-do",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    emptyNotes: "No notes yet.",
    emptyTodos: "No to-dos for today.",
    loading: "Loading.",
    loadError: "Could not load.",
    completedStatus: "Done",
    markDone: "Done",
    markUndone: "Undo",
    clearDone: "Clear done",
    premiumTitle: "Premium",
    premiumActive: "Premium is active.",
    trialActive: "7-day trial is active. {days} days left.",
    trialEnded: "The 7-day trial has ended.",
    basicStillWorks: "Basic notes and today's to-dos still work after the trial.",
    paymentUnavailable: "Stripe production link is not configured.",
    price: "One-time $3",
    today: "Today",
    storageOnly: "Content is stored only in this browser's storage.",
    offline: "No network transmission.",
  },
};

export function detectLocale(): LocaleCode {
  const language =
    typeof chrome !== "undefined" && chrome.i18n?.getUILanguage
      ? chrome.i18n.getUILanguage()
      : navigator.language;
  return language.toLowerCase().startsWith("en") ? "en" : "ja";
}

export function createTranslator(locale: LocaleCode) {
  return (key: MessageKey, values: Record<string, string | number> = {}) => {
    let message = messages[locale][key];
    for (const [name, value] of Object.entries(values)) {
      message = message.replace(`{${name}}`, String(value));
    }
    return message;
  };
}
