import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table header skeleton */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex p-4">
          {[...Array(7)].map((_, i) => (
            <div key={`header-${i}`} className="flex-1 px-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Table rows skeleton */}
      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex items-center p-4">
            {/* Avatar and name skeleton */}
            <div className="flex items-center w-48 px-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Email skeleton */}
            <div className="flex-1 px-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Registration # skeleton */}
            <div className="flex-1 px-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Age skeleton */}
            <div className="flex-1 px-2">
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Role skeleton */}
            <div className="flex-1 px-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            
            {/* Date skeleton */}
            <div className="flex-1 px-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Actions skeleton */}
            <div className="w-20 px-2 flex justify-end space-x-2">
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 flex justify-between items-center">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div key={`page-${i}`} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
