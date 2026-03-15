import { useState, useCallback } from 'react';
import './index.css';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import { DIMENSIONS } from './data/assessment';

type AppState = 'welcome' | 'question' | 'results';

export default function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [dimensionIndex, setDimensionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleStart = useCallback(() => {
    setAppState('question');
    setDimensionIndex(0);
    setQuestionIndex(0);
  }, []);

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = useCallback(() => {
    const dim = DIMENSIONS[dimensionIndex];
    const isLastQuestion = questionIndex === dim.questions.length - 1;
    const isLastDimension = dimensionIndex === DIMENSIONS.length - 1;

    if (isLastQuestion && isLastDimension) {
      setAppState('results');
    } else if (isLastQuestion) {
      setDimensionIndex((i) => i + 1);
      setQuestionIndex(0);
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }, [dimensionIndex, questionIndex]);

  const handlePrev = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else if (dimensionIndex > 0) {
      const prevDim = DIMENSIONS[dimensionIndex - 1];
      setDimensionIndex((i) => i - 1);
      setQuestionIndex(prevDim.questions.length - 1);
    }
  }, [dimensionIndex, questionIndex]);

  const handleReset = useCallback(() => {
    setAnswers({});
    setDimensionIndex(0);
    setQuestionIndex(0);
    setAppState('welcome');
  }, []);

  if (appState === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (appState === 'question') {
    return (
      <QuestionScreen
        dimensionIndex={dimensionIndex}
        questionIndex={questionIndex}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    );
  }

  return <ResultsScreen answers={answers} onReset={handleReset} />;
}
