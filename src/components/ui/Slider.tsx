'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number[];
  onValueChange: (val: number[]) => void;
  className?: string;
  'aria-label'?: string;
  disabled?: boolean;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className,
  'aria-label': ariaLabel,
  disabled = false,
}: SliderProps) {
  const currentVal = value[0] ?? min;
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const percentage = Math.min(100, Math.max(0, ((currentVal - min) / (max - min)) * 100));

  const updateFromPosition = React.useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const thumbRadius = 10;
      const availableWidth = Math.max(1, rect.width - thumbRadius * 2);
      const relativeX = clientX - (rect.left + thumbRadius);
      const rawFrac = Math.max(0, Math.min(1, relativeX / availableWidth));
      const rawVal = min + rawFrac * (max - min);
      const steppedVal = Math.round((rawVal - min) / step) * step + min;
      const clampedVal = Math.min(max, Math.max(min, Number(steppedVal.toFixed(4))));
      onValueChange([clampedVal]);
    },
    [min, max, step, disabled, onValueChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateFromPosition(e.clientX);

    const handleMouseMove = (ev: MouseEvent) => {
      updateFromPosition(ev.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateFromPosition(e.touches[0].clientX);

    const handleTouchMove = (ev: TouchEvent) => {
      if (ev.touches[0]) {
        updateFromPosition(ev.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onValueChange([Math.min(max, currentVal + step)]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onValueChange([Math.max(min, currentVal - step)]);
    }
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={currentVal}
      tabIndex={disabled ? -1 : 0}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative flex w-full cursor-pointer touch-none select-none items-center py-2.5 focus-visible:outline-none',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {/* Background track */}
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#e6e6e1]/80 transition-colors">
        {/* Strava Orange filled gradient track */}
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-[#fc5200] to-[#ff7a38] transition-all duration-75 shadow-[0_0_8px_rgba(252,82,0,0.35)]"
          style={{ left: 0, width: `${percentage}%` }}
        />
      </div>

      {/* Thumb handle container: rigidly centered vertically on the track, never overridden by motion */}
      <div
        className="pointer-events-none absolute top-1/2"
        style={{
          left: `calc(10px + (100% - 20px) * ${percentage / 100})`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.span
          animate={{ scale: isDragging ? 1.25 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'block size-5 rounded-full border-2 border-[#fc5200] bg-white shadow-md transition-shadow duration-200 group-hover:scale-110 group-hover:shadow-[0_2px_12px_rgba(252,82,0,0.4)]',
            isDragging && 'border-[#fc5200] ring-4 ring-[#ffd8c7] shadow-[0_2px_14px_rgba(252,82,0,0.5)]'
          )}
        />
      </div>
    </div>
  );
}
