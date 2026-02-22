import React from 'react';
import { InsuranceObject } from '@/data/mockWorkspace';

interface ObjectRowProps {
  object: InsuranceObject;
  isSelected: boolean;
  onClick: () => void;
}

const ObjectRow = ({ object, isSelected, onClick }: ObjectRowProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between px-4 py-2.5 text-sm transition-colors"
      style={{
        backgroundColor: isSelected ? 'var(--pw-bg-tertiary)' : 'transparent',
        color: 'var(--pw-text-primary)',
        borderLeft: isSelected ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
        fontWeight: isSelected ? 500 : 400,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span>{object.name}</span>
      <span className="flex items-center gap-4 shrink-0 ml-4" style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}>
        <span>Struktur {object.structurePct}%</span>
        <span>Verifierat {object.verifiedPct}%</span>
        <span>Saknas {object.missingCount}</span>
      </span>
    </button>
  );
};

export default ObjectRow;
