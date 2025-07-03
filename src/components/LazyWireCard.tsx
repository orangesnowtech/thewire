import React, { useState, useRef, useEffect } from 'react';
import { Wire } from '@/types';
import WireCard from './WireCard';

interface LazyWireCardProps {
  wire: Wire;
  rootMargin?: string;
}

export default function LazyWireCard({ wire, rootMargin = '100px' }: LazyWireCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Once loaded, we can disconnect the observer for this card
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, hasLoaded]);

  return (
    <div ref={cardRef} className="w-full">
      {isVisible || hasLoaded ? (
        <WireCard wire={wire} />
      ) : (
        // Skeleton placeholder
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
          <div className="p-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-3 mb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            {/* Budget section skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          
          {/* Action bar skeleton */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="flex space-x-3">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
