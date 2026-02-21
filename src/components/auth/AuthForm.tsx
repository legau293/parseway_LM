import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Fel e-post eller lösenord. Kontrollera dina uppgifter och försök igen.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Kontrollera din e-post och klicka på bekräftelselänken innan du loggar in.');
        } else {
          throw error;
        }
      }

      toast({ title: 'Välkommen tillbaka!', description: 'Du är nu inloggad.' });
    } catch (error: any) {
      toast({ title: 'Inloggning misslyckades', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    height: '46px',
    padding: '0 14px',
    borderRadius: '10px',
    border: `1px solid ${focusedField === field ? '#2DB7A3' : '#E4E7EC'}`,
    outline: 'none',
    fontSize: '14px',
    color: '#0D1117',
    backgroundColor: '#FFFFFF',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontWeight: 400,
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxShadow: focusedField === field
      ? '0 0 0 3px rgba(45,183,163,0.12)'
      : '0 1px 2px rgba(13,17,23,0.04)',
    boxSizing: 'border-box' as const,
  });

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #EAECEF',
          boxShadow: '0 1px 3px rgba(13,17,23,0.04), 0 4px 24px rgba(13,17,23,0.06)',
          padding: '32px',
        }}
      >
        <div style={{ marginBottom: '26px' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: '#2DB7A3',
              marginBottom: '7px',
            }}
          >
            Välkommen tillbaka
          </p>
          <h2
            style={{
              fontSize: '21px',
              fontWeight: 600,
              color: '#0D1117',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '5px',
            }}
          >
            Logga in på Parseway
          </h2>
          <p style={{ fontSize: '13px', color: '#8A93A4', fontWeight: 400 }}>
            Din information väntar redan.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              htmlFor="email"
              style={{
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#4B5563',
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: '0.005em',
              }}
            >
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="du@exempel.com"
              style={inputStyle('email')}
              autoComplete="email"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              htmlFor="password"
              style={{
                fontSize: '12.5px',
                fontWeight: 500,
                color: '#4B5563',
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: '0.005em',
              }}
            >
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="••••••••"
              minLength={6}
              style={inputStyle('password')}
              autoComplete="current-password"
            />
          </div>

          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: loading ? '#E4E7EC' : '#2DB7A3',
                color: loading ? '#9BA5B5' : '#FFFFFF',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: "'Inter', system-ui, sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
                letterSpacing: '-0.01em',
                boxShadow: loading ? 'none' : '0 1px 3px rgba(45,183,163,0.25)',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1E9E8C';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(45,183,163,0.30)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#2DB7A3';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(45,183,163,0.25)';
                }
              }}
              onMouseDown={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#178070';
              }}
              onMouseUp={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#1E9E8C';
              }}
            >
              {loading ? 'Loggar in...' : 'Logga in'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '11.5px', color: '#C4CBD8', letterSpacing: '0.005em' }}>
              Allt på rätt plats. Varje gång.
            </p>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '18px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#8A93A4', lineHeight: 1.6 }}>
          Ny på Parseway?{' '}
          <a
            href="/"
            style={{
              color: '#2DB7A3',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E9E8C')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#2DB7A3')}
          >
            Det tar bara några sekunder att komma igång.
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
