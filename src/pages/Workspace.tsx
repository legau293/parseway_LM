import React, { useState } from 'react';
import { Settings, HelpCircle, Search, Building2, ChevronRight } from 'lucide-react';
import parsewayLogo from "@/assets/parseway-logo.svg";
import { Link } from "react-router-dom";

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

  const filtered = COMPANIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex" style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: 'var(--pw-bg-primary)' }}>
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
          <Link to="/workspace" className="block mb-6">
            <img src={parsewayLogo} alt="Parseway" style={{ height: 22 }} />
          </Link>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            filtered.map((company) => {
              const isSelected = selected === company;
              return (
                <button
                  key={company}
                  onClick={() => setSelected(company)}
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
                  {company}
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
        </div>
      </aside>

      <main
        className="flex-1 overflow-y-auto"
        style={{ backgroundColor: 'var(--pw-bg-primary)' }}
      >
        <div className="px-10 py-8 max-w-3xl">
          <div className="mb-8">
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'var(--pw-text-tertiary)', fontWeight: 400, letterSpacing: '0.1em' }}
            >
              Moderbolag
            </p>
            <h1
              className="text-xl"
              style={{ color: 'var(--pw-text-primary)', fontWeight: 500 }}
            >
              {selected ?? 'Ingen vald'}
            </h1>
          </div>

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
      </main>
    </div>
  );
};

export default Workspace;
