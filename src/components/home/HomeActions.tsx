import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface HomeActionsProps {
  loading: boolean;
  onGenerate: () => void;
  onClear: () => void;
}

export const HomeActions: React.FC<HomeActionsProps> = ({
  loading,
  onGenerate,
  onClear,
}) => {
  return (
    <section className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 w-full transition-colors">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <button
            className={`relative overflow-hidden flex items-center justify-center gap-2 w-full sm:w-full max-w-[250px] h-10 px-8 py-2 rounded-md font-semibold transition-all duration-700 ease-in-out text-sm text-center ${
              loading
                ? "bg-indigo-600 text-white cursor-default shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_0_18px_rgba(99,102,241,0.5)]"
            }`}
            onClick={onGenerate}
            disabled={loading}
          >
            <span className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
              <span className={`shine ${loading ? "shine-loop" : ""}`}></span>
            </span>

            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="text-white transition-all duration-500">
                  Generating...
                </span>
              </>
            ) : (
              <>
                <SparklesIcon className="sparkle-icon w-5 h-5 text-white transition-all duration-500 ease-in-out" />
                <span className="relative z-10">Generate Vocabulary</span>
              </>
            )}
          </button>

          <button
            onClick={onClear}
            disabled={loading}
            className="group flex items-center justify-center gap-2 w-full sm:w-full max-w-[250px] h-10 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-black active:bg-black font-semibold disabled:opacity-50 transition text-sm text-center"
          >
            <Trash2 className="trash-icon w-4 h-4 transition-transform duration-300" />
            Clear All
          </button>
        </div>
      </div>
    </section>
  );
};
