'use client'

import { LogoSettings } from './types'

interface LogoProps {
  settings: LogoSettings;
}

export function Logo({ settings }: LogoProps) {
  if (!settings.enabled || !settings.url) {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div 
      className={`absolute ${positionClasses[settings.position]} z-10`}
      style={{
        width: `${settings.size}px`,
        height: `${settings.size}px`,
        opacity: settings.opacity
      }}
    >
      <img 
        src={settings.url} 
        alt="Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
