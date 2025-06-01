import type { AlgorithmGenerator, BarData, SortStep } from '@/types';
import { createInitialBarData, delay } from './helpers';

async function* merge(
  bars: BarData[],
  l: number,
  m: number,
  r: number,
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void,
  tempArrayForDisplay: BarData[] // Pass the main display array for yielding global state
): AsyncGenerator<SortStep, void, any> {
  const n1 = m - l + 1;
  const n2 = r - m;

  // Create temp arrays by copying relevant segment from main 'bars' array
  let L: BarData[] = new Array(n1);
  let R: BarData[] = new Array(n2);

  for (let i = 0; i < n1; i++) L[i] = { ...bars[l + i] };
  for (let j = 0; j < n2; j++) R[j] = { ...bars[m + 1 + j] };

  // Highlight segments being merged
  for(let i=l; i<=r; i++) tempArrayForDisplay[i].state = 'comparing';
  yield { array: [...tempArrayForDisplay.map(b=>({...b}))] };
  await delay(animationSpeedValue);


  let i = 0; // Initial index of first subarray
  let j = 0; // Initial index of second subarray
  let k = l; // Initial index of merged subarray in original 'bars' array

  let comparisonsThisMerge = 0;

  while (i < n1 && j < n2) {
    // Highlight elements being compared from L and R within tempArrayForDisplay
    if(l+i < tempArrayForDisplay.length) tempArrayForDisplay[l+i].state = 'pivot'; // Element from L
    if(m+1+j < tempArrayForDisplay.length) tempArrayForDisplay[m+1+j].state = 'pivot'; // Element from R
    
    playSoundCallback('compare', L[i].value);
    yield { array: [...tempArrayForDisplay.map(b=>({...b}))], comparisonsMadeThisStep: 1 };
    await delay(animationSpeedValue);
    comparisonsThisMerge++;

    if (L[i].value <= R[j].value) {
      bars[k] = { ...L[i], state: 'swapping' }; // Mark as being placed
      tempArrayForDisplay[k] = { ...bars[k] }; // Update display array
      i++;
    } else {
      bars[k] = { ...R[j], state: 'swapping' }; // Mark as being placed
      tempArrayForDisplay[k] = { ...bars[k] }; // Update display array
      j++;
    }
    playSoundCallback('swap', bars[k].value); // Sound for placing element
    yield { array: [...tempArrayForDisplay.map(b=>({...b}))] };
    await delay(animationSpeedValue);
    
    tempArrayForDisplay[k].state = 'default'; // Reset after placing
    // Reset pivot highlights
    if(l+i-1 < tempArrayForDisplay.length && L[i-1]) tempArrayForDisplay[l+i-1].state = 'comparing'; // Back to comparing state for segment
    if(m+1+j-1 < tempArrayForDisplay.length && R[j-1]) tempArrayForDisplay[m+1+j-1].state = 'comparing';


    k++;
  }

  while (i < n1) {
    bars[k] = { ...L[i], state: 'swapping' };
    tempArrayForDisplay[k] = { ...bars[k] };
    playSoundCallback('swap', bars[k].value);
    yield { array: [...tempArrayForDisplay.map(b=>({...b}))] };
    await delay(animationSpeedValue);
    tempArrayForDisplay[k].state = 'default';
    i++;
    k++;
  }

  while (j < n2) {
    bars[k] = { ...R[j], state: 'swapping' };
    tempArrayForDisplay[k] = { ...bars[k] };
    playSoundCallback('swap', bars[k].value);
    yield { array: [...tempArrayForDisplay.map(b=>({...b}))] };
    await delay(animationSpeedValue);
    tempArrayForDisplay[k].state = 'default';
    j++;
    k++;
  }
  
  // Mark merged segment as sorted in the display array
  for(let idx=l; idx<=r; idx++) tempArrayForDisplay[idx].state = 'sorted';
  yield { array: [...tempArrayForDisplay.map(b=>({...b}))] };
  await delay(animationSpeedValue);
}


async function* mergeSortRecursive(
  bars: BarData[], // This is the array being mutated by sort logic
  l: number,
  r: number,
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void,
  tempArrayForDisplay: BarData[] // This is for yielding visualization steps
): AlgorithmGenerator {
  if (l < r) {
    const m = Math.floor(l + (r - l) / 2);

    yield* mergeSortRecursive(bars, l, m, animationSpeedValue, playSoundCallback, tempArrayForDisplay);
    yield* mergeSortRecursive(bars, m + 1, r, animationSpeedValue, playSoundCallback, tempArrayForDisplay);
    
    // Update tempArrayForDisplay with current state of bars before merge visualisation
    for(let i=l; i<=r; i++) tempArrayForDisplay[i] = {...bars[i]};

    const mergeGenerator = merge(bars, l, m, r, animationSpeedValue, playSoundCallback, tempArrayForDisplay);
    let step = await mergeGenerator.next();
    while(!step.done) {
      yield step.value as SortStep;
      step = await mergeGenerator.next();
    }
    // After merge, elements in tempArrayForDisplay from l to r are sorted
    // The actual 'bars' array is also sorted in this range.
  } else if (l === r && l >=0 && l < bars.length) { // Single element is sorted
     tempArrayForDisplay[l].state = 'sorted';
     yield { array: [...tempArrayForDisplay.map(b => ({...b}))] };
  }
}

export async function* mergeSort(
  initialNumericArray: number[],
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AlgorithmGenerator {
  // 'actualBars' is the array that merge sort logic will modify.
  // 'displayBars' is a copy used for yielding animation steps to reflect global state.
  let actualBars = createInitialBarData([...initialNumericArray]);
  let displayBars = createInitialBarData([...initialNumericArray]); // Separate array for visualization yields

  yield* mergeSortRecursive(actualBars, 0, actualBars.length - 1, animationSpeedValue, playSoundCallback, displayBars);
  
  // Final state from actualBars, ensure all marked sorted for display.
  return actualBars.map(b => ({ ...b, state: 'sorted' as const }));
}
