import React, { useState, useEffect } from 'react';
import { Building } from '@/data/mockOrgTree';
import { Plus, Trash2 } from 'lucide-react';

interface BuildingSwitcherProps {
  buildings: Building[];
  activeBuildingId: string;
  onSelect: (id: string) => void;
  getProgress: (b: Building) => number;
  onAddBuilding: () => void;
  onDeleteBuilding: (id: string) => void;
}

const BuildingSwitcher = ({ buildings, activeBuildingId, onSelect, getProgress, onAddBuilding, onDeleteBuilding }: BuildingSwitcherProps) => {
  const hasMultiple = buildings.length >= 2;
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingDeleteId) return;
    const t = window.setTimeout(() => setPendingDeleteId(null), 3000);
    return () => window.clearTimeout(t);
  }, [pendingDeleteId]);

  const handleTrashClick = (e: React.MouseEvent, buildingId: string) => {
    e.stopPropagation();
    if (pendingDeleteId === buildingId) {
      setPendingDeleteId(null);
      onDeleteBuilding(buildingId);
    } else {
      setPendingDeleteId(buildingId);
    }
  };

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
              const isPendingDelete = pendingDeleteId === b.id;

              return (
                <div
                  key={b.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'baseline',
                    gap: '4px',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <button
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
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--pw-text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'var(--pw-text-tertiary)';
                    }}
                  >
                    {b.name}
                    <span style={{ fontSize: '11px', color: 'var(--pw-text-tertiary)', fontWeight: 400 }}>
                      {pct}%
                    </span>
                  </button>

                  {isActive && (
                    <button
                      onClick={(e) => handleTrashClick(e, b.id)}
                      title={isPendingDelete ? 'Klicka igen för att radera' : 'Radera byggnad'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '14px',
                        height: '14px',
                        padding: 0,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isPendingDelete ? '#E5483F' : 'var(--pw-text-tertiary)',
                        transition: 'color 0.15s',
                        alignSelf: 'center',
                        marginLeft: '2px',
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        if (!isPendingDelete) e.currentTarget.style.color = 'var(--pw-text-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isPendingDelete) e.currentTarget.style.color = 'var(--pw-text-tertiary)';
                      }}
                    >
                      <Trash2 size={10} strokeWidth={1.75} />
                    </button>
                  )}
                </div>
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

      {pendingDeleteId && (
        <div
          style={{
            marginTop: '6px',
            fontSize: '10px',
            color: '#E5483F',
            userSelect: 'none',
          }}
        >
          Klicka på papperskorgen igen för att bekräfta radering
        </div>
      )}
    </div>
  );
};

export default BuildingSwitcher;
