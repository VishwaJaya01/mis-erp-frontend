import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppearanceProvider } from './lib/appearance';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AppearanceProvider>
      <App />
    </AppearanceProvider>
  </ErrorBoundary>
);
