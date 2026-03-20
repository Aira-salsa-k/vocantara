import React, { useState, useEffect } from "react";

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
	collection,
	addDoc,
	serverTimestamp,
	query,
	where,
	getDocs,
	orderBy,
	deleteDoc,
	doc,
	onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { translateWordService } from "../services/translate.ts";
import UserAvatar from "../components/User.avatar";
import TranslateIndoToEngSection from "../components/TranslateSection";
import Swal from "sweetalert2";
import { Trash2, Loader2, Sparkles } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { X, ArrowRight } from "lucide-react";
import "../index.css";

interface Vocabulary {
	id: string;
	word: string;
	meaning: string;
	example: string;
	partOfSpeech: string;
	pronunciation?: string;
	synonyms?: string[];
	antonyms?: string[];
	phonetic?: string;
	createdAt?: any; // Firestore timestamp
}
interface OnboardingStep {
	title: string;
	content: string;
	imageUrl?: string; // URL untuk GIF atau gambar
}
const steps: OnboardingStep[] = [
  {
    title: "Selamat Datang di Vocantara!",
    content: "Aplikasi ini dirancang untuk membantu Anda menguasai Bahasa Inggris dengan cara yang interaktif dan menyenangkan. Mari kita mulai!",
    imageUrl: "https://placehold.co/400x200/6366f1/ffffff?text=Selamat+Datang"
  },
  {
    title: "Cara Menggunakan Penerjemah",
    content: "Cukup ketik kalimat dalam Bahasa Indonesia di kolom yang tersedia, dan kami akan langsung menerjemahkannya ke dalam Bahasa Inggris untuk Anda.",
    imageUrl: "https://placehold.co/400x200/34d399/ffffff?text=Ketik+Kalimatmu"
  },
  {
    title: "Mulai Latihan Anda",
    content: "Gunakan fitur ini setiap hari untuk melatih kemampuan Anda. Semakin sering berlatih, semakin cepat Anda mahir. Selamat belajar!",
    imageUrl: "https://placehold.co/400x200/f59e0b/ffffff?text=Selamat+Belajar"
  }
];

interface OnboardingGuideProps {
  onFinish: () => void;
}
const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onFinish }) => {
	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onFinish();
		}
	};

	const currentStepData = steps[currentStep];

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 font-[Inter,sans-serif]">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up">
				<button
					onClick={onFinish}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
					aria-label="Tutup panduan"
				>
					<X size={24} />
				</button>
				{currentStepData.imageUrl && (
					<div className="mb-4 rounded-lg overflow-hidden">
						<img
							src={currentStepData.imageUrl}
							alt={currentStepData.title}
							className="w-full h-auto object-cover"
						/>
					</div>
				)}
				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					{currentStepData.title}
				</h2>
				<p className="text-gray-600 mb-6">{currentStepData.content}</p>
				<div className="flex justify-between items-center">
					<div className="flex space-x-2">
						{steps.map((_, index) => (
							<div
								key={index}
								className={`w-2 h-2 rounded-full ${
									index === currentStep ? "bg-indigo-600" : "bg-gray-300"
								}`}
							></div>
						))}
					</div>
					<button
						onClick={handleNext}
						className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-transform transform active:scale-95"
					>
						{currentStep < steps.length - 1 ? "Lanjut" : "Selesai"}
						<ArrowRight size={18} />
					</button>
				</div>
			</div>
		</div>
	);
};

