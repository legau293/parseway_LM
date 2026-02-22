import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { InsuranceObject } from '@/data/mockOrgTree';

interface ObjectRowProps {
  object: InsuranceObject;
  isExpanded: boolean;
  onClick: () => void;
}

const ProgressBar = ({ pct }: { pct: number }) => (
  <div className="flex items-center gap-2.5">
    <div
      className="flex-1 rounded-full overflow-hidden"
      style={{ height: '6px', backgroundColor: 'var(--pw-bg-tertiary)', minWidth: 0 }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: pct === 100 ? '#2DB7A3' : 'linear-gradient(90deg, #E5483F 0%, #2DB7A3 100%)',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
    {pct < 100 && (
      <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--pw-text-secondary)', minWidth: '32px' }}>
        {pct}%
      </span>
    )}
  </div>
);

const GRID = 'grid grid-cols-[140px_220px_1fr_200px]';

export const ObjectListHeader = () => (
  <div
    className={`${GRID} items-center px-4 py-2`}
    style={{ borderBottom: '1px solid var(--pw-border)' }}
  >
    <span className="text-xs" style={{ color: 'var(--pw-text-secondary)' }}>Typ</span>
    <span className="text-xs" style={{ color: 'var(--pw-text-secondary)' }}>Namn</span>
    <span className="text-xs" style={{ color: 'var(--pw-text-secondary)' }}>Beskrivning</span>
    <span className="text-xs" style={{ color: 'var(--pw-text-secondary)' }}>Färdigställt</span>
  </div>
);

const ObjectRow = ({ object, isExpanded, onClick }: ObjectRowProps) => {
  const pct = object.fieldsTotal === 0
    ? 0
    : Math.round((object.fieldsVerified / object.fieldsTotal) * 100);

  return (
    <div
      className={`${GRID} w-full items-center px-4 py-2.5 text-sm transition-colors cursor-pointer`}
      style={{
        backgroundColor: isExpanded ? 'var(--pw-bg-tertiary)' : 'transparent',
        borderLeft: isExpanded ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
      }}
      onClick={onClick}
      onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
      onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <span className="flex items-center gap-1.5 min-w-0">
        {isExpanded ? (
          <ChevronDown size={12} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
        ) : (
          <ChevronRight size={12} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
        )}
        <span className="truncate text-xs" style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}>
          {object.objectType}
        </span>
      </span>

      <span
        className="truncate pr-3 text-sm"
        style={{ color: 'var(--pw-text-primary)', fontWeight: isExpanded ? 500 : 400 }}
      >
        {object.name}
      </span>

      <span className="truncate pr-3 text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
        {object.description}
      </span>

      <div className="pr-2">
        <ProgressBar pct={pct} />
      </div>
    </div>
  );
};

export default ObjectRow;
