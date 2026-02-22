import React from 'react';

interface WorkspaceToastProps {
  message: string;
  isVisible: boolean;
}

const WorkspaceToast = ({ message, isVisible }: WorkspaceToastProps) => (
  <div
    style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 9999,
      padding: '8px 14px',
      borderRadius: '6px',
      border: '1px solid var(--pw-border)',
      backgroundColor: 'var(--pw-bg-secondary)',
      color: 'var(--pw-text-secondary)',
      fontSize: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      pointerEvents: 'none',
      transition: 'opacity 0.15s, transform 0.15s',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-6px)',
    }}
  >
    {message}
  </div>
);

export default WorkspaceToast;
