import React, { useState, useRef, useEffect } from 'react';
import { Check, FileText, ChevronRight } from 'lucide-react';
import { InsuranceObject, ObjectParameter, ParameterStatus } from '@/data/mockOrgTree';
import { getProgressFill } from './ProgressPill';
import BuildingSwitcher from './BuildingSwitcher';

interface Props {
  object: InsuranceObject;
  onUpdateParameter: (paramId: string, patch: { value?: string; status?: ParameterStatus }) => void;
}

const TEAL = '#2DB7A3';
const RED = '#E5483F';

function StatusDot({ status }: { status: ParameterStatus }) {
  let bg: string;
  let title: string;
  if (status === 'verified') {
    bg = TEAL;
    title = 'Mänskligt bekräftat';
  } else if (status === 'ai') {
    bg = RED;
    title = 'AI-framtaget';
  } else {
    bg = 'var(--pw-text-tertiary)';
    title = 'Saknas';
  }
  return (
    <span
      title={title}
      style={{
        display: 'inline-block',
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        backgroundColor: bg,
        flexShrink: 0,
        alignSelf: 'center',
      }}
    />
  );
}

function ParameterRow({
  param,
  isSelected,
  onSelect,
  onUpdate,
}: {
  param: ObjectParameter;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (patch: { value?: string; status?: ParameterStatus }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(param.value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(param.value);
    setEditing(false);
  }, [param.id, param.value]);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleCommit = () => {
    const trimmed = draft.trim();
    if (trimmed !== param.value) {
      onUpdate({ value: trimmed, status: param.status === 'missing' && trimmed ? 'ai' : param.status });
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleCommit(); }
    if (e.key === 'Escape') { setDraft(param.value); setEditing(false); }
  };

  const handleVerify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (param.status !== 'verified') {
      onUpdate({ status: 'verified' });
    }
  };

  return (
    <div
      onClick={() => { onSelect(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 16px',
        cursor: 'pointer',
        backgroundColor: isSelected ? 'var(--pw-bg-tertiary)' : 'transparent',
        borderLeft: isSelected ? `2px solid ${TEAL}` : '2px solid transparent',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--pw-bg-secondary)'; }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <StatusDot status={param.status} />

      <div
        style={{
          minWidth: '130px',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            lineHeight: 1.25,
            color: 'var(--pw-text-tertiary)',
            display: 'block',
          }}
        >
          {param.label}
        </span>
        {param.helpText && (
          <span
            style={{
              fontSize: '10px',
              color: 'var(--pw-text-tertiary)',
              opacity: 0.7,
              display: 'block',
              marginTop: '1px',
              lineHeight: 1.25,
            }}
          >
            {param.helpText}
          </span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleCommit}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--pw-bg-primary)',
              border: '1px solid var(--pw-border)',
              color: 'var(--pw-text-primary)',
              borderRadius: '3px',
              fontSize: '12px',
              padding: '1px 6px',
              outline: 'none',
              width: '100%',
            }}
          />
        ) : (
          <span
            onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); setDraft(param.value); }}
            style={{
              fontSize: '11px',
              lineHeight: 1.25,
              color: param.value ? 'var(--pw-text-primary)' : 'var(--pw-text-tertiary)',
              display: 'block',
              wordBreak: 'break-word',
            }}
            title="Dubbelklicka för att redigera"
          >
            {param.value || '–'}
          </span>
        )}
      </div>

      {param.status !== 'verified' && !editing && (
        <button
          onClick={handleVerify}
          title="Bekräfta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '3px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--pw-text-tertiary)',
            flexShrink: 0,
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.1s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = TEAL; e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--pw-text-tertiary)'; e.currentTarget.style.opacity = isSelected ? '1' : '0'; }}
        >
          <Check size={11} />
        </button>
      )}
    </div>
  );
}

function groupParamsBySection(params: ObjectParameter[]): { section: string | null; items: ObjectParameter[] }[] {
  const groups: { section: string | null; items: ObjectParameter[] }[] = [];
  let currentSection: string | null = null;
  let currentItems: ObjectParameter[] = [];

  for (const p of params) {
    const sec = p.section ?? null;
    if (sec !== currentSection) {
      if (currentItems.length > 0) groups.push({ section: currentSection, items: currentItems });
      currentSection = sec;
      currentItems = [p];
    } else {
      currentItems.push(p);
    }
  }
  if (currentItems.length > 0) groups.push({ section: currentSection, items: currentItems });
  return groups;
}

