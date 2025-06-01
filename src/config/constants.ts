import type { SortAlgorithmType, DistributionType } from '@/types';
import { SORTING_ALGORITHMS as ALGORITHMS_ARRAY, DISTRIBUTIONS as DISTRIBUTIONS_ARRAY } from '@/types';

export const ALL_SORTING_ALGORITHMS: SortAlgorithmType[] = [...ALGORITHMS_ARRAY];
export const ALL_DISTRIBUTIONS: DistributionType[] = [...DISTRIBUTIONS_ARRAY];

export const DEFAULT_ALGORITHM_1: SortAlgorithmType = "Bubble Sort";
export const DEFAULT_ALGORITHM_2: SortAlgorithmType = "Quick Sort";
export const DEFAULT_NUM_ELEMENTS: number = 30;
export const MIN_ELEMENTS: number = 10;
export const MAX_ELEMENTS: number = 200; // Increased from 100 to 200 as per spec
export const DEFAULT_DISTRIBUTION: DistributionType = "Random";
export const DEFAULT_SOUND_ENABLED: boolean = true;
export const DEFAULT_ANIMATION_SPEED: number = 50; // Mid-range, 0-100 scale

// Delay calculation: higher speed value means shorter delay
// Max delay 200ms (speed 0), min delay 5ms (speed 100)
export const calculateDelay = (speedValue: number): number => {
  const minDelay = 5;
  const maxDelay = 500; // Reduced max delay for better responsiveness
  // Inverse relationship: higher speed value = lower delay
  return maxDelay - (speedValue / 100) * (maxDelay - minDelay);
};
