'use client';

interface OnboardingTitleProps {
  title: string;
}

export default function OnboardingTitle({ title }: OnboardingTitleProps) {
  return (
    <div className="relative">
      <h2 className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-800 whitespace-nowrap">
        {title}
      </h2>
      <div className="h-4"></div>
    </div>
  );
}
