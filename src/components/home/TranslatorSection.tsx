import React, { useState } from "react";
import TranslateIndoToEngSection from "../TranslateSection";
import { translateWordService } from "../../services/translate";

export const TranslatorSection: React.FC = () => {
  const [translateInput, setTranslateInput] = useState("");
  const [translateResult, setTranslateResult] = useState("");
  const [translateLoading, setTranslateLoading] = useState(false);

  const handleTranslateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translateInput.trim()) return;
    setTranslateLoading(true);
    setTranslateResult("");
    try {
      const result = await translateWordService(translateInput.trim());
      setTranslateResult(result);
    } catch {
      setTranslateResult("Terjemahan gagal");
    } finally {
      setTranslateLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 flex-1 lg:flex-[1.1] bg-none rounded-xl w-full mx-auto">
      <section className="w-full mx-auto bg-white shadow rounded-xl p-6 mb-2">
        <h2 className="text-lg font-semibold mb-3 text-indigo-700">
          Inggris → Indonesia
        </h2>
        <form onSubmit={handleTranslateManual} className="flex flex-col gap-3">
          <textarea
            rows={3}
            className=" bg-gray-50 w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm placeholder-gray-300 placeholder:italic"
            placeholder="Ketik kata/kalimat dalam bahasa Inggris..."
            value={translateInput}
            onChange={(e) => setTranslateInput(e.target.value)}
            disabled={translateLoading}
          />
          <button
            type="submit"
            disabled={translateLoading}
            className={`flex items-center justify-center gap-2 py-2 rounded font-semibold w-full sm:max-w-[180px] md:max-w-[220px] transition-all duration-500 ease-in-out ${
              translateLoading
                ? "bg-indigo-700 text-white opacity-90 cursor-not-allowed"
                : "bg-gray-100 text-gray-400 hover:bg-indigo-700 hover:text-white focus-visible:bg-indigo-700 focus-visible:text-white active:bg-indigo-700 active:text-white cursor-pointer select-none"
            }`}
          >
            {translateLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Menerjemahkan...</span>
              </>
            ) : (
              "Terjemahkan"
            )}
          </button>
        </form>

        {translateResult && (
          <div className="mt-4 p-3 bg-gray-50 rounded text-gray-800 border border-gray-200">
            <span className="font-medium text-gray-400">Hasil terjemahan:</span>
            <br />
            <span>{translateResult}</span>
          </div>
        )}
      </section>
      <TranslateIndoToEngSection />
    </section>
  );
};
