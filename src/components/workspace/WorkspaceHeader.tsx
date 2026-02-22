import React from 'react';

interface PathSegment {
  id: string;
  name: string;
}

interface WorkspaceHeaderProps {
  path: PathSegment[];
  onSelectNode: (id: string) => void;
}

const Separator = () => (
  <span className="mx-1.5 text-sm" style={{ color: 'var(--pw-text-tertiary)' }}>
    /
  </span>
);

const WorkspaceHeader = ({ path, onSelectNode }: WorkspaceHeaderProps) => {
  if (path.length === 0) return <div className="mb-6" />;

  return (
    <div className="mb-6 flex items-center flex-wrap">
      {path.map((segment, index) => {
        const isLast = index === path.length - 1;
        return (
          <React.Fragment key={segment.id}>
            {index > 0 && <Separator />}
            {isLast ? (
              <span
                className="text-sm"
                style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}
              >
                {segment.name}
              </span>
            ) : (
              <button
                onClick={() => onSelectNode(segment.id)}
                className="text-sm transition-colors"
                style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
              >
                {segment.name}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default WorkspaceHeader;
