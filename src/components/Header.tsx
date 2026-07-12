import React from "react";
import { useTheme } from "../hooks/useTheme";

interface HeaderProps {
	onSignOut: () => void;
}

export default function Header({ onSignOut }: HeaderProps) {
	const { isDarkMode, toggleTheme } = useTheme();
	
	const handleSignOut = () => {
		if (onSignOut) onSignOut();
	};

	return (
		<>
			{/* Theme Toggle pojok kanan atas agak diturunkan */}
			<div className="absolute top-14 right-0 z-50 p-4">
				<button 
					onClick={toggleTheme}
					className="p-2 rounded-full dark:bg-neutral-800 text-indigo-500 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-sm border-1 border-gray-200 dark:border-neutral-700"
					aria-label="Toggle Dark Mode"
				>
					{isDarkMode ? (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
						</svg>
					)}
				</button>
			</div>

			{/* Konten Biasa - Bisa scroll */}
			<div className="text-center mt-6 px-4">
				
				<h1 className="text-2xl sm:text-4xl md:text-4xl font-bold text-gray-900 dark:text-gray-300 leading-tight">
					<span className="block">English</span>
					<span className="block">Vocabulary</span>
				</h1>

				<div className="text-sm text-black dark:text-neutral-300 flex items-center justify-center gap-1 mt-1">
					<span className="sm:inline">Belajar kosakata bersama Antara</span>
				</div>
			</div>
		</>
	);
}
