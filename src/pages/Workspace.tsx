import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, ChevronDown, ChevronRight, Filter, FileSpreadsheet, FileDown } from 'lucide-react';
import { SortColumn, SortDirection } from '@/components/workspace/ObjectRow';
import { exportXLSX, exportPDF } from '@/utils/exportUtils';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import ObjectListView from '@/components/workspace/ObjectListView';
import ProgressPill from '@/components/workspace/ProgressPill';
import WorkspaceToast from '@/components/workspace/WorkspaceToast';
import {
  OrgTree,
  getTree,
  addRootCompany,
  addSubsidiary,
  deleteSubsidiaries,
  deleteInsuranceObjects,
  addInsuranceObject,
  incrementFieldVerified,
  updateInsuranceObject,
  updateObjectParameter,
  updateBuildingParameter,
  updateObjectBuildings,
  Building,
  InsuranceObject,
  ParameterStatus,
} from '@/data/mockOrgTree';
import {
  getNodeProgress,
  getSubsidiaryProgress,
} from '@/utils/progress';

type Panel = 'search' | 'add' | 'delete' | 'filter' | null;
const OBJECT_TYPE_OPTIONS = ['Fastighet', 'Bil', 'Maskin'];

interface NewObjectForm {
  objectType: string;
  name: string;
  description: string;
}

const inputBase: React.CSSProperties = {
  backgroundColor: 'var(--pw-bg-primary)',
  border: '1px solid var(--pw-border)',
  color: 'var(--pw-text-primary)',
  borderRadius: '4px',
  fontSize: '12px',
  padding: '4px 8px',
  outline: 'none',
};

const iBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  flexShrink: 0,
};

function OrgNrChip({ orgnr, onCopied }: { orgnr: string; onCopied: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(orgnr).catch(() => {});
        onCopied();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '11px',
        padding: '1px 6px',
        borderRadius: '4px',
        border: '1px solid var(--pw-border)',
        color: 'var(--pw-text-tertiary)',
        backgroundColor: hover ? 'var(--pw-bg-tertiary)' : 'transparent',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background 0.1s',
        marginLeft: '6px',
        flexShrink: 0,
      }}
      title="Kopiera orgnr"
    >
      {orgnr}
    </span>
  );
}

interface SubInlinePanelProps {
  panel: Panel;
  subSearch: string;
  setSubSearch: (v: string) => void;
  subAddValue: string;
  setSubAddValue: (v: string) => void;
  onAddSubsidiary: () => void;
  onBulkDelete: () => void;
  selectedCount: number;
  onClose: () => void;
}

function SubInlinePanel({
  panel, subSearch, setSubSearch, subAddValue, setSubAddValue,
  onAddSubsidiary, onBulkDelete, selectedCount, onClose,
}: SubInlinePanelProps) {
  if (panel === 'search') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input autoFocus value={subSearch} onChange={(e) => setSubSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          placeholder="Sök dotterbolag…" style={{ ...inputBase, width: '180px' }} />
      </div>
    );
  }
  if (panel === 'add') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input autoFocus value={subAddValue} onChange={(e) => setSubAddValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onAddSubsidiary(); if (e.key === 'Escape') onClose(); }}
          placeholder="Dotterbolagsnamn…" style={{ ...inputBase, width: '200px' }} />
        <button onClick={onAddSubsidiary} disabled={!subAddValue.trim()}
          style={{ ...inputBase, padding: '4px 10px', cursor: subAddValue.trim() ? 'pointer' : 'default', opacity: subAddValue.trim() ? 1 : 0.5, flexShrink: 0 }}>
          Lägg till
        </button>
      </div>
    );
  }
  if (panel === 'delete') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--pw-text-secondary)' }}>{selectedCount} markerade</span>
        <button onClick={onBulkDelete} disabled={selectedCount === 0}
          style={{ ...inputBase, padding: '3px 10px', color: selectedCount > 0 ? '#E5483F' : 'var(--pw-text-tertiary)', cursor: selectedCount > 0 ? 'pointer' : 'default', opacity: selectedCount > 0 ? 1 : 0.5, borderColor: selectedCount > 0 ? '#E5483F' : 'var(--pw-border)' }}>
          Ta bort
        </button>
      </div>
    );
  }
  return null;
}

