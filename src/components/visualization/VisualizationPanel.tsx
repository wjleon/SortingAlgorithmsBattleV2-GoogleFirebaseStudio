import React from 'react';
import type { SortAlgorithmType, BarData } from '@/types';
import { useSortingInstance } from '@/hooks/useSortingInstance';
import { Bar } from './Bar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // For loading state perhaps

interface VisualizationPanelProps {
  panelId: string; // 'algo1' or 'algo2'
  algorithmName: SortAlgorithmType;
  initialNumericArray: number[];
  numElements: number;
  animationSpeed: number; // 0-100
  isGloballySorting: boolean; // From main page state
  isGloballyPaused: boolean; // From main page state
  triggerGlobalReset: boolean; // To signal reset from parent
  soundEnabled: boolean;
  onAlgorithmFinish: (panelId: string, comparisons: number, time: number) => void;
  clearCompletionMessage: () => void; // To clear message on new start/reset
}

export function VisualizationPanel({
  panelId,
  algorithmName,
  initialNumericArray,
  numElements,
  animationSpeed,
  isGloballySorting,
  isGloballyPaused,
  triggerGlobalReset,
  soundEnabled,
  onAlgorithmFinish,
  clearCompletionMessage,
}: VisualizationPanelProps) {
  
  const {
    bars,
    comparisons,
    timeElapsed,
    isSortingThisInstance, // local sorting state
    isPausedThisInstance,   // local pause state
    isFinished,
    startSort,
    pauseSort,
    resumeSort,
    resetSort,
  } = useSortingInstance(
    algorithmName,
    initialNumericArray,
    animationSpeed,
    soundEnabled,
    () => { // onFinishCallback
      onAlgorithmFinish(panelId, comparisons, timeElapsed);
    }
  );

  // Effect to handle global controls
  React.useEffect(() => {
    if (triggerGlobalReset) {
      resetSort(initialNumericArray);
      clearCompletionMessage(); // Clear message on global reset
    }
  }, [triggerGlobalReset, initialNumericArray, resetSort, clearCompletionMessage]);

  React.useEffect(() => {
    if (isGloballySorting && !isGloballyPaused && !isSortingThisInstance && !isFinished) {
      clearCompletionMessage(); // Clear previous message if any
      startSort();
    } else if (isGloballyPaused && isSortingThisInstance && !isPausedThisInstance) {
      pauseSort();
    } else if (!isGloballyPaused && isSortingThisInstance && isPausedThisInstance) {
      resumeSort();
    }
  }, [isGloballySorting, isGloballyPaused, isSortingThisInstance, isPausedThisInstance, isFinished, startSort, pauseSort, resumeSort, clearCompletionMessage]);
  
  // Update title when algorithm or numElements changes
  const title = `${algorithmName}: Sorting ${numElements} Elements`;

  return (
    <Card className="flex flex-col flex-1 min-w-0 h-full shadow-lg">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-lg md:text-xl font-headline truncate" title={title}>{title}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Comparisons: {comparisons} | Time: {(timeElapsed / 1000).toFixed(3)}s
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 md:p-4 min-h-[200px] md:min-h-[300px] overflow-hidden">
        {isSortingThisInstance && !isFinished && bars.length === 0 && (
           <div className="flex items-center justify-center h-full">
             <p>Generating array...</p>
             <Progress value={50} className="w-1/2 mx-auto" />
           </div>
        )}
        <div className="flex-grow flex flex-col space-y-px bg-muted/50 p-1 rounded-md overflow-y-auto">
          {bars.map((bar) => (
            <Bar key={bar.id} barData={bar} maxHeight={numElements} />
          ))}
        </div>
      </CardContent>
      {isFinished && (
        <CardFooter className="pt-2 pb-4 text-xs md:text-sm text-primary">
          <p>{algorithmName} finished. Comparisons: {comparisons}, Time: {(timeElapsed / 1000).toFixed(3)}s.</p>
        </CardFooter>
      )}
    </Card>
  );
}
