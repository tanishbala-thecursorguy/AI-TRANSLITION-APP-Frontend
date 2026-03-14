import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Download, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

export function EditingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFileById } = useTranslation();
  const file = id ? getFileById(id) : undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentIssue, setCurrentIssue] = useState(0);
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    if (file?.translatedText) {
      setTranslatedText(file.translatedText);
    }
  }, [file]);

  if (!file) {
    return (
      <div className="max-w-7xl mx-auto py-16">
        <div className="text-center">
          <p className="text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
            File not found
          </p>
          <button
            onClick={() => navigate('/status')}
            className="mt-4 px-6 py-3 bg-black text-white rounded-md hover:bg-[#3A3A3A] transition-all"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Back to Status
          </button>
        </div>
      </div>
    );
  }

  const totalPages = 2;
  const issues = file.issues || [];

  const handleSuggestionClick = (suggestion: string) => {
    setTranslatedText((prev) => {
      const issueText = issues[currentIssue]?.originalLine;
      return prev.replace(issueText, suggestion);
    });
  };

  const handleFinalize = () => {
    alert('Translation finalized! PDF download will start.');
    navigate('/status');
  };

  // Split translated text into numbered lines
  const translatedLines = translatedText.split('\n').filter((line) => line.trim());

  // Find corresponding line in original for highlighting
  const getCurrentOriginalLineIndex = () => {
    if (issues.length === 0) return -1;
    const currentIssueLine = issues[currentIssue]?.originalLine;
    return file.originalText?.split('\n').findIndex((line) => line.trim() === currentIssueLine.trim()) ?? -1;
  };

  return (
    <div className="w-full bg-[rgba(220,255,253,0.1)] min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto h-full">
        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#0891b2]/20 flex flex-col"
          style={{ minHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0891b2]/10 to-[#22d3ee]/10 px-3 md:px-6 py-4 md:py-5 border-b-2 border-[#0891b2]/30 flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-xl font-semibold mb-1 truncate text-[#083344]" style={{ fontFamily: 'var(--font-sans)' }}>
                  Editing Panel
                </h2>
                <p className="text-xs md:text-sm text-[#164e63] truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                  {file.fileName}
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm border-2 border-[#0891b2] rounded-lg hover:bg-[#0891b2]/10 transition-all flex-shrink-0 text-[#0891b2] font-medium"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>
          </div>

          {/* Three Column Layout - Responsive with full height */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 flex-1 min-h-0">
            {/* Left Panel - AI Suggestions */}
            <div className="lg:col-span-3 bg-gradient-to-b from-[#ecfeff] to-[#cffafe] flex flex-col border-b lg:border-b-0 lg:border-r-2 border-[#0891b2]/20 min-h-0">
              {/* Header */}
              <div className="px-3 md:px-4 py-3 md:py-4 border-b-2 border-[#0891b2]/20 flex-shrink-0">
                <h3 className="text-sm md:text-base font-semibold text-[#083344]" style={{ fontFamily: 'var(--font-sans)' }}>
                  AI Suggestions
                </h3>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 min-h-0">
                {issues.length > 0 ? (
                  <div className="space-y-2 md:space-y-3">
                    {/* Page number */}
                    <p className="text-xs md:text-sm text-[#164e63] mb-2 md:mb-3 font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                      Page {issues[currentIssue]?.page}
                    </p>

                    {/* Original line quote */}
                    <div className="p-2 md:p-3 bg-white rounded-lg mb-2 md:mb-3 text-xs md:text-sm leading-relaxed border border-[#0891b2]/20 text-[#083344]" style={{ fontFamily: 'var(--font-serif)' }}>
                      "{issues[currentIssue]?.originalLine}"
                    </div>

                    {/* Suggestion buttons */}
                    <div className="space-y-2">
                      {issues[currentIssue]?.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left p-2 md:p-3 bg-white rounded-lg hover:bg-[#ecfeff] hover:shadow-sm hover:border-[#0891b2]/30 transition-all duration-200 text-xs md:text-sm leading-relaxed break-words border border-[#0891b2]/10 text-[#083344]"
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs md:text-sm text-[#164e63]" style={{ fontFamily: 'var(--font-sans)' }}>
                    No issues detected
                  </p>
                )}
              </div>

              {/* Footer Navigation */}
              {issues.length > 0 && (
                <div className="px-4 py-3 border-t-2 border-[#0891b2]/20 bg-white/50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCurrentIssue(Math.max(0, currentIssue - 1))}
                      disabled={currentIssue === 0}
                      className="p-2 hover:bg-[#0891b2]/10 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Previous issue"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#0891b2]" />
                    </button>
                    <span className="text-xs font-medium text-[#083344]" style={{ fontFamily: 'var(--font-sans)' }}>
                      Issue {currentIssue + 1} of {issues.length}
                    </span>
                    <button
                      onClick={() => setCurrentIssue(Math.min(issues.length - 1, currentIssue + 1))}
                      disabled={currentIssue === issues.length - 1}
                      className="p-2 hover:bg-[#0891b2]/10 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Next issue"
                    >
                      <ChevronRight className="w-4 h-4 text-[#0891b2]" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Center Panel - Translated Document */}
            <div className="lg:col-span-5 bg-white flex flex-col border-b lg:border-b-0 lg:border-r-2 border-[#0891b2]/20 min-h-0">
              {/* Header */}
              <div className="px-3 md:px-4 py-3 md:py-4 border-b-2 border-[#0891b2]/20 bg-gradient-to-r from-white to-[#ecfeff] flex-shrink-0">
                <h3 className="text-sm md:text-base font-semibold text-[#083344]" style={{ fontFamily: 'var(--font-sans)' }}>
                  Translated Document
                </h3>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 min-h-0">
                <div className="prose prose-sm max-w-none">
                  {translatedLines.map((line, idx) => {
                    const lineNumber = idx + 1;
                    const isHighlighted = issues.some(
                      (issue) => issue.originalLine.trim() === line.trim() && issues.indexOf(issue) === currentIssue
                    );

                    return (
                      <span
                        key={idx}
                        className={`inline transition-all ${
                          isHighlighted ? 'bg-[#ecfeff] px-1 py-0.5 rounded border-l-2 border-[#0891b2]' : ''
                        }`}
                        style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)', lineHeight: '1.8' }}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newLines = [...translatedLines];
                          newLines[idx] = e.currentTarget.textContent || '';
                          setTranslatedText(newLines.join('\n'));
                        }}
                      >
                        {line}{' '}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Footer Navigation */}
              <div className="px-3 md:px-4 py-2 md:py-3 border-t-2 border-[#0891b2]/20 bg-gradient-to-r from-white to-[#ecfeff] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-[#0891b2]/10 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-[#0891b2]" />
                  </button>
                  <span className="text-xs md:text-sm font-medium px-2 text-[#083344]" style={{ fontFamily: 'var(--font-sans)' }}>
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-[#0891b2]/10 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-[#0891b2]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Original */}
            <div className="lg:col-span-4 bg-gradient-to-b from-[#ecfeff] to-[#cffafe] flex flex-col border-l-2 border-[#0891b2]/20 min-h-0">
              {/* Header */}
              <div className="px-3 md:px-4 py-3 md:py-4 border-b-2 border-[#0891b2]/20 flex-shrink-0">
                <h3 className="text-sm md:text-base font-semibold text-[#083344]" style={{ fontFamily: 'var(--font-sans)' }}>
                  Original
                </h3>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 min-h-0">
                <div className="prose prose-sm max-w-none">
                  {file.originalText?.split('\n').filter((line) => line.trim()).map((line, idx) => {
                    const isHighlighted = idx === getCurrentOriginalLineIndex();

                    return (
                      <span
                        key={idx}
                        className={`inline transition-all ${
                          isHighlighted
                            ? 'bg-[#0891b2]/20 text-[#083344] px-1 py-0.5 rounded border-l-2 border-[#0891b2]'
                            : 'text-[#164e63]'
                        }`}
                        style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)', lineHeight: '1.8' }}
                      >
                        {line}{' '}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Finalize Button - Fixed at bottom */}
          <div className="px-3 md:px-6 py-3 md:py-4 bg-gradient-to-r from-[#0891b2]/10 to-[#22d3ee]/10 border-t-2 border-[#0891b2]/30 flex-shrink-0">
            <button
              onClick={handleFinalize}
              className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-[#0891b2] text-white rounded-full hover:bg-[#0e7490] transition-all duration-300 flex items-center justify-center gap-2 text-xs md:text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <Download className="w-3 h-3 md:w-4 md:h-4" />
              Finalize & Download
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}