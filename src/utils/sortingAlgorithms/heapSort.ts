import type { AlgorithmGenerator, BarData, SortStep } from '@/types';
import { createInitialBarData, delay } from './helpers';

async function* heapify(
  bars: BarData[],
  n: number,
  i: number, // root index
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AsyncGenerator<SortStep, void, any> {
  let largest = i; // Initialize largest as root
  const l = 2 * i + 1; // left = 2*i + 1
  const r = 2 * i + 2; // right = 2*i + 2
  let comparisonsThisHeapify = 0;

  bars[i].state = 'pivot'; // Current root being processed

  // If left child is larger than root
  if (l < n) {
    bars[l].state = 'comparing';
    playSoundCallback('compare', bars[l].value);
    yield { array: [...bars.map(b => ({...b}))], comparisonsMadeThisStep: 1 };
    await delay(animationSpeedValue);
    comparisonsThisHeapify++;
    if (bars[l].value > bars[largest].value) {
      largest = l;
    }
    bars[l].state = 'default';
  }

  // If right child is larger than largest so far
  if (r < n) {
    bars[r].state = 'comparing';
    playSoundCallback('compare', bars[r].value);
    yield { array: [...bars.map(b => ({...b}))], comparisonsMadeThisStep: 1 };
    await delay(animationSpeedValue);
    comparisonsThisHeapify++;
    if (bars[r].value > bars[largest].value) {
      largest = r;
    }
    bars[r].state = 'default';
  }
  
  bars[i].state = 'default'; // Done with this root as pivot for now

  // If largest is not root
  if (largest !== i) {
    bars[i].state = 'swapping';
    bars[largest].state = 'swapping';
    playSoundCallback('swap', bars[largest].value);
    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue);

    [bars[i], bars[largest]] = [bars[largest], bars[i]];
    
    bars[i].state = 'default';
    bars[largest].state = 'default';
    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue);

    // Recursively heapify the affected sub-tree
    // Need to yield steps from recursive calls
    const subHeapifyGen = heapify(bars, n, largest, animationSpeedValue, playSoundCallback);
    let step = await subHeapifyGen.next();
    while(!step.done) {
        yield step.value as SortStep;
        step = await subHeapifyGen.next();
    }
  }
}

export async function* heapSort(
  initialNumericArray: number[],
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AlgorithmGenerator {
  let bars = createInitialBarData([...initialNumericArray]);
  const n = bars.length;

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    const heapifyGen = heapify(bars, n, i, animationSpeedValue, playSoundCallback);
    let step = await heapifyGen.next();
    while(!step.done) {
        yield step.value as SortStep;
        step = await heapifyGen.next();
    }
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    bars[0].state = 'swapping'; // Root
    bars[i].state = 'swapping'; // End of current heap
    playSoundCallback('swap', bars[0].value);
    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue);

    [bars[0], bars[i]] = [bars[i], bars[0]];
    
    bars[i].state = 'sorted'; // Element moved to end is sorted
    bars[0].state = 'default'; 
    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue);

    // call max heapify on the reduced heap
    const heapifyGen = heapify(bars, i, 0, animationSpeedValue, playSoundCallback);
    let step = await heapifyGen.next();
    while(!step.done) {
        yield step.value as SortStep;
        step = await heapifyGen.next();
    }
  }
  if (n > 0) bars[0].state = 'sorted'; // The last element in heap is sorted

  return bars.map(b => ({ ...b, state: 'sorted' as const }));
}
