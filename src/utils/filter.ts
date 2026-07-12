import filterData from "../services/filter.json";
import { FilterInfo } from "../types/vocabulary";

export const getWordFilterInfo = (word: string): FilterInfo | null => {
  const lowerWord = word.toLowerCase();

  // Anatomical Context rule
  if (lowerWord === "crus" || lowerWord === "anatomy") {
    return { isBlocked: false, severity: "none", label: "Medical Term" };
  }

  const found = filterData.profanity_filter.find(
    (f: any) => f.word === lowerWord,
  );
  if (!found) return null;

  if (found.severity === "high") {
    return {
      isBlocked: true,
      severity: "high",
      label: "Kata ini tidak tersedia dalam mode aman.",
    };
  } else if (found.severity === "medium" || found.severity === "low") {
    const isSlang =
      found.category === "slang" || found.category === "double_meaning";
    const label = isSlang ? "Informal/Slang" : "Potentially Offensive";
    return { isBlocked: false, severity: found.severity, label };
  }
  return null;
};
