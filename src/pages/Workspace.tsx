import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, X, Filter } from 'lucide-react';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import ObjectListView from '@/components/workspace/ObjectListView';
import ProgressPill from '@/components/workspace/ProgressPill';
import CopyChip from '@/components/workspace/CopyChip';
import WorkspaceToast from '@/components/workspace/WorkspaceToast';
import {
  OrgTree,
  ROOT_COMPANY_IDS,
  CompanyNode,
  getTree,
  getPathToNode,
  addChildNode,
  addInsuranceObject,
  incrementFieldVerified,
} from '@/data/mockOrgTree';
import { getNodeProgress, getDirectObjectsProgress } from '@/utils/progress';

type Panel = 'search' | 'add' | 'filter' | null;

const OBJECT_TYPE_OPTIONS = ['Fastighet', 'Bil', 'Maskin'];
const SUB_SORT_OPTIONS = [
  { value: 'az', label: 'Namn A–Ö' },
  { value: 'za', label: 'Namn Ö–A' },
];
const OBJ_SORT_OPTIONS = [
  { value: 'az', label: 'Namn A–Ö' },
  { value: 'za', label: 'Namn Ö–A' },
  { value: 'pct_desc', label: 'Färdigställt högst' },
  { value: 'pct_asc', label: 'Färdigställt lägst' },
];

interface NewObjectForm {
  objectType: string;
  name: string;
  description: string;
}

const iStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  borderRadius: '4px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'color 0.12s, background 0.12s',
};

const inputBase: React.CSSProperties = {
  backgroundColor: 'var(--pw-bg-primary)',
  border: '1px solid var(--pw-border)',
  color: 'var(--pw-text-primary)',
  borderRadius: '4px',
  fontSize: '12px',
  padding: '4px 8px',
  outline: 'none',
};

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

const IconBtn = ({
  active,
  title,
  onClick,
  children,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={title}
    style={{
      ...iStyle,
      color: active ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)',
      backgroundColor: active ? 'var(--pw-bg-tertiary)' : 'transparent',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = 'var(--pw-text-primary)';
      if (!active) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = active ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)';
      e.currentTarget.style.backgroundColor = active ? 'var(--pw-bg-tertiary)' : 'transparent';
    }}
  >
    {children}
  </button>
);

