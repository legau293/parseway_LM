import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { InsuranceObject } from '@/data/mockOrgTree';

interface ObjectRowProps {
  object: InsuranceObject;
  isExpanded: boolean;
  isChecked?: boolean;
  showCheckbox?: boolean;
  onClick: () => void;
  onCheckboxClick?: (e: React.MouseEvent) => void;
}

const ProgressBar = ({ pct }: { pct: number }) => (
  <div
    className="rounded-full overflow-hidden"
    style={{ height: '6px', backgroundColor: 'var(--pw-bg-tertiary)' }}
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
);

interface ObjectListHeaderProps {
  showCheckbox?: boolean;
}

export const ObjectListHeader = ({ showCheckbox }: ObjectListHeaderProps) => (
  <div
    className="flex items-center px-4 py-2 gap-2"
    style={{ borderBottom: '1px solid var(--pw-border)' }}
  >
    {showCheckbox && <div style={{ width: '20px', flexShrink: 0 }} />}
    <span className="text-xs" style={{ color: 'var(--pw-text-secondary)', width: '140px', flexShrink: 0 }}>Typ</span>
    <span className="text-xs" style={{ color: 'var(--pw-text-secondary)', width: '220px', flexShrink: 0 }}>Namn</span>
    <span className="text-xs flex-1" style={{ color: 'var(--pw-text-secondary)' }}>Beskrivning</span>
    <span className="text-xs" style={{ color: 'var(--pw-text-secondary)', width: '160px', flexShrink: 0 }}>Färdigställt</span>
  </div>
);

const ObjectRow = ({ object, isExpanded, isChecked = false, showCheckbox = false, onClick, onCheckboxClick }: ObjectRowProps) => {
  const pct = object.fieldsTotal === 0
    ? 0
    : Math.round((object.fieldsVerified / object.fieldsTotal) * 100);

  return (
    <div
      className="flex w-full items-center px-4 py-2.5 text-sm transition-colors cursor-pointer gap-2"
      style={{
        backgroundColor: isExpanded ? 'var(--pw-bg-tertiary)' : 'transparent',
        borderLeft: isExpanded ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
      }}
      onClick={onClick}
      onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
      onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      {showCheckbox && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {}}
          onClick={onCheckboxClick}
          style={{ cursor: 'pointer', accentColor: 'var(--pw-accent-red)', flexShrink: 0, width: '14px', height: '14px' }}
        />
      )}

      <span className="flex items-center gap-1.5" style={{ width: '140px', flexShrink: 0, minWidth: 0 }}>
        {isExpanded ? (
          <ChevronDown size={12} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
        ) : (
          <ChevronRight size={12} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
        )}
        <span className="truncate text-xs" style={{ color: 'var(--pw-text-secondary)' }}>
          {object.objectType}
        </span>
      </span>

      <span
        className="truncate text-sm"
        style={{ color: 'var(--pw-text-primary)', fontWeight: isExpanded ? 500 : 400, width: '220px', flexShrink: 0 }}
      >
        {object.name}
      </span>

      <span className="truncate text-xs flex-1" style={{ color: 'var(--pw-text-tertiary)' }}>
        {object.description}
      </span>

      <div style={{ width: '160px', flexShrink: 0 }}>
        <ProgressBar pct={pct} />
      </div>
    </div>
  );
};

export default ObjectRow;
