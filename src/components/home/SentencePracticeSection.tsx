import React from "react";
import { Vocabulary } from "../../types/vocabulary";

interface SentencePracticeSectionProps {
  vocabulary: Vocabulary[];
  sentenceInput: string;
  setSentenceInput: (value: string) => void;
  grammarLoading: boolean;
  sentenceScore: number | null;
  matchedWords: string[];
  grammarFeedback: string;
  grammarSuggestion: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const SentencePracticeSection: React.FC<SentencePracticeSectionProps> = ({
  vocabulary,
  sentenceInput,
  setSentenceInput,
  grammarLoading,
  sentenceScore,
  matchedWords,
  grammarFeedback,
  grammarSuggestion,
  onSubmit,
}) => {
  return (
    <section className="flex-1 lg:flex-[1.5] max-w-[600px] w-full mx-auto bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-3 text-indigo-900">
        Latihan Merangkai Kalimat
      </h2>
      <div className="mb-2 text-sm text-gray-700">
        Kata kunci yang harus ada di kalimat:
        <span className="font-semibold text-indigo-600 ml-1">
          {vocabulary.map((v) => v.word).join(", ")}
        </span>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <textarea
          rows={10}
          className="bg-gray-100 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 [&:focus]:shadow-none resize-y placeholder-gray-400 placeholder:italic"
          placeholder="Buat kalimat yang mengandung semua kata di atas"
          value={sentenceInput}
          onChange={(e) => setSentenceInput(e.target.value)}
          disabled={grammarLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
          disabled={grammarLoading}
        >
          {grammarLoading ? "Memeriksa..." : "Cek Kalimat & Simpan"}
        </button>
      </form>
      {sentenceScore !== null && (
        <div className="mt-3 text-sm">
          <span className="font-medium">
            Score: {sentenceScore} / {vocabulary.length}
          </span>
          <br />
          <span className="text-gray-700">
            Kata yang ditemukan: {matchedWords.join(", ") || "-"}
          </span>
        </div>
      )}

      {grammarFeedback && (
        <div className="mt-2 text-xs text-gray-700">
          Grammar: {grammarFeedback}
        </div>
      )}

      {grammarSuggestion && (
        <div className="mt-1 text-xs text-blue-700">
          Saran kalimat benar: <strong>{grammarSuggestion}</strong>
        </div>
      )}
    </section>
  );
};
