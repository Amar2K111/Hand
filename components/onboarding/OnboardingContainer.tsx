'use client';

import { Card } from '@/components/ui/Card';

interface OnboardingContainerProps {
  children: React.ReactNode;
}

export default function OnboardingContainer({ children }: OnboardingContainerProps) {
  return (
    <Card className="p-16">
      {children}
    </Card>
  );
}
