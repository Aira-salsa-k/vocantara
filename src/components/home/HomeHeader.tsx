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
        className="absolute top-4 right-4 z-40 bg-white p-2 rounded-full border border-gray-200 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95"
        aria-label="Bantuan Onboarding"
        title="Buka panduan"
      >
        <CircleHelp size={20} />
      </button>
    </>
  );
};
