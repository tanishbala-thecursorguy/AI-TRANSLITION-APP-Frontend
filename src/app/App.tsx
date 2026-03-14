import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </TranslationProvider>
    </AuthProvider>
  );
}