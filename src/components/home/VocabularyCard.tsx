import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Vocabulary, FilterInfo } from "../../types/vocabulary";

interface VocabularyCardProps {
  item: Vocabulary;
  filterInfo: FilterInfo | null;
  onDelete: (id: string) => void;
  onTranslatePart: (id: string, text: string, type: "word" | "example") => void;
  translating: { [id: string]: { word?: boolean; example?: boolean } };
  translations: { [id: string]: { word?: string; example?: string } };
  practiceInput: string;
  onPracticeInputChange: (id: string, value: string) => void;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  item,
  filterInfo,
  onDelete,
  onTranslatePart,
  translating,
  translations,
  practiceInput,
  onPracticeInputChange,
}) => {
  const isBlocked = filterInfo?.isBlocked;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    let copyText = `Artinya ini apa Word: ${item.word} (${item.partOfSpeech})\n`;
    if (item.pronunciation) {
      copyText += `Pronunciation: ${item.pronunciation}\n`;
    }
    copyText += `Meaning: ${item.meaning}\n`;
    
    if (translations[item.id]?.word) {
      copyText += `Translation: ${translations[item.id].word}\n`;
    }
    
    try {
      await navigator.clipboard.writeText(copyText.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="group bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 dark:border-neutral-700">
      <div className="p-4 sm:p-5 flex flex-col h-full ">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white break-word">
              {item.word}
            </h3>
            {filterInfo && filterInfo.label && !isBlocked && (
              <span
                className={`px-2 py-0.5 text-[0.65rem] font-bold rounded uppercase tracking-wider ${
                  filterInfo.label === "Medical Term"
                    ? "bg-teal-100 text-teal-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                [{filterInfo.label}]
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-900/50 rounded-full whitespace-nowrap mr-1">
              {item.partOfSpeech}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                copied
                  ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50"
                  : "text-gray-400 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
              }`}
              title="Copy vocabulary info"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1.5 text-gray-400 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full transition-all duration-200"
              title="Hapus kata ini"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="space-y-3 flex-grow">
          {isBlocked ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-3 rounded-lg flex flex-col items-center justify-center h-full text-center">
              <span className="text-red-500 dark:text-red-400 text-xl">⚠️</span>
              <p className="text-sm text-red-600 dark:text-red-300 font-medium">
                {filterInfo.label}
              </p>
            </div>
          ) : (
            <>
              {item.pronunciation && (
                <p className="text-sm text-gray-600 dark:text-neutral-300">
                  <span className="font-medium text-gray-700 dark:text-neutral-200">Pronunciation:</span>{" "}
                  {item.pronunciation}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-neutral-300">
                <span className="font-medium text-gray-700 dark:text-neutral-200">Meaning:</span>{" "}
                {item.meaning}
              </p>
              {item.example && (
                <div className="pt-3 border-t border-gray-100 dark:border-neutral-700">
                  <p className="text-sm text-gray-500 dark:text-neutral-400 italic">"{item.example}"</p>
                </div>
              )}
            </>
          )}
        </div>

        {!isBlocked && (
          <div className="mt-4">
            <button
              className="px-3 py-1 text-xs rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition disabled:opacity-50"
              onClick={() => onTranslatePart(item.id, item.word, "word")}
              disabled={!!translating[item.id]?.word}
            >
              {translating[item.id]?.word ? "Translating..." : "Translate Word"}
            </button>
            {translations[item.id]?.word && (
              <div className="mt-2 text-xs text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 rounded px-2 py-1">
                {translations[item.id].word}
              </div>
            )}

            {item.example && (
              <>
                <button
                  className="px-3 py-1 text-xs rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold hover:bg-green-100 dark:hover:bg-green-900/50 transition mt-2 disabled:opacity-50"
                  onClick={() => onTranslatePart(item.id, item.example, "example")}
                  disabled={!!translating[item.id]?.example}
                >
                  {translating[item.id]?.example ? "Translating..." : "Translate Example"}
                </button>
                {translations[item.id]?.example && (
                  <div className="mt-2 text-xs text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 rounded px-2 py-1">
                    {translations[item.id].example}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!isBlocked && (
          <div className="mt-4">
            <textarea
              className="w-full border border-gray-300 dark:border-neutral-600 rounded-lg p-3 text-gray-800 dark:text-neutral-200 bg-gray-100 dark:bg-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 transition-all duration-300"
              placeholder={`Latihan menulis: ${item.word}`}
              value={practiceInput}
              onChange={(e) => onPracticeInputChange(item.id, e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};
