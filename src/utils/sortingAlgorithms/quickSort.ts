import type { AlgorithmGenerator, BarData, SortStep } from '@/types';
import { createInitialBarData, delay } from './helpers';

async function* partition(
  bars: BarData[],
  low: number,
  high: number,
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AsyncGenerator<SortStep, number, any> {
  let pivotValue = bars[high].value;
  bars[high].state = 'pivot';
  yield { array: [...bars.map(b => ({...b}))] };
  await delay(animationSpeedValue);

  let i = low - 1; 
  let comparisonsThisPartition = 0;

  for (let j = low; j < high; j++) {
    bars[j].state = 'comparing';
    // bars[high] is pivot, also comparing with it implicitly
    playSoundCallback('compare', bars[j].value);
    yield { array: [...bars.map(b => ({...b}))], comparisonsMadeThisStep: 1 };
    await delay(animationSpeedValue);
    comparisonsThisPartition++;

    if (bars[j].value < pivotValue) {
      i++;
      bars[i].state = 'swapping';
      bars[j].state = 'swapping';
      playSoundCallback('swap', bars[j].value);
      yield { array: [...bars.map(b => ({...b}))] };
      await delay(animationSpeedValue);

      [bars[i], bars[j]] = [bars[j], bars[i]];
      
      bars[i].state = (i <= high && bars[i].state !== 'pivot') ? 'default' : bars[i].state;
      bars[j].state = (j <= high && bars[j].state !== 'pivot') ? 'default' : bars[j].state;
      yield { array: [...bars.map(b => ({...b}))] };
      await delay(animationSpeedValue);
    }
    if (bars[j].state !== 'pivot') bars[j].state = 'default';
  }

  // Swap pivot to its correct position
  bars[i + 1].state = 'swapping';
  bars[high].state = 'swapping'; // Pivot is being swapped
  playSoundCallback('swap', bars[high].value);
  yield { array: [...bars.map(b => ({...b}))] };
  await delay(animationSpeedValue);

  [bars[i + 1], bars[high]] = [bars[high], bars[i + 1]];
  
  bars[i + 1].state = 'sorted'; // Pivot is now sorted
  bars[high].state = 'default'; // Original pivot position reset
  yield { array: [...bars.map(b => ({...b}))] };
  await delay(animationSpeedValue);
  
  // Reset non-pivot states
  for(let k=low; k < high; ++k) {
    if (bars[k].state !== 'sorted' && bars[k].state !== 'pivot') bars[k].state = 'default';
  }
  if (bars[high].state !== 'sorted' && bars[high].state !== 'pivot') bars[high].state = 'default';


  return i + 1; // Return pivot index
}

async function* quickSortRecursive(
  bars: BarData[],
  low: number,
  high: number,
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AlgorithmGenerator {
  if (low < high) {
    // Mark current segment being processed (optional visual cue)
    for(let k=low; k<=high; ++k) if(bars[k].state === 'default') bars[k].state = 'comparing'; // temporary highlight
    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue/2); // Shorter delay for this visual cue

    for(let k=low; k<=high; ++k) if(bars[k].state === 'comparing') bars[k].state = 'default'; // reset cue

    const generator = partition(bars, low, high, animationSpeedValue, playSoundCallback);
    let result = await generator.next();
    while(!result.done) {
        yield result.value as SortStep; // Yield steps from partition
        result = await generator.next();
    }
    const pi = result.value as number; // Pivot index from partition

    yield* quickSortRecursive(bars, low, pi - 1, animationSpeedValue, playSoundCallback);
    yield* quickSortRecursive(bars, pi + 1, high, animationSpeedValue, playSoundCallback);
  } else if (low === high && low >= 0 && low < bars.length) { // Single element segment is sorted
    bars[low].state = 'sorted';
    yield { array: [...bars.map(b => ({...b}))] };
  }
}


export async function* quickSort(
  initialNumericArray: number[],
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AlgorithmGenerator {
  let bars = createInitialBarData([...initialNumericArray]);
  
  yield* quickSortRecursive(bars, 0, bars.length - 1, animationSpeedValue, playSoundCallback);

  // Final pass to ensure all are marked sorted if any missed due to recursion depth
  return bars.map(b => ({ ...b, state: 'sorted' as const }));
}
