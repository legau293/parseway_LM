import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/Logo';

const DashboardMockup = () => (
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
      <div className="mb-4">
        <div className="h-3 w-32 rounded mb-2" style={{ backgroundColor: '#EEF2F1' }} />
        <div className="h-2 w-24 rounded" style={{ backgroundColor: '#F7F9F8' }} />
      </div>
      <div
        className="w-full rounded-xl overflow-hidden mb-4"
        style={{ backgroundColor: '#F7F9F8', height: '140px', position: 'relative' }}
      >
        <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2DB7A3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2DB7A3" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d="M 0 110 C 40 100 60 90 100 70 C 140 50 160 85 200 65 C 240 45 280 30 320 25 C 360 20 380 28 400 20 L 400 140 L 0 140 Z"
            fill="url(#chartGradient)"
          />
          <path
            d="M 0 110 C 40 100 60 90 100 70 C 140 50 160 85 200 65 C 240 45 280 30 320 25 C 360 20 380 28 400 20"
            fill="none"
            stroke="#2DB7A3"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Requests', value: '325,408', sub: '+ 2.1%' },
          { label: 'Uptime', value: '99.99%', sub: '+ 0.3%' },
          { label: 'Latency', value: '235ms', sub: 'avg' },
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

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div
    className="rounded-2xl p-6 flex flex-col gap-3"
    style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ backgroundColor: '#EEF2F1' }}>
        {icon}
      </div>
      <h3 className="font-medium text-base" style={{ color: '#0F172A' }}>{title}</h3>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{description}</p>
    <a
      href="#"
      className="text-sm font-medium inline-flex items-center gap-1 mt-1 transition-colors"
      style={{ color: '#2DB7A3' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#1A8F7E')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#2DB7A3')}
    >
      Learn more <span>→</span>
    </a>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: '#FFFFFF',
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(45,183,163,0.10) 0%, transparent 70%)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Navigation */}
      <header
        className="w-full px-6 lg:px-12 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #F1F5F9' }}
      >
        <Logo size="md" />
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm transition-colors"
              style={{ color: '#0F172A' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2DB7A3')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm transition-colors"
            style={{ color: '#0F172A' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#2DB7A3')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#2DB7A3', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2DB7A3')}
            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#0E6B5E')}
            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="w-full px-6 lg:px-12 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <h1
              className="font-medium leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', color: '#0F172A', lineHeight: 1.15 }}
            >
              Securely integrate your infrastructure
            </h1>
            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#475569', maxWidth: '38ch' }}
            >
              parseway provides a robust, secure platform to seamlessly connect and protect your systems.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => navigate('/auth')}
                className="px-7 py-3 rounded-lg text-base font-medium transition-colors inline-flex items-center gap-2"
                style={{ backgroundColor: '#2DB7A3', color: '#FFFFFF' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2DB7A3')}
                onMouseDown={(e) => (e.currentTarget.style.backgroundColor = '#0E6B5E')}
                onMouseUp={(e) => (e.currentTarget.style.backgroundColor = '#1A8F7E')}
              >
                Get Started <span>›</span>
              </button>
            </div>
          </div>
          <div className="w-full max-w-lg mx-auto">
            <DashboardMockup />
          </div>
        </section>

        {/* Feature cards */}
        <section className="w-full px-6 lg:px-12 pb-20 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCard
              icon={
                <img
                  src="/ChatGPT_Image_Feb_15,_2026,_04_41_31_PM.png"
                  alt=""
                  className="w-5 h-5 object-contain"
                />
              }
              title="Advanced Security"
              description="Protect your data with top-tier encryption and real-time threat detection."
            />
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="5" cy="5" r="2.5" fill="#2DB7A3" />
                  <circle cx="15" cy="5" r="2.5" fill="#2DB7A3" opacity="0.5" />
                  <circle cx="5" cy="15" r="2.5" fill="#2DB7A3" opacity="0.5" />
                  <circle cx="15" cy="15" r="2.5" fill="#2DB7A3" />
                  <line x1="7.5" y1="5" x2="12.5" y2="5" stroke="#2DB7A3" strokeWidth="1.5" />
                  <line x1="7.5" y1="15" x2="12.5" y2="15" stroke="#2DB7A3" strokeWidth="1.5" />
                  <line x1="5" y1="7.5" x2="5" y2="12.5" stroke="#2DB7A3" strokeWidth="1.5" />
                  <line x1="15" y1="7.5" x2="15" y2="12.5" stroke="#2DB7A3" strokeWidth="1.5" />
                </svg>
              }
              title="Seamless Integration"
              description="Easily connect to your existing infrastructure with comprehensive API support."
            />
            <FeatureCard
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <polyline
                    points="2,14 7,9 11,12 18,5"
                    fill="none"
                    stroke="#E5483F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14,5 18,5 18,9"
                    fill="none"
                    stroke="#E5483F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              title="Real-Time Monitoring"
              description="Monitor your infrastructure's performance and security in real-time with detailed analytics."
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
