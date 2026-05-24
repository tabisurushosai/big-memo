import type { LocaleCode } from "./core/models";

const jaMessages = {
  appTitle: "おおきなメモ",
  subtitle: "家族が残したメモと今日のやることを、大きな文字で見やすく表示します。",
  firstStartHint: "はじめに、下の入力欄でメモかやることを1つ追加します。",
  notesTitle: "今日のメモ",
  todosTitle: "今日のやること",
  familyEditor: "家族が入力する欄",
  editorFirstHint: "まずはメモかやることを1つだけ入れれば大丈夫です。",
  noteLabel: "表示するメモ",
  notePlaceholder: "例: 冷蔵庫に夕食があります",
  noteInputHelp: "入力したら「メモを追加」を押すと、今日のメモに表示されます。",
  todoLabel: "今日のやること",
  todoPlaceholder: "例: 19時に薬を飲む",
  todoInputHelp:
    "入力したらEnterキー、または「やることを追加」で今日のやることに表示されます。",
  addNote: "メモを追加",
  addTodo: "やることを追加",
  edit: "編集",
  save: "保存",
  cancel: "キャンセル",
  delete: "削除",
  firstGuideEyebrow: "はじめての使い方",
  firstGuideTitle: "まずは1件だけで大丈夫です。",
  firstGuideTip: "迷ったら、今日伝えたいことを一言だけ書いてください。",
  firstGuideDetail:
    "下の入力欄に、家族へ見せたいメモや今日の用事を入れると、ここに大きく表示されます。",
  firstGuideNoteAction: "メモを書く",
  firstGuideTodoAction: "やることを書く",
  emptyNotes: "まだメモはありません。",
  emptyNotesDetail: "家族への連絡や置き手紙を追加すると、ここに大きく表示されます。",
  emptyNotesAction: "最初のメモを書く",
  emptyTodos: "今日のやることはありません。",
  emptyTodosDetail: "薬、予定、持ち物など、今日だけ表示したい用事を追加できます。",
  emptyTodosAction: "最初のやることを書く",
  loading: "読み込み中です。",
  loadError: "読み込みに失敗しました。",
  completedStatus: "完了",
  summaryLabel: "今日の状況",
  notesCountLabel: "メモ",
  remainingTodosLabel: "残り",
  completedTodosLabel: "完了",
  notesCountText: "メモ：{count}件",
  notesCountTextOne: "メモ：{count}件",
  todoProgress: "完了：{done}/{total}。残り：{remaining}。",
  todoProgressOne: "完了：{done}/{total}。残り：{remaining}。",
  allTodosDone: "今日のやることはすべて完了しました。",
  markDone: "できたにする",
  markUndone: "未完了に戻す",
  clearDone: "完了したやることを削除",
  noteActionsLabel: "メモの操作",
  todoActionsLabel: "やることの操作",
  editActionsLabel: "編集中の操作",
  editKeyboardHelp: "Escapeキーで編集をキャンセルできます。",
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
  paymentUnavailable: "決済リンクはまだ設定されていません。",
  price: "買い切り価格：{price}",
  todayDateLabel: "今日（日本時間）：{date}",
  summaryItemLabel: "{label}：{value}",
  actionTargetLabel: "{target}：{action}",
  storageOnly: "内容はこの端末の保存領域にだけ保存されます。",
  offline: "ネットワークへ送信しません。",
};

type MessageKey = keyof typeof jaMessages;
type MessageValues = Record<string, string | number>;
export type Translator = (key: MessageKey, values?: MessageValues) => string;

const messages = {
  ja: jaMessages,
  en: {
    appTitle: "Big Memo",
    subtitle: "Displays family notes and today's to-dos in large, easy-to-read text.",
    firstStartHint: "To start, add one note or to-do in the entry area below.",
    notesTitle: "Today's notes",
    todosTitle: "Today's to-dos",
    familyEditor: "Family input area",
    editorFirstHint: "Start with one note or one to-do.",
    noteLabel: "Note to display",
    notePlaceholder: "Example: Dinner is in the fridge",
    noteInputHelp: "After typing, select Add note to show it in today's notes.",
    todoLabel: "Today's to-do",
    todoPlaceholder: "Example: Take medicine at 7 PM",
    todoInputHelp:
      "After typing, press Enter or select Add to-do to show it in today's to-dos.",
    addNote: "Add note",
    addTodo: "Add to-do",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    firstGuideEyebrow: "Getting started",
    firstGuideTitle: "One item is enough to start.",
    firstGuideTip: "If you are unsure, write one thing family should see today.",
    firstGuideDetail:
      "Use the entry area below to add a note for family or a task for today. It will appear here in large text.",
    firstGuideNoteAction: "Write a note",
    firstGuideTodoAction: "Add a to-do",
    emptyNotes: "No notes yet.",
    emptyNotesDetail: "Add a family message or reminder and it will appear here in large text.",
    emptyNotesAction: "Write the first note",
    emptyTodos: "No to-dos for today.",
    emptyTodosDetail:
      "Add medicine reminders, appointments, things to bring, or other items for today.",
    emptyTodosAction: "Add the first to-do",
    loading: "Loading.",
    loadError: "Could not load data.",
    completedStatus: "Completed",
    summaryLabel: "Today's status",
    notesCountLabel: "Notes",
    remainingTodosLabel: "Remaining",
    completedTodosLabel: "Completed",
    notesCountText: "{count} notes",
    notesCountTextOne: "{count} note",
    todoProgress: "Done: {done}/{total}. Remaining: {remaining}.",
    todoProgressOne: "Done: {done}/{total}. Remaining: {remaining}.",
    allTodosDone: "All of today's to-dos are complete.",
    markDone: "Mark as done",
    markUndone: "Mark as not done",
    clearDone: "Clear completed to-dos",
    noteActionsLabel: "Note actions",
    todoActionsLabel: "To-do actions",
    editActionsLabel: "Editing actions",
    editKeyboardHelp: "Press Escape to cancel editing.",
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
    trialActive: "Your 7-day trial is active. {days} days left.",
    trialActiveOne: "Your 7-day trial is active. {days} day left.",
    trialEnded: "The 7-day trial has ended.",
    basicStillWorks: "Basic notes and today's to-dos still work after the trial.",
    paymentUnavailable: "The payment link is not configured yet.",
    price: "One-time price: {price}",
    todayDateLabel: "Today (Japan time): {date}",
    summaryItemLabel: "{label}: {value}",
    actionTargetLabel: "{action}: {target}",
    storageOnly: "Content is saved only in this device's storage.",
    offline: "Nothing is sent to the network.",
  },
} satisfies Record<LocaleCode, Record<MessageKey, string>>;

const LOCALE_TAGS: Record<LocaleCode, string> = {
  ja: "ja-JP",
  en: "en-US",
};

const INTEGER_FORMATTERS: Record<LocaleCode, Intl.NumberFormat> = {
  ja: new Intl.NumberFormat(LOCALE_TAGS.ja, {
    maximumFractionDigits: 0,
    useGrouping: true,
  }),
  en: new Intl.NumberFormat(LOCALE_TAGS.en, {
    maximumFractionDigits: 0,
    useGrouping: true,
  }),
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

export function createTranslator(locale: LocaleCode): Translator {
  return (key: MessageKey, values: MessageValues = {}) => {
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
