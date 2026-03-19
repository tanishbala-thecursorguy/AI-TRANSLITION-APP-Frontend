import { PageLoader } from '../layout/PageLoader';
import { FREE_TRIAL_CREDITS, FREE_TRIAL_MAX_PAGES, calculateRequiredCredits, formatCredits, type PageStats } from '../../utils/fileUtils';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from '../../contexts/TranslationContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { Upload, FileText, Globe, CheckCircle } from 'lucide-react';
import { StepUpload } from './playground-steps/StepUpload';
import { StepType } from './playground-steps/StepType';
import { StepLanguage } from './playground-steps/StepLanguage';
import { StepConfirm } from './playground-steps/StepConfirm';
import { LoadingStep } from './playground-steps/LoadingStep';
import { AuthModal } from '../ui/AuthModal';
import { UpgradeModal } from '../ui/UpgradeModal';
import { FreeTierLimitModal } from '../ui/FreeTierLimitModal';

const steps = [
  { number: 1, label: 'Upload', icon: Upload },
  { number: 2, label: 'Language', icon: Globe },
];

export interface PlaygroundData {
  file: File | null;
  fileName: string;
  fileSize: string;
  pageCount: number;
  requiredCredits: number;
  type: 'Published' | 'Non-Published' | null;
  bookTitle?: string;
  authorName?: string;
  contextInfo?: string;
  detectedLanguage: string;
  detectedLanguages?: string[]; // Support for multiple detected languages
  destinationLanguage: string;
  pageStats?: PageStats[];
}

export function PlaygroundPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showFreeTierModal, setShowFreeTierModal] = useState(false);
  const [freeTierModalPages, setFreeTierModalPages] = useState(0);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [data, setData] = useState<PlaygroundData>({
    file: null,
    fileName: '',
    fileSize: '',
    pageCount: 0,
    requiredCredits: 0,
    type: null,
    detectedLanguage: '',
    destinationLanguage: '',
  });
  const navigate = useNavigate();
  const { addFile } = useTranslation();
  const { isAuthenticated, credits, deductCredits } = useAuth();

  // Available credits: if authenticated use real credits, else use free trial baseline
  const availableCredits = isAuthenticated ? credits : FREE_TRIAL_CREDITS;

  // Called by StepUpload right after page detection completes
  const handleFileAnalyzed = (pageCount: number, requiredCredits: number) => {
    // Don't show modal here - wait for Next button click
  };

  // User chose to continue with the free-tier page limit
  const handleContinueWithLimit = (limitedPages: number) => {
    const limitedCredits = calculateRequiredCredits(limitedPages);
    updateData({ pageCount: limitedPages, requiredCredits: limitedCredits });
    setShowFreeTierModal(false);
    toast.info(`Continuing with ${limitedPages} pages`, {
      description: `${formatCredits(limitedCredits)} credits will be used`,
    });
    // Don't auto-advance - let user click Next button
  };

  // User chose to grow credits → billing page
  const handleGrowCredits = () => {
    setShowFreeTierModal(false);
    navigate('/billing');
  };

  // When user authenticates, execute pending action
  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    if (pendingAction && isAuthenticated) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleNextClick = () => {
    if (!isAuthenticated) {
      setPendingAction(() => handleNext);
      setShowAuthModal(true);
    } else {
      handleNext();
    }
  };

  const updateData = (updates: Partial<PlaygroundData>) => {
    console.log('[PlaygroundPage] updateData called with:', { file: !!(updates as any).file, pageCount: updates.pageCount });
    setData((prev) => {
      const newData = { ...prev, ...updates };
      console.log('[PlaygroundPage] New data state:', { file: !!newData.file, pageCount: newData.pageCount, fileName: newData.fileName });
      return newData;
    });
  };

  const handleNext = async () => {
    // STEP 6 & 7: Page Detection Alert - Check BEFORE proceeding
    if (currentStep === 1 && data.file && data.pageCount > FREE_TRIAL_MAX_PAGES) {
      setFreeTierModalPages(data.pageCount);
      setShowFreeTierModal(true);
      return; // BLOCK until user chooses
    }
    
    // Check credits
    if (currentStep === 1 && data.file && data.requiredCredits > credits) {
      setShowUpgradeModal(true);
      return;
    }

    // Proceed to next step
    if (currentStep < steps.length) {
      setIsLoading(true);
      
      if (currentStep === 1) {
        setLoadingMessage('Preparing translation settings...');
      }

      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep((prev) => prev + 1);
      }, 2500);
    } else {
      // Final step - submit for translation
      const success = deductCredits(data.requiredCredits);
      
      if (!success) {
        toast.error('Insufficient credits');
        setShowUpgradeModal(true);
        return;
      }

      setIsLoading(true);
      setLoadingMessage('Starting translation process...');
      
      setTimeout(() => {
        addFile({
          fileName: data.fileName,
          fileSize: data.fileSize,
          type: data.type!,
          bookTitle: data.bookTitle,
          authorName: data.authorName,
          contextInfo: data.contextInfo,
          detectedLanguage: data.detectedLanguage,
          destinationLanguage: data.destinationLanguage,
        });
        navigate('/completed');
      }, 3000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!data.file;
      case 2:
        return !!data.destinationLanguage;
      default:
        return false;
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className="text-2xl md:text-4xl mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Playground
              </h1>
              <p className="text-sm md:text-base text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                Transform your documents with AI-powered translation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-[#0891b2] text-white'
                          : isCompleted
                          ? 'bg-[#0891b2] text-white'
                          : 'bg-[#E8E6E2] text-[#6B6B6B]'
                      }`}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs md:text-sm ${
                        isActive || isCompleted ? 'text-black' : 'text-[#6B6B6B]'
                      }`}
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-[#E8E6E2] mx-2 md:mx-4 relative">
                      <div
                        className={`absolute inset-0 bg-[#0891b2] transition-all duration-300 ${
                          isCompleted ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Step content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-[#e1f3f3] border border-[rgba(0,0,0,0.08)] rounded-lg p-8 mb-8"
        >
          {isLoading ? (
            <LoadingStep message={loadingMessage} />
          ) : (
            <>
              {currentStep === 1 && (
                <StepUpload
                  data={data}
                  updateData={updateData}
                  onFileAnalyzed={handleFileAnalyzed}
                />
              )}
              {currentStep === 2 && <StepLanguage data={data} updateData={updateData} />}
            </>
          )}
        </motion.div>

        {/* Navigation buttons */}
        {!isLoading && (
          <div className="flex gap-4 justify-end">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-[rgba(0,0,0,0.15)] rounded-md hover:bg-[rgba(0,0,0,0.02)] transition-all duration-300"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNextClick}
              disabled={!canProceed()}
              className={`px-6 py-3 rounded-md transition-all duration-300 ${
                canProceed()
                  ? 'bg-[#0891b2] text-white hover:bg-[#0e7490] hover:-translate-y-0.5 shadow-sm hover:shadow-md'
                  : 'bg-[#E8E6E2] text-[#6B6B6B] cursor-not-allowed'
              }`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {currentStep === steps.length ? 'Submit' : 'Next'}
            </button>
          </div>
        )}
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
      />
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
      <FreeTierLimitModal
        isOpen={showFreeTierModal}
        onClose={() => setShowFreeTierModal(false)}
        documentPages={freeTierModalPages}
        availableCredits={availableCredits}
        onContinueWithLimit={handleContinueWithLimit}
        onGrowCredits={handleGrowCredits}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}