function LeftColumn({
  params,
  selectedParamId,
  onSelectParam,
  onUpdateParam,
  switcher,
}: {
  params: ObjectParameter[];
  selectedParamId: string | null;
  onSelectParam: (id: string) => void;
  onUpdateParam: (id: string, patch: { value?: string; status?: ParameterStatus }) => void;
  switcher?: React.ReactNode;
}) {
  const verifiedCount = params.filter((p) => p.status === 'verified').length;
  const total = params.length;
  const pct = total === 0 ? 0 : Math.round((verifiedCount / total) * 100);
  const allDone = pct === 100;
  const groups = groupParamsBySection(params);
  const hasSections = params.some((p) => p.section);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        borderRight: '1px solid var(--pw-border)',
      }}
    >
      {switcher}
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--pw-border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--pw-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Parametrar
          </span>
          {!allDone && (
            <span style={{ fontSize: '11px', color: 'var(--pw-text-tertiary)' }}>
              {pct}%
            </span>
          )}
        </div>
        <div
          style={{
            height: '3px',
            borderRadius: '2px',
            backgroundColor: 'var(--pw-bg-tertiary)',
            border: '1px solid var(--pw-border)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: '2px',
              background: getProgressFill(pct),
              transition: 'width 0.35s ease',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '2px', paddingBottom: '4px' }}>
        {hasSections
          ? groups.map((group, gi) => (
              <React.Fragment key={group.section ?? gi}>
                {group.section && (
                  <div
                    style={{
                      padding: gi === 0 ? '6px 16px 2px' : '8px 16px 2px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: 'var(--pw-text-secondary)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      userSelect: 'none',
                    }}
                  >
                    {group.section}
                  </div>
                )}
                {group.items.map((p) => (
                  <ParameterRow
                    key={p.id}
                    param={p}
                    isSelected={selectedParamId === p.id}
                    onSelect={() => onSelectParam(p.id)}
                    onUpdate={(patch) => onUpdateParam(p.id, patch)}
                  />
                ))}
              </React.Fragment>
            ))
          : params.map((p) => (
              <ParameterRow
                key={p.id}
                param={p}
                isSelected={selectedParamId === p.id}
                onSelect={() => onSelectParam(p.id)}
                onUpdate={(patch) => onUpdateParam(p.id, patch)}
              />
            ))}
      </div>
    </div>
  );
}

