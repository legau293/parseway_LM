import React from 'react';

interface WorkspaceHeaderProps {
  selectedCompanyName: string | null;
}

const WorkspaceHeader = ({ selectedCompanyName }: WorkspaceHeaderProps) => {
  return (
    <div className="mb-8">
      <p
        className="text-xs uppercase tracking-widest mb-1"
        style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400, letterSpacing: '0.1em' }}
      >
        Moderbolag
      </p>
      <h1
        className="text-xl"
        style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}
      >
        {selectedCompanyName ?? 'Ingen vald'}
      </h1>
    </div>
  );
};

export default WorkspaceHeader;
