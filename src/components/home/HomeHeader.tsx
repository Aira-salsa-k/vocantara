import React from "react";
import UserAvatar from "../User.avatar";
import { CircleHelp } from "lucide-react";

interface HomeHeaderProps {
  onHelpClick: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onHelpClick }) => {
  return (
    <>
      <UserAvatar />
      <button
        onClick={onHelpClick}
        className="absolute top-4 right-4 z-40 bg-white dark:bg-neutral-800 p-2 rounded-full border border-gray-200 dark:border-neutral-700 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all hover:scale-105 active:scale-95"
        aria-label="Bantuan Onboarding"
        title="Buka panduan"
      >
        <CircleHelp size={20} />
      </button>
    </>
  );
};
