import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Vocabulary } from "../types/vocabulary";
import Swal from "sweetalert2";
import { OFFLINE_WORDLIST } from "../data/offlineWordList";

// ─── Helper: pick N random words from offline list ──────────────────────────
const getOfflineRandomWords = (count: number, existingWords: Set<string>): string[] => {
  // Deduplicate offline list just in case
  const uniqueOfflineWords = Array.from(new Set(OFFLINE_WORDLIST));
  
  // Filter out words that user already has
  const availableWords = uniqueOfflineWords.filter(
    (word) => !existingWords.has(word.toLowerCase())
  );

  // If we run out of new words, fallback to all unique words
  const pool = availableWords.length >= count ? availableWords : uniqueOfflineWords;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// ─── Helper: fetch random words with fallback chain ──────────────────────────
const getRandomWords = async (count = 5, existingWords: Set<string>): Promise<string[]> => {
  // Level 1 – primary API
  try {
    const res = await fetch(
      `https://random-word-api.herokuapp.com/word?number=${count}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const words = await res.json();
      if (Array.isArray(words) && words.length > 0) return words;
    }
  } catch {
    // primary failed, try mirror
  }

  // Level 2 – mirror API
  try {
    const res = await fetch(
      `https://random-word-api.vercel.app/api?words=${count}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const words = await res.json();
      if (Array.isArray(words) && words.length > 0) return words;
    }
  } catch {
    // mirror failed, fall through to offline
  }

  // Level 3 – offline wordlist (always available)
  console.warn("Both random word APIs failed. Using offline wordlist.");
  return getOfflineRandomWords(count, existingWords);
};

// ─── Helper: fetch word definition ──────────────────────────────────────────
const getWordDefinition = async (word: string) => {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] ?? null;
  } catch (error) {
    console.error("Error fetching definition for", word, error);
    return null;
  }
};

const isValidDefinition = (wordData: any): boolean => {
  const meaning = wordData?.meanings?.[0];
  const definition = meaning?.definitions?.[0];
  return !!(meaning && definition && definition.definition);
};

const mapToVocabulary = (wordData: any): Vocabulary => {
  const meaning = wordData.meanings[0];
  const definition = meaning.definitions[0];
  return {
    id: wordData.word,
    word: wordData.word,
    pronunciation: wordData.phonetics?.[0]?.text ?? "",
    meaning: definition.definition,
    partOfSpeech: meaning.partOfSpeech ?? "",
    example: definition.example ?? "",
    synonyms: definition.synonyms ?? [],
    antonyms: definition.antonyms ?? [],
  };
};

export const useVocabulary = (user: any) => {
  const [loading, setLoading] = useState(false);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [existingWords, setExistingWords] = useState<Set<string>>(new Set());
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const fetchVocabulary = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "vocabulary"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const vocabList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Vocabulary[];

      vocabList.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setVocabulary(vocabList);
      setExistingWords(new Set(vocabList.map((item) => item.word.toLowerCase())));
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVocabulary();
    } else {
      // Optional: Handle guest mode or clear state
    }
  }, [user]);

  const handleGenerateVocabulary = async () => {
    setLoading(true);
    setSuccessCount(0);
    setErrorCount(0);

    const randomWords = await getRandomWords(5, existingWords);
    let success = 0;
    let error = 0;

    for (const word of randomWords) {
      try {
        const wordData = await getWordDefinition(word);
        if (wordData && isValidDefinition(wordData)) {
          const vocab = mapToVocabulary(wordData);
          if (user) {
            await addDoc(collection(db, "vocabulary"), {
              ...vocab,
              createdAt: serverTimestamp(),
              userId: user.uid,
            });
          } else {
            vocab.id = `guest-${Date.now()}-${Math.random()}`;
            setVocabulary((prev) => [vocab, ...prev]);
            setExistingWords((prev) => new Set(prev).add(vocab.word.toLowerCase()));
          }
          success++;
        } else {
          error++;
        }
      } catch (err) {
        console.error("Failed to process word:", word, err);
        error++;
      }
    }

    setSuccessCount(success);
    setErrorCount(error);
    if (user) {
      await fetchVocabulary();
    }
    setLoading(false);
  };

  const handleDeleteSingleVocabulary = async (vocabId: string) => {
    const vocabToDel = vocabulary.find((v) => v.id === vocabId);
    setVocabulary((prev) => prev.filter((v) => v.id !== vocabId));
    if (vocabToDel) {
      setExistingWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(vocabToDel.word.toLowerCase());
        return newSet;
      });
    }

    try {
      if (user) {
        await deleteDoc(doc(db, "vocabulary", vocabId));
      }
    } catch (error) {
      console.error("Error deleting single vocabulary:", error);
      if (user) await fetchVocabulary();
    }
  };

  const handleClearVocabulary = async () => {
    try {
      Swal.fire({
        title: "Clearing your data...",
        text: "Please wait a moment",
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: { popup: "swal-wide" },
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const q = query(collection(db, "vocabulary"), where("userId", "==", user?.uid));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      setVocabulary([]);
      setExistingWords(new Set());

      await Swal.fire({
        icon: "success",
        iconColor: "#8f7febff",
        title: "Deleted!",
        text: "Your vocabulary has been cleared.",
        confirmButtonColor: "#2563eb",
        timer: 1300,
        showConfirmButton: false,
        customClass: { popup: "swal-wide" },
      });
    } catch (error) {
      console.error("Error clearing vocabulary:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while clearing your vocabulary.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  return {
    vocabulary,
    loading,
    existingWords,
    handleGenerateVocabulary,
    handleClearVocabulary,
    handleDeleteSingleVocabulary,
  };
};
