import React from 'react';
import { Settings, HelpCircle, Search, Building2, LogOut } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import ProgressPill from './ProgressPill';
import { getNodeProgress } from '@/utils/progress';
import { OrgTree } from '@/data/mockOrgTree';

interface WorkspaceSidebarProps {
  companies: string[];
  companyNames: Record<string, string>;
  selectedCompany: string | null;
  onSelectCompany: (id: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onLogout: () => void;
  tree: OrgTree;
}

const WorkspaceSidebar = ({
  companies,
  companyNames,
  selectedCompany,
  onSelectCompany,
  searchValue,
  onSearchChange,
  onLogout,
  tree,
}: WorkspaceSidebarProps) => {
  const filtered = companies.filter((id) =>
    (companyNames[id] ?? id).toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <aside
      className="flex flex-col border-r"
      style={{
        width: '280px',
        minWidth: '280px',
        backgroundColor: 'var(--pw-bg-secondary)',
        borderColor: 'var(--pw-border)',
      }}
    >
      <div className="px-5 pt-5 pb-4">
        <div className="mb-6">
          <Logo size="sm" showText={true} />
        </div>
      </div>

      <div className="px-3 pb-3">
        <div
          className="flex items-center gap-2 rounded-md px-3 py-2"
          style={{ backgroundColor: 'var(--pw-bg-tertiary)' }}
        >
          <Search size={13} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Sök moderbolag…"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
            style={{ color: 'var(--pw-text-primary)', caretColor: 'var(--pw-primary)' }}
          />
        </div>
      </div>

      <nav className="flex-1 px-2 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-3 py-2 text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
            Inga träffar
          </p>
        ) : (
          filtered.map((id) => {
            const isSelected = selectedCompany === id;
            const name = companyNames[id] ?? id;
            const progress = getNodeProgress(id, tree);
            return (
              <button
                key={id}
                onClick={() => onSelectCompany(id)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
                style={{
                  backgroundColor: isSelected ? 'var(--pw-bg-tertiary)' : 'transparent',
                  color: isSelected ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)',
                  fontWeight: isSelected ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Building2 size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
                <span className="flex-1 truncate">{name}</span>
                <ProgressPill pct={progress.pct} barWidth={56} />
              </button>
            );
          })
        )}
      </nav>

      <div
        className="px-2 py-3 border-t"
        style={{ borderColor: 'var(--pw-border)' }}
      >
        <button
          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
          style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Settings size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
          Inställningar
        </button>
        <button
          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
          style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <HelpCircle size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
          Hjälp
        </button>
        <button
          onClick={onLogout}
          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
          style={{ color: 'var(--pw-text-secondary)', fontWeight: 400 }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogOut size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
          Logga ut
        </button>
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;
