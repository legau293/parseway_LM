import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { InsuranceObject } from '@/data/mockOrgTree';

interface ObjectRowProps {
  object: InsuranceObject;
  isSelected: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

const ObjectRow = ({ object, isSelected, isExpanded, onClick }: ObjectRowProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center justify-between px-4 py-2.5 text-sm transition-colors"
      style={{
        backgroundColor: isSelected || isExpanded ? 'var(--pw-bg-tertiary)' : 'transparent',
        color: 'var(--pw-text-primary)',
        borderLeft: isSelected || isExpanded ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
        fontWeight: isSelected || isExpanded ? 500 : 400,
      }}
      onMouseEnter={(e) => {
        if (!isSelected && !isExpanded) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected && !isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span className="flex items-center gap-2">
        {isExpanded ? (
          <ChevronDown size={13} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
        ) : (
          <ChevronRight size={13} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
        )}
        <span>{object.name}</span>
      </span>
      <span className="flex items-center gap-4 shrink-0 ml-4" style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}>
        <span>Struktur {object.structurePct}%</span>
        <span>Verifierat {object.verifiedPct}%</span>
        <span>Saknas {object.missingCount}</span>
      </span>
    </button>
  );
};

export default ObjectRow;
