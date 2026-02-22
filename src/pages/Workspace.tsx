import React, { useState } from 'react';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import SubsidiarySelect from '@/components/workspace/SubsidiarySelect';
import ObjectListView from '@/components/workspace/ObjectListView';
import { getMockSubsidiaries, getMockObjects } from '@/data/mockWorkspace';

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
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState<string | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { logout } = useLogout();

  const handleSelectCompany = (company: string) => {
    const subs = getMockSubsidiaries(company);
    setSelectedCompany(company);
    setSelectedSubsidiaryId(subs.length > 0 ? subs[0].id : null);
    setSelectedObjectId(null);
  };

  const handleSelectSubsidiary = (id: string) => {
    setSelectedSubsidiaryId(id);
    setSelectedObjectId(null);
  };

  const handleGoToCompany = () => {
    setSelectedObjectId(null);
  };

  const handleGoToSubsidiary = () => {
    setSelectedObjectId(null);
  };

  const subsidiaries = selectedCompany ? getMockSubsidiaries(selectedCompany) : [];
  const objects = selectedSubsidiaryId ? getMockObjects(selectedSubsidiaryId) : [];

  const selectedSubsidiary = subsidiaries.find((s) => s.id === selectedSubsidiaryId) ?? null;
  const selectedObject = objects.find((o) => o.id === selectedObjectId) ?? null;

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

            <SubsidiarySelect
              subsidiaries={subsidiaries}
              selectedSubsidiaryId={selectedSubsidiaryId ?? ''}
              onChange={handleSelectSubsidiary}
            />

            {selectedObject ? (
              <div>
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
                  objects={objects}
                  selectedObjectId={selectedObjectId}
                  onSelectObject={setSelectedObjectId}
                />
              </div>
            )}
          </>
        )}
      </div>
    </WorkspaceShell>
  );
};

export default Workspace;
