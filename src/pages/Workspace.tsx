import React, { useState, useRef, useEffect } from 'react';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import SubsidiaryList from '@/components/workspace/SubsidiaryList';
import CollapsibleSection from '@/components/workspace/CollapsibleSection';
import ObjectListView from '@/components/workspace/ObjectListView';
import { getMockSubsidiaries, getMockObjects, Subsidiary, InsuranceObject } from '@/data/mockWorkspace';

const COMPANIES = [
  'Volvo AB',
  'Atlas Copco',
  'Assa Abloy',
  'Sandvik',
  'Hexagon',
  'Epiroc',
];

const Workspace = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState<string | null>(null);
  const [objectsBySubsidiaryId, setObjectsBySubsidiaryId] = useState<Record<string, InsuranceObject[]>>({});
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [isSubsidiariesOpen, setIsSubsidiariesOpen] = useState(true);
  const [isObjectsOpen, setIsObjectsOpen] = useState(true);

  const [isAddingSubsidiary, setIsAddingSubsidiary] = useState(false);
  const [newSubsidiaryName, setNewSubsidiaryName] = useState('');
  const [isAddingObject, setIsAddingObject] = useState(false);
  const [newObjectName, setNewObjectName] = useState('');

  const addObjectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingObject) addObjectInputRef.current?.focus();
  }, [isAddingObject]);

  const { logout } = useLogout();

  const handleSelectCompany = (company: string) => {
    const subs = getMockSubsidiaries(company);
    const firstSubId = subs.length > 0 ? subs[0].id : null;
    const objMap: Record<string, InsuranceObject[]> = {};
    subs.forEach((s) => {
      objMap[s.id] = getMockObjects(s.id);
    });
    setSelectedCompany(company);
    setSubsidiaries(subs);
    setSelectedSubsidiaryId(firstSubId);
    setObjectsBySubsidiaryId(objMap);
    setSelectedObjectId(null);
    setIsAddingSubsidiary(false);
    setIsAddingObject(false);
    setNewSubsidiaryName('');
    setNewObjectName('');
  };

  const handleSelectSubsidiary = (id: string) => {
    setSelectedSubsidiaryId(id);
    setSelectedObjectId(null);
    setIsAddingObject(false);
    setNewObjectName('');
  };

  const handleConfirmAddSubsidiary = () => {
    const name = newSubsidiaryName.trim();
    if (!name) return;
    const newId = `custom-sub-${Date.now()}`;
    const newSub: Subsidiary = { id: newId, name };
    setSubsidiaries((prev) => [...prev, newSub]);
    setObjectsBySubsidiaryId((prev) => ({ ...prev, [newId]: [] }));
    setNewSubsidiaryName('');
    setIsAddingSubsidiary(false);
    setSelectedSubsidiaryId(newId);
    setSelectedObjectId(null);
  };

  const handleConfirmAddObject = () => {
    const name = newObjectName.trim();
    if (!name || !selectedSubsidiaryId) return;
    const newObj: InsuranceObject = {
      id: `custom-obj-${Date.now()}`,
      name,
      structurePct: 0,
      verifiedPct: 0,
      missingCount: 0,
    };
    setObjectsBySubsidiaryId((prev) => ({
      ...prev,
      [selectedSubsidiaryId]: [...(prev[selectedSubsidiaryId] ?? []), newObj],
    }));
    setNewObjectName('');
    setIsAddingObject(false);
  };

  const handleGoToCompany = () => {
    setSelectedObjectId(null);
  };

  const handleGoToSubsidiary = () => {
    setSelectedObjectId(null);
  };

  const currentObjects = selectedSubsidiaryId ? (objectsBySubsidiaryId[selectedSubsidiaryId] ?? []) : [];
  const selectedSubsidiary = subsidiaries.find((s) => s.id === selectedSubsidiaryId) ?? null;
  const selectedObject = currentObjects.find((o) => o.id === selectedObjectId) ?? null;

  return (
    <WorkspaceShell
      sidebar={
        <WorkspaceSidebar
          companies={COMPANIES}
          selectedCompany={selectedCompany}
          onSelectCompany={handleSelectCompany}
          searchValue={search}
          onSearchChange={setSearch}
          onLogout={logout}
        />
      }
    >
      <div className="px-10 py-8 max-w-3xl">
        {!selectedCompany ? (
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
              companyName={selectedCompany}
              subsidiaryName={selectedSubsidiary?.name ?? null}
              objectName={selectedObject?.name ?? null}
              onGoToCompany={handleGoToCompany}
              onGoToSubsidiary={handleGoToSubsidiary}
            />

            <SubsidiaryList
              subsidiaries={subsidiaries}
              selectedSubsidiaryId={selectedSubsidiaryId}
              onSelect={handleSelectSubsidiary}
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

              {selectedObject ? (
                <div className="px-4 py-3">
                  <p
                    className="text-base mb-1"
                    style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}
                  >
                    {selectedObject.name}
                  </p>
                  <p
                    className="text-sm mb-3"
                    style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
                  >
                    Här kommer objektvyn med 3-kolumnsgränssnittet.
                  </p>
                  <button
                    onClick={() => setSelectedObjectId(null)}
                    className="text-xs transition-colors"
                    style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
                  >
                    ← Tillbaka till listan
                  </button>
                </div>
              ) : (
                <ObjectListView
                  objects={currentObjects}
                  selectedObjectId={selectedObjectId}
                  onSelectObject={setSelectedObjectId}
                />
              )}
            </CollapsibleSection>
          </>
        )}
      </div>
    </WorkspaceShell>
  );
};

export default Workspace;
