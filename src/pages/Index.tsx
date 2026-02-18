import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from './Dashboard';
import Landing from './Landing';
import Logo from '@/components/ui/Logo';

const Index = () => {
  const { isAuthenticated, loading, error } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F7F9F8' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#2DB7A3', borderTopColor: 'transparent' }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F7F9F8' }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size="md" />
          <p style={{ fontSize: '14px', color: '#475569' }}>
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#2DB7A3', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2DB7A3')}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Landing />;
};

export default Index;
