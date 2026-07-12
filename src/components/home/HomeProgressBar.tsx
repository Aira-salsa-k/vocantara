import React from "react";

interface HomeProgressBarProps {
  progressWords: number;
  progressLevel: number;
  progressPercent: number;
  levelThresholds: number[];
}

export const HomeProgressBar: React.FC<HomeProgressBarProps> = ({
  progressWords,
  progressLevel,
  progressPercent,
  levelThresholds,
}) => {
  const nextLevelWords =
    progressLevel < levelThresholds.length
      ? levelThresholds[progressLevel]
      : null;

  return (
    <section className="max-w-lg w-full mx-auto mt-8 mb-8 px-10 sm:px-6 lg:px-0">
      <div className="mb-1 flex justify-between items-center">
        <span className="text-sm font-semibold text-indigo-700 mb-1">
          Progress Kata: {progressWords}
        </span>
        <span className="text-xs text-gray-600 mb-1">
          Level {progressLevel} ({progressWords}/
          {levelThresholds[progressLevel] ||
            levelThresholds[levelThresholds.length - 1]}
          )
        </span>
      </div>

      <div className="relative w-full bg-gray-200 rounded-full h-3.5">
        <div
          className="h-3.5 rounded-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-800 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>

        <img
          src="/vocantara_logo.png"
          alt="logo"
          className="absolute top-1/2 -translate-y-1/2 w-7.5"
          style={{
            left: `calc(${progressPercent}% - 10px)`,
            transition: "left 0.5s ease-out",
          }}
        />
      </div>

      <div className="text-xs text-gray-500 mt-2.5">
        {progressLevel < levelThresholds.length
          ? `Menuju Level ${progressLevel + 1}: ${nextLevelWords} kata`
          : "Level Maksimal Tercapai"}
      </div>
    </section>
  );
};
