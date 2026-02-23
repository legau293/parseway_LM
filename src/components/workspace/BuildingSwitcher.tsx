import React from 'react';
import { Building } from '@/data/mockOrgTree';

interface BuildingSwitcherProps {
  buildings: Building[];
  activeBuildingId: string;
  onSelect: (id: string) => void;
  getProgress: (b: Building) => number;
}

const BuildingSwitcher = ({ buildings, activeBuildingId, onSelect, getProgress }: BuildingSwitcherProps) => {
  if (buildings.length === 0) return null;

  return (
    <div
      style={{
        marginTop: '16px',
        marginBottom: '12px',
        padding: '0 16px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 500,
          color: 'var(--pw-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '6px',
          userSelect: 'none',
        }}
      >
        Byggnader
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {buildings.map((b) => {
          const isActive = b.id === activeBuildingId;
          const pct = getProgress(b);

          return (
            <button
              key={b.id}
              onClick={() => onSelect(b.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '4px',
                padding: '0',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '1px solid var(--pw-text-primary)' : '1px solid transparent',
                cursor: isActive ? 'default' : 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: isActive ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)',
                transition: 'color 0.1s',
                whiteSpace: 'nowrap',
                paddingBottom: '1px',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--pw-text-secondary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--pw-text-tertiary)';
              }}
            >
              {b.name}
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--pw-text-tertiary)',
                  fontWeight: 400,
                }}
              >
                {pct}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BuildingSwitcher;
