import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DIMENSIONS } from '../data/assessment';
import type { Dimension, Question } from '../data/assessment';

interface Props {
  dimensionIndex: number;
  questionIndex: number;
  answers: Record<string, number>;
  onAnswer: (questionId: string, value: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

function ProgressBar({ current, total, color }: { current: number; total: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${(current / total) * 100}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function QuestionScreen({
  dimensionIndex,
  questionIndex,
  answers,
  onAnswer,
  onNext,
  onPrev,
}: Props) {
  const dimension: Dimension = DIMENSIONS[dimensionIndex];
  const question: Question = dimension.questions[questionIndex];
  const currentAnswer = answers[question.id];

  const totalQuestions = DIMENSIONS.reduce((sum, d) => sum + d.questions.length, 0);
  const answeredSoFar =
    DIMENSIONS.slice(0, dimensionIndex).reduce((sum, d) => sum + d.questions.length, 0) +
    questionIndex;

  const isFirstQuestion = dimensionIndex === 0 && questionIndex === 0;
  const isAnswered = currentAnswer !== undefined;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{dimension.icon}</span>
              <span className="font-semibold text-slate-700 text-sm">{dimension.name}</span>
            </div>
            <span className="text-sm text-slate-400">
              Question {answeredSoFar + 1} of {totalQuestions}
            </span>
          </div>
          <ProgressBar
            current={answeredSoFar + (isAnswered ? 1 : 0)}
            total={totalQuestions}
            color={dimension.color}
          />
        </div>
      </div>

      {/* Dimension pills */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 overflow-x-auto">
        <div className="max-w-3xl mx-auto flex gap-2 flex-nowrap">
          {DIMENSIONS.map((d, i) => {
            const doneCount = d.questions.filter(q => answers[q.id] !== undefined).length;
            const isActive = i === dimensionIndex;
            const isComplete = doneCount === d.questions.length;
            return (
              <div
                key={d.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-all ${
                  isActive
                    ? 'text-white shadow-sm'
                    : isComplete
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-slate-50 text-slate-400'
                }`}
                style={isActive ? { backgroundColor: d.color } : {}}
              >
                <span>{d.icon}</span>
                <span className="hidden sm:inline">{d.shortName}</span>
                {isComplete && !isActive && <span className="text-green-500">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          {/* Dimension label */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: `${dimension.color}15`, color: dimension.color }}
          >
            <span>{dimension.icon}</span>
            {dimension.name} — Question {questionIndex + 1}/{dimension.questions.length}
          </div>

          {/* Question text */}
          <h2 className="text-2xl font-semibold text-slate-800 leading-tight mb-10">
            {question.text}
          </h2>

          {/* Answer options */}
          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = currentAnswer === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onAnswer(question.id, option.value)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 group ${
                    isSelected
                      ? 'border-current bg-current/5'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  style={isSelected ? { borderColor: dimension.color, color: dimension.color } : {}}
                >
                  <div className="flex items-center gap-4">
                    {/* Score indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isSelected ? 'text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                      style={isSelected ? { backgroundColor: dimension.color } : {}}
                    >
                      {option.value}
                    </div>
                    <span
                      className={`font-medium transition-colors ${
                        isSelected ? '' : 'text-slate-700'
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={isFirstQuestion}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={onNext}
            disabled={!isAnswered}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-sm"
            style={{ backgroundColor: isAnswered ? dimension.color : '#94a3b8' }}
          >
            {dimensionIndex === DIMENSIONS.length - 1 &&
            questionIndex === dimension.questions.length - 1
              ? 'View Results'
              : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
