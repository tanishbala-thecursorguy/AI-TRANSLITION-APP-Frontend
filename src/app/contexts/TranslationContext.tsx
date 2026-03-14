import { createContext, useContext, useState, ReactNode } from 'react';
import { PageStats } from '../utils/fileUtils';

export interface TranslationFile {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'processing' | 'completed';
  progress: number;
  type: 'Published' | 'Non-Published';
  bookTitle?: string;
  authorName?: string;
  contextInfo?: string;
  detectedLanguage: string;
  destinationLanguage: string;
  translatedText?: string;
  originalText?: string;
  issues?: Array<{
    page: number;
    originalLine: string;
    suggestions: string[];
  }>;
  pageCount?: number;
  pageStats?: PageStats[];
}

interface TranslationContextType {
  files: TranslationFile[];
  addFile: (file: Omit<TranslationFile, 'id' | 'uploadDate' | 'status' | 'progress'>) => void;
  updateFileStatus: (id: string, status: 'processing' | 'completed', progress: number) => void;
  getFileById: (id: string) => TranslationFile | undefined;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<TranslationFile[]>([]);

  const addFile = (file: Omit<TranslationFile, 'id' | 'uploadDate' | 'status' | 'progress'>) => {
    const newFile: TranslationFile = {
      ...file,
      id: Math.random().toString(36).substring(2, 9),
      uploadDate: new Date().toISOString(),
      status: 'processing',
      progress: 0,
    };

    setFiles((prev) => [...prev, newFile]);

    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        updateFileStatus(newFile.id, 'completed', 100);
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, progress } : f))
        );
      }
    }, 800);

    return newFile.id;
  };

  const updateFileStatus = (id: string, status: 'processing' | 'completed', progress: number) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status,
              progress,
              translatedText:
                status === 'completed'
                  ? 'En un pequeño pueblo al pie de las montañas,\nvivía un anciano sabio conocido por todos.\nSus historias cautivaban a jóvenes y mayores por igual.\nEl anciano caminó lentamente por la calle.\nSaludando a cada persona que encontraba en su camino.\nLos niños corrían a su alrededor con alegría.\nEsperando escuchar otra de sus fascinantes historias.\nMaría observaba desde la ventana con curiosidad.\nNo podía creer lo que veía.\nEl anciano parecía brillar con una luz especial.'
                  : undefined,
              originalText:
                status === 'completed'
                  ? 'In a small village at the foot of the mountains,\nlived a wise old man known by all.\nHis stories captivated young and old alike.\nThe old man walked slowly down the street.\nGreeting every person he met along the way.\nChildren ran around him with joy.\nWaiting to hear another of his fascinating stories.\nMaria watched from the window with curiosity.\nShe could not believe what she was seeing.\nThe old man seemed to shine with a special light.'
                  : undefined,
              issues:
                status === 'completed'
                  ? [
                      {
                        page: 1,
                        originalLine: 'El anciano caminó lentamente por la calle.',
                        suggestions: [
                          'El anciano caminaba despacio por la calle.',
                          'El viejo caminaba despacio por la calle.',
                          'El hombre mayor se paseaba lentamente.',
                        ],
                      },
                      {
                        page: 1,
                        originalLine: 'Saludando a cada persona que encontraba en su camino.',
                        suggestions: [
                          'Saludando a todos los que encontraba en el camino.',
                          'Saludando a cada uno que se encontraba.',
                          'Saludando a la gente que veía en su camino.',
                        ],
                      },
                      {
                        page: 1,
                        originalLine: 'El anciano parecía brillar con una luz especial.',
                        suggestions: [
                          'El anciano resplandecía con luz especial.',
                          'El viejo brillaba con resplandor único.',
                          'El sabio irradiaba una luz particular.',
                        ],
                      },
                    ]
                  : undefined,
            }
          : f
      )
    );
  };

  const getFileById = (id: string) => {
    return files.find((f) => f.id === id);
  };

  return (
    <TranslationContext.Provider
      value={{
        files,
        addFile,
        updateFileStatus,
        getFileById,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}