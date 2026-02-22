import React from 'react';
import { InsuranceObject } from '@/data/mockOrgTree';
import ObjectRow, { ObjectListHeader } from './ObjectRow';

interface ObjectListViewProps {
  objects: InsuranceObject[];
  expandedObjectId: string | null;
  selectedObjectId: string | null;
  onToggleObject: (id: string) => void;
  onUpdateObject: (id: string, patch: Partial<Pick<InsuranceObject, 'name' | 'objectType' | 'description'>>) => void;
  onVerifyField: (objId: string) => void;
}

const ThreeColumnDropdown = ({
  object,
  onVerifyField,
}: {
  object: InsuranceObject;
  onVerifyField: (objId: string) => void;
}) => {
  const remaining = object.fieldsTotal - object.fieldsVerified;
  return (
    <div style={{ borderTop: '1px solid var(--pw-border)', borderBottom: '1px solid var(--pw-border)' }}>
      <div
        className="grid px-4 py-4"
        style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0 24px' }}
      >
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--pw-text-secondary)' }}>
            Struktur
          </p>
          <p className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
            {object.fieldsVerified} av {object.fieldsTotal} fält verifierade
          </p>
          {remaining > 0 && (
            <p className="text-xs mt-1" style={{ color: 'var(--pw-text-tertiary)' }}>
              {remaining} återstår
            </p>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onVerifyField(object.id); }}
            disabled={remaining === 0}
            className="mt-2 text-xs px-2 py-0.5 rounded transition-colors"
            style={{
              border: '1px solid var(--pw-border)',
              color: remaining > 0 ? 'var(--pw-text-secondary)' : 'var(--pw-text-tertiary)',
              backgroundColor: 'transparent',
              cursor: remaining > 0 ? 'pointer' : 'default',
              opacity: remaining > 0 ? 1 : 0.4,
            }}
            onMouseEnter={(e) => { if (remaining > 0) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Verifiera fält
          </button>
        </div>
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--pw-text-secondary)' }}>
            Hänvisning
          </p>
          <p className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Inga hänvisningar</p>
        </div>
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--pw-text-secondary)' }}>
            Dokument
          </p>
          <p className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Inga dokument</p>
        </div>
      </div>
    </div>
  );
};

const ObjectListView = ({
  objects,
  expandedObjectId,
  selectedObjectId,
  onToggleObject,
  onUpdateObject,
  onVerifyField,
}: ObjectListViewProps) => {
  if (objects.length === 0) {
    return (
      <p className="text-xs px-4 py-3" style={{ color: 'var(--pw-text-tertiary)' }}>
        Inga försäkringsobjekt
      </p>
    );
  }

  return (
    <div>
      <ObjectListHeader />
      {objects.map((obj) => (
        <React.Fragment key={obj.id}>
          <ObjectRow
            object={obj}
            isExpanded={expandedObjectId === obj.id}
            isSelected={selectedObjectId === obj.id}
            onClick={() => onToggleObject(obj.id)}
            onUpdate={(patch) => onUpdateObject(obj.id, patch)}
          />
          {expandedObjectId === obj.id && (
            <ThreeColumnDropdown
              object={obj}
              onVerifyField={onVerifyField}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ObjectListView;
