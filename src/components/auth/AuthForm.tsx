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
      const { error, data } = await supabase.auth.signInWithPassword({
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
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${focusedField === field ? '#2DB7A3' : '#E2E8F0'}`,
    outline: 'none',
    fontSize: '14px',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 400,
    transition: 'border-color 0.15s ease',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(45,183,163,0.12)' : 'none',
  });

  return (
    <div className="w-full" style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '32px' }}>
        <p
          className="font-medium tracking-widest uppercase mb-3"
          style={{ fontSize: '11px', color: '#2DB7A3', letterSpacing: '0.12em' }}
        >
          Välkommen tillbaka
        </p>
        <h2
          className="font-medium"
          style={{ fontSize: '28px', color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: '8px' }}
        >
          Logga in på Parseway
        </h2>
        <p style={{ fontSize: '15px', color: '#475569' }}>
          Din information väntar redan.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="email"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#0F172A',
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="password"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#0F172A',
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
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
              fontSize: '15px',
              fontWeight: 500,
              fontFamily: "'Inter', system-ui, sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
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

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#94A3B8' }}>
            Allt på rätt plats. Varje gång.
          </p>
        </div>
      </form>

      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
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