function MiddleColumn({
  param,
  onSelectSection,
  activeSectionKey: activeSection,
}: {
  param: ObjectParameter | null;
  onSelectSection: (key: string | null) => void;
  activeSectionKey: string | null;
}) {
  const ref = param?.reference;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        borderRight: '1px solid var(--pw-border)',
      }}
    >
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--pw-border)', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--pw-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Hänvisning
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {!param ? (
          <p style={{ fontSize: '12px', color: 'var(--pw-text-tertiary)' }}>
            Välj ett fält till vänster för att se hänvisning.
          </p>
        ) : !ref ? (
          <p style={{ fontSize: '12px', color: 'var(--pw-text-tertiary)' }}>
            Ingen hänvisning tillgänglig för <em>{param.label}</em>.
          </p>
        ) : (
          <div>
            <div
              onClick={() => onSelectSection(ref.filename + ':' + ref.section)}
              style={{
                cursor: 'pointer',
                padding: '10px 12px',
                borderRadius: '4px',
                border: `1px solid ${activeSection === ref.filename + ':' + ref.section ? TEAL : 'var(--pw-border)'}`,
                backgroundColor: activeSection === ref.filename + ':' + ref.section ? 'rgba(45,183,163,0.06)' : 'transparent',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => { if (activeSection !== ref.filename + ':' + ref.section) (e.currentTarget as HTMLElement).style.borderColor = 'var(--pw-text-tertiary)'; }}
              onMouseLeave={(e) => { if (activeSection !== ref.filename + ':' + ref.section) (e.currentTarget as HTMLElement).style.borderColor = 'var(--pw-border)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <FileText size={11} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--pw-text-primary)', wordBreak: 'break-word' }}>
                  {ref.filename}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <ChevronRight size={10} style={{ color: 'var(--pw-text-tertiary)', flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: 'var(--pw-text-secondary)' }}>
                  {ref.section}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--pw-text-secondary)', lineHeight: 1.6, margin: 0, borderLeft: `2px solid ${TEAL}`, paddingLeft: '8px' }}>
                "{ref.excerpt}"
              </p>
              {ref.pageHint && (
                <p style={{ fontSize: '10px', color: 'var(--pw-text-tertiary)', marginTop: '6px', marginBottom: 0 }}>
                  Sida {ref.pageHint}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const MOCK_DOC_SECTIONS = [
  { key: 'Fastighetsdokumentation_2023.pdf:Avsnitt 1 – Klassificering', label: 'Avsnitt 1 – Klassificering', page: 2 },
  { key: 'Fastighetsdokumentation_2023.pdf:Avsnitt 2 – Byggnadsbeskrivning', label: 'Avsnitt 2 – Byggnadsbeskrivning', page: 4 },
  { key: 'Fastighetsdokumentation_2023.pdf:Avsnitt 3 – Ytor och volymer', label: 'Avsnitt 3 – Ytor och volymer', page: 6 },
  { key: 'Taxeringsutdrag_2024.pdf:Fastighetsuppgifter', label: 'Fastighetsuppgifter', page: 1 },
  { key: 'Taxeringsutdrag_2024.pdf:Fastighetsbeteckning', label: 'Fastighetsbeteckning', page: 1 },
  { key: 'Taxeringsutdrag_2024.pdf:Taxeringsvärde', label: 'Taxeringsvärde', page: 2 },
  { key: 'Hyresavtal_2024.pdf:Ekonomisk sammanfattning', label: 'Ekonomisk sammanfattning', page: 3 },
  { key: 'Maskinspecifikation.pdf:Identifikation', label: 'Identifikation', page: 1 },
  { key: 'Maskinspecifikation.pdf:Tekniska data', label: 'Tekniska data', page: 2 },
  { key: 'Maskinspecifikation.pdf:Underhåll', label: 'Underhåll', page: 3 },
  { key: 'Planlösning_2023.pdf:Maskinlayout', label: 'Maskinlayout', page: 5 },
  { key: 'Inköpsorder_2020.pdf:Orderbekräftelse', label: 'Orderbekräftelse', page: 1 },
];

function MockDocPage({ index, isHighlighted, label }: { index: number; isHighlighted: boolean; label?: string }) {
  return (
    <div
      style={{
        borderRadius: '3px',
        border: isHighlighted ? `1.5px solid ${TEAL}` : '1px solid var(--pw-border)',
        backgroundColor: isHighlighted ? 'rgba(45,183,163,0.05)' : 'var(--pw-bg-secondary)',
        padding: '10px 12px',
        marginBottom: '8px',
        transition: 'border-color 0.2s, background 0.2s',
        scrollMarginTop: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', color: 'var(--pw-text-tertiary)' }}>
          {isHighlighted && label ? label : `Sida ${index + 1}`}
        </span>
        {isHighlighted && (
          <span style={{ fontSize: '10px', color: TEAL, fontWeight: 500 }}>Markerat avsnitt</span>
        )}
      </div>
      {[...Array(isHighlighted ? 3 : 5)].map((_, i) => (
        <div
          key={i}
          style={{
            height: '8px',
            borderRadius: '2px',
            backgroundColor: isHighlighted && i < 2 ? 'rgba(45,183,163,0.25)' : 'var(--pw-bg-tertiary)',
            marginBottom: '5px',
            width: i === 2 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

function RightColumn({ activeSectionKey }: { activeSectionKey: string | null }) {
  const highlightedPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSectionKey && highlightedPageRef.current) {
      highlightedPageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSectionKey]);

  const activeSection = MOCK_DOC_SECTIONS.find((s) => s.key === activeSectionKey);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--pw-border)', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--pw-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Originaldokument
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {!activeSectionKey ? (
          <>
            <p style={{ fontSize: '12px', color: 'var(--pw-text-tertiary)', marginBottom: '16px' }}>
              Klicka på en hänvisning för att navigera i dokumentet.
            </p>
            {[...Array(6)].map((_, i) => (
              <MockDocPage key={i} index={i} isHighlighted={false} />
            ))}
          </>
        ) : (
          <>
            {MOCK_DOC_SECTIONS.slice(0, 3).map((sec, i) => {
              const isHighlighted = sec.key === activeSectionKey;
              return (
                <div key={sec.key} ref={isHighlighted ? highlightedPageRef : undefined}>
                  <MockDocPage index={i} isHighlighted={isHighlighted} label={activeSection?.label} />
                </div>
              );
            })}
            <div ref={MOCK_DOC_SECTIONS.slice(3).findIndex((s) => s.key === activeSectionKey) >= 0 ? highlightedPageRef : undefined}>
              {MOCK_DOC_SECTIONS.slice(3).map((sec, i) => {
                const isHighlighted = sec.key === activeSectionKey;
                return (
                  <div key={sec.key} ref={isHighlighted ? highlightedPageRef : undefined}>
                    <MockDocPage index={i + 3} isHighlighted={isHighlighted} label={activeSection?.label} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const ObjectThreeColumnView = ({ object, onUpdateParameter }: Props) => {
  const buildings = object.buildings ?? [];
  const hasBuildings = buildings.length > 0;

  const [activeBuildingId, setActiveBuildingId] = useState<string>(() => buildings[0]?.id ?? '');
  const [selectedParamId, setSelectedParamId] = useState<string | null>(null);
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(null);

  const activeBuilding = hasBuildings ? buildings.find((b) => b.id === activeBuildingId) ?? buildings[0] : null;
  const params = hasBuildings ? (activeBuilding?.parameters ?? []) : (object.parameters ?? []);

  useEffect(() => {
    const firstBuilding = buildings[0];
    setActiveBuildingId(firstBuilding?.id ?? '');
    setSelectedParamId(null);
    setActiveSectionKey(null);
  }, [object.id]);

  useEffect(() => {
    setSelectedParamId(params[0]?.id ?? null);
    setActiveSectionKey(null);
  }, [activeBuildingId]);

  const selectedParam = params.find((p) => p.id === selectedParamId) ?? null;

  const getBuildingProgress = (b: { parameters: { status: string }[] }) => {
    const total = b.parameters.length;
    if (total === 0) return 0;
    const verified = b.parameters.filter((p) => p.status === 'verified').length;
    return Math.round((verified / total) * 100);
  };

  const handleSelectSection = (key: string | null) => {
    setActiveSectionKey(key);
  };

  const handleSwitchBuilding = (id: string) => {
    setActiveBuildingId(id);
  };

  if (params.length === 0) {
    return (
      <div
        style={{
          borderTop: '1px solid var(--pw-border)',
          borderBottom: '1px solid var(--pw-border)',
          backgroundColor: 'var(--pw-bg-secondary)',
          padding: '24px 40px',
        }}
      >
        <p style={{ fontSize: '12px', color: 'var(--pw-text-tertiary)' }}>
          Inga parametrar konfigurerade för detta objekt.
        </p>
      </div>
    );
  }

  const switcherNode = hasBuildings ? (
    <BuildingSwitcher
      buildings={buildings}
      activeBuildingId={activeBuildingId}
      onSelect={handleSwitchBuilding}
      getProgress={getBuildingProgress}
    />
  ) : undefined;

  return (
    <div
      style={{
        borderTop: '1px solid var(--pw-border)',
        borderBottom: '1px solid var(--pw-border)',
        backgroundColor: 'var(--pw-bg-primary)',
        display: 'grid',
        gridTemplateColumns: '1.5fr 0.8fr 1.1fr',
        height: 'calc(100vh - 120px)',
        overflow: 'hidden',
      }}
    >
      <LeftColumn
        params={params}
        selectedParamId={selectedParamId}
        onSelectParam={(id) => {
          setSelectedParamId(id);
          setActiveSectionKey(null);
        }}
        onUpdateParam={onUpdateParameter}
        switcher={switcherNode}
      />
      <MiddleColumn
        param={selectedParam}
        onSelectSection={handleSelectSection}
        activeSectionKey={activeSectionKey}
      />
      <RightColumn activeSectionKey={activeSectionKey} />
    </div>
  );
};

export default ObjectThreeColumnView;
