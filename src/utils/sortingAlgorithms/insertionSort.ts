import type { AlgorithmGenerator, BarData, SortStep } from '@/types';
import { createInitialBarData, delay } from './helpers';

export async function* insertionSort(
  initialNumericArray: number[],
  animationSpeedValue: number,
  playSoundCallback: (type: 'compare' | 'swap', value?: number) => void
): AlgorithmGenerator {
  let bars = createInitialBarData([...initialNumericArray]);
  const n = bars.length;
  if (n > 0) bars[0].state = 'sorted'; // First element is trivially sorted

  for (let i = 1; i < n; i++) {
    let keyBar = { ...bars[i] }; // Store the bar to be inserted
    keyBar.state = 'pivot'; // Highlight the key element being inserted
    let tempBars = [...bars.map(b => ({...b}))];
    tempBars[i] = keyBar; // Show keyBar as pivot
    yield { array: tempBars };
    await delay(animationSpeedValue);
    
    let j = i - 1;
    let comparisonsMadeThisSort = 0;

    // Move elements of arr[0..i-1], that are greater than key, to one position ahead of their current position
    while (j >= 0) {
      bars[j].state = 'comparing';
      playSoundCallback('compare', keyBar.value); // Comparing keyBar with bars[j]
      
      tempBars = [...bars.map(b => ({...b}))]; // Create a snapshot for yield
      tempBars[j+1] = keyBar; // Keybar is "floating"
      tempBars[j].state = 'comparing';
      yield { array: tempBars, comparisonsMadeThisStep: 1 };
      await delay(animationSpeedValue);
      comparisonsMadeThisSort++;

      if (bars[j].value > keyBar.value) {
        bars[j].state = 'swapping'; // This element will shift
        // keyBar is 'pivot'
        tempBars = [...bars.map(b => ({...b}))];
        tempBars[j+1] = keyBar;
        tempBars[j].state = 'swapping';
        yield { array: tempBars };
        await delay(animationSpeedValue);
        playSoundCallback('swap', bars[j].value); // Sound for element shift

        bars[j + 1] = { ...bars[j], state: 'default' }; // Shift element
        bars[j].state = 'default'; // Reset state after shift
        j = j - 1;
      } else {
        bars[j].state = 'sorted'; // It's in correct relative order now
        break; 
      }
    }
    bars[j + 1] = { ...keyBar, state: 'sorted' }; // Insert key into its correct sorted position
    
    // Ensure all elements up to i are marked as sorted
    for(let k=0; k<=i; ++k) bars[k].state = 'sorted';

    yield { array: [...bars.map(b => ({...b}))] };
    await delay(animationSpeedValue);
  }
  return bars.map(b => ({ ...b, state: 'sorted' as const }));
}
