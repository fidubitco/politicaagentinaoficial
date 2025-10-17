// Universal Skeleton Loaders for Premium UX
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave';
}

export function Skeleton({ className, variant = 'shimmer', ...props }: SkeletonProps) {
  const variantClasses = {
    default: 'animate-pulse bg-slate-200 dark:bg-slate-800',
    shimmer: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%]',
    pulse: 'animate-pulse bg-slate-200 dark:bg-slate-800',
    wave: 'animate-wave bg-gradient-to-r from-slate-200 via-blue-200 to-slate-200 dark:from-slate-800 dark:via-blue-900 dark:to-slate-800 bg-[length:200%_100%]',
  };

  return (
    <div
      className={cn('rounded-md', variantClasses[variant], className)}
      {...props}
    />
  );
}

// Article Card Skeleton
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
      <div className="space-y-4">
        {/* Image */}
        <Skeleton className="h-48 w-full rounded-lg" variant="shimmer" />

        {/* Category badge */}
        <Skeleton className="h-6 w-24 rounded-full" variant="shimmer" />

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" variant="shimmer" />
          <Skeleton className="h-6 w-3/4" variant="shimmer" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" variant="shimmer" />
          <Skeleton className="h-4 w-5/6" variant="shimmer" />
          <Skeleton className="h-4 w-4/6" variant="shimmer" />
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" variant="shimmer" />
          <Skeleton className="h-4 w-16" variant="shimmer" />
          <Skeleton className="h-4 w-24" variant="shimmer" />
        </div>
      </div>
    </div>
  );
}

// Metric Card Skeleton
export function MetricCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" variant="shimmer" />
        <Skeleton className="h-8 w-32" variant="shimmer" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" variant="shimmer" />
          <Skeleton className="h-4 w-20" variant="shimmer" />
        </div>
      </div>
    </div>
  );
}

// News List Skeleton
export function NewsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
          <Skeleton className="h-24 w-32 flex-shrink-0 rounded-lg" variant="shimmer" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-full" variant="shimmer" />
            <Skeleton className="h-5 w-4/5" variant="shimmer" />
            <Skeleton className="h-4 w-3/5" variant="shimmer" />
            <div className="flex items-center gap-3 mt-2">
              <Skeleton className="h-3 w-16" variant="shimmer" />
              <Skeleton className="h-3 w-20" variant="shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className="min-h-[600px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main headline */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-full max-w-3xl" variant="wave" />
          <Skeleton className="h-12 w-4/5 max-w-2xl" variant="wave" />
        </div>

        {/* Subheadline */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full max-w-2xl" variant="shimmer" />
          <Skeleton className="h-6 w-3/5 max-w-xl" variant="shimmer" />
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 rounded-full" variant="shimmer" />
          <Skeleton className="h-12 w-40 rounded-full" variant="shimmer" />
        </div>

        {/* Featured image/video */}
        <Skeleton className="h-80 w-full rounded-2xl mt-8" variant="shimmer" />
      </div>
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="space-y-4">
        {/* Chart title */}
        <Skeleton className="h-6 w-48" variant="shimmer" />

        {/* Chart area */}
        <div className="h-64 flex items-end gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1"
              style={{ height: `${Math.random() * 100}%` }}
              variant="shimmer"
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" variant="shimmer" />
          <Skeleton className="h-4 w-24" variant="shimmer" />
          <Skeleton className="h-4 w-16" variant="shimmer" />
        </div>
      </div>
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-white/10 bg-white/5">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5 flex-1" variant="shimmer" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4 border-b border-white/10">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 flex-1" variant="shimmer" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" variant="shimmer" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" variant="shimmer" />
        <Skeleton className="h-3 w-24" variant="shimmer" />
      </div>
    </div>
  );
}

// Comment Skeleton
export function CommentSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <ProfileSkeleton />
          <div className="ml-16 space-y-2">
            <Skeleton className="h-4 w-full" variant="shimmer" />
            <Skeleton className="h-4 w-5/6" variant="shimmer" />
            <Skeleton className="h-4 w-4/6" variant="shimmer" />
          </div>
          <div className="ml-16 flex gap-3">
            <Skeleton className="h-6 w-16" variant="shimmer" />
            <Skeleton className="h-6 w-16" variant="shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Live Ticker Skeleton
export function LiveTickerSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm p-4 rounded-lg border border-white/10">
      <div className="flex items-center gap-6 overflow-hidden">
        <Skeleton className="h-6 w-24 flex-shrink-0" variant="wave" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <Skeleton className="h-4 w-16" variant="wave" />
            <Skeleton className="h-6 w-20" variant="wave" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Full Page Loading Skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero */}
        <HeroSkeleton />

        {/* Ticker */}
        <LiveTickerSkeleton />

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      </div>
    </div>
  );
}
