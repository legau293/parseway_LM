import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = 'md', showText = true, className = '' }: LogoProps) => {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/ChatGPT_Image_Feb_15,_2026,_04_41_31_PM.png"
        alt="parseway"
        className={`${iconSizes[size]} object-contain`}
        style={{ background: 'transparent' }}
      />
      {showText && (
        <span
          className={`${textSizes[size]} font-medium tracking-tight select-none`}
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 500,
            fontStyle: 'normal',
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{ color: '#2DB7A3' }}>parse</span>
          <span style={{ color: '#E5483F' }}>way</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
