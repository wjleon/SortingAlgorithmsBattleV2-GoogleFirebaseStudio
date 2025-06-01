import type { DistributionType } from '@/types';
import { MIN_ELEMENTS } from '@/config/constants';

// Generates an array of numbers from 1 to n (inclusive)
const generateSequentialArray = (n: number): number[] => {
  return Array.from({ length: n }, (_, i) => i + 1);
};

// Shuffles an array in place using Fisher-Yates algorithm
const shuffleArray = (array: number[]): number[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateNumericArray = (count: number, distribution: DistributionType): number[] => {
  if (count < MIN_ELEMENTS) count = MIN_ELEMENTS;
  let baseArray = generateSequentialArray(count);

  switch (distribution) {
    case "Random":
      return shuffleArray(baseArray);
    case "Sorted Ascending":
      return baseArray;
    case "Sorted Descending":
      return baseArray.reverse();
    case "Split Ascending": {
      // Split in two halves, each in ascending order
      // Example: [1,2,3,4,5, 6,7,8,9,10] -> if numElements = 10, mid = 5
      // first half [1,2,3,4,5], second half [6,7,8,9,10]
      // if shuffled first, then split and sort:
      // [3,1,5,2,4, 9,6,8,7,10] -> [1,2,3,4,5, 6,7,8,9,10]
      // This interpretation means the values themselves are split
      const mid = Math.floor(count / 2);
      const firstHalfValues = Array.from({length: mid}, (_, i) => i + 1);
      const secondHalfValues = Array.from({length: count - mid}, (_, i) => mid + i + 1);
      // For "Split Ascending", the problem states "each in ascending order". This is naturally the case.
      // If the intention was a partially sorted array like [1,2,3, 7,8,4,5,6,9,10] this needs more complex logic.
      // Current implementation: values are [1...mid] and [mid+1...count], and they are already sorted.
      // Let's interpret it as "almost sorted" with a disturbance, e.g. two sorted sequences concatenated.
      // Or, two halves of numbers, each sorted. E.g., values 1-50, then 51-100.
      // A common interpretation is: shuffle, then sort first half, sort second half.
      // Let's try: array of numbers [1...N/2] and [N/2+1...N].
      // Then shuffle them together, then sort each sub-segment in place if desired.
      // The description "Split in two halves, each in ascending order" usually means
      // an array like [1,3,5,2,4,6] -> first half [1,3,5] (sorted), second half [2,4,6] (sorted).
      // Let's use a simpler interpretation: two sorted sub-arrays are concatenated but not necessarily globally sorted.
      // E.g. [1,2,..,count/2] followed by [1,2,..,(count - count/2)] values can be confusing.
      // Let's take values from 1 to count. First half of values are sorted, second half are sorted.
      // Example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      // First half values: 1,2,3,4,5. Second half values: 6,7,8,9,10
      // To make it interesting: shuffle, then sort first half, then sort second half.
      let arr = shuffleArray([...baseArray]);
      const arrFirstHalf = arr.slice(0, mid).sort((a, b) => a - b);
      const arrSecondHalf = arr.slice(mid).sort((a, b) => a - b);
      return [...arrFirstHalf, ...arrSecondHalf];
    }
    case "Split Descending": {
      // Split in two halves, each in descending order
      let arr = shuffleArray([...baseArray]);
      const mid = Math.floor(count / 2);
      const arrFirstHalf = arr.slice(0, mid).sort((a, b) => b - a);
      const arrSecondHalf = arr.slice(mid).sort((a, b) => b - a);
      return [...arrFirstHalf, ...arrSecondHalf];
    }
    default:
      return shuffleArray(baseArray);
  }
};
