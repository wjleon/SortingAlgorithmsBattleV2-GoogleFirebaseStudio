import type { AlgorithmGenerator, BarData, SortStep } from '@/types';
import { createInitialBarData, delay } from './helpers';

export async function* bubbleSort(
  initialNumericArray: number[],
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AlgorithmGenerator {
  let bars = createInitialBarData([...initialNumericArray]);
  const n = bars.length;
  let comparisonsMadeThisSort = 0;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      bars[j].state = 'comparing';
      bars[j + 1].state = 'comparing';
      playSoundCallback('compare', bars[j].value);
      yield { array: [...bars.map(b => ({...b}))], comparisonsMadeThisStep: 1 };
      await delay(animationSpeedValue);
      comparisonsMadeThisSort++;

      if (bars[j].value > bars[j + 1].value) {
        bars[j].state = 'swapping';
        bars[j + 1].state = 'swapping';
        playSoundCallback('swap', bars[j+1].value);
        yield { array: [...bars.map(b => ({...b}))] };
        await delay(animationSpeedValue);

        [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
        swapped = true;
        
        // After swap, momentarily keep swapping state or set to default
        bars[j].state = 'default'; 
        bars[j+1].state = 'default';
        yield { array: [...bars.map(b => ({...b}))] };
        await delay(animationSpeedValue);
      }

      bars[j].state = 'default';
      bars[j + 1].state = 'default';
    }
    bars[n - 1 - i].state = 'sorted';
    yield { array: [...bars.map(b => ({...b}))] }; // Show the sorted element

    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) {
        bars[k].state = 'sorted';
      }
      yield { array: [...bars.map(b => ({...b}))] };
      return bars.map(b => ({ ...b, state: 'sorted' as const }));
    }
  }
  if (n > 0) bars[0].state = 'sorted'; // The last remaining element
  
  return bars.map(b => ({ ...b, state: 'sorted' as const }));
}
