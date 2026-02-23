import React from 'react';
import { Building } from '@/data/mockOrgTree';
import { Plus } from 'lucide-react';

interface BuildingSwitcherProps {
  buildings: Building[];
  activeBuildingId: string;
  onSelect: (id: string) => void;
  getProgress: (b: Building) => number;
  onAddBuilding: () => void;
}

const BuildingSwitcher = ({ buildings, activeBuildingId, onSelect, getProgress, onAddBuilding }: BuildingSwitcherProps) => {
  const hasMultiple = buildings.length >= 2;

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
        {hasMultiple
          ? buildings.map((b) => {
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
            })
          : (() => {
              const b = buildings[0];
              if (!b) return null;
              return (
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--pw-text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {b.name}
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--pw-text-tertiary)',
                      fontWeight: 400,
                      marginLeft: '4px',
                    }}
                  >
                    {getProgress(b)}%
                  </span>
                </span>
              );
            })()}

        <button
          onClick={onAddBuilding}
          title="Lägg till byggnad"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            padding: 0,
            background: 'none',
            border: '1px solid var(--pw-border)',
            borderRadius: '3px',
            cursor: 'pointer',
            color: 'var(--pw-text-tertiary)',
            flexShrink: 0,
            marginLeft: hasMultiple ? '4px' : '0',
            transition: 'background-color 0.1s, color 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
            e.currentTarget.style.color = 'var(--pw-text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--pw-text-tertiary)';
          }}
        >
          <Plus size={11} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default BuildingSwitcher;
