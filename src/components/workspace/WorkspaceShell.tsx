import React, { ReactNode } from 'react';

interface WorkspaceShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

const WorkspaceShell = ({ sidebar, children }: WorkspaceShellProps) => {
  return (
    <div className="h-screen flex" style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--pw-bg-primary)' }}>
      {sidebar}
      <main
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: 'var(--pw-bg-primary)' }}
      >
        {children}
      </main>
    </div>
  );
};

export default WorkspaceShell;
