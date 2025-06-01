import type { BarData } from '@/types';
import { cn } from '@/lib/utils';

interface BarProps {
  barData: BarData;
  maxHeight: number; // Max height of the container for scaling
}

// Horizontal bars, so width represents value, height is fixed.
// For vertical bars, height would represent value, width fixed.
// The prompt says "Each bar’s length (width) corresponds to a value"
// "display n horizontal bars"
// "Each bar should have a small fixed height (e.g., 2-5 pixels)"

export function Bar({ barData, maxHeight }: BarProps) {
  const { value, state, id } = barData;
  
  // Calculate width percentage. Assume value is 1 to N (numElements)
  // The parent container will handle scaling. Here we just set width relative to max value.
  // Let's assume the parent visualization area uses numElements as the max value for scaling.
  // For example, if value is 50 and numElements is 100, width is 50%.
  // The actual scaling will be handled by the CSS width property.

  const barColorClass = {
    default: 'bg-bar-default',
    comparing: 'bg-bar-comparing',
    swapping: 'bg-bar-swapping',
    pivot: 'bg-bar-pivot',
    sorted: 'bg-bar-sorted',
  };

  return (
    <div
      key={id}
      className={cn(
        "h-[4px] md:h-[5px] rounded-sm transition-all duration-100 ease-in-out", // Adjust height and transition
        barColorClass[state]
      )}
      style={{
        width: `${(value / maxHeight) * 100}%`, // Width scales with value relative to max possible value
      }}
      title={`Value: ${value}`}
      aria-valuenow={value}
      aria-valuemin={1}
      aria-valuemax={maxHeight}
    />
  );
}
