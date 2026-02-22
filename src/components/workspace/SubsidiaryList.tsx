import React, { useEffect, useRef } from 'react';
import CollapsibleSection from './CollapsibleSection';
import { CompanyNode } from '@/data/mockOrgTree';

interface SubsidiaryListProps {
  nodes: CompanyNode[];
  selectedNodeId: string | null;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isAdding: boolean;
  addValue: string;
  onChangeAddValue: (value: string) => void;
  onConfirmAdd: () => void;
  onCancelAdd: () => void;
  onStartAdd: () => void;
}

const SubsidiaryList = ({
  nodes,
  selectedNodeId,
  onSelect,
  isOpen,
  onToggle,
  isAdding,
  addValue,
  onChangeAddValue,
  onConfirmAdd,
  onCancelAdd,
  onStartAdd,
}: SubsidiaryListProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onConfirmAdd();
    if (e.key === 'Escape') onCancelAdd();
  };

  return (
    <CollapsibleSection
      title="Dotterbolag"
      count={nodes.length}
      isOpen={isOpen}
      onToggle={onToggle}
      actionLabel="Lägg till"
      onAction={onStartAdd}
    >
      {isAdding && (
        <div className="flex items-center gap-2 px-4 py-1.5">
          <input
            ref={inputRef}
            value={addValue}
            onChange={(e) => onChangeAddValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Namn på bolag..."
            className="flex-1 text-sm px-2 py-1 rounded outline-none transition-colors"
            style={{
              backgroundColor: 'var(--pw-bg-primary)',
              border: '1px solid var(--pw-border)',
              color: 'var(--pw-text-primary)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
          />
          <button
            onClick={onConfirmAdd}
            className="text-xs transition-colors"
            style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
          >
            OK
          </button>
          <button
            onClick={onCancelAdd}
            className="text-xs transition-colors"
            style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-tertiary)')}
          >
            Avbryt
          </button>
        </div>
      )}

      {nodes.length === 0 && !isAdding && (
        <p className="text-sm px-4 py-2" style={{ color: 'var(--pw-text-tertiary)' }}>
          Inga dotterbolag
        </p>
      )}

      {nodes.map((node) => {
        const isSelected = selectedNodeId === node.id;
        return (
          <button
            key={node.id}
            onClick={() => onSelect(node.id)}
            className="w-full text-left px-4 py-2 text-sm transition-colors"
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
            {node.name}
          </button>
        );
      })}
    </CollapsibleSection>
  );
};

export default SubsidiaryList;
