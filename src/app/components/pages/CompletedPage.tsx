import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, ExternalLink, Download } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { useNavigate } from 'react-router';
import { PageLoader } from '../layout/PageLoader';

export function CompletedPage() {
  const { files } = useTranslation();
  const navigate = useNavigate();
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

  // Show both processing and completed files
  const processingFiles = files.filter((file) => file.status === 'processing');
  const completedFiles = files.filter((file) => file.status === 'completed');

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewFile = (fileId: string) => {
    setLoadingFileId(fileId);
    setTimeout(() => {
      navigate(`/editing/${fileId}`);
    }, 2500);
  };

  return (
    <PageLoader loadingDuration={2500}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-2xl md:text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Completed Translations
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B] imperial-script-font">
            View and manage your translated documents
          </p>
        </motion.div>

        {/* Processing files section */}
        {processingFiles.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                Processing
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              {processingFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-[rgba(0,0,0,0.08)] rounded-lg p-6 shadow-sm bg-gradient-to-b from-white/80 to-transparent"
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-8 h-8 text-black" />
                    <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200 flex items-center gap-1" style={{ fontFamily: 'var(--font-sans)' }}>
                      <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </span>
                  </div>

                  <h3 className="text-lg mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-serif)' }}>
                    {file.fileName}
                  </h3>

                  <div className="space-y-2 mb-4 text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                    <p>
                      <span className="font-medium text-black">Languages:</span> {file.detectedLanguage} → {file.destinationLanguage}
                    </p>
                    <p>
                      <span className="font-medium text-black">Size:</span> {file.fileSize}
                    </p>
                    <p>
                      <span className="font-medium text-black">Started:</span> {formatDate(file.uploadDate)}
                    </p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Grid of completed files */}
        {completedFiles.length === 0 && processingFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-[rgba(0,0,0,0.08)] rounded-lg p-12 md:p-16 text-center bg-gradient-to-b from-white/80 to-transparent"
          >
            <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-[#6B6B6B] opacity-50" />
            <p className="text-sm md:text-base text-[#6B6B6B] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
              No completed translations yet
            </p>
            <p className="text-xs md:text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
              Complete a translation to see it here
            </p>
          </motion.div>
        ) : (
          <>
            {/* Completed files section header */}
            {processingFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                  Completed
                </h2>
              </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {completedFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-[rgba(0,0,0,0.08)] rounded-lg p-6 hover:border-black hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-b from-white/80 to-transparent"
              >
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-8 h-8 text-black" />
                  <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200" style={{ fontFamily: 'var(--font-sans)' }}>
                    Completed
                  </span>
                </div>

                <h3 className="text-lg mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  {file.fileName}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                  <p>
                    <span className="font-medium text-black">Languages:</span> {file.detectedLanguage} → {file.destinationLanguage}
                  </p>
                  <p>
                    <span className="font-medium text-black">Size:</span> {file.fileSize}
                  </p>
                  <p>
                    <span className="font-medium text-black">Completed:</span> {formatDate(file.uploadDate)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewFile(file.id)}
                    className="flex-1 px-4 py-2 bg-[#2ebb77] text-white rounded-md hover:bg-[#25a063] transition-all text-sm flex items-center justify-center gap-2"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => alert('Download started!')}
                    className="px-4 py-2 border border-[rgba(0,0,0,0.15)] rounded-md hover:bg-[#ecfeff] transition-all"
                    aria-label="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          </>
        )}
      </div>
    </PageLoader>
  );
}
