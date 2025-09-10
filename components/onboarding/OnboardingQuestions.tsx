'use client';

import { Button } from '@/components/ui/Button';

interface OnboardingQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export default function OnboardingQuestions({ questions, onSelect }: OnboardingQuestionsProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Button
          key={question}
          onClick={() => onSelect(question)}
          className="w-full py-4 text-lg bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-200"
        >
          {question}
        </Button>
      ))}
    </div>
  );
}
