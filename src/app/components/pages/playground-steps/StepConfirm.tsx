import { motion } from 'motion/react';
import { File, BookOpen, Globe, Coins, Type, Hash } from 'lucide-react';
import type { PlaygroundData } from '../PlaygroundPage';
import { formatCredits } from '../../../utils/fileUtils';

interface StepConfirmProps {
  data: PlaygroundData;
}

export function StepConfirm({ data }: StepConfirmProps) {
  return (
    <div>
      <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
        Confirm & Start
      </h2>
      <p className="text-[#6B6B6B] mb-8 imperial-script-font">
        Review your translation settings before starting
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* File Info */}
        <div className="p-6 bg-[#ecfeff] rounded-lg border border-[rgba(0,0,0,0.08)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <File className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                  FILE
                </span>
              </div>
              <p className="font-medium mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                {data.fileName}
              </p>
              <p className="text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                {data.fileSize} • {data.pageCount} {data.pageCount === 1 ? 'page' : 'pages'}
              </p>
              {/* Page Statistics */}
              {data.pageStats && data.pageStats.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-[#0891b2]" style={{ fontFamily: 'var(--font-sans)' }}>
                    PAGE STATISTICS:
                  </p>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {data.pageStats.map((stat) => (
                      <div
                        key={stat.pageNumber}
                        className="flex items-center justify-between px-3 py-2 bg-white rounded border border-[rgba(0,0,0,0.08)]"
                      >
                        <div className="flex items-center gap-2">
                          <Type className="w-3 h-3 text-[#0891b2]" />
                          <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                            Page {stat.pageNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                            {stat.wordCount.toLocaleString()} words
                          </span>
                          <span className="text-xs text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                            •
                          </span>
                          <span className="text-xs text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                            {stat.characterCount.toLocaleString()} chars
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Type Info */}
        <div className="p-6 bg-[#ecfeff] rounded-lg border border-[rgba(0,0,0,0.08)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                  TYPE
                </span>
              </div>
              <p className="font-medium mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                {data.type}
              </p>
              {data.type === 'Published' && (
                <div className="space-y-2">
                  {data.bookTitle && (
                    <p className="text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                      <span className="text-[#6B6B6B]">Title:</span> {data.bookTitle}
                    </p>
                  )}
                  {data.authorName && (
                    <p className="text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                      <span className="text-[#6B6B6B]">Author:</span> {data.authorName}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Language Info */}
        <div className="p-6 bg-[#ecfeff] rounded-lg border border-[rgba(0,0,0,0.08)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                  LANGUAGES
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                  {data.detectedLanguage}
                </p>
                <span className="text-[#6B6B6B]">→</span>
                <p className="font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                  {data.destinationLanguage}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Cost */}
        <div className="p-6 bg-[#2ebb77] text-white rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/70" style={{ fontFamily: 'var(--font-sans)' }}>
                  CREDIT COST
                </span>
              </div>
              <p className="text-2xl font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                {formatCredits(data.requiredCredits)} credits
              </p>
              <p className="text-sm text-white/70" style={{ fontFamily: 'var(--font-sans)' }}>
                {data.pageCount} {data.pageCount === 1 ? 'page' : 'pages'} × 1,200 credits per page
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}