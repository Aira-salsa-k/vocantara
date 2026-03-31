import React, { useState, useRef, useEffect } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

// Definisikan tipe untuk setiap langkah
interface OnboardingStep {
  title: string;
  content: string;
  imageUrl?: string; // URL untuk GIF, Gambar, atau Video (.mov, .mp4)
}

// Konten untuk setiap langkah onboarding
const steps: OnboardingStep[] = [
  {
    title: "Selamat Datang di Vocantara!",
    content:
      'Aplikasi ini dirancang untuk membantu Anda mempelajari kosa kata Bahasa Inggris.\n\nKlik tombol "Generate Vocabulary" untuk mendapatkan kosa kata baru.',
    imageUrl: "/onboarding/ob-1.mov",
  },
  {
    title: "Latihan Menulis Ulang\n\nKosa Kata",
    content:
      "Dari Kosa Kata yang di dapat, latih ingatan anda dengan menulis ulang kosa kata tersebut.",
    imageUrl: "/onboarding/ob-2.mov",
  },
  {
    title: "Latihan Merangkai Kalimat",
    content:
      "Dari Semua Kosa Kata yang di dapat, pertajam pemahaman anda dengan merangkai kosa kata tersebut menjadi kalimat.",
    imageUrl: "/onboarding/ob-3.mov",
  },
  {
    title: "Fitur Penerjemah Kata",
    content:
      "Gunakan fitur penerjemah untuk membantu Anda menerjemahkan kata atau kalimat yang belum di ketahui.",
    imageUrl: "/onboarding/ob-4.mov",
  },
  {
    title: "Mulai Latihan Anda",
    content:
      "Gunakan Vocantara setiap hari untuk melatih kemampuan Anda. Semakin sering berlatih, semakin cepat Anda mahir. Selamat belajar!",
    imageUrl: "/b-vocantara.jpg",
  },
];

// Definisikan props untuk komponen
interface OnboardingGuideProps {
  onFinish: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Gunakan useEffect untuk handle play/pause secara manual
  // karena atribut autoPlay dinamis tidak selalu memicu play()
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentStep) {
          // Play video aktif dari awal
          video.currentTime = 0;
          video.play().catch((err) => console.log("Autoplay prevented:", err));
        } else {
          // Pause sisanya untuk performa
          video.pause();
        }
      }
    });
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-center items-center p-5 sm:p-4">
      {/* Konten Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-4 sm:p-6 relative animate-fade-in-up flex flex-col">
        {/* Tombol Tutup */}
        <button
          onClick={onFinish}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Tutup panduan"
        >
          <X size={24} />
        </button>

        {/* Header / Step Tracker */}
        <div className="flex justify-start items-center space-x-2 mb-6 mt-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-indigo-600"
                  : "w-2 bg-indigo-100"
              }`}
            ></div>
          ))}
        </div>

        {/* Media (Gambar/GIF/Video) - Diubah menjadi persistent rendering agar smooth dan instan */}
        <div className="mb-6 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center min-h-[200px] shadow-inner relative">
          {steps.map((step, index) => {
            if (!step.imageUrl) return null;

            const isActive = index === currentStep;
            const isVideo =
              step.imageUrl.toLowerCase().endsWith(".mov") ||
              step.imageUrl.toLowerCase().endsWith(".mp4");

            return (
              <div
                key={index}
                className={`${isActive ? "block opacity-100" : "hidden opacity-0"} w-full transition-opacity duration-300`}
              >
                {isVideo ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={step.imageUrl}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-auto object-cover max-h-[250px]"
                  />
                ) : (
                  <img
                    src={step.imageUrl}
                    alt={step.title}
                    className="w-full h-auto object-cover max-h-[250px]"
                  />
                )}
              </div>
            );
          })}
          {!steps[currentStep]?.imageUrl && (
            <div className="text-gray-400 flex items-center justify-center">
              No Media
            </div>
          )}
        </div>

        {/* Judul dan Konten */}
        <div className="flex-1 min-h-[120px] px-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {currentStepData.content}
          </p>
        </div>

        {/* Navigasi */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              currentStep === 0
                ? "text-transparent bg-transparent cursor-default select-none"
                : "text-gray-600 hover:bg-gray-100 active:scale-95"
            }`}
          >
            {currentStep > 0 && (
              <>
                <ArrowLeft size={18} />
                Sebelumnya
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="
			bg-indigo-600 text-white font-semibold 
			px-4 py-2           // ukuran default (mobile)
			sm:px-6 sm:py-2.5   // ukuran untuk layar >= 640px
			rounded-xl 
			flex items-center gap-1 sm:gap-2  // gap lebih kecil di mobile
			hover:bg-indigo-700 
			transition-all 
			transform active:scale-95 
		"
          >
            {currentStep < steps.length - 1 ? "Lanjut" : "Mulai Belajar"}
            {currentStep < steps.length - 1 && (
              <ArrowRight size={currentStep < steps.length - 1 ? 16 : 18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
