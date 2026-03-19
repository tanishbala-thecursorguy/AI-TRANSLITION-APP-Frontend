import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { File, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import * as Tabs from '@radix-ui/react-tabs';
import { PageLoader } from '../layout/PageLoader';

export function StatusPage() {
  const { files } = useTranslation();
  const navigate = useNavigate();

  const workingFiles = files.filter((f) => f.status === 'processing');
  const completedFiles = files.filter((f) => f.status === 'completed');

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Translation Status
              </h1>
              <p className="text-sm md:text-base text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                Monitor your translation progress
              </p>
            </div>
            <button
              onClick={() => navigate('/playground')}
              className="px-4 md:px-6 py-2 md:py-3 border border-[rgba(0,0,0,0.15)] rounded-md hover:bg-[#ecfeff] transition-all duration-300 text-sm md:text-base self-start"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Back to Playground
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs.Root defaultValue="working" className="w-full">
          <Tabs.List className="flex border-b border-[rgba(0,0,0,0.08)] mb-8">
            <Tabs.Trigger
              value="working"
              className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-black transition-all duration-200 text-[#6B6B6B] data-[state=active]:text-black"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Working ({workingFiles.length})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="completed"
              className="px-6 py-3 border-b-2 border-transparent data-[state=active]:border-black transition-all duration-200 text-[#6B6B6B] data-[state=active]:text-black"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Completed ({completedFiles.length})
            </Tabs.Trigger>
          </Tabs.List>

          {/* Working Tab Content */}
          <Tabs.Content value="working" className="space-y-4">
            {workingFiles.length === 0 ? (
              <div className="text-center py-16 text-[#6B6B6B]">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p style={{ fontFamily: 'var(--font-sans)' }}>No files currently processing</p>
              </div>
            ) : (
              workingFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#e1f3f3] border border-[rgba(0,0,0,0.08)] rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-[#ecfeff] flex items-center justify-center flex-shrink-0">
                        <File className="w-6 h-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                          {file.fileName}
                        </p>
                        <p className="text-sm text-[#6B6B6B] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                          {formatDate(file.uploadDate)} • {file.fileSize}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                            Processing
                          </span>
                          <span className="text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                            {file.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      disabled
                      className="px-4 py-2 bg-[#E8E6E2] text-[#6B6B6B] rounded-md cursor-not-allowed text-sm"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Processing
                    </button>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-[#E8E6E2] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-black"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </Tabs.Content>

          {/* Completed Tab Content */}
          <Tabs.Content value="completed" className="space-y-4">
            {completedFiles.length === 0 ? (
              <div className="text-center py-16 text-[#6B6B6B]">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p style={{ fontFamily: 'var(--font-sans)' }}>No completed translations yet</p>
              </div>
            ) : (
              completedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -2 }}
                  className="bg-[#e1f3f3] border border-[rgba(0,0,0,0.08)] rounded-lg p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-[#ecfeff] flex items-center justify-center flex-shrink-0">
                        <File className="w-6 h-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                          {file.fileName}
                        </p>
                        <p className="text-sm text-[#6B6B6B] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                          {formatDate(file.uploadDate)} • {file.fileSize}
                        </p>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600" style={{ fontFamily: 'var(--font-sans)' }}>
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/editing/${file.id}`)}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#3A3A3A] transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      Open Editing Panel
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </PageLoader>
  );
}