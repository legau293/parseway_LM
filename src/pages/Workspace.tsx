import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import ObjectListView from '@/components/workspace/ObjectListView';
import ProgressPill from '@/components/workspace/ProgressPill';
import CopyChip from '@/components/workspace/CopyChip';
import WorkspaceToast from '@/components/workspace/WorkspaceToast';
import {
  OrgTree,
  getTree,
  addRootCompany,
  addSubsidiary,
  deleteSubsidiaries,
  addInsuranceObject,
  incrementFieldVerified,
  updateInsuranceObject,
  InsuranceObject,
} from '@/data/mockOrgTree';
import {
  getNodeProgress,
  getSubsidiaryProgress,
} from '@/utils/progress';

type Panel = 'search' | 'add' | null;
const OBJECT_TYPE_OPTIONS = ['Fastighet', 'Bil', 'Maskin'];

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

const Workspace = () => {
  const { logout } = useLogout();
  const [tree, setTree] = useState<OrgTree>(getTree());
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sidebarSearch, setSidebarSearch] = useState('');

  const [selectedSubsidiaryIds, setSelectedSubsidiaryIds] = useState<Set<string>>(new Set());

  const [subPanel, setSubPanel] = useState<Panel>(null);
  const [subSearch, setSubSearch] = useState('');
  const [subAddValue, setSubAddValue] = useState('');

  const [objPanel, setObjPanel] = useState<Panel>(null);
  const [objSearch, setObjSearch] = useState('');
  const [objTypeFilter, setObjTypeFilter] = useState('Alla');
  const [objAddForm, setObjAddForm] = useState<NewObjectForm>({ objectType: 'Fastighet', name: '', description: '' });

  const [expandedObjectId, setExpandedObjectId] = useState<string | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const objListRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 1500);
  }, []);

  useClickOutside(objListRef as React.RefObject<HTMLElement>, () => {
    setSelectedObjectId(null);
  });

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

  const filteredObjects = currentObjects.filter((obj) => {
    const matchType = objTypeFilter === 'Alla' || obj.objectType === objTypeFilter;
    const matchSearch = !objSearch || obj.name.toLowerCase().includes(objSearch.toLowerCase());
    return matchType && matchSearch;
  });

  const filteredSubsidiaries =
    rootCompany?.subsidiaries.filter(
      (s) => !subSearch || s.name.toLowerCase().includes(subSearch.toLowerCase())
    ) ?? [];

  const handleSelectRoot = (id: string) => {
    setSelectedRootId(id);
    setSelectedSubsidiaryId(null);
    setSelectedSubsidiaryIds(new Set());
    setExpandedObjectId(null);
    setSelectedObjectId(null);
    setSubPanel(null);
    setObjPanel(null);
    setSubSearch('');
    setObjSearch('');
    setObjTypeFilter('Alla');
  };

  const handleSelectSubsidiary = (id: string) => {
    setSelectedSubsidiaryId(id);
    setExpandedObjectId(null);
    setSelectedObjectId(null);
    setObjPanel(null);
    setObjSearch('');
    setObjTypeFilter('Alla');
  };

  const handleBackToRoot = () => {
    setSelectedSubsidiaryId(null);
    setExpandedObjectId(null);
    setSelectedObjectId(null);
  };

  const handleLogoClick = () => {
    setSelectedRootId(null);
    setSelectedSubsidiaryId(null);
    setSelectedSubsidiaryIds(new Set());
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (!selectedRootId || selectedSubsidiaryIds.size === 0) return;
    const count = selectedSubsidiaryIds.size;
    const step1 = window.confirm(
      `Vill du ta bort ${count === 1 ? 'dotterbolaget' : `${count} dotterbolag`}? Alla tillhörande försäkringsobjekt raderas.`
    );
    if (!step1) return;
    const step2 = window.prompt('Skriv OK för att bekräfta borttagningen.');
    if (step2 !== 'OK') return;
    const ids = Array.from(selectedSubsidiaryIds);
    if (selectedSubsidiaryId && ids.includes(selectedSubsidiaryId)) {
      setSelectedSubsidiaryId(null);
    }
    deleteSubsidiaries(selectedRootId, ids);
    setTree(getTree());
    setSelectedSubsidiaryIds(new Set());
    showToast(`${count === 1 ? 'Dotterbolaget' : `${count} dotterbolag`} borttaget`);
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
    setSelectedObjectId(id);
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

  const renderSubPanel = () => {
    if (subPanel === 'search') {
      return (
        <div className="px-10 py-2" style={{ borderTop: '1px solid var(--pw-border)' }}>
          <input
            autoFocus
            value={subSearch}
            onChange={(e) => setSubSearch(e.target.value)}
            placeholder="Sök dotterbolag…"
            style={{ ...inputBase, width: '100%' }}
          />
        </div>
      );
    }
    if (subPanel === 'add') {
      return (
        <div
          className="px-10 py-3"
          style={{ borderTop: '1px solid var(--pw-border)', display: 'flex', gap: '8px', alignItems: 'center' }}
        >
          <input
            autoFocus
            value={subAddValue}
            onChange={(e) => setSubAddValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSubsidiary();
              if (e.key === 'Escape') { setSubPanel(null); setSubAddValue(''); }
            }}
            placeholder="Dotterbolagsnamn…"
            style={{ ...inputBase, flex: 1 }}
          />
          <button
            onClick={handleAddSubsidiary}
            disabled={!subAddValue.trim()}
            style={{
              ...inputBase,
              cursor: subAddValue.trim() ? 'pointer' : 'default',
              opacity: subAddValue.trim() ? 1 : 0.5,
              padding: '4px 12px',
            }}
          >
            Lägg till
          </button>
          <button
            onClick={() => { setSubPanel(null); setSubAddValue(''); }}
            style={{ fontSize: '12px', color: 'var(--pw-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Avbryt
          </button>
        </div>
      );
    }
    return null;
  };

  const renderObjPanel = () => {
    if (objPanel === 'search') {
      return (
        <div
          className="px-10 py-2 flex items-center gap-3"
          style={{ borderTop: '1px solid var(--pw-border)' }}
        >
          <input
            autoFocus
            value={objSearch}
            onChange={(e) => setObjSearch(e.target.value)}
            placeholder="Sök objekt…"
            style={{ ...inputBase, flex: 1 }}
          />
          <select
            value={objTypeFilter}
            onChange={(e) => setObjTypeFilter(e.target.value)}
            style={{ ...inputBase }}
          >
            <option value="Alla">Alla typer</option>
            {OBJECT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      );
    }
    if (objPanel === 'add') {
      return (
        <div
          className="px-10 py-3"
          style={{ borderTop: '1px solid var(--pw-border)', display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}
        >
          <select
            value={objAddForm.objectType}
            onChange={(e) => setObjAddForm((f) => ({ ...f, objectType: e.target.value }))}
            style={{ ...inputBase, width: '120px' }}
          >
            {OBJECT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            autoFocus
            value={objAddForm.name}
            onChange={(e) => setObjAddForm((f) => ({ ...f, name: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddObject();
              if (e.key === 'Escape') setObjPanel(null);
            }}
            placeholder="Objektnamn…"
            style={{ ...inputBase, flex: 1, minWidth: '160px' }}
          />
          <input
            value={objAddForm.description}
            onChange={(e) => setObjAddForm((f) => ({ ...f, description: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddObject();
              if (e.key === 'Escape') setObjPanel(null);
            }}
            placeholder="Beskrivning…"
            style={{ ...inputBase, flex: 2, minWidth: '200px' }}
          />
          <button
            onClick={handleAddObject}
            disabled={!objAddForm.name.trim()}
            style={{
              ...inputBase,
              cursor: objAddForm.name.trim() ? 'pointer' : 'default',
              opacity: objAddForm.name.trim() ? 1 : 0.5,
              padding: '4px 12px',
            }}
          >
            Lägg till
          </button>
          <button
            onClick={() => setObjPanel(null)}
            style={{ fontSize: '12px', color: 'var(--pw-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Avbryt
          </button>
        </div>
      );
    }
    return null;
  };

  const SectionToolbar = ({
    title,
    count,
    panel,
    onPanelToggle,
    showDelete,
    onDelete,
  }: {
    title: string;
    count: number;
    panel: Panel;
    onPanelToggle: (p: Panel) => void;
    showDelete?: boolean;
    onDelete?: () => void;
  }) => (
    <div
      className="flex items-center justify-between px-10 py-2"
      style={{ borderBottom: '1px solid var(--pw-border)' }}
    >
      <span style={{ fontWeight: 500, color: 'var(--pw-text-primary)', fontSize: '14px' }}>
        {title}{' '}
        <span className="text-xs ml-1" style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}>{count}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPanelToggle(panel === 'search' ? null : 'search')}
          style={{ ...iStyle, color: panel === 'search' ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = panel === 'search' ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)'; }}
          title="Sök"
        >
          <Search size={14} />
        </button>
        <button
          onClick={() => onPanelToggle(panel === 'add' ? null : 'add')}
          style={{ ...iStyle, color: panel === 'add' ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = panel === 'add' ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)'; }}
          title="Lägg till"
        >
          <Plus size={14} />
        </button>
        {showDelete && (
          <button
            onClick={onDelete}
            disabled={selectedSubsidiaryIds.size === 0}
            style={{
              ...iStyle,
              color: selectedSubsidiaryIds.size > 0 ? '#E5483F' : 'var(--pw-text-tertiary)',
              opacity: selectedSubsidiaryIds.size > 0 ? 1 : 0.3,
            }}
            onMouseEnter={(e) => {
              if (selectedSubsidiaryIds.size > 0) {
                e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
                e.currentTarget.style.color = '#C83B34';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = selectedSubsidiaryIds.size > 0 ? '#E5483F' : 'var(--pw-text-tertiary)';
            }}
            title="Radera markerade"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );

  const renderBreadcrumb = () => {
    if (!rootCompany) return null;
    return (
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        {selectedSubsidiary ? (
          <>
            <button
              onClick={handleBackToRoot}
              className="text-sm transition-colors"
              style={{ color: 'var(--pw-text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
            >
              {rootCompany.name}
            </button>
            <span className="text-sm" style={{ color: 'var(--pw-text-tertiary)' }}>/</span>
            <span className="text-sm" style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}>
              {selectedSubsidiary.name}
            </span>
          </>
        ) : (
          <span className="text-sm" style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}>
            {rootCompany.name}
          </span>
        )}
      </div>
    );
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
          <div className="flex items-center justify-between mb-1">
            <h1 style={{ color: 'var(--pw-text-primary)', fontSize: '26px', fontWeight: 500, lineHeight: 1.2 }}>
              {rootCompany.name}
            </h1>
            {rootProgress && <ProgressPill pct={rootProgress.pct} showPct={true} barWidth={100} />}
          </div>
          {rootCompany.orgnr && (
            <div className="mb-2">
              <CopyChip text={rootCompany.orgnr} label="Orgnr" onCopied={() => showToast('Orgnr kopierat')} />
            </div>
          )}
          {renderBreadcrumb()}
        </div>

        <div style={{ borderBottom: '1px solid var(--pw-border)' }}>
          <SectionToolbar
            title="Dotterbolag"
            count={subCount}
            panel={subPanel}
            onPanelToggle={setSubPanel}
            showDelete={true}
            onDelete={handleBulkDelete}
          />
          {renderSubPanel()}

          <div
            className="px-10 py-1.5 grid"
            style={{ gridTemplateColumns: 'auto 1fr auto 140px', gap: '0 8px', borderBottom: '1px solid var(--pw-border)' }}
          >
            <div />
            <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Namn</span>
            <div />
            <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Färdigställt</span>
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
                  className="grid items-center px-10 py-2 transition-colors cursor-pointer"
                  style={{
                    gridTemplateColumns: 'auto 1fr auto 140px',
                    gap: '0 8px',
                    backgroundColor: isSelected ? 'var(--pw-bg-tertiary)' : 'transparent',
                    borderLeft: isSelected ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
                  }}
                  onClick={() => handleSelectSubsidiary(sub.id)}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    onClick={(e) => { e.stopPropagation(); handleToggleSubsidiarySelect(sub.id); }}
                    style={{ cursor: 'pointer', accentColor: 'var(--pw-accent-red)', flexShrink: 0, marginRight: '4px' }}
                  />
                  <span
                    className="text-sm truncate"
                    style={{
                      color: isSelected ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)',
                      fontWeight: isSelected ? 500 : 400,
                    }}
                  >
                    {sub.name}
                  </span>
                  {sub.orgnr ? (
                    <CopyChip text={sub.orgnr} label="Orgnr" onCopied={() => showToast('Orgnr kopierat')} />
                  ) : (
                    <div />
                  )}
                  <ProgressPill pct={prog.pct} showPct={false} />
                </div>
              );
            })
          )}
        </div>

        <div>
          <SectionToolbar
            title="Försäkringsobjekt"
            count={objCount}
            panel={objPanel}
            onPanelToggle={setObjPanel}
          />
          {renderObjPanel()}
          <div ref={objListRef}>
            <ObjectListView
              objects={filteredObjects}
              expandedObjectId={expandedObjectId}
              selectedObjectId={selectedObjectId}
              onToggleObject={handleToggleObject}
              onUpdateObject={handleUpdateObject}
              onVerifyField={handleVerifyField}
            />
          </div>
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
          <div className="flex items-center justify-between mb-1">
            <h1 style={{ color: 'var(--pw-text-primary)', fontSize: '26px', fontWeight: 500, lineHeight: 1.2 }}>
              {selectedSubsidiary.name}
            </h1>
            {subsidiaryProgress && (
              <ProgressPill pct={subsidiaryProgress.pct} showPct={true} barWidth={100} />
            )}
          </div>
          {selectedSubsidiary.orgnr && (
            <div className="mb-2">
              <CopyChip
                text={selectedSubsidiary.orgnr}
                label="Orgnr"
                onCopied={() => showToast('Orgnr kopierat')}
              />
            </div>
          )}
          {renderBreadcrumb()}
        </div>

        <div>
          <SectionToolbar
            title="Försäkringsobjekt"
            count={objCount}
            panel={objPanel}
            onPanelToggle={setObjPanel}
          />
          {renderObjPanel()}
          <div ref={objListRef}>
            <ObjectListView
              objects={filteredObjects}
              expandedObjectId={expandedObjectId}
              selectedObjectId={selectedObjectId}
              onToggleObject={handleToggleObject}
              onUpdateObject={handleUpdateObject}
              onVerifyField={handleVerifyField}
            />
          </div>
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
