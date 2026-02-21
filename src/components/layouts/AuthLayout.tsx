import React from 'react';
import Logo from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#FAFAFA' }}
    >
      <div
        className="hidden lg:flex lg:flex-col lg:justify-between"
        style={{
          width: '52%',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          backgroundImage:
            'radial-gradient(ellipse 100% 80% at 0% 100%, rgba(45,183,163,0.09) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(229,72,63,0.04) 0%, transparent 60%)',
          padding: '48px 56px 48px 64px',
          borderRight: '1px solid #F1F5F9',
        }}
      >
        <div>
          <Logo size="md" />
        </div>

        <div style={{ maxWidth: '400px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#2DB7A3',
              marginBottom: '16px',
            }}
          >
            Parseway
          </p>

          <h1
            style={{
              fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
              fontWeight: 500,
              color: '#0F172A',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              marginBottom: '16px',
            }}
          >
            Allt på rätt plats.
            <br />
            <span style={{ color: '#475569', fontWeight: 400 }}>Utan ansträngning.</span>
          </h1>

          <p
            style={{
              fontSize: '15px',
              color: '#64748B',
              lineHeight: 1.7,
              marginBottom: '40px',
            }}
          >
            Din information, samlad och organiserad.
            <br />
            Så att du alltid har kontroll.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '48px' }}>
            {[
              { text: 'Mindre letande' },
              { text: 'Mer klarhet' },
              { text: 'Full transparens' },
            ].map(({ text }) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(45,183,163,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                    <path d="M1 3.5L3.5 6L9 1" stroke="#2DB7A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: 400 }}>{text}</span>
              </li>
            ))}
          </ul>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: '#CBD5E1',
              }}
            />
            <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
              Du ser alltid var din information kommer från.
            </p>
          </div>
        </div>

        <div style={{ height: '8px' }} />
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          padding: '40px 48px',
          minHeight: '100vh',
          backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(229,72,63,0.035) 0%, transparent 70%)',
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
