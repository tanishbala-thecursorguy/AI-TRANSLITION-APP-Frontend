import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import type { PlaygroundData } from '../PlaygroundPage';

interface StepLanguageProps {
  data: PlaygroundData;
  updateData: (updates: Partial<PlaygroundData>) => void;
}

interface DetectedLanguage {
  name: string;
  confidence: number;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'pl', name: 'Polish' },
];

// Language colors for visual distinction - Turquoise Blue palette
const languageColors: Record<string, string> = {
  English: 'bg-cyan-500',
  Spanish: 'bg-teal-500',
  French: 'bg-sky-400',
  German: 'bg-cyan-600',
  Italian: 'bg-teal-400',
  Portuguese: 'bg-sky-500',
  Russian: 'bg-cyan-400',
  Chinese: 'bg-teal-600',
  Japanese: 'bg-sky-600',
  Korean: 'bg-cyan-300',
  Arabic: 'bg-teal-300',
  Hindi: 'bg-sky-300',
  Dutch: 'bg-cyan-700',
  Swedish: 'bg-teal-700',
  Polish: 'bg-sky-700',
};

export function StepLanguage({ data, updateData }: StepLanguageProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLanguages, setDetectedLanguages] = useState<DetectedLanguage[]>([]);
  const [selectedDetectedLanguage, setSelectedDetectedLanguage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate AI detection with multiple languages and confidence scores
    if (!data.detectedLanguage) {
      setIsDetecting(true);
      setTimeout(() => {
        // Simulate detecting multiple languages with confidence percentages
        const detected: DetectedLanguage[] = [
          { name: 'English', confidence: 72 },
          { name: 'Spanish', confidence: 21 },
          { name: 'French', confidence: 7 },
        ];
        
        // Sort by confidence (highest first)
        detected.sort((a, b) => b.confidence - a.confidence);
        
        setDetectedLanguages(detected);
        const primaryLanguage = detected[0].name;
        setSelectedDetectedLanguage(primaryLanguage);
        updateData({ detectedLanguage: primaryLanguage });
        setIsDetecting(false);
      }, 1500);
    } else {
      setSelectedDetectedLanguage(data.detectedLanguage);
      // If already detected, create a single entry
      setDetectedLanguages([{ name: data.detectedLanguage, confidence: 100 }]);
    }
  }, []);

  const handleLanguageSelect = (language: string) => {
    setSelectedDetectedLanguage(language);
    updateData({ detectedLanguage: language });
    setIsEditing(false);
  };

  const handleManualEdit = (value: string) => {
    setSelectedDetectedLanguage(value);
    updateData({ detectedLanguage: value });
  };

  return (
    <div>
      <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
        Language Settings
      </h2>
      <p className="text-[#6B6B6B] mb-8 imperial-script-font">
        Configure source and destination languages
      </p>

      <div className="space-y-8">
        {/* Detected Language */}
        <div>
          <label className="block mb-2 font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
            Detected Languages
          </label>

          {isDetecting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-3 bg-[#ecfeff] border border-[rgba(0,0,0,0.08)] rounded-md"
            >
              <span className="text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                Detecting languages...
              </span>
            </motion.div>
          ) : (
            <>
              {/* Primary Language Display */}
              {detectedLanguages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-[#ecfeff] border-2 border-black rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#6B6B6B] mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                        Primary Language:
                      </p>
                      <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>
                        {selectedDetectedLanguage} ({detectedLanguages.find(l => l.name === selectedDetectedLanguage)?.confidence}%)
                      </p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-black" />
                  </div>
                </motion.div>
              )}

              {/* Vertical Language Confidence List */}
              <div className="space-y-2">
                {detectedLanguages.map((lang, index) => {
                  const isSelected = selectedDetectedLanguage === lang.name;
                  const colorClass = languageColors[lang.name] || 'bg-gray-500';
                  
                  return (
                    <motion.div
                      key={lang.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleLanguageSelect(lang.name)}
                      className="flex items-center gap-3 py-2 cursor-pointer hover:bg-[#ecfeff] rounded px-2 -mx-2 transition-all duration-200"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {/* Language Name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate" style={{ fontFamily: 'var(--font-sans)' }}>
                            {lang.name}
                          </span>
                          <span className="text-xs font-semibold text-[#6B6B6B] ml-2" style={{ fontFamily: 'var(--font-sans)' }}>
                            {lang.confidence}%
                          </span>
                        </div>

                        {/* Thermometer Progress Bar */}
                        <div className="relative h-2 bg-[#E8E6E2] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.confidence}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full ${colorClass}`}
                          />
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 w-5 h-5 bg-[#2ebb77] rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-[#6B6B6B]" style={{ fontFamily: 'var(--font-sans)' }}>
                Click on a language to select it as the primary language for translation.
              </p>
            </>
          )}
        </div>

        {/* Destination Language */}
        <div>
          <label
            htmlFor="destinationLanguage"
            className="block mb-2 font-medium"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Destination Language
          </label>
          <select
            id="destinationLanguage"
            value={data.destinationLanguage}
            onChange={(e) => updateData({ destinationLanguage: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-md focus:outline-none focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <option value="">Select a language</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
