export type LocaleCode = "ja" | "en";

export type Note = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type Todo = {
  id: string;
  text: string;
  date: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PremiumState = {
  firstLaunchAt: string;
  purchasedAt?: string;
};

export type AppData = {
  notes: Note[];
  todos: Todo[];
  premium: PremiumState;
};

export type StoredAppData = {
  notes?: Note[];
  todos?: Todo[];
  premium?: Partial<PremiumState>;
};

export type TrialStatus = {
  firstLaunchAt: string;
  trialEndsAt: string;
  remainingDays: number;
  isTrialActive: boolean;
  isPremiumActive: boolean;
  hasPremiumAccess: boolean;
};
