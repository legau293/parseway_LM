import React, { useState } from 'react';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import ObjectListView from '@/components/workspace/ObjectListView';
import { getMockObjects } from '@/data/mockObjects';

const COMPANIES = [
  'Volvo AB',
  'Atlas Copco',
  'Assa Abloy',
  'Sandvik',
  'Hexagon',
  'Epiroc',
];

const Workspace = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const { logout } = useLogout();

  const handleSelectCompany = (company: string) => {
    setSelected(company);
    setSelectedObjectId(null);
  };

  const selectedObject = selected
    ? getMockObjects(selected).find((o) => o.id === selectedObjectId) ?? null
    : null;

  return (
    <WorkspaceShell
      sidebar={
        <WorkspaceSidebar
          companies={COMPANIES}
          selectedCompany={selected}
          onSelectCompany={handleSelectCompany}
          searchValue={search}
          onSearchChange={setSearch}
          onLogout={logout}
        />
      }
    >
      <div className="px-10 py-8 max-w-3xl">
        <WorkspaceHeader selectedCompanyName={selected} />

        {!selected ? (
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
        ) : selectedObject ? (
          <div>
            <button
              onClick={() => setSelectedObjectId(null)}
              className="text-sm mb-6"
              style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-tertiary)')}
            >
              ← Tillbaka till listan
            </button>
            <p
              className="text-base mb-2"
              style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}
            >
              {selectedObject.name}
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
            >
              Här kommer objektvyn med 3-kolumnsgränssnittet.
            </p>
          </div>
        ) : (
          <div>
            <p
              className="text-sm mb-3 px-1"
              style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
            >
              Försäkringsobjekt
            </p>
            <ObjectListView
              objects={getMockObjects(selected)}
              selectedObjectId={selectedObjectId}
              onSelectObject={setSelectedObjectId}
            />
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
};

export default Workspace;
