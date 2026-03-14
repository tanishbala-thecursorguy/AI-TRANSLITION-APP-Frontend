import { motion } from 'motion/react';
import { BookOpen, FileText } from 'lucide-react';
import type { PlaygroundData } from '../PlaygroundPage';

interface StepTypeProps {
  data: PlaygroundData;
  updateData: (updates: Partial<PlaygroundData>) => void;
}

export function StepType({ data, updateData }: StepTypeProps) {
  const handleTypeSelect = (type: 'Published' | 'Non-Published') => {
    updateData({ type });
  };

  return (
    <div>
      <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
        Document Type
      </h2>
      <p className="text-[#6B6B6B] mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
        Select the type of document you're translating
      </p>

      {/* Type selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.button
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleTypeSelect('Published')}
          className={`p-8 border-2 rounded-lg text-left transition-all duration-300 ${
            data.type === 'Published'
              ? 'border-black bg-[#ecfeff]'
              : 'border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.2)]'
          }`}
        >
          <BookOpen className="w-8 h-8 mb-4" />
          <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Published
          </h3>
          <p className="text-[#6B6B6B] text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
            For books that are already published with known author and title
          </p>
        </motion.button>

        <motion.button
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleTypeSelect('Non-Published')}
          className={`p-8 border-2 rounded-lg text-left transition-all duration-300 ${
            data.type === 'Non-Published'
              ? 'border-black bg-[#ecfeff]'
              : 'border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.2)]'
          }`}
        >
          <FileText className="w-8 h-8 mb-4" />
          <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Non-Published
          </h3>
          <p className="text-[#6B6B6B] text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
            For manuscripts, drafts, or personal documents
          </p>
        </motion.button>
      </div>

      {/* Conditional fields based on type */}
      {data.type === 'Published' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 pt-6 border-t border-[rgba(0,0,0,0.08)]"
        >
          <div>
            <label
              htmlFor="bookTitle"
              className="block mb-2 text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Book Title
            </label>
            <input
              id="bookTitle"
              type="text"
              value={data.bookTitle || ''}
              onChange={(e) => updateData({ bookTitle: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all"
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label
              htmlFor="authorName"
              className="block mb-2 text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Author Name
            </label>
            <input
              id="authorName"
              type="text"
              value={data.authorName || ''}
              onChange={(e) => updateData({ authorName: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all"
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label
              htmlFor="contextInfo"
              className="block mb-2 text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Contextual Information
            </label>
            <textarea
              id="contextInfo"
              value={data.contextInfo || ''}
              onChange={(e) => updateData({ contextInfo: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none"
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="Provide any relevant context about the book..."
            />
          </div>
        </motion.div>
      )}

      {data.type === 'Non-Published' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-6 border-t border-[rgba(0,0,0,0.08)]"
        >
          <div>
            <label
              htmlFor="contextInfo"
              className="block mb-2 text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Contextual Information
            </label>
            <textarea
              id="contextInfo"
              value={data.contextInfo || ''}
              onChange={(e) => updateData({ contextInfo: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none"
              style={{ fontFamily: 'var(--font-sans)' }}
              placeholder="Provide any relevant context about your document..."
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
