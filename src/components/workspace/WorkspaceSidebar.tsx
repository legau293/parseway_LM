import React from 'react';
import { Settings, HelpCircle, Search, Building2, LogOut, Star } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import ProgressPill from './ProgressPill';
import { getNodeProgress } from '@/utils/progress';
import { OrgTree } from '@/data/mockOrgTree';

interface WorkspaceSidebarProps {
  companies: string[];
  companyNames: Record<string, string>;
  selectedCompany: string | null;
  onSelectCompany: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onLogout: () => void;
  tree: OrgTree;
}

const CompanyRow = ({
  id,
  name,
  isSelected,
  isFavorite,
  pct,
  onSelect,
  onToggleFavorite,
}: {
  id: string;
  name: string;
  isSelected: boolean;
  isFavorite: boolean;
  pct: number;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
      style={{
        backgroundColor: isSelected || hovered ? 'var(--pw-bg-tertiary)' : 'transparent',
        color: isSelected ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)',
        fontWeight: isSelected ? 500 : 400,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button onClick={onSelect} className="flex items-center gap-2 flex-1 min-w-0 text-left">
        <Building2 size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
        <span className="flex-1 truncate">{name}</span>
      </button>
      <ProgressPill pct={pct} barWidth={56} showPct={false} />
      <button
        onClick={onToggleFavorite}
        className="shrink-0 transition-all"
        style={{
          opacity: isFavorite || hovered ? 1 : 0,
          color: isFavorite ? '#2DB7A3' : 'var(--pw-text-tertiary)',
        }}
        title={isFavorite ? 'Ta bort favorit' : 'Lägg till favorit'}
      >
        <Star size={12} fill={isFavorite ? '#2DB7A3' : 'none'} />
      </button>
    </div>
  );
};

const WorkspaceSidebar = ({
  companies,
  companyNames,
  selectedCompany,
  onSelectCompany,
  favorites,
  onToggleFavorite,
  searchValue,
  onSearchChange,
  onLogout,
  tree,
}: WorkspaceSidebarProps) => {
  const filtered = companies.filter((id) =>
    (companyNames[id] ?? id).toLowerCase().includes(searchValue.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    (companyNames[a] ?? a).localeCompare(companyNames[b] ?? b, 'sv', { sensitivity: 'base' })
  );

  const favoriteIds = sorted.filter((id) => favorites.includes(id));
  const otherIds = sorted.filter((id) => !favorites.includes(id));

  const renderRow = (id: string) => {
    const progress = getNodeProgress(id, tree);
    return (
      <CompanyRow
        key={id}
        id={id}
        name={companyNames[id] ?? id}
        isSelected={selectedCompany === id}
        isFavorite={favorites.includes(id)}
        pct={progress.pct}
        onSelect={() => onSelectCompany(id)}
        onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(id); }}
      />
    );
  };

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
            value={searchValue}
            placeholder="Sök moderbolag…"
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
          <>
            {favoriteIds.length > 0 && (
              <div className="mb-1">
                <p className="px-3 pb-0.5 pt-1 text-xs uppercase tracking-wide" style={{ color: 'var(--pw-text-tertiary)' }}>
                  Favoriter
                </p>
                {favoriteIds.map(renderRow)}
              </div>
            )}
            {otherIds.length > 0 && (
              <div>
                {favoriteIds.length > 0 && (
                  <p className="px-3 pb-0.5 pt-2 text-xs uppercase tracking-wide" style={{ color: 'var(--pw-text-tertiary)' }}>
                    Övriga
                  </p>
                )}
                {otherIds.map(renderRow)}
              </div>
            )}
          </>
        )}
      </nav>

      <div className="px-2 py-3 border-t" style={{ borderColor: 'var(--pw-border)' }}>
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
