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
        className="absolute -top-10 sm:-top-12 -left-2 sm:-left-4 bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 px-2 sm:px-3 py-1 text-xs focus:outline-none focus:ring-0 focus:border-gray-300 shadow-sm min-h-[28px] sm:min-h-[32px]"
      >
        Back
      </Button>
    </div>
  );
}
