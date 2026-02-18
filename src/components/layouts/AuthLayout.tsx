import React from 'react';
import Logo from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: '#FFFFFF',
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(45,183,163,0.08) 0%, transparent 70%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <header
        className="w-full px-6 lg:px-12 py-4 flex items-center sticky top-0 z-50"
        style={{
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Logo size="md" />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
