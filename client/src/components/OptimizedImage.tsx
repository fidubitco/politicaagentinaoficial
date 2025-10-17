import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  priority?: boolean;
  quality?: number;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  blurDataURL?: string;
}

/**
 * OptimizedImage - Next-gen image component with WebP/AVIF support, lazy loading, and blur-up effect
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  priority = false,
  quality = 80,
  fallback,
  className,
  onLoad,
  onError,
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(blurDataURL || generatePlaceholder(aspectRatio));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate srcset for responsive images
  const generateSrcSet = (url: string): string => {
    if (url.includes('unsplash.com')) {
      const sizes = [640, 750, 828, 1080, 1200, 1920];
      return sizes
        .map((size) => {
          const optimizedUrl = getOptimizedUrl(url, size, quality);
          return `${optimizedUrl} ${size}w`;
        })
        .join(', ');
    }
    return '';
  };

  // Get optimized URL with WebP/AVIF support
  const getOptimizedUrl = (url: string, w?: number, q?: number): string => {
    if (url.includes('unsplash.com')) {
      const urlObj = new URL(url);
      if (w) urlObj.searchParams.set('w', w.toString());
      if (q) urlObj.searchParams.set('q', q.toString());
      urlObj.searchParams.set('auto', 'format'); // Enables WebP/AVIF
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    }
    return url;
  };

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (priority || !imgRef.current) {
      // Load immediately if priority
      loadImage();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, priority]);

  const loadImage = () => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(getOptimizedUrl(src, width, quality));
      setImageLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      setImageError(true);
      if (fallback) {
        setImageSrc(fallback);
      }
      onError?.();
    };

    img.src = getOptimizedUrl(src, width, quality);
  };

  const handleError = () => {
    if (fallback && !imageError) {
      setImageSrc(fallback);
      setImageError(true);
    }
  };

  return (
    <picture ref={imgRef as any}>
      {/* WebP source for modern browsers */}
      {!imageError && src.includes('unsplash.com') && (
        <source
          type="image/webp"
          srcSet={generateSrcSet(src)}
          sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
        />
      )}

      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onError={handleError}
        className={cn(
          'transition-all duration-500',
          imageLoaded ? 'blur-0 scale-100' : 'blur-lg scale-105',
          className
        )}
        style={{
          aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
        }}
        {...props}
      />
    </picture>
  );
}

// Generate placeholder data URL
function generatePlaceholder(aspectRatio?: string): string {
  const ratio = aspectRatio || '16/9';
  const [w, h] = ratio.split('/').map(Number);

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'%3E%3Crect width='${w}' height='${h}' fill='%23334155'/%3E%3C/svg%3E`;
}

// Preload critical images
export function preloadImage(src: string, priority: 'high' | 'low' = 'low') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.fetchPriority = priority;

  // Add WebP source if available
  if (src.includes('unsplash.com')) {
    link.type = 'image/webp';
  }

  document.head.appendChild(link);
}

// BlurHash placeholder generator (simplified version)
export function getBlurDataURL(width: number = 8, height: number = 6): string {
  // Generate a simple gradient blur placeholder
  const colors = ['0f172a', '1e3a8a', '3b82f6'];
  const gradientStops = colors.map((color, i) => `%23${color} ${(i / (colors.length - 1)) * 100}%25`).join(', ');

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='${gradientStops}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='${width}' height='${height}' fill='url(%23g)'/%3E%3C/svg%3E`;
}
