'use client'

import { ReactNode } from 'react'
import { FrameSettings } from './types'

interface FrameProps {
  settings: FrameSettings;
  children: ReactNode;
}

export function Frame({ settings, children }: FrameProps) {
  if (!settings.enabled) {
    return <>{children}</>;
  }

  const frameStyles = {
    border: 'border',
    rounded: 'rounded-lg',
    shadow: 'shadow-lg'
  };

  const styleClass = frameStyles[settings.style] || frameStyles.border;
  
  return (
    <div 
      className={`frame-container ${styleClass}`}
      style={{
        borderColor: settings.color,
        borderWidth: `${settings.width}px`,
        padding: `${settings.width}px`
      }}
    >
      {children}
    </div>
  );
}
