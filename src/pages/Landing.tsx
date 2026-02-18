import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

const PipelineMockup = () => (
  <div
    className="w-full rounded-2xl overflow-hidden shadow-2xl border"
    style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
  >
    <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #F1F5F9' }}>
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EEF2F1' }} />
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EEF2F1' }} />
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EEF2F1' }} />
    </div>
    <div className="p-5">
      <div className="mb-5">
        <div className="h-2.5 w-28 rounded mb-2" style={{ backgroundColor: '#EEF2F1' }} />
        <div className="h-2 w-20 rounded" style={{ backgroundColor: '#F7F9F8' }} />
      </div>
      <div className="flex flex-col gap-3 mb-5">
        {[
          { label: 'Annual report Q4 2024.pdf', status: 'done', pct: 100 },
          { label: 'Market analysis — EMEA.docx', status: 'done', pct: 100 },
          { label: 'Supplier database export.csv', status: 'active', pct: 68 },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-3">
            <div
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: f.status === 'done' ? 'rgba(45,183,163,0.12)' : '#F7F9F8' }}
            >
              {f.status === 'done' ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke="#2DB7A3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="4" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 2" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate mb-1" style={{ color: '#0F172A' }}>{f.label}</p>
              <div className="h-1 rounded-full w-full" style={{ backgroundColor: '#EEF2F1' }}>
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${f.pct}%`, backgroundColor: f.status === 'done' ? '#2DB7A3' : '#94A3B8' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sources processed', value: '1,240', sub: 'this month' },
          { label: 'Time saved', value: '94 h', sub: 'avg / team' },
          { label: 'Accuracy', value: '99.8%', sub: 'verified' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3"
            style={{ backgroundColor: '#F7F9F8', border: '1px solid #EEF2F1' }}
          >
            <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{stat.label}</p>
            <p className="font-medium text-sm" style={{ color: '#0F172A' }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#2DB7A3' }}>{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PipelineStepCard = ({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div
    className="rounded-2xl p-6 flex flex-col gap-3"
    style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
  >
    <div className="flex items-start gap-3">
      <div
        className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl"
        style={{ backgroundColor: '#EEF2F1' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium mb-0.5" style={{ color: '#2DB7A3' }}>{number}</p>
        <h3 className="font-medium text-base leading-tight" style={{ color: '#0F172A' }}>{title}</h3>
      </div>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{description}</p>
  </div>
);

const OUTCOMES = [
  'Mindre manuellt och repetitivt arbete',
  'Snabbare framtagning av rätt information',
  'Standardiserade och återanvändbara mallar',
  'Strukturerad och begriplig data',
  'Stabila och förutsägbara flöden',
  'Full spårbarhet från källa till beslut',
];

const Landing = () => {
  const navigate = useNavigate();

  const ctaBtn = (label: string) => (
    <button
      onClick={() => navigate('/auth')}
      className="px-7 py-3 rounded-lg text-base font-medium inline-flex items-center gap-2"
      style={{ backgroundColor: '#2DB7A3', color: '#FFFFFF', transition: 'background-color 0.15s ease' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2DB7A3')}
      onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#0E6B5E')}
      onMouseUp={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
    >
      {label} <span>›</span>
    </button>
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: '#FFFFFF',
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(45,183,163,0.08) 0%, transparent 70%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Navigation */}
      <header
        className="w-full px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
      >
        <Logo size="md" />
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Funktioner', href: '#features' },
            { label: 'Om Parseway', href: '#about' },
            { label: 'Tillit', href: '#trust' },
            { label: 'Kontakt', href: '#contact' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm transition-colors"
              style={{ color: '#475569' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2DB7A3')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm transition-colors"
            style={{ color: '#475569' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#2DB7A3')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            Logga in
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="px-5 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#2DB7A3', color: '#FFFFFF', transition: 'background-color 0.15s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2DB7A3')}
            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#0E6B5E')}
            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
          >
            Kom igång
          </button>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="w-full px-6 lg:px-12 pt-20 pb-24 grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          <div className="flex flex-col gap-7">
            <p
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: '#2DB7A3', letterSpacing: '0.12em' }}
            >
              Dataintegration & AI-automatisering
            </p>
            <h1
              className="font-medium leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', color: '#0F172A', lineHeight: 1.12 }}
            >
              Gör komplex information begriplig — innan den rör sig vidare
            </h1>
            <p
              className="leading-relaxed"
              style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '42ch' }}
            >
              Parseway är lagret mellan dina system och informationskällor. Data tas emot, förstås, struktureras och levereras på ett kontrollerat och tillförlitligt sätt — automatiskt, varje gång.
            </p>
            <div className="flex items-center gap-4 mt-1">
              {ctaBtn('Kom igång')}
              <a
                href="#about"
                className="text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
                style={{ color: '#475569' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#2DB7A3')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                Läs mer <span>↓</span>
              </a>
            </div>
          </div>
          <div className="w-full max-w-lg mx-auto">
            <PipelineMockup />
          </div>
        </section>

        {/* ── Problem / Value proposition ── */}
        <section
          id="about"
          className="w-full px-6 lg:px-12 py-20"
          style={{ backgroundColor: '#F7F9F8' }}
        >
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="flex flex-col gap-5">
              <h2
                className="font-medium leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0F172A', lineHeight: 1.2 }}
              >
                Det manuella informationsarbetet är ett olöst problem
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#475569' }}>
                Varje bransch arbetar dagligen med att hitta rätt information i ett hav av rapporter, årsredovisningar, databaser och interna system. Man vet ungefär var den finns — men att faktiskt lokalisera den, kontrollera den och sammanställa den korrekt tar tid.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#475569' }}>
                Arbetet är repetitivt men kräver ändå manuell handpåläggning varje gång, eftersom informationen ligger utspridd på många ställen och i olika format.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#0F172A' }}>
                Parseway automatiserar detta. Istället för att du manuellt letar, kopierar och sammanställer — samlar Parseway in data, analyserar innehållet, strukturerar det och presenterar det enligt en mall du definierat.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#475569' }}>
                Det som tidigare tog timmar av manuellt arbete blir ett stabilt och repeterbart flöde.
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium tracking-widest uppercase mb-5"
                style={{ color: '#2DB7A3', letterSpacing: '0.12em' }}
              >
                Det innebär för din verksamhet
              </p>
              <ul className="flex flex-col gap-3">
                {OUTCOMES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: 'rgba(45,183,163,0.12)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#2DB7A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-base" style={{ color: '#0F172A' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Four pipeline steps ── */}
        <section
          id="features"
          className="w-full px-6 lg:px-12 py-20 max-w-7xl mx-auto"
        >
          <div className="mb-12 text-center">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-3"
              style={{ color: '#2DB7A3', letterSpacing: '0.12em' }}
            >
              Hur det fungerar
            </p>
            <h2
              className="font-medium"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0F172A' }}
            >
              Fyra steg. Ett sammanhängande flöde.
            </h2>
            <p
              className="mt-4 mx-auto"
              style={{ fontSize: '1rem', color: '#475569', maxWidth: '52ch' }}
            >
              Parseway hanterar hela kedjan — från inkommande rådata till strukturerad, levererad information.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <PipelineStepCard
              number="01"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="6" stroke="#2DB7A3" strokeWidth="1.6" />
                  <path d="M10 7v3l2 2" stroke="#2DB7A3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
              title="Analysera"
              description="Förstå inkommande data och innehåll. Parseway identifierar vad informationen är, var den kommer ifrån och vad den innehåller — oavsett källa eller format."
            />
            <PipelineStepCard
              number="02"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="5" width="14" height="2.5" rx="1.25" fill="#2DB7A3" opacity="0.3" />
                  <rect x="3" y="9" width="10" height="2.5" rx="1.25" fill="#2DB7A3" opacity="0.6" />
                  <rect x="3" y="13" width="7" height="2.5" rx="1.25" fill="#2DB7A3" />
                </svg>
              }
              title="Strukturera"
              description="Ordna och normalisera informationen. Rådata från olika källor samlas i en enhetlig struktur enligt dina definierade regler och fält."
            />
            <PipelineStepCard
              number="03"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h4l2-4 2 8 2-4h2" stroke="#2DB7A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              title="Transformera"
              description="Anpassa format och logik efter behov. Parseway omvandlar strukturerad data till det exakta format och den presentation som ditt system eller din mall kräver."
            />
            <PipelineStepCard
              number="04"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 10h10M12 7l3 3-3 3" stroke="#2DB7A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="5" cy="10" r="2" stroke="#2DB7A3" strokeWidth="1.4" />
                </svg>
              }
              title="Routa"
              description="Leverera rätt information till rätt plats. Det färdiga resultatet skickas automatiskt vidare — till rätt system, mottagare eller rapport — vid rätt tidpunkt."
            />
          </div>
        </section>

        {/* ── Trust / Traceability ── */}
        <section
          id="trust"
          className="w-full px-6 lg:px-12 py-20"
          style={{ backgroundColor: '#F7F9F8' }}
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-7">
            <span
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(45,183,163,0.12)' }}
            >
              <img
                src="/ChatGPT_Image_Feb_15,_2026,_04_41_31_PM.png"
                alt=""
                className="w-6 h-6 object-contain"
              />
            </span>
            <div>
              <p
                className="text-xs font-medium tracking-widest uppercase mb-4"
                style={{ color: '#2DB7A3', letterSpacing: '0.12em' }}
              >
                Tillit och kontroll
              </p>
              <h2
                className="font-medium mb-5"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0F172A', lineHeight: 1.2 }}
              >
                Varje resultat kan härledas till sin källa
              </h2>
              <p
                className="text-base leading-relaxed mx-auto"
                style={{ color: '#475569', maxWidth: '58ch' }}
              >
                All information som passerar genom Parseway är spårbar. Varje datapunkt, sammanställning och AI-genererad insikt kan härledas till sin ursprungliga källa. Du kan alltid se var informationen kommer ifrån, hur den har bearbetats och vilka steg som har påverkat resultatet.
              </p>
            </div>
            <div
              className="w-full max-w-2xl rounded-2xl p-6"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
            >
              <p
                className="text-sm leading-relaxed italic"
                style={{ color: '#475569' }}
              >
                "I en tid där AI används för att sammanställa och generera beslutsunderlag är transparens avgörande. Parseway bygger inte svarta lådor. Resultaten är granskningsbara, dokumenterade och kontrollerbara."
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 w-full max-w-2xl">
              {[
                { label: 'Granskningsbara', desc: 'Varje steg i processen är synligt och dokumenterat.' },
                { label: 'Kontrollerbara', desc: 'Du bestämmer regler, format och flöden — inte Parseway.' },
                { label: 'Verifierbara', desc: 'Källkritik och verifiering blir en naturlig del av arbetsflödet.' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-4 text-left"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
                >
                  <p className="font-medium text-sm mb-1.5" style={{ color: '#0F172A' }}>{item.label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="w-full px-6 lg:px-12 py-20 max-w-7xl mx-auto">
          <div
            className="rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{
              background: 'linear-gradient(135deg, rgba(45,183,163,0.08) 0%, rgba(229,72,63,0.05) 100%)',
              border: '1px solid rgba(45,183,163,0.18)',
            }}
          >
            <div className="flex flex-col gap-3 max-w-xl">
              <h2
                className="font-medium"
                style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: '#0F172A', lineHeight: 1.25 }}
              >
                Parseway är tyst infrastruktur. När det fungerar märks det knappt.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#475569' }}>
                Informationen flödar dit den ska — i rätt form, vid rätt tid, med full spårbarhet.
              </p>
            </div>
            <div className="flex-shrink-0">
              {ctaBtn('Kom igång nu')}
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer
        id="contact"
        className="w-full px-6 lg:px-12 py-10"
        style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#F7F9F8' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-center" style={{ color: '#94A3B8' }}>
            Vägen som gör att all information kan röra sig säkert, strukturerat och med full tillit.
          </p>
          <div className="flex items-center gap-6">
            {['Villkor', 'Integritet', 'Kontakt'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#2DB7A3')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6" style={{ borderTop: '1px solid #E2E8F0' }}>
          <p className="text-xs text-center" style={{ color: '#CBD5E1' }}>
            © {new Date().getFullYear()} parseway. Alla rättigheter förbehållna.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
