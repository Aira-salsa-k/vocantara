import React, { useState } from "react";
import { X, ArrowRight } from "lucide-react";

// Definisikan tipe untuk setiap langkah
interface OnboardingStep {
	title: string;
	content: string;
	imageUrl?: string; // URL untuk GIF atau gambar
}

// Konten untuk setiap langkah onboarding
const steps: OnboardingStep[] = [
	{
		title: "Selamat Datang di Vocantara!",
		content:
			"Aplikasi ini dirancang untuk membantu Anda mempelajari kosa kata Bahasa Inggris dengan cara yang interaktif dan menyenangkan. Mari kita mulai!",
		imageUrl: "https://placehold.co/400x200/6366f1/ffffff?text=Selamat+Datang",
	},
	{
		title: "Cara Menggunakan Penerjemah",
		content:
			"Cukup ketik kalimat dalam Bahasa Indonesia di kolom yang tersedia, dan kami akan langsung menerjemahkannya ke dalam Bahasa Inggris untuk Anda.",
		imageUrl: "https://placehold.co/400x200/34d399/ffffff?text=Ketik+Kalimatmu",
	},
	{
		title: "Mulai Latihan Anda",
		content:
			"Gunakan fitur ini setiap hari untuk melatih kemampuan Anda. Semakin sering berlatih, semakin cepat Anda mahir. Selamat belajar!",
		imageUrl: "https://placehold.co/400x200/f59e0b/ffffff?text=Selamat+Belajar",
	},
];

// Definisikan props untuk komponen
interface OnboardingGuideProps {
	onFinish: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onFinish }) => {
	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			// Jika sudah di langkah terakhir, panggil onFinish
			onFinish();
		}
	};

	const currentStepData = steps[currentStep];

	return (
		// Backdrop
		<div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 font-[Inter,sans-serif]">
			{/* Konten Modal */}
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up">
				{/* Tombol Tutup */}
				<button
					onClick={onFinish}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
					aria-label="Tutup panduan"
				>
					<X size={24} />
				</button>

				{/* Gambar/GIF */}
				{currentStepData.imageUrl && (
					<div className="mb-4 rounded-lg overflow-hidden">
						<img
							src={currentStepData.imageUrl}
							alt={currentStepData.title}
							className="w-full h-auto object-cover"
						/>
					</div>
				)}

				{/* Judul dan Konten */}
				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					{currentStepData.title}
				</h2>
				<p className="text-gray-600 mb-6">{currentStepData.content}</p>

				{/* Navigasi */}
				<div className="flex justify-between items-center">
					{/* Indikator Step */}
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

					{/* Tombol Next/Finish */}
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

export default OnboardingGuide;
