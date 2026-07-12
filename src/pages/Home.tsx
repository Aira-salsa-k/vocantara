import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { translateWordService } from "../services/translate";
import OnboardingGuide from "../components/OnboardingGuide";
import { HomeHeader } from "../components/home/HomeHeader";
import { HomeActions } from "../components/home/HomeActions";
import { HomeProgressBar } from "../components/home/HomeProgressBar";
import { VocabularyList } from "../components/home/VocabularyList";
import { SentencePracticeSection } from "../components/home/SentencePracticeSection";
import { TranslatorSection } from "../components/home/TranslatorSection";
import { HomeFooter } from "../components/home/HomeFooter";

import { useVocabulary } from "../hooks/useVocabulary";
import { useProgress } from "../hooks/useProgress";
import { useSentencePractice } from "../hooks/useSentencePractice";

export const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const {
    vocabulary,
    loading,
    existingWords,
    handleGenerateVocabulary,
    handleClearVocabulary,
    handleDeleteSingleVocabulary,
  } = useVocabulary(user);

  const {
    progressWords,
    progressLevel,
    progressPercent,
    levelThresholds,
  } = useProgress(user);

  const {
    sentenceInput,
    setSentenceInput,
    grammarSuggestion,
    grammarFeedback,
    grammarLoading,
    sentenceScore,
    matchedWords,
    handleSentenceSubmit,
  } = useSentencePractice(user, vocabulary);

  const [translations, setTranslations] = useState<{
    [id: string]: { word?: string; example?: string };
  }>({});
  const [translating, setTranslating] = useState<{
    [id: string]: { word?: boolean; example?: boolean };
  }>({});

  const translateVocabPart = async (id: string, text: string, type: "word" | "example") => {
    setTranslating((prev) => ({ ...prev, [id]: { ...prev[id], [type]: true } }));
    try {
      const translated = await translateWordService(text);
      setTranslations((prev) => ({ ...prev, [id]: { ...prev[id], [type]: translated } }));
    } catch {
      setTranslations((prev) => ({ ...prev, [id]: { ...prev[id], [type]: "Terjemahan gagal" } }));
    } finally {
      setTranslating((prev) => ({ ...prev, [id]: { ...prev[id], [type]: false } }));
    }
  };

  const [practiceInputs, setPracticeInputs] = useState<{ [id: string]: string }>({});
  const handlePracticeInputChange = (id: string, value: string) => {
    setPracticeInputs((prev) => ({ ...prev, [id]: value }));
  };

  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const VISIT_COUNT_KEY = "vocantaraVisitCount";
    const MAX_VISITS_FOR_ONBOARDING = 2;
    const visitCountStr = localStorage.getItem(VISIT_COUNT_KEY);
    const visitCount = visitCountStr ? parseInt(visitCountStr, 10) : 0;
    if (visitCount < MAX_VISITS_FOR_ONBOARDING) {
      setShowOnboarding(true);
      localStorage.setItem(VISIT_COUNT_KEY, (visitCount + 1).toString());
    }
  }, []);

  const handleOnboardingFinish = () => {
    setShowOnboarding(false);
    localStorage.setItem("vocantaraVisitCount", "10");
  };

  return (
    <>
      <HomeHeader onHelpClick={() => setShowOnboarding(true)} />

      <div className="min-h-screen w-full bg-gray-100 flex flex-col">
        <HomeActions
          loading={loading}
          onGenerate={handleGenerateVocabulary}
          onClear={handleClearVocabulary}
        />

        <HomeProgressBar
          progressWords={progressWords}
          progressLevel={progressLevel}
          progressPercent={progressPercent}
          levelThresholds={levelThresholds}
        />

        <VocabularyList
          loading={loading}
          vocabulary={vocabulary}
          onDeleteSingle={handleDeleteSingleVocabulary}
          onTranslatePart={translateVocabPart}
          translating={translating}
          translations={translations}
          practiceInputs={practiceInputs}
          onPracticeInputChange={handlePracticeInputChange}
        />

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-8 mx-auto lg:mx-27 lg:my-20 mt-14">
          <SentencePracticeSection
            vocabulary={vocabulary}
            sentenceInput={sentenceInput}
            setSentenceInput={setSentenceInput}
            grammarLoading={grammarLoading}
            sentenceScore={sentenceScore}
            matchedWords={matchedWords}
            grammarFeedback={grammarFeedback}
            grammarSuggestion={grammarSuggestion}
            onSubmit={handleSentenceSubmit}
          />

          <TranslatorSection />
        </div>

        {showOnboarding && <OnboardingGuide onFinish={handleOnboardingFinish} />}

        <HomeFooter />
      </div>
    </>
  );
};
