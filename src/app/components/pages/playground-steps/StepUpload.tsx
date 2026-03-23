import { FileUpload } from '../../ui/file-upload';
import { detectPageCount, calculateRequiredCredits, formatCredits, FREE_TRIAL_MAX_PAGES, detectPageStats } from '../../../utils/fileUtils';
import type { PlaygroundData } from '../PlaygroundPage';
import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { FileText, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { AuthModal } from '../../ui/AuthModal';
import { WelcomeModal } from '../../ui/WelcomeModal';
import { motion } from 'motion/react';

interface StepUploadProps {
  data: PlaygroundData;
  updateData: (updates: Partial<PlaygroundData>) => void;
  onFileAnalyzed?: (pageCount: number, requiredCredits: number) => void;
}

export function StepUpload({ data, updateData, onFileAnalyzed }: StepUploadProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);

  const handleUploadClick = (e: MouseEvent<HTMLDivElement>) => {
    // Intercept click - show auth modal if not authenticated
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // If authenticated, let the FileUpload component handle it normally
  };

  const handleFileUpload = async (files: File[]) => {
    console.log('[StepUpload] handleFileUpload called, files:', files.length);
    
    // Check authentication FIRST
    if (!isAuthenticated) {
      setPendingFiles(files);
      setShowAuthModal(true);
      return;
    }

    const file = files[0];
    if (file) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log('[StepUpload] Processing file:', file.name);
      
      setIsDetecting(true);
      
      try {
        const pageCount = await detectPageCount(file);
        const requiredCredits = calculateRequiredCredits(pageCount);
        console.log('[StepUpload] Page detection - pages:', pageCount, 'credits:', requiredCredits);
        
        // Read file content to analyze character/word count
        let fileContent: string | undefined = undefined;
        if (file.type === 'text/plain') {
          fileContent = await file.text();
        }
        
        // Get page statistics
        const pageStats = await detectPageStats(file, pageCount, fileContent);
        
        updateData({
          file,
          fileName: file.name,
          fileSize: `${sizeInMB} MB`,
          pageCount,
          requiredCredits,
          pageStats,
        });
        console.log('[StepUpload] updateData called with pageStats:', pageStats);

        toast.success('File analyzed successfully', {
          description: `${pageCount} ${pageCount === 1 ? 'page' : 'pages'} detected`,
        });

        onFileAnalyzed?.(pageCount, requiredCredits);
      } catch (error) {
        console.error('Error during page detection:', error);
        toast.error('Failed to analyze file');
      } finally {
        setIsDetecting(false);
      }
    }
  };

  // Handle authentication completion - process pending files
  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  // Process pending files after auth completes
  useEffect(() => {
    if (isAuthenticated && pendingFiles) {
      console.log('[StepUpload] Processing pending files after auth');
      handleFileUpload(pendingFiles);
      setPendingFiles(null);
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
        Upload Document
      </h2>
      <p className="text-[#6B6B6B] mb-8 imperial-script-font">
        Upload your document to begin the translation process
      </p>

      {/* Free trial info banner */}
      {!isAuthenticated && !data.file && (
        <div className="mb-6 p-4 bg-[#cccccc] border border-[#999999] rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-[#333333] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#333333] font-medium mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
              Free Trial: {FREE_TRIAL_MAX_PAGES} Pages
            </p>
            <p className="text-sm text-[#444444]" style={{ fontFamily: 'var(--font-sans)' }}>
              You can translate up to {FREE_TRIAL_MAX_PAGES} pages with the free trial. If your document has more pages, you'll be prompted to upgrade or continue with {FREE_TRIAL_MAX_PAGES} pages.
            </p>
          </div>
        </div>
      )}

      {/* Upload box - always visible and normal looking */}
      <div className="relative">
        {/* Actual upload component */}
        <div 
          className="w-full max-w-4xl mx-auto min-h-96 border border-dashed border-neutral-200 rounded-lg bg-gradient-to-b from-white/80 to-transparent"
        >
          <FileUpload 
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
          />
        </div>
        
        {/* Invisible overlay when not authenticated - catches clicks */}
        {!isAuthenticated && (
          <div 
            className="absolute inset-0 z-20 cursor-pointer"
            onClick={handleUploadClick}
          />
        )}
      </div>

      <p className="text-sm text-center text-[#6B6B6B] mt-4" style={{ fontFamily: 'var(--font-sans)' }}>
        Supports PDF, DOCX, TXT, PNG, JPG
      </p>

      {/* File info display */}
      {data.file && (
        <div className="mt-8">
          {/* File details card */}
          <div className="p-4 rounded-lg border border-[rgba(0,0,0,0.08)] mb-8 bg-gradient-to-b from-white/80 to-transparent">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                  {data.fileName}
                </p>
                <p className="text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                  Size: {data.fileSize}
                </p>
                
                {isDetecting ? (
                  <div className="flex items-center gap-2 mt-2 text-sm text-[#6B6B6B]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span style={{ fontFamily: 'var(--font-sans)' }}>Detecting pages...</span>
                  </div>
                ) : (
                  <p className="text-sm text-[#3A3A3A] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>
                    Pages detected: <span className="font-medium">{data.pageCount}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Context Information Textbox */}
          {!isDetecting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-6 border-t border-[rgba(0,0,0,0.08)]"
            >
              <label
                htmlFor="contextInfo"
                className="block mb-2 text-sm font-medium"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Contextual Information
              </label>
              <textarea
                id="contextInfo"
                value={data.contextInfo || ''}
                onChange={(e) => updateData({ contextInfo: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none bg-gradient-to-b from-white/80 to-transparent"
                style={{ fontFamily: 'var(--font-sans)' }}
                placeholder="Provide any relevant context about your document, such as subject matter, specific terminology, writing style, or important notes..."
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
      />
      
      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => {
          setShowWelcomeModal(false);
          setIsNewUser(false);
        }}
        isNewUser={isNewUser}
      />
    </div>
  );
}