import React from 'react';
import Logo from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#F8F9FA' }}
    >
      <div
        className="hidden lg:flex lg:flex-col lg:justify-between"
        style={{
          width: '50%',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          padding: '48px 52px 48px 64px',
          position: 'relative',
        }}
      >
        <div>
          <Logo size="md" />
        </div>

        <div style={{ maxWidth: '380px' }}>
          <div
            style={{
              width: '28px',
              height: '2px',
              backgroundColor: 'rgba(229,72,63,0.70)',
              marginBottom: '20px',
            }}
          />

          <h1
            style={{
              fontSize: 'clamp(1.85rem, 2.8vw, 2.5rem)',
              fontWeight: 500,
              color: '#0F172A',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              marginBottom: '14px',
            }}
          >
            Allt på rätt plats.
            <br />
            <span style={{ color: '#94A3B8', fontWeight: 400 }}>Utan ansträngning.</span>
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#94A3B8',
              lineHeight: 1.65,
              marginBottom: '32px',
            }}
          >
            Din information, samlad och organiserad.
            <br />
            Så att du alltid har kontroll.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
            {['Mindre letande', 'Mer klarhet', 'Full transparens'].map((text) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(45,183,163,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="#2DB7A3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 400 }}>{text}</span>
              </li>
            ))}
          </ul>

          <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.5 }}>
            Du ser alltid var din information kommer från.
          </p>
        </div>

        <div style={{ height: '8px' }} />

        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '1px',
            height: '100%',
            backgroundColor: 'rgba(229,72,63,0.65)',
          }}
        />
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          padding: '40px 40px',
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
        }}
      >
        <div className="lg:hidden mb-8">
          <Logo size="md" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
