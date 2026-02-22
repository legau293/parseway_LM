import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import ObjectListView from '@/components/workspace/ObjectListView';
import ProgressPill from '@/components/workspace/ProgressPill';
import {
  OrgTree,
  ROOT_COMPANY_IDS,
  getTree,
  getPathToNode,
  addChildNode,
  addInsuranceObject,
  incrementFieldVerified,
} from '@/data/mockOrgTree';
import { getNodeProgress, getDirectObjectsProgress } from '@/utils/progress';

const OBJECT_TYPE_OPTIONS = ['Fastighet', 'Bil', 'Maskin'];

interface NewObjectForm {
  objectType: string;
  name: string;
  description: string;
}

const iconBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px',
  borderRadius: '4px',
  color: 'var(--pw-text-tertiary)',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  transition: 'color 0.15s',
};

const SectionHeader = ({
  title,
  count,
  isOpen,
  onToggle,
  progress,
  showSearch,
  onToggleSearch,
  onClickAdd,
}: {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  progress: number;
  showSearch: boolean;
  onToggleSearch: () => void;
  onClickAdd: () => void;
}) => (
  <div
    className="flex items-center gap-1.5 px-10 py-2"
    style={{ borderBottom: '1px solid var(--pw-border)' }}
  >
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-sm"
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

    <div className="flex items-center gap-1 ml-1">
      <button
        onClick={onToggleSearch}
        style={{ ...iconBtn, color: showSearch ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = showSearch ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)')}
        title="Sök"
      >
        <Search size={13} />
      </button>
      <button
        onClick={onClickAdd}
        style={{ ...iconBtn }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-tertiary)')}
        title="Lägg till"
      >
        <Plus size={13} />
      </button>
    </div>

    <div className="ml-auto">
      <ProgressPill pct={progress} showPct={true} barWidth={80} />
    </div>
  </div>
);

const InlineSearch = ({
  value,
  onChange,
  onClose,
  placeholder,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  placeholder: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}) => (
  <div
    className="flex items-center gap-2 px-10 py-1.5"
    style={{ borderBottom: '1px solid var(--pw-border)', backgroundColor: 'var(--pw-bg-secondary)' }}
  >
    <Search size={12} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      placeholder={placeholder}
      className="flex-1 bg-transparent outline-none text-sm"
      style={{
        color: 'var(--pw-text-primary)',
        caretColor: 'var(--pw-accent-red)',
      }}
    />
    {value && (
      <button onClick={() => onChange('')} style={{ ...iconBtn }}>
        <X size={11} />
      </button>
    )}
    <button
      onClick={onClose}
      style={{ ...iconBtn }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-tertiary)')}
    >
      <X size={13} />
    </button>
  </div>
);

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--pw-bg-primary)',
  border: '1px solid var(--pw-border)',
  color: 'var(--pw-text-primary)',
  borderRadius: '4px',
  fontSize: '12px',
  padding: '4px 8px',
  outline: 'none',
  width: '100%',
};

const CreateObjectRow = ({
  form,
  onChange,
  onConfirm,
  onCancel,
  typeRef,
}: {
  form: NewObjectForm;
  onChange: (f: NewObjectForm) => void;
  onConfirm: () => void;
  onCancel: () => void;
  typeRef: React.RefObject<HTMLSelectElement>;
}) => {
  const valid =
    form.objectType.trim() !== '' ||
    form.name.trim() !== '' ||
    form.description.trim() !== '';

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && valid) onConfirm();
    if (e.key === 'Escape') onCancel();
  };

  const focusBorder = (e: React.FocusEvent<HTMLElement>) =>
    (e.currentTarget.style.borderColor = 'var(--pw-accent-red)');
  const blurBorder = (e: React.FocusEvent<HTMLElement>) =>
    (e.currentTarget.style.borderColor = 'var(--pw-border)');

  return (
    <div
      className="grid grid-cols-[140px_220px_1fr_200px] items-center gap-2 px-4 py-2"
      style={{ borderBottom: '1px solid var(--pw-border)', backgroundColor: 'var(--pw-bg-secondary)' }}
    >
      <select
        ref={typeRef}
        value={form.objectType}
        onChange={(e) => onChange({ ...form, objectType: e.target.value })}
        onKeyDown={handleKey}
        onFocus={focusBorder}
        onBlur={blurBorder}
        style={{ ...inputStyle, cursor: 'pointer' }}
      >
        {OBJECT_TYPE_OPTIONS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <input
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        onKeyDown={handleKey}
        onFocus={focusBorder}
        onBlur={blurBorder}
        placeholder="Namn..."
        style={inputStyle}
      />

      <input
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        onKeyDown={handleKey}
        onFocus={focusBorder}
        onBlur={blurBorder}
        placeholder="Beskrivning..."
        style={{ ...inputStyle, marginRight: '8px' }}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={onConfirm}
          disabled={!valid}
          className="text-xs px-2.5 py-1 rounded transition-colors"
          style={{
            border: `1px solid ${valid ? 'var(--pw-accent-red)' : 'var(--pw-border)'}`,
            color: valid ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)',
            backgroundColor: 'transparent',
            cursor: valid ? 'pointer' : 'default',
            opacity: valid ? 1 : 0.5,
          }}
        >
          Skapa
        </button>
        <button
          onClick={onCancel}
          className="text-xs"
          style={{ color: 'var(--pw-text-tertiary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-tertiary)')}
        >
          Avbryt
        </button>
        {!valid && (
          <span className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
            Fyll i minst ett fält
          </span>
        )}
      </div>
    </div>
  );
};

