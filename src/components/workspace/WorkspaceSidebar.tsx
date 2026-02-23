import React, { useRef, useEffect } from 'react';
import { Search, Building2, Star, Plus, Settings, HelpCircle, LogOut, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import ProgressPill from './ProgressPill';
import { getNodeProgress } from '@/utils/progress';
import { OrgTree } from '@/data/mockOrgTree';
import { useAuth } from '@/contexts/AuthContext';
import * as Tooltip from '@radix-ui/react-tooltip';

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
  onLogoClick: () => void;
  onAddCompany: (name: string) => void;
  tree: OrgTree;
}

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

function NavTooltip({ label, collapsed, children }: { label: string; collapsed: boolean; children: React.ReactNode }) {
  if (!collapsed) return <>{children}</>;
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            style={{
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: 'var(--pw-bg-secondary)',
              border: '1px solid var(--pw-border)',
              color: 'var(--pw-text-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
              zIndex: 100,
              pointerEvents: 'none',
            }}
          >
            {label}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

const CompanyRow = ({
  id,
  name,
  isSelected,
  isFavorite,
  pct,
  onSelect,
  onToggleFavorite,
  collapsed,
}: {
  id: string;
  name: string;
  isSelected: boolean;
  isFavorite: boolean;
  pct: number;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  collapsed: boolean;
}) => {
  const [hovered, setHovered] = React.useState(false);

  const inner = (
    <div
      className="flex items-center rounded-md transition-colors"
      style={{
        gap: collapsed ? 0 : '8px',
        padding: collapsed ? '6px' : '6px 8px',
        justifyContent: collapsed ? 'center' : undefined,
        backgroundColor: isSelected || hovered ? 'var(--pw-bg-tertiary)' : 'transparent',
        color: isSelected ? 'var(--pw-text-primary)' : 'var(--pw-text-secondary)',
        fontWeight: isSelected ? 500 : 400,
        cursor: 'pointer',
        borderLeft: isSelected ? '2px solid var(--pw-accent-red)' : '2px solid transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <Building2 size={14} style={{ flexShrink: 0, opacity: 0.6 }} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-sm">{name}</span>
          <ProgressPill pct={pct} barWidth={40} showPct={false} />
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(e); }}
            className="shrink-0 transition-all"
            style={{
              opacity: isFavorite || hovered ? 1 : 0,
              color: isFavorite ? '#2DB7A3' : 'var(--pw-text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            title={isFavorite ? 'Ta bort favorit' : 'Lägg till favorit'}
          >
            <Star size={12} fill={isFavorite ? '#2DB7A3' : 'none'} />
          </button>
        </>
      )}
    </div>
  );

  return (
    <NavTooltip label={name} collapsed={collapsed}>
      {inner}
    </NavTooltip>
  );
};

const UserMenu = ({
  displayName,
  onLogout,
  collapsed,
}: {
  displayName: string;
  onLogout: () => void;
  collapsed: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setOpen(false));

  const menuItemStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 10px',
    fontSize: '13px',
    color: 'var(--pw-text-secondary)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background 0.1s',
  };

  if (collapsed) {
    return (
      <NavTooltip label={displayName} collapsed={true}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '6px',
            cursor: 'default',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'var(--pw-bg-tertiary)',
              border: '1px solid var(--pw-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--pw-text-secondary)',
              flexShrink: 0,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </NavTooltip>
    );
  }

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
        style={{
          color: 'var(--pw-text-secondary)',
          backgroundColor: open ? 'var(--pw-bg-tertiary)' : 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <span className="flex-1 truncate text-left text-sm" style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}>
          {displayName}
        </span>
        <ChevronDown
          size={13}
          style={{
            flexShrink: 0,
            color: 'var(--pw-text-tertiary)',
            transition: 'transform 0.15s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: '8px',
            right: '8px',
            zIndex: 50,
            backgroundColor: 'var(--pw-bg-secondary)',
            border: '1px solid var(--pw-border)',
            borderRadius: '6px',
            padding: '4px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          <button
            style={menuItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Settings size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
            Inställningar
          </button>
          <button
            style={menuItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <HelpCircle size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
            Hjälp
          </button>
          <div style={{ borderTop: '1px solid var(--pw-border)', margin: '4px 0' }} />
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            style={menuItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <LogOut size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
            Logga ut
          </button>
        </div>
      )}
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
  onLogoClick,
  onAddCompany,
  tree,
}: WorkspaceSidebarProps) => {
  const [collapsed, setCollapsed] = React.useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [isAddingCompany, setIsAddingCompany] = React.useState(false);
  const [newCompanyName, setNewCompanyName] = React.useState('');
  const addInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const displayName = (() => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name)
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    if (user?.email) return user.email.split('@')[0];
    return 'Dennis Johansson';
  })();

  useEffect(() => {
    if (isAddingCompany) addInputRef.current?.focus();
  }, [isAddingCompany]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
  };

  const handleConfirmAdd = () => {
    const name = newCompanyName.trim();
    if (!name) return;
    onAddCompany(name);
    setNewCompanyName('');
    setIsAddingCompany(false);
  };

  const handleCancelAdd = () => {
    setNewCompanyName('');
    setIsAddingCompany(false);
  };

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
        collapsed={collapsed}
      />
    );
  };

  return (
    <aside
      className="flex flex-col border-r flex-shrink-0"
      style={{
        width: collapsed ? '56px' : '280px',
        minWidth: collapsed ? '56px' : '280px',
        backgroundColor: 'var(--pw-bg-secondary)',
        borderColor: 'var(--pw-border)',
        transition: 'width 200ms ease-out, min-width 200ms ease-out',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: collapsed ? '16px 8px 12px' : '20px 20px 12px' }}>
        <button
          onClick={onLogoClick}
          className="block"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            marginBottom: collapsed ? '12px' : '16px',
            display: 'flex',
            justifyContent: collapsed ? 'center' : undefined,
          }}
        >
          <Logo size="sm" showText={!collapsed} />
        </button>

        <UserMenu displayName={displayName} onLogout={onLogout} collapsed={collapsed} />

        {!collapsed && (
          <div className="mt-2">
            {isAddingCompany ? (
              <div
                className="rounded-md px-3 py-2"
                style={{ backgroundColor: 'var(--pw-bg-tertiary)', border: '1px solid var(--pw-border)' }}
              >
                <input
                  ref={addInputRef}
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmAdd();
                    if (e.key === 'Escape') handleCancelAdd();
                  }}
                  placeholder="Moderbolagsnamn…"
                  className="bg-transparent outline-none w-full text-sm mb-2"
                  style={{ color: 'var(--pw-text-primary)', caretColor: 'var(--pw-primary)', display: 'block' }}
                  onFocus={(e) => (e.currentTarget.parentElement!.style.borderColor = 'var(--pw-accent-red)')}
                  onBlur={(e) => (e.currentTarget.parentElement!.style.borderColor = 'var(--pw-border)')}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConfirmAdd}
                    disabled={!newCompanyName.trim()}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      border: `1px solid ${newCompanyName.trim() ? 'var(--pw-accent-red)' : 'var(--pw-border)'}`,
                      color: newCompanyName.trim() ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)',
                      opacity: newCompanyName.trim() ? 1 : 0.5,
                      cursor: newCompanyName.trim() ? 'pointer' : 'default',
                      backgroundColor: 'transparent',
                    }}
                  >
                    Skapa
                  </button>
                  <button
                    onClick={handleCancelAdd}
                    className="text-xs"
                    style={{ color: 'var(--pw-text-tertiary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-tertiary)')}
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCompany(true)}
                className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors"
                style={{
                  color: 'var(--pw-text-tertiary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
                  e.currentTarget.style.color = 'var(--pw-text-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--pw-text-tertiary)';
                }}
              >
                <Plus size={12} style={{ flexShrink: 0 }} />
                <span>Lägg till moderbolag</span>
              </button>
            )}
          </div>
        )}

        {collapsed && (
          <NavTooltip label="Lägg till moderbolag" collapsed={true}>
            <button
              onClick={() => { setCollapsed(false); localStorage.setItem('sidebarCollapsed', 'false'); setIsAddingCompany(true); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '6px',
                borderRadius: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--pw-text-tertiary)',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)'; e.currentTarget.style.color = 'var(--pw-text-secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--pw-text-tertiary)'; }}
            >
              <Plus size={14} />
            </button>
          </NavTooltip>
        )}
      </div>

      {!collapsed && (
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
      )}

      <nav className="flex-1 overflow-y-auto" style={{ padding: collapsed ? '0 4px' : '0 8px' }}>
        {!collapsed && filtered.length === 0 && (
          <p className="px-3 py-2 text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
            Inga träffar
          </p>
        )}
        {(!collapsed || true) && (
          <>
            {favoriteIds.length > 0 && (
              <div className="mb-1">
                {!collapsed && (
                  <p className="px-3 pb-0.5 pt-1 text-xs uppercase tracking-wide" style={{ color: 'var(--pw-text-tertiary)' }}>
                    Favoriter
                  </p>
                )}
                {favoriteIds.map(renderRow)}
              </div>
            )}
            {otherIds.length > 0 && (
              <div>
                {!collapsed && favoriteIds.length > 0 && (
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

      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expandera sidopanel' : 'Kollapsa sidopanel'}
        style={{
          position: 'absolute',
          right: '-1px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '32px',
          borderRadius: '0 4px 4px 0',
          backgroundColor: 'var(--pw-bg-secondary)',
          border: '1px solid var(--pw-border)',
          borderLeft: 'none',
          cursor: 'pointer',
          color: 'var(--pw-text-tertiary)',
          transition: 'color 0.15s, background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--pw-text-secondary)';
          e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--pw-text-tertiary)';
          e.currentTarget.style.backgroundColor = 'var(--pw-bg-secondary)';
        }}
      >
        {collapsed
          ? <ChevronRight size={10} strokeWidth={2} />
          : <ChevronLeft size={10} strokeWidth={2} />
        }
      </button>
    </aside>
  );
};

export default WorkspaceSidebar;
