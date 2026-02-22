import React from 'react';

interface CopyChipProps {
  text: string;
  label?: string;
  onCopied?: () => void;
  variant?: 'subtle';
}

const CopyChip = ({ text, label, onCopied }: CopyChipProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      onCopied?.();
    });
  };

  return (
    <button
      onClick={handleClick}
      title={`Kopiera ${label ?? text}`}
      className="inline-flex items-center gap-1 rounded text-xs transition-colors"
      style={{
        padding: '2px 8px',
        border: '1px solid var(--pw-border)',
        backgroundColor: copied ? 'var(--pw-bg-tertiary)' : 'transparent',
        color: copied ? 'var(--pw-text-secondary)' : 'var(--pw-text-tertiary)',
        cursor: 'pointer',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '0.01em',
        lineHeight: '1.5',
      }}
      onMouseEnter={(e) => {
        if (!copied) e.currentTarget.style.backgroundColor = 'var(--pw-bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        if (!copied) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {copied ? 'Kopierat' : text}
    </button>
  );
};

export default CopyChip;
