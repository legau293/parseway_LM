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
  CompanyNode,
  InsuranceObject,
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

  const currentNode = selectedNodeId ? getCompanyNodeById(selectedNodeId) : null;
  const childNodes = selectedNodeId ? getChildCompanies(selectedNodeId) : [];
  const currentObjects = selectedNodeId ? getInsuranceObjects(selectedNodeId) : [];
  const path = selectedNodeId ? getPathToNode(selectedNodeId) : [];

  const selectedRoot = selectedRootId ? getCompanyNodeById(selectedRootId) : null;

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
      <div className="px-10 py-8 max-w-3xl">
        {!selectedRootId ? (
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: 'var(--pw-bg-secondary)',
              border: '1px solid var(--pw-border)',
            }}
          >
            <p
              className="text-sm"
              style={{ color: 'var(--pw-text-secondary)', fontWeight: 400, lineHeight: '1.6' }}
            >
              Välj ett moderbolag i panelen till vänster för att komma igång.
            </p>
            <p
              className="text-xs mt-4"
              style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}
            >
              Här kommer 3-kolumnsgränssnittet för valt objekt.
            </p>
          </div>
        ) : (
          <>
            <WorkspaceHeader
              path={path.map((n) => ({ id: n.id, name: n.name }))}
              onSelectNode={handleSelectNode}
            />

            <SubsidiaryList
              nodes={childNodes}
              selectedNodeId={selectedNodeId}
              onSelect={handleSelectNode}
              isOpen={isSubsidiariesOpen}
              onToggle={() => setIsSubsidiariesOpen((v) => !v)}
              isAdding={isAddingSubsidiary}
              addValue={newSubsidiaryName}
              onChangeAddValue={setNewSubsidiaryName}
              onConfirmAdd={handleConfirmAddSubsidiary}
              onCancelAdd={() => { setIsAddingSubsidiary(false); setNewSubsidiaryName(''); }}
              onStartAdd={() => { setIsAddingSubsidiary(true); setIsSubsidiariesOpen(true); }}
            />

            <CollapsibleSection
              title="Försäkringsobjekt"
              count={currentObjects.length}
              isOpen={isObjectsOpen}
              onToggle={() => setIsObjectsOpen((v) => !v)}
              actionLabel="Lägg till"
              onAction={() => { setIsAddingObject(true); setIsObjectsOpen(true); }}
            >
              {isAddingObject && (
                <div className="flex items-center gap-2 px-4 py-1.5">
                  <input
                    ref={addObjectInputRef}
                    value={newObjectName}
                    onChange={(e) => setNewObjectName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmAddObject();
                      if (e.key === 'Escape') { setIsAddingObject(false); setNewObjectName(''); }
                    }}
                    placeholder="Namn på objekt..."
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
                    onClick={handleConfirmAddObject}
                    className="text-xs transition-colors"
                    style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
                  >
                    OK
                  </button>
                  <button
                    onClick={() => { setIsAddingObject(false); setNewObjectName(''); }}
                    className="text-xs transition-colors"
                    style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-tertiary)')}
                  >
                    Avbryt
                  </button>
                </div>
              )}

              <ObjectListView
                objects={currentObjects}
                expandedObjectId={expandedObjectId}
                onToggleObject={handleToggleObject}
              />
            </CollapsibleSection>
          </>
        )}
      </div>
    </WorkspaceShell>
  );
};

export default Workspace;
