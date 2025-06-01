import type { BarData } from '@/types';
import { calculateDelay } from '@/config/constants';

export const createInitialBarData = (numbers: number[]): BarData[] =>
  numbers.map((value, index) => ({
    value,
    id: `bar-${index}-${value}-${Math.random().toString(36).substring(7)}`, // Unique ID
    state: 'default',
  }));

// Creates a copy of BarData array with potentially new states for specific indices
export const updateBarStates = (
  currentBars: BarData[],
  updates: { index: number; newState: BarData['state'] }[]
): BarData[] => {
  const newBars = [...currentBars.map(bar => ({ ...bar }))]; // Deep copy for safety
  updates.forEach(({ index, newState }) => {
    if (newBars[index]) {
      newBars[index].state = newState;
    }
  });
  return newBars;
};


export const markSorted = (bars: BarData[], ...indices: number[]): BarData[] => {
  const newBars = [...bars.map(b => ({...b}))];
  indices.forEach(i => {
    if (newBars[i]) newBars[i].state = 'sorted';
  });
  return newBars;
}

export const delay = (animationSpeedValue: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, calculateDelay(animationSpeedValue)));
};
