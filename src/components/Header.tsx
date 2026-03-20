import React from "react";
import { Home } from "../pages/Home";
interface HeaderProps {
	onSignOut: () => void;
}

export default function Header({ onSignOut }: HeaderProps) {
	const handleSignOut = () => {
		if (onSignOut) onSignOut();
	};

	return (
		<>
		

			{/* Konten Biasa - Bisa scroll */}
			<div className="text-center mt-6 px-4">
				
				<h1 className="text-2xl sm:text-4xl md:text-4xl font-bold text-gray-900 leading-tight">
					<span className="block">English</span>
					<span className="block">Vocabulary</span>
				</h1>

				<div className="text-sm text-black flex items-center justify-center gap-1 mt-1">
					<span className="sm:inline">Belajar kosakata bersama Antara</span>
					
				</div>
			</div>
		</>
	);
}
