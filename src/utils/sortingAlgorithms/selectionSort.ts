import type { AlgorithmGenerator, BarData, SortStep } from '@/types';
import { createInitialBarData, delay } from './helpers';

export async function* selectionSort(
  initialNumericArray: number[],
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AlgorithmGenerator {
  let bars = createInitialBarData([...initialNumericArray]);
  const n = bars.length;
  let comparisonsMadeThisSort = 0;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    bars[i].state = 'pivot'; // Current element considered for min swap target
    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue);

    for (let j = i + 1; j < n; j++) {
      bars[j].state = 'comparing';
      if (bars[minIdx].state !== 'pivot') bars[minIdx].state = 'comparing'; // if minIdx changed
      
      playSoundCallback('compare', bars[j].value);
      yield { array: [...bars.map(b => ({...b}))], comparisonsMadeThisStep: 1 };
      await delay(animationSpeedValue);
      comparisonsMadeThisSort++;

      if (bars[j].value < bars[minIdx].value) {
        if (bars[minIdx].state !== 'pivot') bars[minIdx].state = 'default'; // reset old minIdx if not pivot
        minIdx = j;
        // bars[minIdx] is now the new minimum, highlight it as such or keep 'comparing'
      }
      bars[j].state = 'default'; // Reset after comparison if not new min
    }
    
    if (bars[minIdx].state !== 'pivot') bars[minIdx].state = 'default'; // Reset minIdx state before swap if it's not the pivot itself

    // Swap
    bars[i].state = 'swapping'; // i is the pivot/target
    bars[minIdx].state = 'swapping'; // minIdx is the element to swap with
    playSoundCallback('swap', bars[minIdx].value);
    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue);

    [bars[i], bars[minIdx]] = [bars[minIdx], bars[i]];

    bars[i].state = 'sorted'; // Element at i is now sorted
    if (i !== minIdx) bars[minIdx].state = 'default'; // Reset the state of the swapped element's original position
    
    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue);

    // Reset states for elements that were pivot but now are default
    if (bars[minIdx].state === 'pivot') bars[minIdx].state = 'default';
  }
  if (n > 0) bars[n - 1].state = 'sorted'; // Last element is also sorted

  return bars.map(b => ({ ...b, state: 'sorted' as const }));
}
