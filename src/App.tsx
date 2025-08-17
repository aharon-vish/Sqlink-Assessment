import React, { useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard';
import { GlobalStyles } from '@/styles/GlobalStyles';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/i18n/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#718096'
  }}>
    Loading...
  </div>
);

function App() {
  useEffect(() => {
    // Set initial document direction based on detected language
    const currentLang = localStorage.getItem('i18nextLng');
    const isRTL = currentLang === 'he';
    
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang || 'en';

    // Performance monitoring
    if ('performance' in window && 'mark' in performance) {
      performance.mark('app-start');
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles />
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
