import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#F7F9F8', fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
};

export default AppLayout;