export const Home = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [successCount, setSuccessCount] = useState(0);
	const [errorCount, setErrorCount] = useState(0);
	const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
	const [existingWords, setExistingWords] = useState<Set<string>>(new Set());

	const handleSignOut = async () => {
		try {
			await auth.signOut();
			navigate("/login");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	useEffect(() => {
		fetchVocabulary();
	}, []);

	// Ambil data vocabulary dari Firestore
	const fetchVocabulary = async () => {
		try {
			const q = query(
				collection(db, "vocabulary"),
				where("userId", "==", auth.currentUser?.uid)
			);
			const querySnapshot = await getDocs(q);

			const vocabList = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Vocabulary[];

			// Sort dari yang terbaru
			vocabList.sort((a, b) => {
				const dateA = a.createdAt?.toDate?.() || new Date(0);
				const dateB = b.createdAt?.toDate?.() || new Date(0);
				return dateB.getTime() - dateA.getTime();
			});

			setVocabulary(vocabList);
			setExistingWords(
				new Set(vocabList.map((item) => item.word.toLowerCase()))
			);
		} catch (error) {
			console.error("Error fetching vocabulary:", error);
		}
	};

	// Ambil kata acak
	const getRandomWords = async (count = 5): Promise<string[]> => {
		try {
			const res = await fetch(
				`https://random-word-api.herokuapp.com/word?number=${count}`
			);
			return await res.json();
		} catch (error) {
			console.error("Error fetching random words:", error);
			return [];
		}
	};

	// Cek apakah definisi valid
	const isValidDefinition = (wordData: any): boolean => {
		const meaning = wordData?.meanings?.[0];
		const definition = meaning?.definitions?.[0];
		return !!(meaning && definition && definition.definition);
	};

	// Ubah ke bentuk Vocabulary
	const mapToVocabulary = (wordData: any): Vocabulary => {
		const meaning = wordData.meanings[0];
		const definition = meaning.definitions[0];

		return {
			id: wordData.word,
			word: wordData.word,
			pronunciation: wordData.phonetics?.[0]?.text ?? "",
			meaning: definition.definition,
			partOfSpeech: meaning.partOfSpeech ?? "",
			example: definition.example ?? "",
			synonyms: definition.synonyms ?? [],
			antonyms: definition.antonyms ?? [],
		};
	};

	// Ambil data definisi dari Dictionary API
	const getWordDefinition = async (word: string) => {
		try {
			const res = await fetch(
				`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
			);
			if (!res.ok) return null;

			const data = await res.json();
			return data[0]; // format mentah untuk `mapToVocabulary`
		} catch (error) {
			console.error("Error fetching definition for", word, error);
			return null;
		}
	};

	// Handle generate vocabulary dari kata acak
	const handleGenerateVocabulary = async () => {
		setLoading(true);
		setSuccessCount(0);
		setErrorCount(0);

		const randomWords = await getRandomWords(5);
		let success = 0;
		let error = 0;

		for (const word of randomWords) {
			try {
				const wordData = await getWordDefinition(word);

				if (wordData && isValidDefinition(wordData)) {
					const vocab = mapToVocabulary(wordData);

					await addDoc(collection(db, "vocabulary"), {
						...vocab,
						createdAt: serverTimestamp(),
						userId: auth.currentUser?.uid,
					});
					success++;
				} else {
					error++;
				}
			} catch (err) {
				console.error("Failed to process word:", word, err);
				error++;
			}
		}

		setSuccessCount(success);
		setErrorCount(error);
		await fetchVocabulary();
		setLoading(false);
	};

	// const handleClearVocabulary = async () => {
	// 	if (
	// 		!window.confirm("Are you sure you want to delete all your vocabulary?")
	// 	) {
	// 		return;
	// 	}

	// 	try {
	// 		const q = query(
	// 			collection(db, "vocabulary"),
	// 			where("userId", "==", auth.currentUser?.uid)
	// 		);
	// 		const querySnapshot = await getDocs(q);

	// 		// Delete all documents
	// 		const deletePromises = querySnapshot.docs.map((doc) =>
	// 			deleteDoc(doc.ref)
	// 		);
	// 		await Promise.all(deletePromises);

	// 		// Clear local state
	// 		setVocabulary([]);
	// 		setExistingWords(new Set());
	// 	} catch (error) {
	// 		console.error("Error clearing vocabulary:", error);
	// 	}
	// };
	const handleClearVocabulary = async () => {
		try {
			Swal.fire({
				title: "Clearing your data...",
				text: "Please wait a moment",
				allowOutsideClick: false,
				allowEscapeKey: false,
				customClass: {
					popup: "swal-wide", // 👈 ini yang penting
				},
				didOpen: () => {
					Swal.showLoading();
				},
			});
			const q = query(
				collection(db, "vocabulary"),
				where("userId", "==", auth.currentUser?.uid)
			);
			const querySnapshot = await getDocs(q);

			const deletePromises = querySnapshot.docs.map((doc) =>
				deleteDoc(doc.ref)
			);
			await Promise.all(deletePromises);

			setVocabulary([]);
			setExistingWords(new Set());

			await Swal.fire({
				icon: "success",
				iconColor: "#8f7febff",
				title: "Deleted!",
				text: "Your vocabulary has been cleared.",
				confirmButtonColor: "#2563eb",
				timer: 1300,
				showConfirmButton: false,
				customClass: {
					popup: "swal-wide", // 👈 ini yang penting
				},
			});
		} catch (error) {
			console.error("Error clearing vocabulary:", error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Something went wrong while clearing your vocabulary.",
				confirmButtonColor: "#2563eb",
			});
		}
	};
	const [translations, setTranslations] = useState<{
		[id: string]: { word?: string; example?: string };
	}>({}); // id vocab : hasil translate
	const [translating, setTranslating] = useState<{
		[id: string]: { word?: boolean; example?: boolean };
	}>({});

	const translateVocabPart = async (
		id: string,
		text: string,
		type: "word" | "example"
	) => {
		setTranslating((prev) => ({
			...prev,
			[id]: { ...prev[id], [type]: true },
		}));
		try {
			const translated = await translateWordService(text);
			setTranslations((prev) => ({
				...prev,
				[id]: { ...prev[id], [type]: translated },
			}));
		} catch {
			setTranslations((prev) => ({
				...prev,
				[id]: { ...prev[id], [type]: "Terjemahan gagal" },
			}));
		} finally {
			setTranslating((prev) => ({
				...prev,
				[id]: { ...prev[id], [type]: false },
			}));
		}
	};

	// Tambahkan di dalam komponen Home (setelah deklarasi state lain)
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

	// fitur 3 :  arrange sentence

	// State untuk latihan kalimat, grammar feedback, loading, dan score
	// State untuk 1 form latihan kalimat

	const [sentenceInput, setSentenceInput] = useState("");
	const [grammarSuggestion, setGrammarSuggestion] = useState("");
	const [grammarFeedback, setGrammarFeedback] = useState("");
	const [grammarLoading, setGrammarLoading] = useState(false);
	const [sentenceScore, setSentenceScore] = useState<number | null>(null);
	const [matchedWords, setMatchedWords] = useState<string[]>([]);

	// Cek kata-kata vocab mana saja yang ada di kalimat
	const getMatchedWords = (sentence: string, words: string[]) => {
		return words.filter((word) =>
			sentence.toLowerCase().includes(word.toLowerCase())
		);
	};

	// fitur 4 : check grammar
	const getGrammarSuggestion = async (sentence: string) => {
		const options = {
			method: "POST",
			url: "https://grammar-genius.p.rapidapi.com/dev/grammar",
			headers: {
				"content-type": "application/json",
				"X-RapidAPI-Key": "e2d6554dcbmsh5b077ebc955fff8p1e078ejsn0da2f1368466", // Ganti dengan API key kamu
				"X-RapidAPI-Host": "grammar-genius.p.rapidapi.com",
			},
			data: {
				text: sentence,
				lang: "en",
			},
		};
		try {
			const response = await axios.request(options);
			// Hasil: response.data.corrections[0].correctedText
			return response.data?.corrections?.[0]?.correctedText || "";
		} catch (error) {
			console.error("Grammar API error:", error);
			return "";
		}
	};
	const checkGrammar = async (sentence: string) => {
		try {
			const response = await axios.post(
				"https://api.languagetoolplus.com/v2/check",
				new URLSearchParams({
					text: sentence,
					language: "en-US",
				}),
				{ headers: { "Content-Type": "application/x-www-form-urlencoded" } }
			);
			const matches = response.data.matches;
			if (!matches || matches.length === 0) {
				return "Grammar looks good!";
			}
			return matches.map((m: any) => m.message).join("; ");
		} catch (err) {
			return "Grammar check failed.";
		}
	};
	const handleGrammarCheck = async (sentence: string) => {
		setGrammarFeedback("Checking...");
		setGrammarSuggestion("");

		const feedback = await checkGrammar(sentence);
		setGrammarFeedback(feedback);

		const suggestion = await getGrammarSuggestion(sentence);
		if (suggestion) setGrammarSuggestion(suggestion);
	};

	// fitur submit kalimat latihan rangkai kata
	const handleSentenceSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setGrammarLoading(true);
		getGrammarSuggestion(""); // reset suggestion
		setGrammarFeedback("");
		// Ambil semua kata dari vocabulary
		const words = vocabulary.map((v) => v.word);
		const matched = getMatchedWords(sentenceInput, words);
		setMatchedWords(matched);

		const score = matched?.length ?? 0;
		setSentenceScore(score);

		// Grammar check
		const feedback = await checkGrammar(sentenceInput);
		setGrammarFeedback(feedback);

		// Jika grammar salah, minta suggestion dari Grammar Genius
		if (feedback !== "Grammar looks good!") {
			const suggestion = await getGrammarSuggestion(sentenceInput);
			setGrammarSuggestion(suggestion);
		}

		setGrammarLoading(false);

		// Simpan ke Firestore
		const saveSentencePractice = async ({
			vocabIds,
			vocabWords,
			matchedWords,
			sentence,
			grammarFeedback,
			score,
		}: {
			vocabIds: string[];
			vocabWords: string[];
			matchedWords: string[];
			sentence: string;
			grammarFeedback: string;
			score: number;
		}) => {
			// Guard: Pastikan user sudah login
			if (!auth.currentUser || !auth.currentUser.uid) {
				console.error("User belum login, data tidak disimpan.");
				alert("Anda harus login untuk menyimpan latihan.");
				return;
			}

			// Validasi field
			const dataToSave = {
				userId: auth.currentUser.uid,
				vocabIds: Array.isArray(vocabIds) ? vocabIds : [],
				vocabWords: Array.isArray(vocabWords) ? vocabWords : [],
				matchedWords: Array.isArray(matchedWords) ? matchedWords : [],
				sentence: typeof sentence === "string" ? sentence : "",
				grammarFeedback:
					typeof grammarFeedback === "string" ? grammarFeedback : "",
				score: typeof score === "number" && !isNaN(score) ? score : 0,
				createdAt: serverTimestamp(),
			};

			// Logging sebelum simpan
			console.log("Data yang akan disimpan ke Firestore:", dataToSave);

			try {
				await addDoc(collection(db, "sentencePractices"), dataToSave);
				console.log("Berhasil menyimpan latihan ke Firestore.");
			} catch (err) {
				console.error(
					"Gagal menyimpan latihan kalimat ke Firestore:",
					err,
					dataToSave
				);
				alert("Gagal menyimpan ke Firestore. Lihat console untuk detail.");
			}
		};

		await saveSentencePractice({
			vocabIds: vocabulary.map((v) => v.id),
			vocabWords: words,
			matchedWords: matched,
			sentence: sentenceInput,
			grammarFeedback: feedback,
			score,
		});

		// if (score === words.length && feedback === "Grammar looks good!") {
		// 	window.alert(
		// 		"Selamat! Kalimat Anda sudah benar dan mengandung semua kata kunci."
		// 	);
		// 	setSentenceInput(""); // Kosongkan textarea
		// 	setSentenceScore(null);
		// 	setMatchedWords([]);
		// 	getGrammarSuggestion("");
		// 	setGrammarFeedback("");
		// }

		if (score === words.length && feedback === "Grammar looks good!") {
			Swal.fire({
				title: "Selamat!",
				text: "Kalimat Anda sudah benar dan mengandung semua kata kunci.",
				icon: "success",
				timer: 1300,
				showConfirmButton: false,
			}).then(() => {
				// Reset state setelah user menutup alert
				setSentenceInput("");
				setSentenceScore(null);
				setMatchedWords([]);
				getGrammarSuggestion("");
				setGrammarFeedback("");
			});
		}
	};

	useEffect(() => {
		setSentenceInput("");
		setSentenceScore(null);
		setMatchedWords([]);
		setGrammarFeedback("");
		getGrammarSuggestion("");
	}, [vocabulary]);

	const saveSentencePractice = async ({
		vocabIds,
		vocabWords,
		matchedWords,
		sentence,
		grammarFeedback,
		score,
	}: {
		vocabIds: string[];
		vocabWords: string[];
		matchedWords: string[];
		sentence: string;
		grammarFeedback: string;
		score: number;
	}) => {
		try {
			await addDoc(collection(db, "sentencePractices"), {
				userId: auth.currentUser?.uid,
				vocabIds,
				vocabWords,
				matchedWords,
				sentence,
				grammarFeedback,
				score,
				createdAt: serverTimestamp(),
			});
		} catch (err) {
			console.error("Gagal menyimpan latihan kalimat:", err);
		}
	};

	//   progres bar
	const levelThresholds = [100, 200, 500, 1000, 2000, 3000];
	const [progressWords, setProgressWords] = useState(0);
	const [progressLevel, setProgressLevel] = useState(1);
	const [progressPercent, setProgressPercent] = useState(0);

	useEffect(() => {
		if (!auth.currentUser) return;

		const q = query(
			collection(db, "sentencePractices"),
			where("userId", "==", auth.currentUser.uid)
		);

		// Pasang listener real-time
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let allWords: string[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				if (Array.isArray(data.matchedWords)) {
					allWords = allWords.concat(
						data.matchedWords.map((w: string) => w.toLowerCase())
					);
				}
			});

			// Hitung kata unik
			const uniqueWords = Array.from(new Set(allWords));
			setProgressWords(uniqueWords.length);

			// Hitung level dan persen
			let level = 1;
			for (let i = 0; i < levelThresholds.length; i++) {
				if (uniqueWords.length >= levelThresholds[i]) level = i + 1;
			}
			setProgressLevel(level);

			const prev = level > 1 ? levelThresholds[level - 2] : 0;
			const next =
				levelThresholds[level - 1] ||
				levelThresholds[levelThresholds.length - 1];
			const percent = Math.min(
				100,
				Math.round(((uniqueWords.length - prev) / (next - prev)) * 100)
			);
			setProgressPercent(percent);
		});

		// Cleanup listener saat komponen unmount atau user logout
		return () => unsubscribe();
	}, [auth.currentUser]);

	//avatar
	const [user, setUser] = useState(() => auth.currentUser);
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
		return () => unsubscribe();
	}, []);

	// console.log('vocabulary:', vocabulary);
	const [practiceInputs, setPracticeInputs] = useState<{
		[id: string]: string;
	}>({});

	// Logika untuk onboarding ditempatkan di sini
	const [showOnboarding, setShowOnboarding] = useState(false);

	useEffect(() => {
		const VISIT_COUNT_KEY = "vocantaraVisitCount";
		const MAX_VISITS_FOR_ONBOARDING = 10;

		const visitCountStr = localStorage.getItem(VISIT_COUNT_KEY);
		const visitCount = visitCountStr ? parseInt(visitCountStr, 10) : 0;

		if (visitCount < MAX_VISITS_FOR_ONBOARDING) {
			setShowOnboarding(true);
			localStorage.setItem(VISIT_COUNT_KEY, (visitCount + 1).toString());
		}
	}, []);

	const handleOnboardingFinish = () => {
		setShowOnboarding(false);
	};

	return (
		<>
			{/* User avatar di pojok kiri atas */}
			<UserAvatar />

			<div className="min-h-screen w-full bg-gray-100 flex flex-col">
				{/* Section 2: Action Buttons */}
				<section className="bg-white border-b border-gray-200 w-full">
					<div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 rounded-lg">
						<div className="flex flex-col sm:flex-row justify-center items-center gap-3">
							<button
								className={`relative overflow-hidden flex items-center justify-center gap-2 w-full sm:w-full max-w-[250px] h-10 px-8 py-2 rounded-md font-semibold
											transition-all duration-700 ease-in-out text-sm text-center
											${
												loading
													? "bg-indigo-600 text-white cursor-wait shadow-[0_0_12px_rgba(99,102,241,0.5)]"
													: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-[0_0_18px_rgba(99,102,241,0.5)]"
											}`}
								onClick={handleGenerateVocabulary}
								disabled={loading}
							>
								{/* Efek shine */}
								<span className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
									<span
										className={`shine ${loading ? "shine-loop" : ""}`}
									></span>
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
								onClick={handleClearVocabulary}
								disabled={loading}
								className="group flex items-center justify-center gap-2 w-full sm:w-full max-w-[250px] h-10 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-black active:bg-black font-semibold disabled:opacity-50 transition text-sm text-center"
							>
								<Trash2 className="trash-icon w-4 h-4 transition-transform duration-300" />
								Clear All
							</button>
						</div>
					</div>
				</section>

				{/* Progress Bar */}

				{/* <section className="max-w-lg w-full mx-auto mt-8 mb-8 px-10 sm:px-6 lg:px-0">
					<div className="mb-1 flex justify-between items-center">
						<span className="text-sm font-semibold text-indigo-700">
							Progress Kata: {progressWords}
						</span>
						<span className="text-xs text-gray-600">
							Level {progressLevel} ({progressWords}/
							{levelThresholds[progressLevel - 1] ||
								levelThresholds[levelThresholds.length - 1]}
							)
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-3.5">
						<div
							// className="bg-indigo-600 h-4 rounded-full transition-all"
							className="h-3.5 rounded-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-800

               transition-all duration-500 ease-out"
							// style={{ width: "70%" }} // contoh progress 70%
							style={{ width: `${progressPercent}%` }}
						></div>
					</div>
					<div className="text-xs text-gray-500 mt-1">
						{progressLevel < levelThresholds.length
							? `Menuju Level ${progressLevel + 1}: ${
									levelThresholds[progressLevel - 1]
							  } kata`
							: "Level Maksimal Tercapai"}
					</div>
				</section> */}

				<section className="max-w-lg w-full mx-auto mt-8 mb-8 px-10 sm:px-6 lg:px-0">
					<div className="mb-1 flex justify-between items-center">
						<span className="text-sm font-semibold text-indigo-700 mb-1">
							Progress Kata: {progressWords}
						</span>
						<span className="text-xs text-gray-600 mb-1">
							Level {progressLevel} ({progressWords}/
							{levelThresholds[progressLevel - 1] ||
								levelThresholds[levelThresholds.length - 1]}
							)
						</span>
					</div>

					{/* Progress bar container */}
					<div className="relative w-full bg-gray-200 rounded-full h-3.5">
						{/* Progress bar isi */}
						<div
							className="h-3.5 rounded-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-800 transition-all duration-500 ease-out"
							style={{ width: `${progressPercent}%` }}
						></div>

						{/* Logo di ujung bar */}
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
							? `Menuju Level ${progressLevel + 1}: ${
									levelThresholds[progressLevel - 1]
							  } kata`
							: "Level Maksimal Tercapai"}
					</div>
				</section>

				{/* Section 3: Vocabulary Cards */}
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
								<p className="text-sm text-gray-500">
									Please wait<span className="animate-pulse">...</span>
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
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4  px-4 sm:px-0">
								{vocabulary.map((item, idx) => (
									<div
										key={`${item.id}-${idx}`}
										className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
									>
										<div className="p-4 sm:p-5 flex flex-col h-full ">
											<div className="flex items-center justify-between gap-2 mb-4">
												<h3 className="text-xl font-semibold text-gray-800 break-word">
													{item.word}
												</h3>
												{/* <span className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full whitespace-nowrap">
													{item.partOfSpeech}
												</span> */}
												<span className="inline-flex px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full whitespace-nowrap">
													{item.partOfSpeech}
												</span>
											</div>
											<div className="space-y-3 flex-grow">
												{item.pronunciation && (
													<p className="text-sm text-gray-600">
														<span className="font-medium text-gray-700">
															Pronunciation:
														</span>{" "}
														{item.pronunciation}
													</p>
												)}
												<p className="text-sm text-gray-600">
													<span className="font-medium text-gray-700">
														Meaning:
													</span>{" "}
													{item.meaning}
												</p>
												{item.example && (
													<div className="pt-3 border-t border-gray-100">
														<p className="text-sm text-gray-500 italic">
															"{item.example}"
														</p>
													</div>
												)}
											</div>
											{/* Tombol translate */}
											<div className="mt-4">
												{/* Translate judul vocab */}
												<button
													className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
													onClick={() =>
														translateVocabPart(item.id, item.word, "word")
													}
													disabled={!!translating[item.id]?.word}
												>
													{translating[item.id]?.word
														? "Translating..."
														: "Translate Word"}{" "}
												</button>
												{translations[item.id]?.word && (
													<div className="mt-2 text-xs text-gray-700 bg-gray-100 rounded px-2 py-1">
														{translations[item.id].word}
													</div>
												)}

												{item.example && (
													<>
														<button
															className="px-3 py-1 text-xs rounded-md bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition mt-2"
															onClick={() =>
																translateVocabPart(
																	item.id,
																	item.example,
																	"example"
																)
															}
															disabled={!!translating[item.id]?.example}
														>
															{translating[item.id]?.example
																? "Translating..."
																: "Translate Example"}
														</button>
														{translations[item.id]?.example && (
															<div className="mt-2 text-xs text-gray-700 bg-gray-100 rounded px-2 py-1">
																{translations[item.id].example}
															</div>
														)}
													</>
												)}
											</div>

											<div className="mt-4">
												<textarea
													className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
													placeholder={`Latihan menulis: ${item.word}`}
													value={practiceInputs[item.id] || ""}
													onChange={(e) =>
														setPracticeInputs((prev) => ({
															...prev,
															[item.id]: e.target.value,
														}))
													}
													rows={3}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* //Section arrange sentence */}

					{/* <div className="flex flex-col gap-8 lg:flex-row lg:gap-8 max-w-7xl lg:px-8 mt-14"> */}
					<div className="flex flex-col gap-8 lg:flex-row lg:gap-8 max-w-7xl mx-auto px-8 sm:px-8 lg:px-8 my-8 lg:my-20 mt-14">
						{/* Section 2: Latihan Merangkai Kalimat */}

						{/* ...isi Latihan Merangkai Kalimat */}
						<section className="flex-1 lg:flex-[1.5] max-w-230 w-full mx-auto bg-white shadow rounded-xl p-6">
							<h2 className="text-xl font-semibold mb-3 text-indigo-900">
								Latihan Merangkai Kalimat
							</h2>
							<div className="mb-2 text-sm text-gray-700">
								Kata kunci yang harus ada di kalimat:
								<span className="font-semibold text-indigo-600 ml-1">
									{vocabulary.map((v) => v.word).join(", ")}
								</span>
							</div>
							<form
								onSubmit={handleSentenceSubmit}
								className="flex flex-col gap-3"
							>
								<textarea
									rows={10}
									className="bg-gray-100 border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 [&:focus]:shadow-none resize-y placeholder-gray-400 placeholder:italic"
									placeholder="Buat kalimat yang mengandung semua kata di atas"
									value={sentenceInput}
									onChange={(e) => setSentenceInput(e.target.value)}
									disabled={grammarLoading}
								/>
								<button
									type="submit"
									className="bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
									disabled={grammarLoading}
								>
									{grammarLoading ? "Memeriksa..." : "Cek Kalimat & Simpan"}
								</button>
							</form>
							{sentenceScore !== null && (
								<div className="mt-3 text-sm">
									<span className="font-medium">
										Score: {sentenceScore} / {vocabulary.length}
									</span>
									<br />
									<span className="text-gray-700">
										Kata yang ditemukan: {matchedWords.join(", ") || "-"}
									</span>
								</div>
							)}

							{grammarFeedback && (
								<div className="mt-2 text-xs text-gray-700">
									Grammar: {grammarFeedback}
								</div>
							)}

							{grammarSuggestion && (
								<div className="mt-1 text-xs text-blue-700">
									Saran kalimat benar: <strong>{grammarSuggestion}</strong>
								</div>
							)}
						</section>

						{/* Section 3: Translate Section */}
						{/* Section 1: Alat Translate Kata */}
						<section className="flex flex-col gap-6 flex-1 lg:flex-[1.1] bg-none rounded-xl w-full mx-auto">
							{/* ...isi Alat Translate Kata */}
							<section className="w-full mx-auto bg-white shadow rounded-xl p-6 mb-2">
								<h2 className="text-lg font-semibold mb-3 text-indigo-700">
									Inggris → Indonesia
								</h2>
								<form
									onSubmit={handleTranslateManual}
									className="flex flex-col gap-3"
								>
									{/* <input
								type="text"
								className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								placeholder="Masukkan kata dalam bahasa Inggris"
								value={translateInput}
								onChange={(e) => setTranslateInput(e.target.value)}
								disabled={translateLoading}
							/> */}
									<textarea
										rows={3} // Atur tinggi awalnya
										className=" bg-gray-50 w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm placeholder-gray-300 placeholder:italic"
										placeholder="Ketik kata/kalimat dalam bahasa Inggris..."
										value={translateInput}
										onChange={(e) => setTranslateInput(e.target.value)}
										disabled={translateLoading}
									/>

									<button
										type="submit"
										disabled={translateLoading}
										className={`flex items-center justify-center gap-2 py-2 rounded font-semibold 
										w-full sm:max-w-[180px] md:max-w-[220px]
										transition-all duration-500 ease-in-out 
										${
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
										<span className="font-medium text-gray-400">
											Hasil terjemahan:
										</span>
										<br />
										<span>{translateResult}</span>
									</div>
								)}
							</section>
							<TranslateIndoToEngSection />
						</section>
					</div>
				</main>

				{/* Footer */}

				{/* <footer className="bg-white border-t border-gray-200 mt-10">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
						<p className="text-center sm:text-left mb-2 sm:mb-0">
							© {new Date().getFullYear()} All rights reserved.
						</p>
						<div className="text-center sm:text-right space-y-1 sm:space-y-0">
							<p>
								Built by{" "}
								<span className="font-semibold text-indigo-600">
									Aira | Qreative-tech
								</span>
							</p>
							<p>
								Support & feedback:{" "}
								<a
									href="mailto:aira.kusumadew@gmail.com"
									className="text-gray-400 hover:underline"
								>
									aira.kusumadew@gmail.com
								</a>
							</p>
						</div>
					</div>
				</footer> */}

				{/* Komponen tooltip dipanggil secara kondisional di sini */}
				{showOnboarding && (
					<OnboardingGuide onFinish={handleOnboardingFinish} />
				)}

			
				<div className="min-h-screen w-full bg-gray-100 flex flex-col">
					{/* Sisa dari konten halaman utama Anda */}
					<main className="flex-grow container mx-auto p-4 pt-20">
						<h1 className="text-3xl font-bold text-center">
							Konten Utama Aplikasi Anda
						</h1>
						{/* Misalnya, komponen <TranslateIndoToEngSection /> akan ada di sini */}
					</main>
				</div>
				<footer className="bg-white border-t border-gray-200 mt-10">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						{/* Kontainer utama */}
						<div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
							{/* Sisi Kiri: Logo Vocantara + Nama dan built by */}
							<div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left">
								<img
									src="/vocantara_logo.png"
									alt="Vocantara Logo"
									className="w-12 h-12 sm:w-14 sm:h-14 object-contain flex-shrink-0"
								/>
								<div>
									<p className="text-xl font-bold text-indigo-600 mt-2 md:mt-0">
										Vocantara
									</p>
									<p className="text-sm text-gray-500">
										Built by{" "}
										<span className="font-semibold text-gray-800">
											Aira | Qreative-tech
										</span>
									</p>
								</div>
							</div>

							{/* Sisi Kanan: Dukungan + Credit Freepik */}
							<div className="flex flex-col items-center md:items-end gap-3 text-sm text-gray-600">
								<p>
									Support:{" "}
									<a
										href="mailto:aira.kusumadew@gmail.com"
										className="font-medium text-indigo-600 hover:underline"
									>
										aira.kusumadew@gmail.com
									</a>
								</p>
								<div className="flex items-center gap-1.5 text-gray-500">
									<span className="text-xs">Images from</span>
									<a
										href="https://www.freepik.com"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 font-medium text-gray-600 hover:underline"
									>
										<img
											src="FREEPIK_logo.png"
											alt="Freepik Logo"
											className="h-4 object-contain"
										/>
									</a>
								</div>
							</div>
						</div>

						{/* Garis pemisah dan Hak Cipta */}
						<div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
							<p>
								&copy; {new Date().getFullYear()} Vocantara. All rights
								reserved.
							</p>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
};
