import React from 'react';
import Logo from '@/components/ui/Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div
        className="hidden lg:flex lg:flex-col lg:justify-between"
        style={{
          width: '55%',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          backgroundImage:
            'radial-gradient(ellipse 90% 70% at 0% 100%, rgba(45,183,163,0.10) 0%, transparent 65%)',
          padding: '48px 64px',
        }}
      >
        <div>
          <Logo size="md" />
        </div>

        <div style={{ maxWidth: '480px' }}>
          <h1
            className="font-medium"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              color: '#0F172A',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}
          >
            Struktur är bara ett steg bort.
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.65,
              marginBottom: '32px',
            }}
          >
            Parseway samlar och organiserar din information.
            <br />
            Så att du alltid har kontroll.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            {['Mindre letande', 'Mer klarhet', 'Full transparens'].map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(45,183,163,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="#2DB7A3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: '15px', color: '#334155', fontWeight: 400 }}>{item}</span>
              </li>
            ))}
          </ul>

          <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
            Du ser alltid var din information kommer från.
          </p>
        </div>

        <div style={{ height: '48px' }} />
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '40px 32px',
          minHeight: '100vh',
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
