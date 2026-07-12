import { useState, useEffect } from "react";
import axios from "axios";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Vocabulary } from "../types/vocabulary";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const useSentencePractice = (user: any, vocabulary: Vocabulary[]) => {
  const navigate = useNavigate();
  const [sentenceInput, setSentenceInput] = useState("");
  const [grammarSuggestion, setGrammarSuggestion] = useState("");
  const [grammarFeedback, setGrammarFeedback] = useState("");
  const [grammarLoading, setGrammarLoading] = useState(false);
  const [sentenceScore, setSentenceScore] = useState<number | null>(null);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);

  useEffect(() => {
    setSentenceInput("");
    setSentenceScore(null);
    setMatchedWords([]);
    setGrammarFeedback("");
    setGrammarSuggestion("");
  }, [vocabulary]);

  const getMatchedWords = (sentence: string, words: string[]) => {
    return words.filter((word) => sentence.toLowerCase().includes(word.toLowerCase()));
  };

  const getGrammarSuggestion = async (sentence: string) => {
    if (!sentence) return "";
    try {
      const isDev = import.meta.env.DEV;
      if (isDev) {
        // Direct call in development to ease local testing without vercel dev setup
        const response = await axios.post(
          "https://grammar-genius.p.rapidapi.com/dev/grammar",
          { text: sentence, lang: "en" },
          {
            headers: {
              "content-type": "application/json",
              "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY || "",
              "X-RapidAPI-Host": "grammar-genius.p.rapidapi.com",
            },
          }
        );
        return response.data?.corrections?.[0]?.correctedText || "";
      } else {
        // Secure call proxy via Vercel Serverless Function in production
        const response = await axios.post("/api/check-grammar", { text: sentence });
        return response.data?.corrections?.[0]?.correctedText || "";
      }
    } catch (error) {
      console.error("Grammar API error:", error);
      return "";
    }
  };

  const checkGrammar = async (sentence: string) => {
    try {
      const response = await axios.post(
        "https://api.languagetoolplus.com/v2/check",
        new URLSearchParams({ text: sentence, language: "en-US" }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      const matches = response.data.matches;
      if (!matches || matches.length === 0) {
        return "Grammar looks good!";
      }
      return matches.map((m: any) => m.message).join("; ");
    } catch (err) {
      return "Grammar check failed.";
    }
  };

  const handleSentenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGrammarLoading(true);
    setGrammarSuggestion(""); 
    setGrammarFeedback("");
    
    const words = vocabulary.map((v) => v.word);
    const matched = getMatchedWords(sentenceInput, words);
    setMatchedWords(matched);

    const score = matched?.length ?? 0;
    setSentenceScore(score);

    const feedback = await checkGrammar(sentenceInput);
    setGrammarFeedback(feedback);

    if (feedback !== "Grammar looks good!") {
      const suggestion = await getGrammarSuggestion(sentenceInput);
      setGrammarSuggestion(suggestion);
    }

    setGrammarLoading(false);

    const saveSentencePractice = async (): Promise<{ success: boolean; error?: string }> => {
      if (!user || !user.uid) return { success: false, error: "Anda belum login." };

      const dataToSave = {
        userId: user.uid,
        vocabIds: vocabulary.map((v) => v.id),
        vocabWords: words,
        matchedWords: matched,
        sentence: sentenceInput,
        grammarFeedback: feedback,
        score,
        createdAt: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, "sentencePractices"), dataToSave);
        return { success: true };
      } catch (err: any) {
        console.error("Gagal menyimpan latihan kalimat ke Firestore:", err);
        return { success: false, error: err.message || "Unknown error occurred" };
      }
    };

    const saveResult = await saveSentencePractice();

    if (words.length > 0 && score === words.length && feedback === "Grammar looks good!") {
      if (!user) {
        Swal.fire({
          title: "Hore! Kalimatmu Sempurna! 🎉",
          text: "Keren banget! Agar latihan ini tersimpan dan kamu bisa naik level, yuk bikin akun atau login ke Vocantara!",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#4f46e5",
          cancelButtonColor: "#9ca3af",
          confirmButtonText: "Login & Simpan",
          cancelButtonText: "Nanti Saja",
          customClass: {
            popup: "rounded-2xl shadow-2xl",
            title: "text-2xl font-bold text-gray-800 dark:text-neutral-100",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          } else {
            setSentenceInput("");
            setSentenceScore(null);
            setMatchedWords([]);
            setGrammarSuggestion("");
            setGrammarFeedback("");
          }
        });
      } else {
        if (saveResult.success) {
          Swal.fire({
            title: "Selamat!",
            text: "Kalimat Anda sudah benar dan latihan telah disimpan.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            setSentenceInput("");
            setSentenceScore(null);
            setMatchedWords([]);
            setGrammarSuggestion("");
            setGrammarFeedback("");
          });
        } else {
          Swal.fire({
            title: "Gagal Menyimpan",
            text: `Terjadi kesalahan sistem: ${saveResult.error}`,
            icon: "error",
            confirmButtonColor: "#2563eb",
          });
        }
      }
    }
  };

  return {
    sentenceInput,
    setSentenceInput,
    grammarSuggestion,
    grammarFeedback,
    grammarLoading,
    sentenceScore,
    matchedWords,
    handleSentenceSubmit,
  };
};
