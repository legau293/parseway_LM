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

export const ObjectListHeader = ({
  sortKey,
  sortDir,
  onSort,
}: {
  sortKey: string;
  sortDir: 'asc' | 'desc';
  onSort: (key: 'objectType' | 'name' | 'description' | 'completedPct') => void;
}) => {
  const col = (key: 'objectType' | 'name' | 'description' | 'completedPct', label: string) => {
    const active = sortKey === key;
    return (
      <button
        onClick={() => onSort(key)}
        className="flex items-center gap-1 text-left text-xs transition-colors select-none"
        style={{
          color: active ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)',
          fontWeight: active ? 500 : 400,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--pw-text-secondary)'; }}
      >
        {label}
        {active && (
          <span style={{ color: 'var(--pw-text-tertiary)', fontSize: '10px' }}>
            {sortDir === 'asc' ? ' ↑' : ' ↓'}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className={`${GRID} items-center px-4 py-2`}
      style={{ borderBottom: '1px solid var(--pw-border)' }}
    >
      {col('objectType', 'Typ')}
      {col('name', 'Namn')}
      {col('description', 'Beskrivning')}
      {col('completedPct', 'Färdigställt')}
    </div>
  );
};

const ObjectRow = ({ object, isExpanded, onClick }: ObjectRowProps) => {
  return (
    <button
      onClick={onClick}
      className={`${GRID} w-full text-left items-center px-4 py-2.5 text-sm transition-colors`}
      style={{
        backgroundColor: isExpanded ? 'var(--pw-bg-tertiary)' : 'transparent',
        borderLeft: isExpanded ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span className="flex items-center gap-1.5 min-w-0">
        {isExpanded ? (
          <ChevronDown size={12} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
        ) : (
          <ChevronRight size={12} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
        )}
        <span
          className="truncate text-xs"
          style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
        >
          {object.objectType}
        </span>
      </span>

      <span
        className="truncate pr-3 text-sm"
        style={{ color: 'var(--pw-text-primary)', fontWeight: isExpanded ? 500 : 400 }}
      >
        {object.name}
      </span>

      <span
        className="truncate pr-3 text-xs"
        style={{ color: 'var(--pw-text-tertiary)' }}
      >
        {object.description}
      </span>

      <div className="pr-2">
        <ProgressBar pct={object.completedPct} />
      </div>
    </button>
  );
};

export default ObjectRow;
