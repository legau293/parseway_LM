import React, { useState, useRef, useEffect } from 'react';
import { Pencil, X, Check } from 'lucide-react';
import { Building, InsuranceObject, ParameterStatus } from '@/data/mockOrgTree';
import ObjectRow, { ObjectListHeader, SortColumn, SortDirection } from './ObjectRow';
import ObjectThreeColumnView from './ObjectThreeColumnView';

const OBJECT_TYPE_OPTIONS = ['Fastighet', 'Bil', 'Maskin'];

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

const editIconBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  borderRadius: '3px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  flexShrink: 0,
  color: 'var(--pw-text-tertiary)',
  marginLeft: '4px',
  verticalAlign: 'middle',
};

interface DropdownProps {
  object: InsuranceObject;
  onVerifyField: (objId: string) => void;
  onUpdate: (patch: Partial<Pick<InsuranceObject, 'name' | 'objectType' | 'description'>>) => void;
  onCollapse: () => void;
}

function ObjectDropdown({ object, onVerifyField, onUpdate, onCollapse }: DropdownProps) {
  const [editMode, setEditMode] = useState(false);
  const [editType, setEditType] = useState(object.objectType);
  const [editName, setEditName] = useState(object.name);
  const [editDesc, setEditDesc] = useState(object.description);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditType(object.objectType);
    setEditName(object.name);
    setEditDesc(object.description);
    setEditMode(false);
  }, [object.id]);

  useEffect(() => {
    if (!editMode) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        handleCancel();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [editMode]);

  const handleSave = () => {
    onUpdate({ objectType: editType, name: editName, description: editDesc });
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditType(object.objectType);
    setEditName(object.name);
    setEditDesc(object.description);
    setEditMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') handleCancel();
  };

  const remaining = object.fieldsTotal - object.fieldsVerified;

  const EditIcon = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={editIconBtn}
      title="Redigera"
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--pw-text-tertiary)'; }}
    >
      <Pencil size={11} />
    </button>
  );

  return (
    <div
      ref={dropdownRef}
      style={{ borderTop: '1px solid var(--pw-border)', borderBottom: '1px solid var(--pw-border)', backgroundColor: 'var(--pw-bg-secondary)' }}
    >
      <div className="px-4 py-4">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0 24px' }}>
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--pw-text-secondary)' }}>
              Struktur
            </p>

            <div className="mb-2">
              <div className="flex items-center mb-1">
                <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)', minWidth: '72px' }}>Typ</span>
                {!editMode && <EditIcon onClick={() => setEditMode(true)} />}
              </div>
              {editMode ? (
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  style={{ ...editInputStyle, width: '140px' }}
                >
                  {OBJECT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <span className="text-xs" style={{ color: 'var(--pw-text-primary)' }}>{object.objectType}</span>
              )}
            </div>

            <div className="mb-2">
              <div className="flex items-center mb-1">
                <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)', minWidth: '72px' }}>Namn</span>
                {!editMode && <EditIcon onClick={() => setEditMode(true)} />}
              </div>
              {editMode ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  style={{ ...editInputStyle, width: '180px' }}
                />
              ) : (
                <span className="text-xs" style={{ color: 'var(--pw-text-primary)' }}>{object.name}</span>
              )}
            </div>

            <div className="mb-3">
              <div className="flex items-center mb-1">
                <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)', minWidth: '72px' }}>Beskrivning</span>
                {!editMode && <EditIcon onClick={() => setEditMode(true)} />}
              </div>
              {editMode ? (
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  style={{ ...editInputStyle, width: '220px' }}
                />
              ) : (
                <span className="text-xs" style={{ color: 'var(--pw-text-primary)' }}>{object.description || '–'}</span>
              )}
            </div>

            {editMode && (
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSave(); }}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors"
                  style={{ border: '1px solid var(--pw-border)', color: 'var(--pw-text-primary)', backgroundColor: 'transparent', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Check size={11} />
                  Spara
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors"
                  style={{ border: '1px solid var(--pw-border)', color: 'var(--pw-text-tertiary)', backgroundColor: 'transparent', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <X size={11} />
                  Avbryt
                </button>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--pw-border)', paddingTop: '10px', marginTop: '10px' }}>
              <p className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
                {object.fieldsVerified} av {object.fieldsTotal} fält verifierade
              </p>
              {remaining > 0 && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>
                  {remaining} återstår
                </p>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onVerifyField(object.id); }}
                disabled={remaining === 0}
                className="mt-1.5 text-xs px-2 py-0.5 rounded transition-colors"
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
          </div>

          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--pw-text-secondary)' }}>
              Hänvisning
            </p>
            <p className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Inga hänvisningar</p>
          </div>

          <div>
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--pw-text-secondary)' }}>
              Dokument
            </p>
            <p className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Inga dokument</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ObjectListViewProps {
  objects: InsuranceObject[];
  expandedObjectId: string | null;
  selectedObjectIds?: Set<string>;
  onToggleObject: (id: string) => void;
  onToggleObjectSelect?: (id: string) => void;
  onSelectAll?: () => void;
  onUpdateObject: (id: string, patch: Partial<Pick<InsuranceObject, 'name' | 'objectType' | 'description'>>) => void;
  onVerifyField: (objId: string) => void;
  onUpdateParameter?: (objId: string, paramId: string, patch: { value?: string; status?: ParameterStatus }) => void;
  onUpdateBuildingParameter?: (objId: string, buildingId: string, paramId: string, patch: { value?: string; status?: ParameterStatus }) => void;
  onUpdateBuildings?: (objId: string, buildings: Building[]) => void;
  showCheckboxes?: boolean;
  sortColumn?: SortColumn;
  sortDirection?: SortDirection;
  onSort?: (col: SortColumn) => void;
}

