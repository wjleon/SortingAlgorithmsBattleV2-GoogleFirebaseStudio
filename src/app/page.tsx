'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AlgorithmSelector } from '@/components/config/AlgorithmSelector';
import { ElementCountInput } from '@/components/config/ElementCountInput';
import { DistributionSelector } from '@/components/config/DistributionSelector';
import { GlobalControls } from '@/components/config/GlobalControls';
import { AudioToggle } from '@/components/config/AudioToggle';
import { SpeedSlider } from '@/components/config/SpeedSlider';
import { VisualizationPanel } from '@/components/visualization/VisualizationPanel';
import type { SortAlgorithmType, DistributionType } from '@/types';
import { 
  DEFAULT_ALGORITHM_1, DEFAULT_ALGORITHM_2, DEFAULT_NUM_ELEMENTS, 
  MIN_ELEMENTS, MAX_ELEMENTS, DEFAULT_DISTRIBUTION, 
  DEFAULT_SOUND_ENABLED, DEFAULT_ANIMATION_SPEED 
} from '@/config/constants';
import { generateNumericArray } from '@/utils/arrayGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Label } from "@/components/ui/label";

export default function SortVisualizerPage() {
  const [selectedAlgorithm1, setSelectedAlgorithm1] = useState<SortAlgorithmType>(DEFAULT_ALGORITHM_1);
  const [selectedAlgorithm2, setSelectedAlgorithm2] = useState<SortAlgorithmType>(DEFAULT_ALGORITHM_2);
  const [numElements, setNumElements] = useState<number>(DEFAULT_NUM_ELEMENTS);
  const [distribution, setDistribution] = useState<DistributionType>(DEFAULT_DISTRIBUTION);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(DEFAULT_SOUND_ENABLED);
  const [animationSpeed, setAnimationSpeed] = useState<number>(DEFAULT_ANIMATION_SPEED); // 0-100

  const [initialArray, setInitialArray] = useState<number[]>([]);
  
  const [isGloballySorting, setIsGloballySorting] = useState<boolean>(false);
  const [isGloballyPaused, setIsGloballyPaused] = useState<boolean>(false);
  const [triggerGlobalReset, setTriggerGlobalReset] = useState<boolean>(false); // Used to signal reset to panels

  const [completionMessage1, setCompletionMessage1] = useState<string>('');
  const [completionMessage2, setCompletionMessage2] = useState<string>('');

  const { toast } = useToast();

  const regenerateArray = useCallback(() => {
    const newArray = generateNumericArray(numElements, distribution);
    setInitialArray(newArray);
  }, [numElements, distribution]);

  useEffect(() => {
    regenerateArray();
  }, [regenerateArray]);

  const handleNumElementsChange = (value: number) => {
    let clampedValue = value;
    if (value < MIN_ELEMENTS) clampedValue = MIN_ELEMENTS;
    if (value > MAX_ELEMENTS) clampedValue = MAX_ELEMENTS;
    setNumElements(clampedValue);
    // Array will regenerate via useEffect on numElements change if not sorting
    if (!isGloballySorting) regenerateArray(); 
  };
  
  const handleDistributionChange = (value: DistributionType) => {
    setDistribution(value);
    if (!isGloballySorting) regenerateArray();
  }

  const handleStart = () => {
    if (isGloballyPaused) { // Resume
      setIsGloballyPaused(false);
    } else { // Start new or restart
      setCompletionMessage1('');
      setCompletionMessage2('');
      regenerateArray(); // Always get fresh array on new start
      setIsGloballySorting(true);
      setIsGloballyPaused(false);
      setTriggerGlobalReset(false); // Ensure reset is not active
    }
    toast({ title: "Sorting Started", description: `Visualizing ${selectedAlgorithm1} and ${selectedAlgorithm2}.` });
  };

  const handlePause = () => {
    setIsGloballyPaused(true);
    toast({ title: "Sorting Paused" });
  };

  const handleReset = () => {
    setIsGloballySorting(false);
    setIsGloballyPaused(false);
    setTriggerGlobalReset(true); // Signal panels to reset
    regenerateArray(); // Generate new base array
    setCompletionMessage1('');
    setCompletionMessage2('');
    // After signaling, reset the trigger
    setTimeout(() => setTriggerGlobalReset(false), 0);
    toast({ title: "Visualizations Reset" });
  };

  const handleAlgorithmFinish = useCallback((panelId: string, comparisons: number, time: number) => {
    const algoName = panelId === 'algo1' ? selectedAlgorithm1 : selectedAlgorithm2;
    const message = `${algoName} finished. Comparisons: ${comparisons}, Time: ${(time / 1000).toFixed(3)}s.`;
    if (panelId === 'algo1') {
      setCompletionMessage1(message);
    } else {
      setCompletionMessage2(message);
    }
    // Check if both finished to update global sorting state potentially
    // This logic is complex if they finish at different times.
    // For now, isGloballySorting remains true until reset.
    // Or, track individual panel finished states.
  }, [selectedAlgorithm1, selectedAlgorithm2]);
  
  // Derived state for disabling controls
  const controlsDisabled = isGloballySorting && !isGloballyPaused;

  const memoizedInitialArray = useMemo(() => initialArray, [initialArray]);


  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 bg-background font-body">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Sort Visualizer by Google Firebase Studio</h1>
        <p className="text-muted-foreground">Compare sorting algorithms side-by-side</p>
      </header>

      <Card className="shadow-lg">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
            <div className="space-y-4">
              <AlgorithmSelector id="algo1-select" label="Algorithm 1 (Left Panel)" selectedValue={selectedAlgorithm1} onValueChange={setSelectedAlgorithm1} disabled={controlsDisabled} />
              <AlgorithmSelector id="algo2-select" label="Algorithm 2 (Right Panel)" selectedValue={selectedAlgorithm2} onValueChange={setSelectedAlgorithm2} disabled={controlsDisabled} />
            </div>
            
            <div className="space-y-4">
              <ElementCountInput value={numElements} onChange={handleNumElementsChange} disabled={controlsDisabled} />
              <DistributionSelector selectedValue={distribution} onValueChange={handleDistributionChange} disabled={controlsDisabled} />
            </div>

            <div className="space-y-4 md:col-span-2 lg:col-span-1">
                <div className="flex flex-col space-y-3 items-start">
                    <Label className="text-sm font-medium">Global Controls</Label>
                    <GlobalControls 
                        onStart={handleStart} 
                        onPause={handlePause} 
                        onReset={handleReset} 
                        isSorting={isGloballySorting}
                        isPaused={isGloballyPaused}
                    />
                </div>
                 <Separator className="my-3"/>
                <div className="flex space-x-4 items-center">
                    <AudioToggle enabled={soundEnabled} onToggle={setSoundEnabled} />
                    <SpeedSlider value={animationSpeed} onChange={setAnimationSpeed} disabled={controlsDisabled && false /* Speed can be changed mid-sort */} />
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <main className="flex-grow flex flex-col md:flex-row gap-4 md:gap-6">
        <VisualizationPanel
          panelId="algo1"
          algorithmName={selectedAlgorithm1}
          initialNumericArray={memoizedInitialArray}
          numElements={numElements}
          animationSpeed={animationSpeed}
          isGloballySorting={isGloballySorting}
          isGloballyPaused={isGloballyPaused}
          triggerGlobalReset={triggerGlobalReset}
          soundEnabled={soundEnabled}
          onAlgorithmFinish={handleAlgorithmFinish}
          clearCompletionMessage={() => setCompletionMessage1('')}
        />
        <VisualizationPanel
          panelId="algo2"
          algorithmName={selectedAlgorithm2}
          initialNumericArray={memoizedInitialArray}
          numElements={numElements}
          animationSpeed={animationSpeed}
          isGloballySorting={isGloballySorting}
          isGloballyPaused={isGloballyPaused}
          triggerGlobalReset={triggerGlobalReset}
          soundEnabled={soundEnabled}
          onAlgorithmFinish={handleAlgorithmFinish}
          clearCompletionMessage={() => setCompletionMessage2('')}
        />
      </main>
       <Toaster />
    </div>
  );
}
