import { Outlet } from 'react-router-dom';

export function ParsewayLayout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--pw-bg-secondary)', fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <header
        className="h-14 flex items-center justify-between px-6 border-b"
        style={{ backgroundColor: 'var(--pw-bg-primary)', borderBottomColor: 'var(--pw-border)' }}
      >
        <span
          className="font-semibold text-base"
          style={{ color: 'var(--pw-text-primary)' }}
        >
          Parseway
        </span>
        <div
          className="rounded-full w-8 h-8"
          style={{ backgroundColor: 'var(--pw-bg-tertiary)' }}
        />
      </header>
      <main
        className="flex-1"
        style={{ backgroundColor: 'var(--pw-bg-secondary)', color: 'var(--pw-text-primary)' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
