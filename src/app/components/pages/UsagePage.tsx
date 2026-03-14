import { motion } from 'motion/react';
import { File, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import { useNavigate } from 'react-router';
import { PageLoader } from '../layout/PageLoader';

export function UsagePage() {
  const { files } = useTranslation();
  const navigate = useNavigate();

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
            Usage
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
            Track all your translation activity
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-[rgba(0,0,0,0.08)] rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[rgba(0,0,0,0.08)]">
                  <th
                    className="text-left px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#6B6B6B]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Date
                  </th>
                  <th
                    className="text-left px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#6B6B6B]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Document Name
                  </th>
                  <th
                    className="text-left px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#6B6B6B]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Size
                  </th>
                  <th
                    className="text-left px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#6B6B6B]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Status
                  </th>
                  <th
                    className="text-left px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#6B6B6B]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Access
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 md:px-6 py-12 md:py-16 text-center text-[#6B6B6B]">
                      <File className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm md:text-base" style={{ fontFamily: 'var(--font-sans)' }}>No translations yet</p>
                    </td>
                  </tr>
                ) : (
                  files.map((file, index) => (
                    <motion.tr
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-[rgba(0,0,0,0.08)] last:border-b-0 hover:bg-[#ecfeff] transition-colors"
                    >
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
                        {formatDate(file.uploadDate)}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm truncate max-w-[150px] md:max-w-none" style={{ fontFamily: 'var(--font-sans)' }}>
                        {file.fileName}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[#6B6B6B] whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
                        {file.fileSize}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        {file.status === 'completed' ? (
                          <span className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-green-600" style={{ fontFamily: 'var(--font-sans)' }}>
                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Completed</span>
                            <span className="sm:hidden">Done</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            {file.progress}%
                          </span>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        {file.status === 'completed' ? (
                          <button
                            onClick={() => navigate(`/editing/${file.id}`)}
                            className="text-xs md:text-sm text-black hover:underline flex items-center gap-1"
                            style={{ fontFamily: 'var(--font-sans)' }}
                          >
                            View
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-xs md:text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                            —
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </PageLoader>
  );
}