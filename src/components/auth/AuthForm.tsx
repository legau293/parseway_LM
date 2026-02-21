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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else {
          throw error;
        }
      }

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '11px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${focusedField === field ? '#2DB7A3' : '#E8EEF2'}`,
    outline: 'none',
    fontSize: '14px',
    color: '#0F172A',
    backgroundColor: focusedField === field ? '#FFFFFF' : '#FAFBFC',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 400,
    transition: 'border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(45,183,163,0.10)' : 'none',
  });

  return (
    <div className="w-full" style={{ maxWidth: '380px' }}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(15,23,42,0.04), 0 8px 32px rgba(15,23,42,0.07)',
          border: '1px solid rgba(226,232,240,0.9)',
        }}
      >
        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(229,72,63,0.65)',
          }}
        />

        <div style={{ padding: '36px 36px 32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#2DB7A3',
                marginBottom: '8px',
              }}
            >
              Välkommen tillbaka
            </p>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 500,
                color: '#0F172A',
                lineHeight: 1.2,
                letterSpacing: '-0.015em',
                marginBottom: '5px',
              }}
            >
              Logga in på Parseway
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>
              Din information väntar redan.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label
                htmlFor="email"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#475569',
                  fontFamily: "'Inter', system-ui, sans-serif",
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
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#475569',
                  fontFamily: "'Inter', system-ui, sans-serif",
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: loading ? '#E2E8F0' : '#2DB7A3',
                  color: loading ? '#94A3B8' : '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#1A8F7E';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#2DB7A3';
                }}
                onMouseDown={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#0E6B5E';
                }}
                onMouseUp={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#1A8F7E';
                }}
              >
                {loading ? 'Loggar in...' : 'Logga in'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: '#CBD5E1' }}>
                Allt på rätt plats. Varje gång.
              </p>
            </div>
          </form>
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
          Ny på Parseway?{' '}
          <a
            href="/"
            style={{ color: '#2DB7A3', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s ease' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1A8F7E')}
            onMouseLeave={e => (e.currentTarget.style.color = '#2DB7A3')}
          >
            Det tar bara några sekunder att komma igång.
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
