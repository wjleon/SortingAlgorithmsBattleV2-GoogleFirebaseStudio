
export const SORTING_ALGORITHMS = [
  "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort",
  "Heap Sort", // "Counting Sort", "Radix Sort", "Bucket Sort", "Shell Sort",
  // "Tim Sort", "Comb Sort", "Pigeonhole Sort", "Cycle Sort", "Strand Sort",
  // "Bitonic Sort", "Pancake Sort", "Bogo Sort", "Gnome Sort", "Stooge Sort",
  // "Odd-Even Sort", 
  // For brevity in initial implementation, only a subset is actively used.
  // The full list is kept for UI population but mapping to functions will be limited initially.
] as const;

export type SortAlgorithmType = typeof SORTING_ALGORITHMS[number];

export const DISTRIBUTIONS = [
  "Random",
  "Sorted Ascending",
  "Sorted Descending",
  "Split Ascending", // First half ascending, second half ascending
  "Split Descending", // First half descending, second half descending
] as const;

export type DistributionType = typeof DISTRIBUTIONS[number];

export type BarState = 'default' | 'comparing' | 'swapping' | 'pivot' | 'sorted';

export type BarData = {
  value: number;
  id: string; 
  state: BarState;
};

export type SortStep = {
  array: BarData[];
  comparisonsMadeThisStep?: number; 
  // Optional specific indices for highlighting, if not fully managed by BarData.state in more complex scenarios
  // These can be derived from state changes in BarData as well.
};

// An AlgorithmGenerator takes an array of numbers, animation speed, and a sound playing callback.
// It yields SortStep objects representing the state of the array at each step of the algorithm.
// It returns the final sorted BarData array.
export type AlgorithmGenerator = (
  initialNumericArray: number[],
  animationSpeedValue: number, // Typically 0-100, to be mapped to delay ms
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
) => AsyncGenerator<SortStep, BarData[], string | undefined>; // Returns final array or error message
