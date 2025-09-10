'use client';

import { Button } from '@/components/ui/Button';

interface OnboardingBackButtonProps {
  onClick: () => void;
}

export default function OnboardingBackButton({ onClick }: OnboardingBackButtonProps) {
  return (
    <div className="relative">
      <Button 
        onClick={onClick} 
        className="absolute -top-16 -left-8 bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 px-4 py-2 text-sm focus:outline-none focus:ring-0 focus:border-gray-300 shadow-sm"
      >
        Back
      </Button>
    </div>
  );
}
