'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
      <Image
        src={logoUrl}
        alt="Hass Properties Logo"
        width={128}
        height={128}
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
