import type { DongId, CategoryKey } from "./constants";

export type AgeGroup =
  | "10대" | "20대" | "30대" | "40대" | "50대" | "60대" | "70대 이상";

export type Gender = "m" | "f";

export interface Voice {
  id: string;
  created_at: string;
  dong: DongId;
  category: CategoryKey;
  content: string;
  age_group: AgeGroup | null;
  gender: Gender | null;
  is_visible: boolean;
}

export interface VoiceInput {
  dong: DongId;
  category: CategoryKey;
  content: string;
  age_group?: AgeGroup;
  gender?: Gender;
}
