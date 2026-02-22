import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { InsuranceObject } from '@/data/mockOrgTree';
import ObjectRow, { ObjectListHeader } from './ObjectRow';

type SortKey = 'objectType' | 'name' | 'description' | 'completedPct';
type SortDir = 'asc' | 'desc';

interface ObjectListViewProps {
  objects: InsuranceObject[];
  expandedObjectId: string | null;
  onToggleObject: (id: string) => void;
}

const ThreeColumnDropdown = ({ object }: { object: InsuranceObject }) => (
  <div style={{ borderTop: '1px solid var(--pw-border)', borderBottom: '1px solid var(--pw-border)' }}>
    <div className="grid grid-cols-3">
      {(['Struktur', 'Hänvisning', 'Dokument'] as const).map((col, i) => (
        <div
          key={col}
          className="px-6 py-2 text-xs"
          style={{
            color: 'var(--pw-text-tertiary)',
            fontWeight: 500,
            borderRight: i < 2 ? '1px solid var(--pw-border)' : undefined,
            borderBottom: '1px solid var(--pw-border)',
          }}
        >
          {col}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3">
      <div className="px-6 py-4" style={{ borderRight: '1px solid var(--pw-border)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--pw-text-secondary)' }}>Strukturgrad</p>
        <p className="text-sm" style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}>{object.structurePct}%</p>
        <p className="text-xs mt-2" style={{ color: 'var(--pw-text-tertiary)' }}>Byggnadsår, yta, konstruktion</p>
      </div>
      <div className="px-6 py-4" style={{ borderRight: '1px solid var(--pw-border)' }}>
        <p className="text-xs mb-1" style={{ color: 'var(--pw-text-secondary)' }}>Verifieringsgrad</p>
        <p className="text-sm" style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}>{object.verifiedPct}%</p>
        <p className="text-xs mt-2" style={{ color: 'var(--pw-text-tertiary)' }}>Försäkringsbevis, avtal</p>
      </div>
      <div className="px-6 py-4">
        <p className="text-xs mb-1" style={{ color: 'var(--pw-text-secondary)' }}>Saknade dokument</p>
        <p className="text-sm" style={{ color: object.missingCount > 0 ? 'var(--pw-accent-red)' : 'var(--pw-text-primary)', fontWeight: 500 }}>
          {object.missingCount}
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--pw-text-tertiary)' }}>Ritningar, certifikat</p>
      </div>
    </div>
  </div>
);

const OBJECT_TYPES = ['Alla', 'Fastighet', 'Bil', 'Maskin'];

const ObjectListView = ({ objects, expandedObjectId, onToggleObject }: ObjectListViewProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Alla');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return objects.filter((o) => {
      const matchSearch = !q || o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q);
      const matchType = typeFilter === 'Alla' || o.objectType === typeFilter;
      return matchSearch && matchType;
    });
  }, [objects, search, typeFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  return (
    <div>
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{ borderBottom: '1px solid var(--pw-border)' }}
      >
        <div
          className="flex items-center gap-1.5 flex-1 max-w-[240px] rounded px-2.5 py-1"
          style={{ border: '1px solid var(--pw-border)' }}
        >
          <Search size={11} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök..."
            className="bg-transparent outline-none text-xs w-full"
            style={{ color: 'var(--pw-text-primary)', caretColor: 'var(--pw-accent-red)' }}
            onFocus={(e) => (e.currentTarget.parentElement!.style.borderColor = 'var(--pw-accent-red)')}
            onBlur={(e) => (e.currentTarget.parentElement!.style.borderColor = 'var(--pw-border)')}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-xs rounded px-2 py-1 outline-none cursor-pointer transition-colors"
          style={{
            border: '1px solid var(--pw-border)',
            backgroundColor: 'var(--pw-bg-primary)',
            color: 'var(--pw-text-secondary)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--pw-accent-red)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--pw-border)')}
        >
          {OBJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {(search || typeFilter !== 'Alla') && (
          <button
            onClick={() => { setSearch(''); setTypeFilter('Alla'); }}
            className="text-xs transition-colors"
            style={{ color: 'var(--pw-text-tertiary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pw-text-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pw-text-tertiary)')}
          >
            Rensa
          </button>
        )}

        <span className="ml-auto text-xs" style={{ color: 'var(--pw-text-tertiary)' }}>
          {sorted.length} {sorted.length === 1 ? 'objekt' : 'objekt'}
        </span>
      </div>

      <ObjectListHeader sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />

      {sorted.length === 0 ? (
        <p className="text-xs px-4 py-4" style={{ color: 'var(--pw-text-tertiary)' }}>
          Inga objekt matchar filtret.
        </p>
      ) : (
        sorted.map((obj) => (
          <React.Fragment key={obj.id}>
            <ObjectRow
              object={obj}
              isExpanded={expandedObjectId === obj.id}
              onClick={() => onToggleObject(obj.id)}
            />
            {expandedObjectId === obj.id && (
              <ThreeColumnDropdown object={obj} />
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default ObjectListView;
