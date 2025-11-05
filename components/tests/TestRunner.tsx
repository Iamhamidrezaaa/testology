'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TestRunnerProps {
  test: {
    slug: string;
    name: string;
    description: string;
    questions: Array<{
      id: string;
      question: string;
      options: Array<{
        label: string;
        value: number;
      }>;
    }>;
  };
}

export default function TestRunner({ test }: TestRunnerProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tests/${test.slug}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      
      if (res.ok) {
        const data = await res.json();
        router.push(`/results/${data.resultId}`);
      } else {
        alert('Error submitting test');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Error submitting test');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const currentQ = test.questions[currentQuestion];
  const allAnswered = test.questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{test.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{test.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {test.questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option, i) => (
            <label
              key={i}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                answers[currentQ.id] === option.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option.value}
                checked={answers[currentQ.id] === option.value}
                onChange={() => handleSelect(currentQ.id, option.value)}
                className="mr-3"
              />
              <span className="text-gray-800 dark:text-white">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ← Previous
        </button>

        {currentQuestion < test.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={answers[currentQ.id] === undefined}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {submitting ? 'Analyzing...' : '✓ Submit & Analyze'}
          </button>
        )}
      </div>

      {/* Answer Summary */}
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Answered: {Object.keys(answers).length} / {test.questions.length}
      </div>
    </div>
  );
}
















