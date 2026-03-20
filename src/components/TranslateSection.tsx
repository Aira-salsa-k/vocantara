// import React, { useState } from "react";
// import { translateIndoToEngService } from "../services/translate.ts";


// const TranslateIndoToEngSection = () => {
// 	const [input, setInput] = useState("");
// 	const [result, setResult] = useState("");

// 	const handleTranslate = async () => {
// 		const translated = await translateIndoToEngService(input);
// 		setResult(translated);
// 	};

// 	return (
// 		<section className="p-4 bg-white rounded shadow-md w-full mx-auto my-auto  rounded-xl">
// 			<h2 className="text-lg font-semibold mb-3 text-indigo-700">
// 				Indonesia → Inggris
// 			</h2>
// 			<textarea
// 				rows={3} // Atur tinggi awalnya
// 				className="bg-gray-50 w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm mb- placeholder-gray-300 placeholder:italic mb-2"
// 				placeholder="Ketik kata/kalimat dalam bahasa Indonesia..."
// 				value={input}
// 				onChange={(e) => setInput(e.target.value)}
// 			/>
			
// 			<button
// 				className="bg-gray-100 text-gray-400 py-2 rounded font-semibold hover:bg-indigo-700  hover:text-white transition-colors w-full w-full sm:max-w-[180px] md:max-w-[220px]"
// 				onClick={handleTranslate}
// 			>
// 				Translate
// 			</button>
// 			{result && (
// 				<div className="mt-3 p-2 bg-gray-50 rounded border">{result}</div>
// 			)}
// 		</section>
// 	);
// };

// export default TranslateIndoToEngSection;


import React, { useState } from "react";
import { translateIndoToEngService } from "../services/translate.ts";

const TranslateIndoToEngSection = () => {
	const [input, setInput] = useState("");
	const [result, setResult] = useState("");
	const [loading, setLoading] = useState(false);

	const handleTranslate = async () => {
		if (!input.trim()) return;
		setLoading(true);
		setResult("");

		try {
			const translated = await translateIndoToEngService(input);
			setResult(translated);
		} catch (error) {
			console.error(error);
			setResult("Terjadi kesalahan saat menerjemahkan.");
		}

		setLoading(false);
	};

	return (
		<section className="p-4 bg-white rounded-xl shadow-md w-full mx-auto">
			<h2 className="text-lg font-semibold mb-3 text-indigo-700">
				Indonesia → Inggris
			</h2>

			<textarea
				rows={3}
				className="bg-gray-50 w-full border border-gray-300 rounded px-3 py-2 resize-y 
        focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm placeholder-gray-300 placeholder:italic mb-2"
				placeholder="Ketik kata/kalimat dalam bahasa Indonesia..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>

			<button
				onClick={handleTranslate}
				disabled={loading}
				className={`flex items-center justify-center gap-2 py-2 rounded font-semibold w-full sm:max-w-[180px] md:max-w-[220px]
        transition-all duration-500 ease-in-out
        ${
					loading
						? "bg-indigo-700 text-white opacity-90 cursor-not-allowed"
						: "bg-gray-100 text-gray-400 hover:bg-indigo-700 hover:text-white active:bg-indigo-700 active:text-white"
				}`}
			>
				{loading ? (
					<>
						<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						<span>Translating...</span>
					</>
				) : (
					"Translate"
				)}
			</button>

			{result && (
				<div className="mt-3 p-2 bg-gray-50 rounded border border-gray-300 transition-all duration-300 ease-in-out">
					<span className="font-medium text-gray-400">Hasil Translate:</span>
					<br />
					<span>{result}</span>
				</div>
			)}
		</section>
	);
};

export default TranslateIndoToEngSection;
