import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLogout } from '@/services/authService';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';

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
  const { logout } = useLogout();

  return (
    <WorkspaceShell
      sidebar={
        <WorkspaceSidebar
          companies={COMPANIES}
          selectedCompany={selected}
          onSelectCompany={setSelected}
          searchValue={search}
          onSearchChange={setSearch}
          onLogout={logout}
        />
      }
    >
      <div className="px-10 py-8 max-w-3xl">
        <WorkspaceHeader selectedCompanyName={selected} />

        <div
          className="rounded-lg p-6"
          style={{
            backgroundColor: 'var(--pw-bg-secondary)',
            border: '1px solid var(--pw-border)',
          }}
        >
          <div
            className="flex items-center gap-2 mb-4 text-sm"
            style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}
          >
            <span>Moderbolag</span>
            <ChevronRight size={12} />
            <span>Dotterbolag</span>
            <ChevronRight size={12} />
            <span>Försäkringsobjekt</span>
          </div>
          <p
            className="text-sm"
            style={{ color: 'var(--pw-text-secondary)', fontWeight: 400, lineHeight: '1.6' }}
          >
            {selected
              ? `Välj ett dotterbolag eller försäkringsobjekt under ${selected} för att se detaljer.`
              : 'Välj ett moderbolag i panelen till vänster för att komma igång.'}
          </p>
          <p
            className="text-xs mt-4"
            style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400 }}
          >
            Här kommer 3-kolumnsgränssnittet för valt objekt.
          </p>
        </div>
      </div>
    </WorkspaceShell>
  );
};

export default Workspace;