interface ObjInlinePanelProps {
  panel: Panel;
  objSearch: string;
  setObjSearch: (v: string) => void;
  objTypeFilter: string;
  setObjTypeFilter: (v: string) => void;
  objAddForm: NewObjectForm;
  setObjAddForm: React.Dispatch<React.SetStateAction<NewObjectForm>>;
  onAddObject: () => void;
  onBulkDeleteObjects: () => void;
  selectedCount: number;
  onClose: () => void;
}

function ObjInlinePanel({
  panel, objSearch, setObjSearch, objTypeFilter, setObjTypeFilter,
  objAddForm, setObjAddForm, onAddObject, onBulkDeleteObjects, selectedCount, onClose,
}: ObjInlinePanelProps) {
  if (panel === 'search') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input autoFocus value={objSearch} onChange={(e) => setObjSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          placeholder="Sök objekt…" style={{ ...inputBase, width: '160px' }} />
      </div>
    );
  }
  if (panel === 'filter') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--pw-text-tertiary)' }}>Typ:</span>
        {['Alla', ...OBJECT_TYPE_OPTIONS].map((t) => (
          <button
            key={t}
            onClick={() => setObjTypeFilter(t)}
            style={{
              ...inputBase,
              padding: '2px 8px',
              cursor: 'pointer',
              backgroundColor: objTypeFilter === t ? 'var(--pw-bg-tertiary)' : 'transparent',
              color: objTypeFilter === t ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)',
              borderColor: objTypeFilter === t ? 'var(--pw-text-secondary)' : 'var(--pw-border)',
            }}
          >
            {t === 'Alla' ? 'Alla' : t}
          </button>
        ))}
      </div>
    );
  }
  if (panel === 'add') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'nowrap' }}>
        <select value={objAddForm.objectType} onChange={(e) => setObjAddForm((f) => ({ ...f, objectType: e.target.value }))} style={{ ...inputBase, width: '100px' }}>
          {OBJECT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input autoFocus value={objAddForm.name} onChange={(e) => setObjAddForm((f) => ({ ...f, name: e.target.value }))}
          onKeyDown={(e) => { if (e.key === 'Enter') onAddObject(); if (e.key === 'Escape') onClose(); }}
          placeholder="Namn…" style={{ ...inputBase, width: '140px' }} />
        <input value={objAddForm.description} onChange={(e) => setObjAddForm((f) => ({ ...f, description: e.target.value }))}
          onKeyDown={(e) => { if (e.key === 'Enter') onAddObject(); if (e.key === 'Escape') onClose(); }}
          placeholder="Beskrivning…" style={{ ...inputBase, width: '180px' }} />
        <button onClick={onAddObject} disabled={!objAddForm.name.trim()}
          style={{ ...inputBase, padding: '4px 10px', cursor: objAddForm.name.trim() ? 'pointer' : 'default', opacity: objAddForm.name.trim() ? 1 : 0.5, flexShrink: 0 }}>
          Lägg till
        </button>
      </div>
    );
  }
  if (panel === 'delete') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--pw-text-secondary)' }}>{selectedCount} markerade</span>
        <button onClick={onBulkDeleteObjects} disabled={selectedCount === 0}
          style={{ ...inputBase, padding: '3px 10px', color: selectedCount > 0 ? '#E5483F' : 'var(--pw-text-tertiary)', cursor: selectedCount > 0 ? 'pointer' : 'default', opacity: selectedCount > 0 ? 1 : 0.5, borderColor: selectedCount > 0 ? '#E5483F' : 'var(--pw-border)' }}>
          Ta bort
        </button>
      </div>
    );
  }
  return null;
}

interface SectionHeaderProps {
  title: string;
  count: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  panel: Panel;
  onPanelToggle: (p: Panel) => void;
  showDelete?: boolean;
  deleteDisabled?: boolean;
  showFilter?: boolean;
  filterActive?: boolean;
  panelContent: React.ReactNode;
  toolbarRef: React.RefObject<HTMLDivElement>;
  showExport?: boolean;
  exportDisabled?: boolean;
  onExportXLSX?: () => void;
  onExportPDF?: () => void;
}

