import React from 'react';
import Logo from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F7F8FA',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '1160px',
          width: '100%',
          margin: '0 auto',
          padding: '0 40px',
        }}
      >
        <div style={{ paddingTop: '36px', paddingBottom: '0' }}>
          <Logo size="md" />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '48px 40px 64px',
        }}
      >
        <div
          style={{
            maxWidth: '1160px',
            width: '100%',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '72px',
            alignItems: 'center',
          }}
        >
          <LeftPanel />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const LeftPanel = () => (
  <div style={{ maxWidth: '420px' }}>
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          width: '32px',
          height: '2px',
          backgroundColor: 'rgba(220,56,48,0.65)',
          marginBottom: '22px',
          borderRadius: '1px',
        }}
      />
      <h1
        style={{
          fontSize: '2.6rem',
          fontWeight: 600,
          color: '#0D1117',
          lineHeight: 1.06,
          letterSpacing: '-0.03em',
          marginBottom: '12px',
        }}
      >
        Allt på rätt plats.
        <br />
        <span
          style={{
            color: '#9BA5B5',
            fontWeight: 400,
          }}
        >
          Utan ansträngning.
        </span>
      </h1>
      <p
        style={{
          fontSize: '14px',
          color: '#8A93A4',
          lineHeight: 1.7,
          fontWeight: 400,
        }}
      >
        Din information, samlad och organiserad.
        <br />
        Så att du alltid har kontroll.
      </p>
    </div>

    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        margin: '0 0 32px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '9px',
      }}
    >
      {['Mindre letande', 'Mer klarhet', 'Full transparens'].map((text) => (
        <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'rgba(45,183,163,0.10)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path d="M1 3L3 5L7 1" stroke="#2DB7A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span style={{ fontSize: '13px', color: '#9BA5B5', fontWeight: 400 }}>{text}</span>
        </li>
      ))}
    </ul>

    <p style={{ fontSize: '12px', color: '#C4CBD8', lineHeight: 1.5 }}>
      Du ser alltid var din information kommer från.
    </p>
  </div>
);

export default AuthLayout;
