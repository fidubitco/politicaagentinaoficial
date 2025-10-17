import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  photographer?: string;
  photographerUrl?: string;
  enableZoom?: boolean;
  'data-testid'?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'aspect-video',
  photographer,
  photographerUrl,
  enableZoom = true,
  'data-testid': testId 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate thumbnail URL (Pexels optimization)
  const getThumbnailUrl = (url: string): string => {
    if (url.includes('pexels.com')) {
      // Convert to tiny/small version for LQIP
      return url.replace(/w=\d+/, 'w=50').replace(/h=\d+/, 'h=50');
    }
    return url;
  };

  const thumbnailUrl = getThumbnailUrl(src);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={imgRef} 
      className={`${aspectRatio} overflow-hidden relative group ${className}`}
    >
      {/* LQIP (Low Quality Image Placeholder) - Blur-up effect */}
      {isInView && !isLoaded && (
        <img
          src={thumbnailUrl}
          alt={alt}
          className="w-full h-full object-cover absolute inset-0 blur-lg scale-110 transition-opacity duration-300"
          onLoad={() => setThumbnailLoaded(true)}
          aria-hidden="true"
        />
      )}

      {/* Skeleton loader mientras carga thumbnail */}
      {!thumbnailLoaded && (
        <div className="w-full h-full bg-muted/50 animate-pulse absolute inset-0"></div>
      )}

      {/* Full resolution image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${enableZoom ? 'group-hover:scale-105' : ''}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          data-testid={testId}
        />
      )}

      {/* Overlay gradient on hover for better text readability */}
      {enableZoom && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Photo credit (Pexels attribution) */}
      {photographer && photographerUrl && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-white/80 hover:text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded-sm"
            data-testid="text-photographer"
          >
            📷 {photographer}
          </a>
        </div>
      )}
    </div>
  );
}
