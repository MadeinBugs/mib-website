'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { getImagePath } from '../lib/imagePaths';

interface NavButtonProps {
  href: string;
  imageSrc: string;
  hoverImageSrc: string;
  labelTextKey: string;
  className?: string;
}

export default function NavButton({
  href,
  imageSrc,
  hoverImageSrc,
  labelTextKey,
  className = ''
}: NavButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    // Extract current locale from pathname
    const locale = pathname.split('/')[1];
    const fullHref = `/${locale}${href}`;
    router.push(fullHref);
  };

  return (
    <button
      className={`nav-button-container ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      title={labelTextKey}
      style={{
        position: 'relative',
        display: 'block',
        width: '150px', // Increased from 120px
        height: '150px', // Increased from 120px
        zIndex: 30,
        pointerEvents: 'auto',
        cursor: 'pointer'
      }}
    >
      <Image
        src={getImagePath(isHovered ? hoverImageSrc : imageSrc)}
        alt={labelTextKey}
        width={150}
        height={150}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none'
        }}
      />
    </button>
  );
}
