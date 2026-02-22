import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { InsuranceObject } from '@/data/mockOrgTree';

const OBJECT_TYPE_OPTIONS = ['Fastighet', 'Bil', 'Maskin'];

interface ObjectRowProps {
  object: InsuranceObject;
  isExpanded: boolean;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (patch: Partial<Pick<InsuranceObject, 'name' | 'objectType' | 'description'>>) => void;
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

const editInputStyle: React.CSSProperties = {
  backgroundColor: 'var(--pw-bg-primary)',
  border: '1px solid var(--pw-border)',
  color: 'var(--pw-text-primary)',
  borderRadius: '3px',
  fontSize: '12px',
  padding: '2px 6px',
  outline: 'none',
  width: '100%',
};

const ObjectRow = ({ object, isExpanded, isSelected, onClick, onUpdate }: ObjectRowProps) => {
  const pct = object.fieldsTotal === 0
    ? 0
    : Math.round((object.fieldsVerified / object.fieldsTotal) * 100);

  const [editType, setEditType] = useState(object.objectType);
  const [editName, setEditName] = useState(object.name);
  const [editDesc, setEditDesc] = useState(object.description);

  useEffect(() => {
    if (!isSelected) {
      setEditType(object.objectType);
      setEditName(object.name);
      setEditDesc(object.description);
    }
  }, [isSelected, object.objectType, object.name, object.description]);

  const handleSave = () => {
    onUpdate({ objectType: editType, name: editName, description: editDesc });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') {
      setEditType(object.objectType);
      setEditName(object.name);
      setEditDesc(object.description);
    }
  };

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
      {isSelected ? (
        <select
          value={editType}
          onChange={(e) => setEditType(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={{ ...editInputStyle, fontSize: '11px' }}
        >
          {OBJECT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      ) : (
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
      )}

      {isSelected ? (
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={{ ...editInputStyle, fontWeight: 500 }}
        />
      ) : (
        <span
          className="truncate pr-3 text-sm"
          style={{ color: 'var(--pw-text-primary)', fontWeight: isExpanded ? 500 : 400 }}
        >
          {object.name}
        </span>
      )}

      {isSelected ? (
        <input
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={{ ...editInputStyle }}
        />
      ) : (
        <span className="truncate pr-3 text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
          {object.description}
        </span>
      )}

      <div className="pr-2">
        <ProgressBar pct={pct} />
      </div>
    </div>
  );
};

export default ObjectRow;
