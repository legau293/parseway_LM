import React from 'react';
import { InsuranceObject } from '@/data/mockOrgTree';
import ObjectRow from './ObjectRow';

interface ObjectListViewProps {
  objects: InsuranceObject[];
  expandedObjectId: string | null;
  onToggleObject: (id: string) => void;
}

const ThreeColumnPlaceholder = ({ object }: { object: InsuranceObject }) => (
  <div
    className="mx-4 mb-1"
    style={{ borderTop: '1px solid var(--pw-border)' }}
  >
    <div className="grid grid-cols-3 gap-0" style={{ borderBottom: '1px solid var(--pw-border)' }}>
      {(['Struktur', 'Hänvisning', 'Dokument'] as const).map((col) => (
        <div
          key={col}
          className="px-3 py-2 text-xs"
          style={{ color: 'var(--pw-text-tertiary)', fontWeight: 500, borderRight: col !== 'Dokument' ? '1px solid var(--pw-border)' : undefined }}
        >
          {col}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-0">
      <div className="px-3 py-3" style={{ borderRight: '1px solid var(--pw-border)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--pw-text-secondary)' }}>
          Strukturgrad
        </p>
        <p className="text-sm" style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}>
          {object.structurePct}%
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--pw-text-tertiary)' }}>
          Byggnadsår, yta, konstruktion
        </p>
      </div>
      <div className="px-3 py-3" style={{ borderRight: '1px solid var(--pw-border)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--pw-text-secondary)' }}>
          Verifieringsgrad
        </p>
        <p className="text-sm" style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}>
          {object.verifiedPct}%
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--pw-text-tertiary)' }}>
          Försäkringsbevis, avtal
        </p>
      </div>
      <div className="px-3 py-3">
        <p className="text-xs mb-1" style={{ color: 'var(--pw-text-secondary)' }}>
          Saknade dokument
        </p>
        <p className="text-sm" style={{ color: object.missingCount > 0 ? 'var(--pw-accent-red)' : 'var(--pw-text-primary)', fontWeight: 500 }}>
          {object.missingCount}
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--pw-text-tertiary)' }}>
          Ritningar, certifikat
        </p>
      </div>
    </div>
  </div>
);

const ObjectListView = ({ objects, expandedObjectId, onToggleObject }: ObjectListViewProps) => {
  if (objects.length === 0) {
    return (
      <p className="text-sm px-4 py-3" style={{ color: 'var(--pw-text-tertiary)' }}>
        Inga objekt
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {objects.map((obj) => (
        <React.Fragment key={obj.id}>
          <ObjectRow
            object={obj}
            isSelected={false}
            isExpanded={expandedObjectId === obj.id}
            onClick={() => onToggleObject(obj.id)}
          />
          {expandedObjectId === obj.id && (
            <ThreeColumnPlaceholder object={obj} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ObjectListView;
