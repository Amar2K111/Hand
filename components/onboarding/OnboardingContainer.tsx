'use client';

import { Card } from '@/components/ui/Card';

interface OnboardingContainerProps {
  children: React.ReactNode;
}

export default function OnboardingContainer({ children }: OnboardingContainerProps) {
  return (
    <Card className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 max-w-4xl mx-auto">
      {children}
    </Card>
  );
}
