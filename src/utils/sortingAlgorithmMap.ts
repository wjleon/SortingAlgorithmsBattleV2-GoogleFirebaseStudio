import type { SortAlgorithmType, AlgorithmGenerator } from '@/types';
import { bubbleSort } from './sortingAlgorithms/bubbleSort';
import { quickSort } from './sortingAlgorithms/quickSort';
import { selectionSort } from './sortingAlgorithms/selectionSort';
import { insertionSort } from './sortingAlgorithms/insertionSort';
import { mergeSort } from './sortingAlgorithms/mergeSort';
import { heapSort } from './sortingAlgorithms/heapSort';
// Import other implemented algorithms here

// Placeholder for algorithms not yet implemented
async function* placeholderSort(
  initialNumericArray: number[],
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AsyncGenerator<any, any, any> {
    yield { array: initialNumericArray.map(v => ({ value: v, id: String(v), state: 'default' })) };
    return initialNumericArray.map(v => ({ value: v, id: String(v), state: 'sorted' }));
}


export const algorithmMap: Record<SortAlgorithmType, AlgorithmGenerator> = {
  "Bubble Sort": bubbleSort,
  "Selection Sort": selectionSort,
  "Insertion Sort": insertionSort,
  "Merge Sort": mergeSort,
  "Quick Sort": quickSort,
  "Heap Sort": heapSort,
  "Counting Sort": placeholderSort, // Placeholder
  "Radix Sort": placeholderSort,    // Placeholder
  "Bucket Sort": placeholderSort,   // Placeholder
  "Shell Sort": placeholderSort,    // Placeholder
  "Tim Sort": placeholderSort,      // Placeholder
  "Comb Sort": placeholderSort,     // Placeholder
  "Pigeonhole Sort": placeholderSort, // Placeholder
  "Cycle Sort": placeholderSort,    // Placeholder
  "Strand Sort": placeholderSort,   // Placeholder
  "Bitonic Sort": placeholderSort,  // Placeholder
  "Pancake Sort": placeholderSort,  // Placeholder
  "Bogo Sort": placeholderSort,     // Placeholder
  "Gnome Sort": placeholderSort,    // Placeholder
  "Stooge Sort": placeholderSort,   // Placeholder
  "Odd-Even Sort": placeholderSort, // Placeholder
};

export const getAlgorithmFunction = (name: SortAlgorithmType): AlgorithmGenerator => {
  return algorithmMap[name] || placeholderSort;
};
