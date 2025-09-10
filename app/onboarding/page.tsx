'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import OnboardingBackButton from '@/components/onboarding/OnboardingBackButton';
import OnboardingTitle from '@/components/onboarding/OnboardingTitle';
import OnboardingQuestions from '@/components/onboarding/OnboardingQuestions';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProfileIcon } from '@/components/layout/ProfileIcon';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface OnboardingData {
  dreamInterest: string;
  obstacles: string[];
  validation: string;
  opportunity: string;
  urgency: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    dreamInterest: '',
    obstacles: [],
    validation: '',
    opportunity: '',
    urgency: ''
  });
  const { user, isNewUser, markOnboardingCompleted, saveOnboardingProgress, onboardingData: cloudOnboardingData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !isNewUser) {
      router.push('/dashboard');
    }
  }, [user, isNewUser, router]);

  // Restore onboarding progress from cloud database
  useEffect(() => {
    if (cloudOnboardingData) {
      try {
        setOnboardingData(cloudOnboardingData);
        // Determine current step based on answered questions
        const step = getCurrentStepFromData(cloudOnboardingData);
        setCurrentStep(step);
      } catch (error) {
        console.error('Error restoring onboarding data:', error);
      }
    }
  }, [cloudOnboardingData]);

  // Helper function to determine current step based on answered questions
  const getCurrentStepFromData = (data: OnboardingData): number => {
    if (!data.dreamInterest) return 1;
    if (data.obstacles.length === 0) return 2;
    if (!data.validation) return 3;
    if (!data.opportunity) return 4;
    if (!data.urgency) return 5;
    return 5; // All questions answered, ready to submit
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Onboarding data:', onboardingData);
      // Save final onboarding data to cloud
      await saveOnboardingProgress(onboardingData);
      // Mark onboarding as completed
      await markOnboardingCompleted();
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Error completing onboarding. Please try again.');
    }
  };

  // Calculate completion percentage based on current step and answered questions
  const getCompletionPercentage = () => {
    // For steps 1-4, show progress based on current step
    // For step 5, show progress based on actual answers
    if (currentStep < 5) {
      return Math.round(((currentStep - 1) / 5) * 100);
    } else {
      let answeredCount = 0;
      if (onboardingData.dreamInterest) answeredCount++;
      if (onboardingData.obstacles.length > 0) answeredCount++;
      if (onboardingData.validation) answeredCount++;
      if (onboardingData.opportunity) answeredCount++;
      if (onboardingData.urgency) answeredCount++;
      return Math.round((answeredCount / 5) * 100);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <OnboardingTitle title="Have you ever looked at hand models in ads and thought 'I could do that'?" />
            <OnboardingQuestions 
              questions={[
                "Yes, all the time!",
                "Sometimes, I wonder...",
                "Not really, but I'm curious"
              ]}
              onSelect={async (dreamInterest) => {
                const newData = { ...onboardingData, dreamInterest };
                setOnboardingData(newData);
                await saveOnboardingProgress(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="What's stopping you from pursuing hand modeling?" />
            <OnboardingQuestions 
              questions={[
                "Don't know if my hands are good enough",
                "No idea how to get started",
                "Worried about rejection",
                "Don't know where to find opportunities"
              ]}
              onSelect={async (obstacle) => {
                const newData = { 
                  ...onboardingData, 
                  obstacles: [...onboardingData.obstacles, obstacle] 
                };
                setOnboardingData(newData);
                await saveOnboardingProgress(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="Do you ever wonder if your hands are 'model material'?" />
            <OnboardingQuestions 
              questions={[
                "Yes, I think about it constantly",
                "Sometimes, when I see ads",
                "Not really, but I'm open to finding out"
              ]}
              onSelect={async (validation) => {
                const newData = { ...onboardingData, validation };
                setOnboardingData(newData);
                await saveOnboardingProgress(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="What would hand modeling mean for your life?" />
            <OnboardingQuestions 
              questions={[
                "Extra income",
                "Creative fulfillment",
                "Career change",
                "Personal confidence boost"
              ]}
              onSelect={async (opportunity) => {
                const newData = { ...onboardingData, opportunity };
                setOnboardingData(newData);
                await saveOnboardingProgress(newData);
                handleNext();
              }}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <OnboardingBackButton onClick={handleBack} />
            <OnboardingTitle title="How long have you been thinking about this?" />
            <OnboardingQuestions 
              questions={[
                "Years - I've been dreaming about this forever",
                "Months - it's been on my mind",
                "Recently - but I'm ready to find out",
                "I have never thought about this"
              ]}
              onSelect={async (urgency) => {
                const newData = { ...onboardingData, urgency };
                setOnboardingData(newData);
                await saveOnboardingProgress(newData);
                handleSubmit();
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        {/* Profile Icon - Floating in top right */}
        <ProfileIcon />
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Hand Modeling Potential
            </h1>
            <p className="text-xl text-gray-600">
              Let's find out if you have what it takes to become a hand model
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
              <span className="text-sm text-gray-600">{getCompletionPercentage()}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>

          <OnboardingContainer>
            {renderStep()}
          </OnboardingContainer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
