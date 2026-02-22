import React from 'react';

interface ProgressPillProps {
  pct: number;
  showPct?: boolean;
  barWidth?: number;
}

export function getProgressFill(pct: number): string {
  if (pct === 100) return '#2DB7A3';
  if (pct < 20) return '#E5483F';
  const x = Math.min(90, Math.max(15, 90 - pct));
  return `linear-gradient(to right, #E5483F 0%, #E5483F ${x}%, #2DB7A3 100%)`;
}

const ProgressPill = ({ pct, showPct = true, barWidth = 84 }: ProgressPillProps) => (
  <div className="flex items-center gap-1.5 shrink-0">
    <div
      className="rounded-full overflow-hidden shrink-0"
      style={{
        width: barWidth,
        height: '5px',
        backgroundColor: 'var(--pw-bg-tertiary)',
        border: '1px solid var(--pw-border)',
        boxSizing: 'content-box',
      }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: getProgressFill(pct),
          transition: 'width 0.3s ease',
        }}
      />
    </div>
    {showPct && pct < 100 && (
      <span
        className="text-xs tabular-nums"
        style={{ color: 'var(--pw-text-tertiary)', minWidth: '28px', textAlign: 'right' }}
      >
        {pct}%
      </span>
    )}
  </div>
);

export default ProgressPill;
