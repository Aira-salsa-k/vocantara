export interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
  example: string;
  partOfSpeech: string;
  pronunciation?: string;
  synonyms?: string[];
  antonyms?: string[];
  phonetic?: string;
  createdAt?: any; // Firestore timestamp
}

export interface FilterInfo {
  isBlocked: boolean;
  severity: "high" | "medium" | "low" | "none";
  label?: string;
}
