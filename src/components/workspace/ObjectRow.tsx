import React from 'react';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { InsuranceObject } from '@/data/mockOrgTree';
import { getProgressFill } from './ProgressPill';

export type SortColumn = 'type' | 'name' | 'description' | null;
export type SortDirection = 'asc' | 'desc';

const CHECKBOX_COL = '24px';

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
    style={{
      height: '6px',
      backgroundColor: 'var(--pw-bg-tertiary)',
      border: '1px solid var(--pw-border)',
    }}
  >
    <div
      className="h-full rounded-full"
      style={{
        width: `${pct}%`,
        background: getProgressFill(pct),
        transition: 'width 0.3s ease',
      }}
    />
  </div>
);

interface ObjectListHeaderProps {
  showCheckbox?: boolean;
  sortColumn?: SortColumn;
  sortDirection?: SortDirection;
  onSort?: (col: SortColumn) => void;
}

export const ObjectListHeader = ({ showCheckbox, sortColumn, sortDirection, onSort }: ObjectListHeaderProps) => {
  const SortIcon = ({ col }: { col: SortColumn }) => {
    if (sortColumn !== col) return null;
    return sortDirection === 'asc'
      ? <ChevronUp size={10} style={{ flexShrink: 0 }} />
      : <ChevronDown size={10} style={{ flexShrink: 0 }} />;
  };

  const sortableStyle = (col: SortColumn): React.CSSProperties => ({
    color: sortColumn === col ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)',
    cursor: onSort ? 'pointer' : 'default',
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
  });

  return (
    <div
      className="flex items-center px-10 py-2"
      style={{ borderBottom: '1px solid var(--pw-border)', gap: '8px' }}
    >
      <div style={{ width: CHECKBOX_COL, flexShrink: 0 }} />
      <span
        className="text-xs"
        style={{ ...sortableStyle('type'), width: '140px', flexShrink: 0 }}
        onClick={() => onSort?.('type')}
        onMouseEnter={(e) => { if (onSort) (e.currentTarget as HTMLElement).style.color = 'var(--pw-text-primary)'; }}
        onMouseLeave={(e) => { if (onSort) (e.currentTarget as HTMLElement).style.color = sortColumn === 'type' ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)'; }}
      >
        Typ<SortIcon col="type" />
      </span>
      <span
        className="text-xs"
        style={{ ...sortableStyle('name'), width: '220px', flexShrink: 0 }}
        onClick={() => onSort?.('name')}
        onMouseEnter={(e) => { if (onSort) (e.currentTarget as HTMLElement).style.color = 'var(--pw-text-primary)'; }}
        onMouseLeave={(e) => { if (onSort) (e.currentTarget as HTMLElement).style.color = sortColumn === 'name' ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)'; }}
      >
        Namn<SortIcon col="name" />
      </span>
      <span
        className="text-xs flex-1"
        style={{ ...sortableStyle('description') }}
        onClick={() => onSort?.('description')}
        onMouseEnter={(e) => { if (onSort) (e.currentTarget as HTMLElement).style.color = 'var(--pw-text-primary)'; }}
        onMouseLeave={(e) => { if (onSort) (e.currentTarget as HTMLElement).style.color = sortColumn === 'description' ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)'; }}
      >
        Beskrivning<SortIcon col="description" />
      </span>
      <span className="text-xs" style={{ color: 'var(--pw-text-secondary)', width: '160px', flexShrink: 0 }}>Färdigställt</span>
    </div>
  );
};

const ObjectRow = ({ object, isExpanded, isChecked = false, showCheckbox = false, onClick, onCheckboxClick }: ObjectRowProps) => {
  const pct = object.fieldsTotal === 0
    ? 0
    : Math.round((object.fieldsVerified / object.fieldsTotal) * 100);

  return (
    <div
      className="flex w-full items-center px-10 py-2.5 text-sm transition-colors cursor-pointer"
      style={{
        gap: '8px',
        backgroundColor: isExpanded ? 'var(--pw-bg-tertiary)' : 'transparent',
        borderLeft: isExpanded ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
      }}
      onClick={onClick}
      onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
      onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <div style={{ width: CHECKBOX_COL, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {}}
            onClick={onCheckboxClick}
            style={{ cursor: 'pointer', accentColor: 'var(--pw-accent-red)', width: '14px', height: '14px' }}
          />
        )}
      </div>

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