function SectionHeader({
  title, count, isOpen, onToggleOpen, panel, onPanelToggle,
  showDelete, deleteDisabled, showFilter, filterActive, panelContent, toolbarRef,
  showExport, exportDisabled, onExportXLSX, onExportPDF,
}: SectionHeaderProps) {
  const hasDeleteSelection = showDelete && !deleteDisabled;
  const deleteColor = hasDeleteSelection ? '#E5483F' : 'var(--pw-text-tertiary)';

  return (
    <div
      ref={toolbarRef}
      className="flex items-center px-10 py-2 gap-2"
      style={{ borderBottom: isOpen ? '1px solid var(--pw-border)' : 'none', minHeight: '40px', cursor: 'default' }}
    >
      <button
        onClick={onToggleOpen}
        style={{ ...iBtn, color: 'var(--pw-text-tertiary)', width: '20px', height: '20px', cursor: 'pointer' }}
        title={isOpen ? 'Stäng' : 'Öppna'}
      >
        {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>

      <span
        onClick={onToggleOpen}
        style={{ fontWeight: 500, color: 'var(--pw-text-primary)', fontSize: '14px', flexShrink: 0, cursor: 'pointer', userSelect: 'none' }}
      >
        {title}
      </span>
      <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }}>
        {count}
      </span>

      <button
        onClick={() => onPanelToggle(panel === 'search' ? null : 'search')}
        title="Sök"
        style={{ ...iBtn, color: panel === 'search' ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = panel === 'search' ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)'; }}
      >
        <Search size={13} />
      </button>

      <button
        onClick={() => onPanelToggle(panel === 'add' ? null : 'add')}
        title="Lägg till"
        style={{ ...iBtn, color: panel === 'add' ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = panel === 'add' ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)'; }}
      >
        <Plus size={13} />
      </button>

      {showDelete && (
        <button
          onClick={() => !deleteDisabled && onPanelToggle(panel === 'delete' ? null : 'delete')}
          disabled={deleteDisabled}
          title="Ta bort markerade"
          style={{ ...iBtn, color: panel === 'delete' ? '#C83B34' : deleteColor, opacity: deleteDisabled ? 0.3 : 1, cursor: deleteDisabled ? 'default' : 'pointer' }}
          onMouseEnter={(e) => { if (!deleteDisabled) { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = '#C83B34'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = panel === 'delete' ? '#C83B34' : deleteColor; }}
        >
          <Trash2 size={13} />
        </button>
      )}

      {showFilter && (
        <button
          onClick={() => onPanelToggle(panel === 'filter' ? null : 'filter')}
          title="Filtrera"
          style={{ ...iBtn, color: panel === 'filter' || filterActive ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = panel === 'filter' || filterActive ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)'; }}
        >
          <Filter size={13} />
        </button>
      )}

      {showExport && (
        <>
          <button
            onClick={() => !exportDisabled && onExportXLSX?.()}
            disabled={exportDisabled}
            title="Exportera till Excel"
            style={{ ...iBtn, color: 'var(--pw-text-tertiary)', opacity: exportDisabled ? 0.3 : 1, cursor: exportDisabled ? 'default' : 'pointer' }}
            onMouseEnter={(e) => { if (!exportDisabled) { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-primary)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--pw-text-tertiary)'; }}
          >
            <FileSpreadsheet size={13} />
          </button>
          <button
            onClick={() => !exportDisabled && onExportPDF?.()}
            disabled={exportDisabled}
            title="Exportera till PDF"
            style={{ ...iBtn, color: 'var(--pw-text-tertiary)', opacity: exportDisabled ? 0.3 : 1, cursor: exportDisabled ? 'default' : 'pointer' }}
            onMouseEnter={(e) => { if (!exportDisabled) { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-primary)'; } }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--pw-text-tertiary)'; }}
          >
            <FileDown size={13} />
          </button>
        </>
      )}

      {panel !== null && panelContent && (
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
          {panelContent}
        </div>
      )}
    </div>
  );
}

const Workspace = () => {
  const { logout } = useLogout();
  const [tree, setTree] = useState<OrgTree>(getTree());
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sidebarSearch, setSidebarSearch] = useState('');

  const [selectedSubsidiaryIds, setSelectedSubsidiaryIds] = useState<Set<string>>(new Set());
  const [selectedObjectIds, setSelectedObjectIds] = useState<Set<string>>(new Set());

  const [subOpen, setSubOpen] = useState(true);
  const [objOpen, setObjOpen] = useState(true);

  const [subPanel, setSubPanel] = useState<Panel>(null);
  const [subSearch, setSubSearch] = useState('');
  const [subAddValue, setSubAddValue] = useState('');

  const [objPanel, setObjPanel] = useState<Panel>(null);
  const [objSearch, setObjSearch] = useState('');
  const [objTypeFilter, setObjTypeFilter] = useState('Alla');
  const [objAddForm, setObjAddForm] = useState<NewObjectForm>({ objectType: 'Fastighet', name: '', description: '' });
  const [objSortColumn, setObjSortColumn] = useState<SortColumn>(null);
  const [objSortDirection, setObjSortDirection] = useState<SortDirection>('asc');

  const [expandedObjectId, setExpandedObjectId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subToolbarRef = useRef<HTMLDivElement>(null);
  const objToolbarRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 1500);
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (subToolbarRef.current && !subToolbarRef.current.contains(target)) setSubPanel(null);
      if (objToolbarRef.current && !objToolbarRef.current.contains(target)) setObjPanel(null);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  const allRootIds = Object.keys(tree);
  const rootCompanyNames: Record<string, string> = {};
  for (const id of allRootIds) rootCompanyNames[id] = tree[id].name;

  const rootCompany = selectedRootId ? tree[selectedRootId] : null;
  const selectedSubsidiary =
    selectedRootId && selectedSubsidiaryId
      ? rootCompany?.subsidiaries.find((s) => s.id === selectedSubsidiaryId) ?? null
      : null;

  const rootProgress = selectedRootId ? getNodeProgress(selectedRootId, tree) : null;
  const subsidiaryProgress =
    selectedRootId && selectedSubsidiaryId
      ? getSubsidiaryProgress(selectedRootId, selectedSubsidiaryId, tree)
      : null;

  const currentObjects: InsuranceObject[] = selectedRootId
    ? selectedSubsidiaryId === null
      ? (rootCompany?.rootInsuranceObjects ?? [])
      : (selectedSubsidiary?.insuranceObjects ?? [])
    : [];

  const filteredObjects = (() => {
    const filtered = currentObjects.filter((obj) => {
      const matchType = objTypeFilter === 'Alla' || obj.objectType === objTypeFilter;
      const q = objSearch.toLowerCase();
      const matchSearch = !q || obj.name.toLowerCase().includes(q) || obj.objectType.toLowerCase().includes(q) || obj.description.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
    if (!objSortColumn) return filtered;
    return [...filtered].sort((a, b) => {
      let valA = '';
      let valB = '';
      if (objSortColumn === 'type') { valA = a.objectType; valB = b.objectType; }
      else if (objSortColumn === 'name') { valA = a.name; valB = b.name; }
      else if (objSortColumn === 'description') { valA = a.description; valB = b.description; }
      const cmp = valA.localeCompare(valB, 'sv');
      return objSortDirection === 'asc' ? cmp : -cmp;
    });
  })();

  const filteredSubsidiaries =
    rootCompany?.subsidiaries.filter((s) => !subSearch || s.name.toLowerCase().includes(subSearch.toLowerCase())) ?? [];

  const handleSelectRoot = (id: string) => {
    setSelectedRootId(id);
    setSelectedSubsidiaryId(null);
    setSelectedSubsidiaryIds(new Set());
    setSelectedObjectIds(new Set());
    setExpandedObjectId(null);
    setSubPanel(null);
    setObjPanel(null);
    setSubSearch('');
    setObjSearch('');
    setObjTypeFilter('Alla');
    setObjSortColumn(null);
    setObjSortDirection('asc');
    setSubOpen(true);
    setObjOpen(true);
  };

  const handleSelectSubsidiary = (id: string) => {
    setSelectedSubsidiaryId(id);
    setExpandedObjectId(null);
    setSelectedObjectIds(new Set());
    setObjPanel(null);
    setObjSearch('');
    setObjTypeFilter('Alla');
    setObjSortColumn(null);
    setObjSortDirection('asc');
  };

  const handleObjSort = (col: SortColumn) => {
    if (objSortColumn === col) {
      setObjSortDirection((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setObjSortColumn(col);
      setObjSortDirection('asc');
    }
  };

  const handleBackToRoot = () => {
    setSelectedSubsidiaryId(null);
    setExpandedObjectId(null);
    setSelectedObjectIds(new Set());
  };

  const handleLogoClick = () => {
    setSelectedRootId(null);
    setSelectedSubsidiaryId(null);
    setSelectedSubsidiaryIds(new Set());
    setSelectedObjectIds(new Set());
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const handleAddRootCompany = (name: string) => {
    addRootCompany(name);
    setTree(getTree());
  };

  const handleAddSubsidiary = () => {
    if (!selectedRootId || !subAddValue.trim()) return;
    addSubsidiary(selectedRootId, subAddValue.trim());
    setTree(getTree());
    setSubAddValue('');
    setSubPanel(null);
  };

  const handleToggleSubsidiarySelect = (id: string) => {
    setSelectedSubsidiaryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleToggleObjectSelect = (id: string) => {
    setSelectedObjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (!selectedRootId || selectedSubsidiaryIds.size === 0) return;
    setSubPanel(null);
    const count = selectedSubsidiaryIds.size;
    const step1 = window.confirm(
      `Vill du ta bort ${count === 1 ? 'dotterbolaget' : `${count} dotterbolag`}? Alla tillhörande försäkringsobjekt raderas.`
    );
    if (!step1) return;
    const step2 = window.prompt('Skriv OK för att bekräfta borttagningen.');
    if (step2 !== 'OK') return;
    const ids = Array.from(selectedSubsidiaryIds);
    if (selectedSubsidiaryId && ids.includes(selectedSubsidiaryId)) setSelectedSubsidiaryId(null);
    deleteSubsidiaries(selectedRootId, ids);
    setTree(getTree());
    setSelectedSubsidiaryIds(new Set());
    showToast(`${count === 1 ? 'Dotterbolaget' : `${count} dotterbolag`} borttaget`);
  };

  const handleBulkDeleteObjects = () => {
    if (!selectedRootId || selectedObjectIds.size === 0) return;
    setObjPanel(null);
    const count = selectedObjectIds.size;
    const step1 = window.confirm(
      `Vill du ta bort ${count === 1 ? 'försäkringsobjektet' : `${count} försäkringsobjekt`}?`
    );
    if (!step1) return;
    const step2 = window.prompt(
      `${count === 1 ? 'Försäkringsobjektet' : 'Objekten'} kommer att tas bort. Skriv OK i rutan.`
    );
    if (step2 !== 'OK') return;
    const ids = Array.from(selectedObjectIds);
    if (expandedObjectId && ids.includes(expandedObjectId)) setExpandedObjectId(null);
    deleteInsuranceObjects(selectedRootId, selectedSubsidiaryId, ids);
    setTree(getTree());
    setSelectedObjectIds(new Set());
    showToast(`${count === 1 ? 'Försäkringsobjektet' : `${count} försäkringsobjekt`} borttaget`);
  };

  const getExportContextName = () => {
    if (selectedSubsidiary) return selectedSubsidiary.name;
    if (rootCompany) return rootCompany.name;
    return '';
  };

  const handleExportXLSX = () => {
    if (selectedObjectIds.size === 0) return;
    exportXLSX(currentObjects, selectedObjectIds, `${getExportContextName()}_forsäkringsobjekt.xlsx`);
  };

  const handleExportPDF = () => {
    if (selectedObjectIds.size === 0) return;
    exportPDF(currentObjects, selectedObjectIds, getExportContextName());
  };

  const handleAddObject = () => {
    if (!selectedRootId || !objAddForm.name.trim()) return;
    addInsuranceObject(selectedRootId, selectedSubsidiaryId, {
      name: objAddForm.name.trim(),
      objectType: objAddForm.objectType,
      description: objAddForm.description.trim(),
      fieldsTotal: 10,
      fieldsVerified: 0,
    });
    setTree(getTree());
    setObjAddForm({ objectType: 'Fastighet', name: '', description: '' });
    setObjPanel(null);
  };

  const handleToggleObject = (id: string) => {
    setExpandedObjectId((prev) => (prev === id ? null : id));
  };

  const handleUpdateObject = (
    objId: string,
    patch: Partial<Pick<InsuranceObject, 'name' | 'objectType' | 'description'>>
  ) => {
    if (!selectedRootId) return;
    updateInsuranceObject(selectedRootId, selectedSubsidiaryId, objId, patch);
    setTree(getTree());
  };

  const handleVerifyField = (objId: string) => {
    if (!selectedRootId) return;
    incrementFieldVerified(selectedRootId, selectedSubsidiaryId, objId);
    setTree(getTree());
  };

  const handleUpdateParameter = (
    objId: string,
    paramId: string,
    patch: { value?: string; status?: ParameterStatus }
  ) => {
    if (!selectedRootId) return;
    updateObjectParameter(selectedRootId, selectedSubsidiaryId, objId, paramId, patch);
    setTree(getTree());
  };

  const handleUpdateBuildingParameter = (
    objId: string,
    buildingId: string,
    paramId: string,
    patch: { value?: string; status?: ParameterStatus }
  ) => {
    if (!selectedRootId) return;
    updateBuildingParameter(selectedRootId, selectedSubsidiaryId, objId, buildingId, paramId, patch);
    setTree(getTree());
  };

  const handleUpdateBuildings = (objId: string, buildings: Building[]) => {
    if (!selectedRootId) return;
    updateObjectBuildings(selectedRootId, selectedSubsidiaryId, objId, buildings);
    setTree(getTree());
  };


  const renderHome = () => (
    <div className="flex items-center justify-center h-full" style={{ minHeight: '200px' }}>
      <p style={{ color: 'var(--pw-text-tertiary)', fontSize: '14px' }}>
        Välj ett moderbolag i panelen till vänster för att komma igång.
      </p>
    </div>
  );

  const renderRootView = () => {
    if (!rootCompany || !selectedRootId) return null;
    const subCount = rootCompany.subsidiaries.length;
    const objCount = currentObjects.length;

    return (
      <div>
        <div className="px-10 pt-8 pb-4" style={{ borderBottom: '1px solid var(--pw-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 style={{ color: 'var(--pw-text-primary)', fontSize: '26px', fontWeight: 500, lineHeight: 1.2 }}>
                {rootCompany.name}
              </h1>
              {rootCompany.orgnr && (
                <OrgNrChip orgnr={rootCompany.orgnr} onCopied={() => showToast('Orgnr kopierat')} />
              )}
            </div>
            {rootProgress && <ProgressPill pct={rootProgress.pct} showPct={true} barWidth={100} />}
          </div>
        </div>

        <div style={{ borderBottom: '1px solid var(--pw-border)' }}>
          <SectionHeader
            title="Dotterbolag"
            count={subCount}
            isOpen={subOpen}
            onToggleOpen={() => setSubOpen((v) => !v)}
            panel={subPanel}
            onPanelToggle={setSubPanel}
            showDelete={true}
            deleteDisabled={selectedSubsidiaryIds.size === 0}
            toolbarRef={subToolbarRef}
            panelContent={
              <SubInlinePanel
                panel={subPanel}
                subSearch={subSearch} setSubSearch={setSubSearch}
                subAddValue={subAddValue} setSubAddValue={setSubAddValue}
                onAddSubsidiary={handleAddSubsidiary}
                onBulkDelete={handleBulkDelete}
                selectedCount={selectedSubsidiaryIds.size}
                onClose={() => setSubPanel(null)}
              />
            }
          />

          {subOpen && (
            <>
              <div
                className="flex items-center px-10 py-1.5"
                style={{ gap: '8px', borderBottom: '1px solid var(--pw-border)' }}
              >
                <div style={{ width: '24px', flexShrink: 0 }} />
                <span className="text-xs flex-1" style={{ color: 'var(--pw-text-tertiary)' }}>Namn</span>
                <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)', width: '140px', flexShrink: 0 }}>Färdigställt</span>
              </div>

              {filteredSubsidiaries.length === 0 ? (
                <p className="text-xs px-10 py-3" style={{ color: 'var(--pw-text-tertiary)' }}>
                  {subSearch ? 'Inga träffar' : 'Inga dotterbolag'}
                </p>
              ) : (
                filteredSubsidiaries.map((sub) => {
                  const isSelected = selectedSubsidiaryId === sub.id;
                  const isChecked = selectedSubsidiaryIds.has(sub.id);
                  const prog = getSubsidiaryProgress(selectedRootId, sub.id, tree);
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center px-10 py-2 transition-colors cursor-pointer"
                      style={{
                        gap: '8px',
                        backgroundColor: isSelected ? 'var(--pw-bg-tertiary)' : 'transparent',
                        borderLeft: isSelected ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
                      }}
                      onClick={() => handleSelectSubsidiary(sub.id)}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ width: '24px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          onClick={(e) => { e.stopPropagation(); handleToggleSubsidiarySelect(sub.id); }}
                          style={{ cursor: 'pointer', accentColor: 'var(--pw-accent-red)', width: '14px', height: '14px' }}
                        />
                      </div>
                      <span className="flex items-center min-w-0 flex-1">
                        <span
                          className="text-sm truncate"
                          style={{ color: isSelected ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)', fontWeight: isSelected ? 500 : 400 }}
                        >
                          {sub.name}
                        </span>
                        {sub.orgnr && (
                          <OrgNrChip orgnr={sub.orgnr} onCopied={() => showToast('Orgnr kopierat')} />
                        )}
                      </span>
                      <div style={{ width: '140px', flexShrink: 0 }}>
                        <ProgressPill pct={prog.pct} showPct={false} />
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        <div>
          <SectionHeader
            title="Försäkringsobjekt"
            count={objCount}
            isOpen={objOpen}
            onToggleOpen={() => setObjOpen((v) => !v)}
            panel={objPanel}
            onPanelToggle={setObjPanel}
            showDelete={true}
            deleteDisabled={selectedObjectIds.size === 0}
            showFilter={true}
            filterActive={objTypeFilter !== 'Alla'}
            showExport={true}
            exportDisabled={selectedObjectIds.size === 0}
            onExportXLSX={handleExportXLSX}
            onExportPDF={handleExportPDF}
            toolbarRef={objToolbarRef}
            panelContent={
              <ObjInlinePanel
                panel={objPanel}
                objSearch={objSearch} setObjSearch={setObjSearch}
                objTypeFilter={objTypeFilter} setObjTypeFilter={setObjTypeFilter}
                objAddForm={objAddForm} setObjAddForm={setObjAddForm}
                onAddObject={handleAddObject}
                onBulkDeleteObjects={handleBulkDeleteObjects}
                selectedCount={selectedObjectIds.size}
                onClose={() => setObjPanel(null)}
              />
            }
          />
          {objOpen && (
            <ObjectListView
              objects={filteredObjects}
              expandedObjectId={expandedObjectId}
              selectedObjectIds={selectedObjectIds}
              onToggleObject={handleToggleObject}
              onToggleObjectSelect={handleToggleObjectSelect}
              onUpdateObject={handleUpdateObject}
              onVerifyField={handleVerifyField}
              onUpdateParameter={handleUpdateParameter}
              onUpdateBuildingParameter={handleUpdateBuildingParameter}
              onUpdateBuildings={handleUpdateBuildings}
              showCheckboxes={true}
              sortColumn={objSortColumn}
              sortDirection={objSortDirection}
              onSort={handleObjSort}
            />
          )}
        </div>
      </div>
    );
  };

  const renderSubsidiaryView = () => {
    if (!rootCompany || !selectedSubsidiary || !selectedRootId) return null;
    const objCount = currentObjects.length;

    return (
      <div>
        <div className="px-10 pt-8 pb-4" style={{ borderBottom: '1px solid var(--pw-border)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <span
                  onClick={handleBackToRoot}
                  style={{ color: 'var(--pw-text-secondary)', fontSize: '16px', fontWeight: 400, lineHeight: 1.2, cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pw-text-primary)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--pw-text-secondary)'; }}
                >
                  {rootCompany.name}
                </span>
                {rootCompany.orgnr && (
                  <OrgNrChip orgnr={rootCompany.orgnr} onCopied={() => showToast('Orgnr kopierat')} />
                )}
              </div>
              <div className="flex items-center mt-2">
                <h1 style={{ color: 'var(--pw-text-primary)', fontSize: '26px', fontWeight: 600, lineHeight: 1.2 }}>
                  {selectedSubsidiary.name}
                </h1>
                {selectedSubsidiary.orgnr && (
                  <OrgNrChip orgnr={selectedSubsidiary.orgnr} onCopied={() => showToast('Orgnr kopierat')} />
                )}
              </div>
            </div>
            {subsidiaryProgress && (
              <ProgressPill pct={subsidiaryProgress.pct} showPct={true} barWidth={100} />
            )}
          </div>
        </div>

        <div>
          <SectionHeader
            title="Försäkringsobjekt"
            count={objCount}
            isOpen={objOpen}
            onToggleOpen={() => setObjOpen((v) => !v)}
            panel={objPanel}
            onPanelToggle={setObjPanel}
            showDelete={true}
            deleteDisabled={selectedObjectIds.size === 0}
            showFilter={true}
            filterActive={objTypeFilter !== 'Alla'}
            showExport={true}
            exportDisabled={selectedObjectIds.size === 0}
            onExportXLSX={handleExportXLSX}
            onExportPDF={handleExportPDF}
            toolbarRef={objToolbarRef}
            panelContent={
              <ObjInlinePanel
                panel={objPanel}
                objSearch={objSearch} setObjSearch={setObjSearch}
                objTypeFilter={objTypeFilter} setObjTypeFilter={setObjTypeFilter}
                objAddForm={objAddForm} setObjAddForm={setObjAddForm}
                onAddObject={handleAddObject}
                onBulkDeleteObjects={handleBulkDeleteObjects}
                selectedCount={selectedObjectIds.size}
                onClose={() => setObjPanel(null)}
              />
            }
          />
          {objOpen && (
            <ObjectListView
              objects={filteredObjects}
              expandedObjectId={expandedObjectId}
              selectedObjectIds={selectedObjectIds}
              onToggleObject={handleToggleObject}
              onToggleObjectSelect={handleToggleObjectSelect}
              onUpdateObject={handleUpdateObject}
              onVerifyField={handleVerifyField}
              onUpdateParameter={handleUpdateParameter}
              onUpdateBuildingParameter={handleUpdateBuildingParameter}
              onUpdateBuildings={handleUpdateBuildings}
              showCheckboxes={true}
              sortColumn={objSortColumn}
              sortDirection={objSortDirection}
              onSort={handleObjSort}
            />
          )}
        </div>
      </div>
    );
  };

  const mainContent = !selectedRootId
    ? renderHome()
    : selectedSubsidiaryId
    ? renderSubsidiaryView()
    : renderRootView();

  return (
    <>
      <WorkspaceToast message={toastMessage} isVisible={toastVisible} />
      <WorkspaceShell
        sidebar={
          <WorkspaceSidebar
            companies={allRootIds}
            companyNames={rootCompanyNames}
            selectedCompany={selectedRootId}
            onSelectCompany={handleSelectRoot}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            searchValue={sidebarSearch}
            onSearchChange={setSidebarSearch}
            onLogout={logout}
            onLogoClick={handleLogoClick}
            onAddCompany={handleAddRootCompany}
            tree={tree}
          />
        }
      >
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--pw-bg-primary)' }}>
          {mainContent}
        </div>
      </WorkspaceShell>
    </>
  );
};

export default Workspace;
