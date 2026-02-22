import React from 'react';

interface ProgressPillProps {
  pct: number;
  showPct?: boolean;
  barWidth?: number;
}

const ProgressPill = ({ pct, showPct = true, barWidth = 84 }: ProgressPillProps) => (
  <div className="flex items-center gap-1.5 shrink-0">
    <div
      className="rounded-full overflow-hidden shrink-0"
      style={{ width: barWidth, height: '5px', backgroundColor: 'var(--pw-bg-tertiary)' }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: pct === 100 ? '#2DB7A3' : 'linear-gradient(90deg, #E5483F 0%, #2DB7A3 100%)',
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
