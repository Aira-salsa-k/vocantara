import { useState, useEffect } from "react";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const levelThresholds = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000,
  3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000,
  9500, 10000,
];

export const useProgress = (user: any) => {
  const [progressWords, setProgressWords] = useState(0);
  const [progressLevel, setProgressLevel] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!user) {
      setProgressWords(0);
      setProgressLevel(0);
      setProgressPercent(0);
      return;
    }

    const q = query(
      collection(db, "sentencePractices"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let allWords: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.matchedWords)) {
          allWords = allWords.concat(
            data.matchedWords.map((w: string) => w.toLowerCase())
          );
        }
      });

      const uniqueWords = Array.from(new Set(allWords));
      const wordCount = uniqueWords.length;

      setProgressWords(wordCount);

      let currentLv = 0;
      for (let i = 0; i < levelThresholds.length; i++) {
        if (wordCount >= levelThresholds[i]) {
          currentLv = i + 1;
        } else {
          break;
        }
      }
      setProgressLevel(currentLv);

      const prev = currentLv === 0 ? 0 : levelThresholds[currentLv - 1];
      const next = levelThresholds[currentLv];

      let percent = 0;
      if (next) {
        percent = Math.min(100, Math.round(((wordCount - prev) / (next - prev)) * 100));
      } else {
        percent = 100;
      }
      setProgressPercent(percent);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    progressWords,
    progressLevel,
    progressPercent,
    levelThresholds,
  };
};
