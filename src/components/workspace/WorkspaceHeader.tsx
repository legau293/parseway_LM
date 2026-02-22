import React from 'react';

interface WorkspaceHeaderProps {
  companyName: string | null;
  subsidiaryName: string | null;
  objectName: string | null;
  onGoToCompany: () => void;
  onGoToSubsidiary: () => void;
}

const Separator = () => (
  <span className="mx-1.5 text-sm" style={{ color: 'var(--pw-text-tertiary)' }}>
    /
  </span>
);

const WorkspaceHeader = ({
  companyName,
  subsidiaryName,
  objectName,
  onGoToCompany,
  onGoToSubsidiary,
}: WorkspaceHeaderProps) => {
  if (!companyName) return <div className="mb-6" />;

  return (
    <div className="mb-6 flex items-center flex-wrap">
      <button
        onClick={onGoToCompany}
        className="text-sm transition-colors"
        style={{ color: objectName || subsidiaryName ? 'var(--pw-text-secondary)' : 'var(--pw-text-primary)', fontWeight: 400 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = objectName || subsidiaryName ? 'var(--pw-text-secondary)' : 'var(--pw-text-primary)';
        }}
      >
        {companyName}
      </button>

      {subsidiaryName && (
        <>
          <Separator />
          <button
            onClick={onGoToSubsidiary}
            className="text-sm transition-colors"
            style={{ color: objectName ? 'var(--pw-text-secondary)' : 'var(--pw-text-primary)', fontWeight: 400 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = objectName ? 'var(--pw-text-secondary)' : 'var(--pw-text-primary)';
            }}
          >
            {subsidiaryName}
          </button>
        </>
      )}

      {objectName && (
        <>
          <Separator />
          <span
            className="text-sm"
            style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}
          >
            {objectName}
          </span>
        </>
      )}
    </div>
  );
};

export default WorkspaceHeader;
