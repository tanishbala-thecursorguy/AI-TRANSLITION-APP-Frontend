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
      }, 800);
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
      }, 1000);
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
      <div className="max-w-6xl mx-auto px-4">
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
              <p className="text-sm md:text-base text-[#6B6B6B] imperial-script-font">
                Transform your documents with AI-powered translation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main content area with sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content - upload and language forms */}
          <div className="flex-1">
            {/* Step content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-[rgba(0,0,0,0.08)] rounded-lg p-8 mb-8 bg-gradient-to-b from-white/80 to-transparent min-h-[500px]"
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
                      ? 'bg-[#2ebb77] text-white hover:bg-[#25a063] hover:-translate-y-0.5 shadow-sm hover:shadow-md'
                      : 'bg-[#E8E6E2] text-[#6B6B6B] cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {currentStep === steps.length ? 'Submit' : 'Next'}
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar - Step roadmap */}
          <div className="lg:w-80">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="sticky top-8"
            >
              <h3
                className="text-xl mb-6 font-semibold"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Translation Steps
              </h3>
              
              <div className="relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#E8E6E2]">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full bg-[#2ebb77] origin-top"
                  />
                </div>

                {/* Steps */}
                <div className="space-y-8">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;
                    const isPending = currentStep < step.number;

                    return (
                      <motion.div
                        key={step.number}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        className="relative flex items-start gap-4"
                      >
                        {/* Step number indicator */}
                        <motion.div
                          animate={{
                            scale: isActive ? 1.1 : 1,
                            backgroundColor: isActive || isCompleted ? '#2ebb77' : '#E8E6E2',
                            color: isActive || isCompleted ? '#ffffff' : '#6B6B6B',
                          }}
                          transition={{ duration: 0.3 }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 ${
                            isActive ? 'border-black' : isCompleted ? 'border-[#2ebb77]' : 'border-white'
                          }`}
                        >
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <CheckCircle className="w-6 h-6 text-white" />
                            </motion.div>
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </motion.div>

                        {/* Step details */}
                        <div className="flex-1 pt-1">
                          <h4
                            className={`font-semibold text-base mb-1 ${
                              isActive ? 'text-black' : isPending ? 'text-[#6B6B6B]' : 'text-[#2ebb77]'
                            }`}
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            Step {step.number}: {step.label}
                          </h4>
                          <p
                            className={`text-sm ${
                              isActive ? 'text-black' : isPending ? 'text-[#9CA3AF]' : 'text-[#2ebb77]'
                            }`}
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            {step.number === 1 ? 'Upload your document' : 'Select target language'}
                          </p>
                        </div>

                        {/* Status indicator */}
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                            className="absolute -right-2 top-0"
                          >
                            <div className="w-3 h-3 bg-[#2ebb77] rounded-full animate-pulse" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Completion message */}
                {currentStep === steps.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 p-4 bg-[#ecfeff] border-2 border-[#2ebb77] rounded-lg"
                  >
                    <p
                      className="text-sm font-medium text-[#2ebb77] text-center"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Ready to translate! 🎉
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
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