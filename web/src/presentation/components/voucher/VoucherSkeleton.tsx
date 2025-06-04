import React from 'react';

interface VoucherSkeletonProps {
  count?: number;
  className?: string;
}

export const VoucherSkeleton: React.FC<VoucherSkeletonProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-white rounded-2xl border border-neutral-200 overflow-hidden animate-pulse ${className}`}
        >
          {/* Image Skeleton */}
          <div className="w-full h-32 bg-neutral-200" />

          {/* Content Skeleton */}
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 mr-2">
                <div className="h-5 bg-neutral-200 rounded w-3/4 mb-1" />
              </div>
              <div className="h-6 bg-neutral-200 rounded-full w-16" />
            </div>

            {/* Description */}
            <div className="mb-3">
              <div className="h-4 bg-neutral-200 rounded w-full mb-1" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="h-5 bg-neutral-200 rounded w-16" />
              <div className="h-4 bg-neutral-200 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};