const ObjectListView = ({
  objects,
  expandedObjectId,
  selectedObjectIds,
  onToggleObject,
  onToggleObjectSelect,
  onSelectAll,
  onUpdateObject,
  onVerifyField,
  onUpdateParameter,
  onUpdateBuildingParameter,
  onUpdateBuildings,
  showCheckboxes = false,
  sortColumn,
  sortDirection,
  onSort,
}: ObjectListViewProps) => {
  const allSelected = objects.length > 0 && objects.every((o) => selectedObjectIds?.has(o.id));
  const someSelected = !allSelected && objects.some((o) => selectedObjectIds?.has(o.id));

  if (objects.length === 0) {
    return (
      <p className="text-xs px-4 py-3" style={{ color: 'var(--pw-text-tertiary)' }}>
        Inga försäkringsobjekt
      </p>
    );
  }

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <ObjectListHeader
        showCheckbox={showCheckboxes}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={onSort}
        onSelectAll={onSelectAll}
        allSelected={allSelected}
        someSelected={someSelected}
      />
      {objects.map((obj) => {
        const isChecked = selectedObjectIds?.has(obj.id) ?? false;
        return (
          <React.Fragment key={obj.id}>
            <ObjectRow
              object={obj}
              isExpanded={expandedObjectId === obj.id}
              isChecked={isChecked}
              showCheckbox={showCheckboxes}
              onClick={() => onToggleObject(obj.id)}
              onCheckboxClick={onToggleObjectSelect ? (e) => { e.stopPropagation(); onToggleObjectSelect(obj.id); } : undefined}
            />
            {expandedObjectId === obj.id && (
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  backgroundColor: 'var(--pw-bg-secondary)',
                  isolation: 'isolate',
                }}
              >
                <ObjectThreeColumnView
                  object={obj}
                  onUpdateParameter={(paramId, patch) => onUpdateParameter?.(obj.id, paramId, patch)}
                  onUpdateBuildingParameter={(buildingId, paramId, patch) => onUpdateBuildingParameter?.(obj.id, buildingId, paramId, patch)}
                  onUpdateBuildings={(buildings) => onUpdateBuildings?.(obj.id, buildings)}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ObjectListView;
