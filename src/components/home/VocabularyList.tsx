import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { VocabularyCard } from "./VocabularyCard";
import { Vocabulary } from "../../types/vocabulary";
import { getWordFilterInfo } from "../../utils/filter";

interface VocabularyListProps {
  loading: boolean;
  vocabulary: Vocabulary[];
  onDeleteSingle: (id: string) => void;
  onTranslatePart: (id: string, text: string, type: "word" | "example") => void;
  translating: { [id: string]: { word?: boolean; example?: boolean } };
  translations: { [id: string]: { word?: string; example?: string } };
  practiceInputs: { [id: string]: string };
  onPracticeInputChange: (id: string, value: string) => void;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({
  loading,
  vocabulary,
  onDeleteSingle,
  onTranslatePart,
  translating,
  translations,
  practiceInputs,
  onPracticeInputChange,
}) => {
  return (
    <main className="flex-grow py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[20vh] text-gray-600 gap-4">
            <div className="w-58 h-48">
              <DotLottieReact
                src="https://lottie.host/39548f35-9573-42bb-8922-4febb7c5745c/cHTJuAco7l.lottie"
                loop
                autoplay
              />
            </div>
            <p className="text-lg font-medium flex items-center gap-2">
              <span>Generating vocabulary</span>
              <span className="animate-pulse text-2xl">🤖</span>
            </p>
          </div>
        ) : vocabulary.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[24vh] gap-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 p-4 mx-4">
            <div className="text-center sm:mx-0 mx-8">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak ada vocabulary.
              </h2>
              <p className="text-gray-500">
                klik "Generate Vocabulary" untuk mulai belajar !
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0">
            {vocabulary.map((item, idx) => {
              const filterInfo = getWordFilterInfo(item.word);
              return (
                <VocabularyCard
                  key={`${item.id}-${idx}`}
                  item={item}
                  filterInfo={filterInfo}
                  onDelete={onDeleteSingle}
                  onTranslatePart={onTranslatePart}
                  translating={translating}
                  translations={translations}
                  practiceInput={practiceInputs[item.id] || ""}
                  onPracticeInputChange={onPracticeInputChange}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
