import React, { useState } from 'react';
import LogoLightbox from './LogoLightbox';

const logoUrl = '/logo.png';

interface CompanyLogoProps {
  className?: string;
}

export default function CompanyLogo({ className = "" }: CompanyLogoProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  return (
    <>
      <img 
        src={logoUrl} 
        alt="Hass Quality Properties Logo"
        width={48}
        height={48}
        loading="eager"
        className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
        onClick={handleClick}
        title="Click to preview logo"
      />
      <LogoLightbox 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        logoUrl={logoUrl} 
      />
    </>
  );
}
