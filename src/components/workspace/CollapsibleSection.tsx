import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

const CollapsibleSection = ({
  title,
  count,
  isOpen,
  onToggle,
  actionLabel,
  onAction,
  children,
}: CollapsibleSectionProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between py-1.5 px-1">
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
        >
          {isOpen ? (
            <ChevronDown size={14} style={{ color: 'var(--pw-text-tertiary)' }} />
          ) : (
            <ChevronRight size={14} style={{ color: 'var(--pw-text-tertiary)' }} />
          )}
          <span>{title}</span>
          {count !== undefined && (
            <span className="text-xs ml-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>
              {count}
            </span>
          )}
        </button>

        {actionLabel && onAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="text-xs transition-colors"
            style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