const Workspace = () => {
  const [tree, setTree] = useState<OrgTree>(() => ({ ...getTree() }));

  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedObjectId, setExpandedObjectId] = useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const [isSubsidiariesOpen, setIsSubsidiariesOpen] = useState(true);
  const [isObjectsOpen, setIsObjectsOpen] = useState(true);

  const [subSearch, setSubSearch] = useState('');
  const [showSubSearch, setShowSubSearch] = useState(false);
  const [objSearch, setObjSearch] = useState('');
  const [showObjSearch, setShowObjSearch] = useState(false);

  const [isAddingSubsidiary, setIsAddingSubsidiary] = useState(false);
  const [newSubsidiaryName, setNewSubsidiaryName] = useState('');

  const [isAddingObject, setIsAddingObject] = useState(false);
  const [newObjectForm, setNewObjectForm] = useState<NewObjectForm>({ objectType: 'Fastighet', name: '', description: '' });

  const subSearchRef = useRef<HTMLInputElement>(null);
  const objSearchRef = useRef<HTMLInputElement>(null);
  const createRowTypeRef = useRef<HTMLSelectElement>(null);
  const subNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSubSearch) subSearchRef.current?.focus();
  }, [showSubSearch]);

  useEffect(() => {
    if (showObjSearch) objSearchRef.current?.focus();
  }, [showObjSearch]);

  useEffect(() => {
    if (isAddingObject) createRowTypeRef.current?.focus();
  }, [isAddingObject]);

  useEffect(() => {
    if (isAddingSubsidiary) subNameInputRef.current?.focus();
  }, [isAddingSubsidiary]);

  const { logout } = useLogout();

  const rootCompanies = ROOT_COMPANY_IDS.map((id) => tree[id]).filter(Boolean);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSelectRoot = (id: string) => {
    setSelectedRootId(id);
    setSelectedNodeId(id);
    setExpandedObjectId(null);
    setIsAddingSubsidiary(false);
    setIsAddingObject(false);
    setNewSubsidiaryName('');
    setNewObjectForm({ objectType: 'Fastighet', name: '', description: '' });
    setSubSearch('');
    setObjSearch('');
    setShowSubSearch(false);
    setShowObjSearch(false);
  };

  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id);
    setExpandedObjectId(null);
    setIsAddingSubsidiary(false);
    setIsAddingObject(false);
    setNewSubsidiaryName('');
    setNewObjectForm({ objectType: 'Fastighet', name: '', description: '' });
    setSubSearch('');
    setObjSearch('');
    setShowSubSearch(false);
    setShowObjSearch(false);
  };

  const handleToggleObject = (id: string) => {
    setExpandedObjectId((prev) => (prev === id ? null : id));
  };

  const handleConfirmAddSubsidiary = () => {
    const name = newSubsidiaryName.trim();
    if (!name || !selectedNodeId) return;
    const newNode = addChildNode(selectedNodeId, name);
    setNewSubsidiaryName('');
    setIsAddingSubsidiary(false);
    setSelectedNodeId(newNode.id);
    setExpandedObjectId(null);
    setTree({ ...getTree() });
  };

  const handleConfirmAddObject = () => {
    const valid =
      newObjectForm.objectType.trim() !== '' ||
      newObjectForm.name.trim() !== '' ||
      newObjectForm.description.trim() !== '';
    if (!valid || !selectedNodeId) return;
    addInsuranceObject(
      selectedNodeId,
      newObjectForm.name.trim(),
      newObjectForm.objectType.trim() || 'Fastighet',
      newObjectForm.description.trim(),
    );
    setNewObjectForm({ objectType: 'Fastighet', name: '', description: '' });
    setIsAddingObject(false);
    setTree({ ...getTree() });
  };

  const handleVerifyField = (nodeId: string, objectId: string) => {
    const updated = incrementFieldVerified(nodeId, objectId);
    setTree({ ...updated });
  };

  const currentNode = selectedNodeId ? tree[selectedNodeId] : null;
  const childNodes = currentNode
    ? currentNode.childCompanyIds.map((id) => tree[id]).filter(Boolean)
    : [];

  const filteredChildren = showSubSearch && subSearch
    ? childNodes.filter((n) => n.name.toLowerCase().includes(subSearch.toLowerCase()))
    : childNodes;

  const currentObjects = currentNode ? currentNode.insuranceObjects : [];
  const path = selectedNodeId ? getPathToNode(selectedNodeId) : [];

  const rootNode = selectedRootId ? tree[selectedRootId] : null;
  const rootProgress = selectedRootId ? getNodeProgress(selectedRootId, tree) : null;

  const subsProgress = selectedNodeId ? getNodeProgress(selectedNodeId, tree) : null;
  const objsProgress = selectedNodeId ? getDirectObjectsProgress(selectedNodeId, tree) : null;

  return (
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
            <div className="flex items-center justify-between mb-2">
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
              showSearch={showSubSearch}
              onToggleSearch={() => {
                setShowSubSearch((v) => !v);
                if (showSubSearch) setSubSearch('');
              }}
              onClickAdd={() => { setIsAddingSubsidiary(true); setIsSubsidiariesOpen(true); }}
            />

            {isSubsidiariesOpen && (
              <div>
                {showSubSearch && (
                  <InlineSearch
                    value={subSearch}
                    onChange={setSubSearch}
                    onClose={() => { setShowSubSearch(false); setSubSearch(''); }}
                    placeholder="Sök dotterbolag…"
                    inputRef={subSearchRef}
                  />
                )}

                {isAddingSubsidiary && (
                  <div className="flex items-center gap-2 px-10 py-1.5">
                    <input
                      ref={subNameInputRef}
                      value={newSubsidiaryName}
                      onChange={(e) => setNewSubsidiaryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirmAddSubsidiary();
                        if (e.key === 'Escape') { setIsAddingSubsidiary(false); setNewSubsidiaryName(''); }
                      }}
                      placeholder="Namn på bolag..."
                      className="flex-1 max-w-xs text-sm px-2 py-1 rounded outline-none"
                      style={{
                        backgroundColor: 'var(--pw-bg-primary)',
                        border: '1px solid var(--pw-border)',
                        color: 'var(--pw-text-primary)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
                    />
                    <button onClick={handleConfirmAddSubsidiary} className="text-xs" style={{ color: 'var(--pw-text-secondary)' }}>OK</button>
                    <button
                      onClick={() => { setIsAddingSubsidiary(false); setNewSubsidiaryName(''); }}
                      className="text-xs"
                      style={{ color: 'var(--pw-text-tertiary)' }}
                    >
                      Avbryt
                    </button>
                  </div>
                )}

                {filteredChildren.length === 0 && !isAddingSubsidiary && (
                  <p className="text-xs px-10 py-2" style={{ color: 'var(--pw-text-tertiary)' }}>
                    {subSearch ? 'Inga träffar' : 'Inga dotterbolag'}
                  </p>
                )}

                {filteredChildren.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const progress = getNodeProgress(node.id, tree);
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleSelectNode(node.id)}
                      className="w-full text-left flex items-center gap-3 px-10 py-2 text-sm transition-colors"
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
                      <ProgressPill pct={progress.pct} showPct={false} />
                    </button>
                  );
                })}
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
              showSearch={showObjSearch}
              onToggleSearch={() => {
                setShowObjSearch((v) => !v);
                if (showObjSearch) setObjSearch('');
              }}
              onClickAdd={() => { setIsAddingObject(true); setIsObjectsOpen(true); }}
            />

            {isObjectsOpen && (
              <div>
                {showObjSearch && (
                  <InlineSearch
                    value={objSearch}
                    onChange={setObjSearch}
                    onClose={() => { setShowObjSearch(false); setObjSearch(''); }}
                    placeholder="Sök försäkringsobjekt…"
                    inputRef={objSearchRef}
                  />
                )}

                {isAddingObject && (
                  <CreateObjectRow
                    form={newObjectForm}
                    onChange={setNewObjectForm}
                    onConfirm={handleConfirmAddObject}
                    onCancel={() => {
                      setIsAddingObject(false);
                      setNewObjectForm({ objectType: 'Fastighet', name: '', description: '' });
                    }}
                    typeRef={createRowTypeRef}
                  />
                )}

                <ObjectListView
                  objects={currentObjects}
                  expandedObjectId={expandedObjectId}
                  onToggleObject={handleToggleObject}
                  nodeId={selectedNodeId!}
                  onVerifyField={handleVerifyField}
                  externalSearch={objSearch}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
};

export default Workspace;