const SubSearchPanel = ({
  value,
  onChange,
  autoFocusRef,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocusRef: React.RefObject<HTMLInputElement>;
}) => (
  <div className="flex items-center gap-1.5" style={{ minWidth: '180px' }}>
    <input
      ref={autoFocusRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Escape') onChange(''); }}
      placeholder="Sök dotterbolag…"
      className="text-xs outline-none"
      style={{ ...inputBase, flex: 1, padding: '3px 7px' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
    />
    {value && (
      <button onClick={() => onChange('')} style={{ ...iStyle, color: 'var(--pw-text-tertiary)' }}>
        <X size={11} />
      </button>
    )}
  </div>
);

const SubAddPanel = ({
  value,
  onChange,
  onConfirm,
  autoFocusRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onConfirm: () => void;
  autoFocusRef: React.RefObject<HTMLInputElement>;
}) => (
  <div className="flex items-center gap-1.5" style={{ minWidth: '200px' }}>
    <input
      ref={autoFocusRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter' && value.trim()) onConfirm(); }}
      placeholder="Dotterbolagsnamn…"
      className="text-xs outline-none"
      style={{ ...inputBase, flex: 1, padding: '3px 7px' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
    />
    <button
      onClick={onConfirm}
      disabled={!value.trim()}
      className="text-xs px-2 py-0.5 rounded"
      style={{
        border: `1px solid ${value.trim() ? 'var(--pw-accent-red)' : 'var(--pw-border)'}`,
        color: value.trim() ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)',
        backgroundColor: 'transparent',
        cursor: value.trim() ? 'pointer' : 'default',
        opacity: value.trim() ? 1 : 0.5,
        whiteSpace: 'nowrap',
      }}
    >
      Skapa
    </button>
  </div>
);

const SubFilterPanel = ({
  sortVal,
  onSort,
}: {
  sortVal: string;
  onSort: (v: string) => void;
}) => (
  <div className="flex items-center gap-2" style={{ minWidth: '160px' }}>
    <span className="text-xs shrink-0" style={{ color: 'var(--pw-text-tertiary)' }}>Sortera:</span>
    <select
      value={sortVal}
      onChange={(e) => onSort(e.target.value)}
      className="text-xs rounded outline-none cursor-pointer"
      style={{ ...inputBase, padding: '3px 7px', flex: 1 }}
      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
    >
      {SUB_SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const ObjSearchPanel = ({
  value,
  onChange,
  autoFocusRef,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocusRef: React.RefObject<HTMLInputElement>;
}) => (
  <div className="flex items-center gap-1.5" style={{ minWidth: '180px' }}>
    <input
      ref={autoFocusRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Escape') onChange(''); }}
      placeholder="Sök försäkringsobjekt…"
      className="text-xs outline-none"
      style={{ ...inputBase, flex: 1, padding: '3px 7px' }}
      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
    />
    {value && (
      <button onClick={() => onChange('')} style={{ ...iStyle, color: 'var(--pw-text-tertiary)' }}>
        <X size={11} />
      </button>
    )}
  </div>
);

const ObjAddPanel = ({
  form,
  onChange,
  onConfirm,
  typeRef,
}: {
  form: NewObjectForm;
  onChange: (f: NewObjectForm) => void;
  onConfirm: () => void;
  typeRef: React.RefObject<HTMLSelectElement>;
}) => {
  const valid = form.objectType.trim() !== '' || form.name.trim() !== '' || form.description.trim() !== '';
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && valid) onConfirm(); };
  const fb = (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)');
  const bb = (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = 'var(--pw-border)');
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <select
        ref={typeRef}
        value={form.objectType}
        onChange={(e) => onChange({ ...form, objectType: e.target.value })}
        onKeyDown={handleKey}
        onFocus={fb} onBlur={bb}
        className="text-xs rounded outline-none cursor-pointer"
        style={{ ...inputBase, padding: '3px 7px', width: '90px' }}
      >
        {OBJECT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <input
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        onKeyDown={handleKey}
        onFocus={fb} onBlur={bb}
        placeholder="Namn…"
        className="text-xs outline-none"
        style={{ ...inputBase, padding: '3px 7px', width: '110px' }}
      />
      <input
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        onKeyDown={handleKey}
        onFocus={fb} onBlur={bb}
        placeholder="Beskrivning…"
        className="text-xs outline-none"
        style={{ ...inputBase, padding: '3px 7px', width: '140px' }}
      />
      <button
        onClick={onConfirm}
        disabled={!valid}
        className="text-xs px-2 py-0.5 rounded"
        style={{
          border: `1px solid ${valid ? 'var(--pw-accent-red)' : 'var(--pw-border)'}`,
          color: valid ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)',
          backgroundColor: 'transparent',
          cursor: valid ? 'pointer' : 'default',
          opacity: valid ? 1 : 0.5,
          whiteSpace: 'nowrap',
        }}
      >
        Skapa
      </button>
    </div>
  );
};

const ObjFilterPanel = ({
  sortVal,
  onSort,
  typeFilter,
  onTypeFilter,
}: {
  sortVal: string;
  onSort: (v: string) => void;
  typeFilter: string;
  onTypeFilter: (v: string) => void;
}) => (
  <div className="flex items-center gap-3 flex-wrap">
    <div className="flex items-center gap-1.5">
      <span className="text-xs shrink-0" style={{ color: 'var(--pw-text-tertiary)' }}>Typ:</span>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilter(e.target.value)}
        className="text-xs rounded outline-none cursor-pointer"
        style={{ ...inputBase, padding: '3px 7px', width: '100px' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
      >
        {['Alla', 'Fastighet', 'Bil', 'Maskin'].map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="text-xs shrink-0" style={{ color: 'var(--pw-text-tertiary)' }}>Sortera:</span>
      <select
        value={sortVal}
        onChange={(e) => onSort(e.target.value)}
        className="text-xs rounded outline-none cursor-pointer"
        style={{ ...inputBase, padding: '3px 7px', width: '150px' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
      >
        {OBJ_SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  </div>
);

const SectionHeader = ({
  title,
  count,
  isOpen,
  onToggle,
  progress,
  activePanel,
  onPanelToggle,
  panelContent,
  headerRef,
}: {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  progress: number;
  activePanel: Panel;
  onPanelToggle: (p: Panel) => void;
  panelContent: React.ReactNode;
  headerRef: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={headerRef}
    className="flex items-center gap-2 px-10 py-2 flex-wrap"
    style={{ borderBottom: '1px solid var(--pw-border)', minHeight: '40px' }}
  >
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-sm shrink-0"
      style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}
    >
      <span
        className="text-xs"
        style={{ color: 'var(--pw-text-tertiary)', display: 'inline-block', width: '10px', textAlign: 'center' }}
      >
        {isOpen ? '▾' : '▸'}
      </span>
      {title}
      <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}>
        {count}
      </span>
    </button>

    <div className="flex items-center gap-0.5 shrink-0">
      <IconBtn active={activePanel === 'search'} title="Sök" onClick={() => onPanelToggle('search')}>
        <Search size={13} />
      </IconBtn>
      <IconBtn active={activePanel === 'add'} title="Lägg till" onClick={() => onPanelToggle('add')}>
        <Plus size={13} />
      </IconBtn>
      <IconBtn active={activePanel === 'filter'} title="Filtrera / sortera" onClick={() => onPanelToggle('filter')}>
        <Filter size={13} />
      </IconBtn>
    </div>

    {activePanel && panelContent && (
      <div className="flex items-center ml-2">
        {panelContent}
      </div>
    )}

    <div className="ml-auto shrink-0">
      <ProgressPill pct={progress} showPct={true} barWidth={80} />
    </div>
  </div>
);

const Workspace = () => {
  const [tree, setTree] = useState<OrgTree>(() => ({ ...getTree() }));
  const [rootCompanyIds, setRootCompanyIds] = useState<string[]>([...ROOT_COMPANY_IDS]);

  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedObjectId, setExpandedObjectId] = useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const [isSubsidiariesOpen, setIsSubsidiariesOpen] = useState(true);
  const [isObjectsOpen, setIsObjectsOpen] = useState(true);

  const [subActivePanel, setSubActivePanel] = useState<Panel>(null);
  const [subSearch, setSubSearch] = useState('');
  const [subAddName, setSubAddName] = useState('');
  const [subSort, setSubSort] = useState('az');

  const [objActivePanel, setObjActivePanel] = useState<Panel>(null);
  const [objSearch, setObjSearch] = useState('');
  const [objAddForm, setObjAddForm] = useState<NewObjectForm>({ objectType: 'Fastighet', name: '', description: '' });
  const [objSort, setObjSort] = useState('az');
  const [objTypeFilter, setObjTypeFilter] = useState('Alla');

  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 1500);
  }, []);

  const subHeaderRef = useRef<HTMLDivElement>(null);
  const objHeaderRef = useRef<HTMLDivElement>(null);
  const subSearchInputRef = useRef<HTMLInputElement>(null);
  const subAddInputRef = useRef<HTMLInputElement>(null);
  const objSearchInputRef = useRef<HTMLInputElement>(null);
  const objAddTypeRef = useRef<HTMLSelectElement>(null);

  useClickOutside(subHeaderRef, useCallback(() => setSubActivePanel(null), []));
  useClickOutside(objHeaderRef, useCallback(() => setObjActivePanel(null), []));

  useEffect(() => { if (subActivePanel === 'search') subSearchInputRef.current?.focus(); }, [subActivePanel]);
  useEffect(() => { if (subActivePanel === 'add') subAddInputRef.current?.focus(); }, [subActivePanel]);
  useEffect(() => { if (objActivePanel === 'search') objSearchInputRef.current?.focus(); }, [objActivePanel]);
  useEffect(() => { if (objActivePanel === 'add') objAddTypeRef.current?.focus(); }, [objActivePanel]);

  const { logout } = useLogout();

  const rootCompanies = rootCompanyIds.map((id) => tree[id]).filter((n): n is CompanyNode => Boolean(n));

  const handleLogoClick = () => {
    setSelectedRootId(null);
    setSelectedNodeId(null);
    setExpandedObjectId(null);
    setSubActivePanel(null);
    setObjActivePanel(null);
    setSubSearch('');
    setSubAddName('');
    setObjSearch('');
    setObjAddForm({ objectType: 'Fastighet', name: '', description: '' });
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const handleAddCompany = (name: string) => {
    const newId = `custom-root-${Date.now()}`;
    const newNode: CompanyNode = {
      id: newId,
      name,
      parentId: null,
      childCompanyIds: [],
      insuranceObjects: [],
    };
    setTree((prev) => ({ ...prev, [newId]: newNode }));
    setRootCompanyIds((prev) => [...prev, newId]);
  };

  const resetPanels = () => {
    setSubActivePanel(null);
    setObjActivePanel(null);
    setSubSearch('');
    setSubAddName('');
    setObjSearch('');
    setObjAddForm({ objectType: 'Fastighet', name: '', description: '' });
  };

  const handleSelectRoot = (id: string) => {
    setSelectedRootId(id);
    setSelectedNodeId(id);
    setExpandedObjectId(null);
    resetPanels();
  };

  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id);
    setExpandedObjectId(null);
    resetPanels();
  };

  const handleToggleObject = (id: string) => {
    setExpandedObjectId((prev) => (prev === id ? null : id));
  };

  const handleSubPanelToggle = (p: Panel) => {
    setSubActivePanel((prev) => (prev === p ? null : p));
    if (p !== 'search') setSubSearch('');
    if (p !== 'add') setSubAddName('');
  };

  const handleObjPanelToggle = (p: Panel) => {
    setObjActivePanel((prev) => (prev === p ? null : p));
    if (p !== 'search') setObjSearch('');
    if (p !== 'add') setObjAddForm({ objectType: 'Fastighet', name: '', description: '' });
  };

  const handleConfirmAddSubsidiary = () => {
    const name = subAddName.trim();
    if (!name || !selectedNodeId) return;
    const newNode = addChildNode(selectedNodeId, name);
    setSubAddName('');
    setSubActivePanel(null);
    setSelectedNodeId(newNode.id);
    setExpandedObjectId(null);
    setTree({ ...getTree() });
  };

  const handleConfirmAddObject = () => {
    const valid = objAddForm.objectType.trim() !== '' || objAddForm.name.trim() !== '' || objAddForm.description.trim() !== '';
    if (!valid || !selectedNodeId) return;
    addInsuranceObject(
      selectedNodeId,
      objAddForm.name.trim(),
      objAddForm.objectType.trim() || 'Fastighet',
      objAddForm.description.trim(),
    );
    setObjAddForm({ objectType: 'Fastighet', name: '', description: '' });
    setObjActivePanel(null);
    setTree({ ...getTree() });
  };

  const handleVerifyField = (nodeId: string, objectId: string) => {
    const updated = incrementFieldVerified(nodeId, objectId);
    setTree({ ...updated });
  };

  const currentNode = selectedNodeId ? tree[selectedNodeId] : null;

  const childNodes = currentNode
    ? currentNode.childCompanyIds.map((id) => tree[id]).filter((n): n is CompanyNode => Boolean(n))
    : [];

  const filteredChildren = (() => {
    let list = [...childNodes];
    if (subSearch) list = list.filter((n) => n.name.toLowerCase().includes(subSearch.toLowerCase()));
    if (subSort === 'az') list.sort((a, b) => a.name.localeCompare(b.name, 'sv', { sensitivity: 'base' }));
    if (subSort === 'za') list.sort((a, b) => b.name.localeCompare(a.name, 'sv', { sensitivity: 'base' }));
    return list;
  })();

  const currentObjects = currentNode ? currentNode.insuranceObjects : [];

  const filteredObjects = (() => {
    let list = [...currentObjects];
    const q = objSearch.toLowerCase();
    if (q) list = list.filter((o) =>
      o.name.toLowerCase().includes(q) ||
      o.objectType.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q)
    );
    if (objTypeFilter !== 'Alla') list = list.filter((o) => o.objectType === objTypeFilter);
    if (objSort === 'az') list.sort((a, b) => a.name.localeCompare(b.name, 'sv', { sensitivity: 'base' }));
    if (objSort === 'za') list.sort((a, b) => b.name.localeCompare(a.name, 'sv', { sensitivity: 'base' }));
    if (objSort === 'pct_desc') list.sort((a, b) => b.completedPct - a.completedPct);
    if (objSort === 'pct_asc') list.sort((a, b) => a.completedPct - b.completedPct);
    return list;
  })();

  const path = selectedNodeId ? getPathToNode(selectedNodeId) : [];
  const rootNode = selectedRootId ? tree[selectedRootId] : null;
  const rootProgress = selectedRootId ? getNodeProgress(selectedRootId, tree) : null;
  const subsProgress = selectedNodeId ? getNodeProgress(selectedNodeId, tree) : null;
  const objsProgress = selectedNodeId ? getDirectObjectsProgress(selectedNodeId, tree) : null;

  const subPanelContent = (
    subActivePanel === 'search' ? (
      <SubSearchPanel value={subSearch} onChange={setSubSearch} autoFocusRef={subSearchInputRef} />
    ) : subActivePanel === 'add' ? (
      <SubAddPanel
        value={subAddName}
        onChange={setSubAddName}
        onConfirm={handleConfirmAddSubsidiary}
        autoFocusRef={subAddInputRef}
      />
    ) : subActivePanel === 'filter' ? (
      <SubFilterPanel sortVal={subSort} onSort={setSubSort} />
    ) : null
  );

  const objPanelContent = (
    objActivePanel === 'search' ? (
      <ObjSearchPanel value={objSearch} onChange={setObjSearch} autoFocusRef={objSearchInputRef} />
    ) : objActivePanel === 'add' ? (
      <ObjAddPanel
        form={objAddForm}
        onChange={setObjAddForm}
        onConfirm={handleConfirmAddObject}
        typeRef={objAddTypeRef}
      />
    ) : objActivePanel === 'filter' ? (
      <ObjFilterPanel
        sortVal={objSort}
        onSort={setObjSort}
        typeFilter={objTypeFilter}
        onTypeFilter={setObjTypeFilter}
      />
    ) : null
  );

  return (
    <>
    <WorkspaceToast message={toastMessage} isVisible={toastVisible} />
    <WorkspaceShell
      sidebar={
        <WorkspaceSidebar
          companies={rootCompanies.map((c) => c.id)}
          companyNames={Object.fromEntries(rootCompanies.map((c) => [c.id, c.name]))}
          selectedCompany={selectedRootId}
          onSelectCompany={handleSelectRoot}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          searchValue={sidebarSearch}
          onSearchChange={setSidebarSearch}
          onLogout={logout}
          onLogoClick={handleLogoClick}
          onAddCompany={handleAddCompany}
          tree={tree}
        />
      }
    >
      {!selectedRootId ? (
        <div className="px-10 py-8 max-w-xl">
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--pw-bg-secondary)',
              border: '1px solid var(--pw-border)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--pw-text-secondary)', lineHeight: '1.6' }}>
              Välj ett moderbolag i panelen till vänster för att komma igång.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div
            className="px-10 pt-8 pb-4"
            style={{ borderBottom: '1px solid var(--pw-border)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <h1
                className="truncate"
                style={{ color: 'var(--pw-text-primary)', fontSize: '26px', fontWeight: 500, lineHeight: 1.2 }}
              >
                {rootNode?.name ?? ''}
              </h1>
              {rootProgress && (
                <ProgressPill pct={rootProgress.pct} showPct={true} barWidth={100} />
              )}
            </div>
            {rootNode?.orgnr && (
              <div className="mb-2">
                <CopyChip
                  text={rootNode.orgnr}
                  label="Orgnr"
                  onCopied={() => showToast('Orgnr kopierat')}
                />
              </div>
            )}
            <WorkspaceHeader
              path={path.map((n) => ({ id: n.id, name: n.name }))}
              onSelectNode={handleSelectNode}
            />
          </div>

          <div className="mb-2">
            <SectionHeader
              title="Dotterbolag"
              count={childNodes.length}
              isOpen={isSubsidiariesOpen}
              onToggle={() => setIsSubsidiariesOpen((v) => !v)}
              progress={subsProgress?.pct ?? 0}
              activePanel={subActivePanel}
              onPanelToggle={handleSubPanelToggle}
              panelContent={subPanelContent}
              headerRef={subHeaderRef}
            />

            {isSubsidiariesOpen && (
              <div>
                {filteredChildren.length === 0 ? (
                  <p className="text-xs px-10 py-2" style={{ color: 'var(--pw-text-tertiary)' }}>
                    {subSearch ? 'Inga träffar' : 'Inga dotterbolag'}
                  </p>
                ) : (
                  filteredChildren.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const progress = getNodeProgress(node.id, tree);
                    return (
                      <div
                        key={node.id}
                        onClick={() => handleSelectNode(node.id)}
                        className="w-full flex items-center gap-3 px-10 py-2 text-sm transition-colors cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? 'var(--pw-bg-tertiary)' : 'transparent',
                          color: 'var(--pw-text-primary)',
                          borderLeft: isSelected ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
                          fontWeight: isSelected ? 500 : 400,
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <span className="flex-1">{node.name}</span>
                        {node.orgnr && (
                          <CopyChip
                            text={node.orgnr}
                            label="Orgnr"
                            onCopied={() => showToast('Orgnr kopierat')}
                          />
                        )}
                        <ProgressPill pct={progress.pct} showPct={false} />
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="mb-2">
            <SectionHeader
              title="Försäkringsobjekt"
              count={currentObjects.length}
              isOpen={isObjectsOpen}
              onToggle={() => setIsObjectsOpen((v) => !v)}
              progress={objsProgress?.pct ?? 0}
              activePanel={objActivePanel}
              onPanelToggle={handleObjPanelToggle}
              panelContent={objPanelContent}
              headerRef={objHeaderRef}
            />

            {isObjectsOpen && (
              <ObjectListView
                objects={filteredObjects}
                expandedObjectId={expandedObjectId}
                onToggleObject={handleToggleObject}
                nodeId={selectedNodeId!}
                onVerifyField={handleVerifyField}
              />
            )}
          </div>
        </div>
      )}
    </WorkspaceShell>
    </>
  );
};

export default Workspace;
