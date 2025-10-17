export function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url) return '';
  
  if (url.includes('unsplash.com')) {
    const urlObj = new URL(url);
    if (width) {
      urlObj.searchParams.set('w', width.toString());
    }
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('q', '80');
    return urlObj.toString();
  }
  
  return url;
}

export function getResponsiveImageSrcSet(url: string): string {
  if (!url) return '';
  
  if (url.includes('unsplash.com')) {
    return `
      ${getOptimizedImageUrl(url, 640)} 640w,
      ${getOptimizedImageUrl(url, 750)} 750w,
      ${getOptimizedImageUrl(url, 828)} 828w,
      ${getOptimizedImageUrl(url, 1080)} 1080w,
      ${getOptimizedImageUrl(url, 1200)} 1200w,
      ${getOptimizedImageUrl(url, 1920)} 1920w
    `.trim();
  }
  
  return url;
}

export function getImagePlaceholder(aspectRatio: 'square' | 'video' | 'wide' = 'video'): string {
  const placeholders = {
    square: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
    video: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"%3E%3C/svg%3E',
    wide: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 9"%3E%3C/svg%3E',
  };
  return placeholders[aspectRatio];
}
