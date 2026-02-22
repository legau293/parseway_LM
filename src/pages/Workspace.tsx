import React, { useState, useRef, useEffect } from 'react';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import SubsidiaryList from '@/components/workspace/SubsidiaryList';
import CollapsibleSection from '@/components/workspace/CollapsibleSection';
import ObjectListView from '@/components/workspace/ObjectListView';
import {
  getRootCompanies,
  getCompanyNodeById,
  getChildCompanies,
  getInsuranceObjects,
  getPathToNode,
  addChildNode,
  addInsuranceObject,
} from '@/data/mockOrgTree';

const Workspace = () => {
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedObjectId, setExpandedObjectId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [isSubsidiariesOpen, setIsSubsidiariesOpen] = useState(true);
  const [isObjectsOpen, setIsObjectsOpen] = useState(true);

  const [isAddingSubsidiary, setIsAddingSubsidiary] = useState(false);
  const [newSubsidiaryName, setNewSubsidiaryName] = useState('');
  const [isAddingObject, setIsAddingObject] = useState(false);
  const [newObjectName, setNewObjectName] = useState('');

  const [, forceUpdate] = useState(0);
  const addObjectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingObject) addObjectInputRef.current?.focus();
  }, [isAddingObject]);

  const { logout } = useLogout();

  const rootCompanies = getRootCompanies();

  const handleSelectRoot = (id: string) => {
    setSelectedRootId(id);
    setSelectedNodeId(id);
    setExpandedObjectId(null);
    setIsAddingSubsidiary(false);
    setIsAddingObject(false);
    setNewSubsidiaryName('');
    setNewObjectName('');
  };

  const handleSelectNode = (id: string) => {
    setSelectedNodeId(id);
    setExpandedObjectId(null);
    setIsAddingSubsidiary(false);
    setIsAddingObject(false);
    setNewSubsidiaryName('');
    setNewObjectName('');
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
    forceUpdate((n) => n + 1);
  };

  const handleConfirmAddObject = () => {
    const name = newObjectName.trim();
    if (!name || !selectedNodeId) return;
    addInsuranceObject(selectedNodeId, name);
    setNewObjectName('');
    setIsAddingObject(false);
    forceUpdate((n) => n + 1);
  };

  const childNodes = selectedNodeId ? getChildCompanies(selectedNodeId) : [];
  const currentObjects = selectedNodeId ? getInsuranceObjects(selectedNodeId) : [];
  const path = selectedNodeId ? getPathToNode(selectedNodeId) : [];

  return (
    <WorkspaceShell
      sidebar={
        <WorkspaceSidebar
          companies={rootCompanies.map((c) => c.id)}
          companyNames={Object.fromEntries(rootCompanies.map((c) => [c.id, c.name]))}
          selectedCompany={selectedRootId}
          onSelectCompany={handleSelectRoot}
          searchValue={search}
          onSearchChange={setSearch}
          onLogout={logout}
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
            <p className="text-xs mt-4" style={{ color: 'var(--pw-text-tertiary)' }}>
              Här kommer 3-kolumnsgränssnittet för valt objekt.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="px-10 pt-8 pb-0 max-w-5xl">
            <WorkspaceHeader
              path={path.map((n) => ({ id: n.id, name: n.name }))}
              onSelectNode={handleSelectNode}
            />
          </div>

          <div className="mb-2">
            <div className="px-10 py-1">
              <div
                className="flex items-center justify-between py-1.5"
                style={{ borderBottom: '1px solid var(--pw-border)' }}
              >
                <button
                  onClick={() => setIsSubsidiariesOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: 'var(--pw-text-secondary)' }}
                >
                  <span
                    className="text-xs"
                    style={{ color: 'var(--pw-text-tertiary)', display: 'inline-block', width: '10px', textAlign: 'center' }}
                  >
                    {isSubsidiariesOpen ? '▾' : '▸'}
                  </span>
                  Dotterbolag
                  <span className="text-xs ml-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>
                    {childNodes.length}
                  </span>
                </button>
                <button
                  onClick={() => { setIsAddingSubsidiary(true); setIsSubsidiariesOpen(true); }}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--pw-text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
                >
                  Lägg till
                </button>
              </div>
            </div>

            {isSubsidiariesOpen && (
              <div>
                {isAddingSubsidiary && (
                  <div className="flex items-center gap-2 px-10 py-1.5">
                    <input
                      autoFocus
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
                    <button onClick={() => { setIsAddingSubsidiary(false); setNewSubsidiaryName(''); }} className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Avbryt</button>
                  </div>
                )}

                {childNodes.length === 0 && !isAddingSubsidiary && (
                  <p className="text-xs px-10 py-2" style={{ color: 'var(--pw-text-tertiary)' }}>Inga dotterbolag</p>
                )}

                {childNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => handleSelectNode(node.id)}
                      className="w-full text-left px-10 py-2 text-sm transition-colors"
                      style={{
                        backgroundColor: isSelected ? 'var(--pw-bg-tertiary)' : 'transparent',
                        color: 'var(--pw-text-primary)',
                        borderLeft: isSelected ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
                        fontWeight: isSelected ? 500 : 400,
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {node.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mb-2">
            <div className="px-10 py-1">
              <div
                className="flex items-center justify-between py-1.5"
                style={{ borderBottom: '1px solid var(--pw-border)' }}
              >
                <button
                  onClick={() => setIsObjectsOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: 'var(--pw-text-secondary)' }}
                >
                  <span
                    className="text-xs"
                    style={{ color: 'var(--pw-text-tertiary)', display: 'inline-block', width: '10px', textAlign: 'center' }}
                  >
                    {isObjectsOpen ? '▾' : '▸'}
                  </span>
                  Försäkringsobjekt
                  <span className="text-xs ml-0.5" style={{ color: 'var(--pw-text-tertiary)' }}>
                    {currentObjects.length}
                  </span>
                </button>
                <button
                  onClick={() => { setIsAddingObject(true); setIsObjectsOpen(true); }}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--pw-text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
                >
                  Lägg till
                </button>
              </div>
            </div>

            {isObjectsOpen && (
              <div>
                {isAddingObject && (
                  <div className="flex items-center gap-2 px-10 py-1.5">
                    <input
                      ref={addObjectInputRef}
                      value={newObjectName}
                      onChange={(e) => setNewObjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirmAddObject();
                        if (e.key === 'Escape') { setIsAddingObject(false); setNewObjectName(''); }
                      }}
                      placeholder="Namn på objekt..."
                      className="flex-1 max-w-xs text-sm px-2 py-1 rounded outline-none"
                      style={{
                        backgroundColor: 'var(--pw-bg-primary)',
                        border: '1px solid var(--pw-border)',
                        color: 'var(--pw-text-primary)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
                    />
                    <button onClick={handleConfirmAddObject} className="text-xs" style={{ color: 'var(--pw-text-secondary)' }}>OK</button>
                    <button onClick={() => { setIsAddingObject(false); setNewObjectName(''); }} className="text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>Avbryt</button>
                  </div>
                )}

                <ObjectListView
                  objects={currentObjects}
                  expandedObjectId={expandedObjectId}
                  onToggleObject={handleToggleObject}
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
