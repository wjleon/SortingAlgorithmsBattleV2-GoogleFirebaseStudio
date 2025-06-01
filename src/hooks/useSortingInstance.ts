import { useState, useEffect, useCallback, useRef } from 'react';
import type { BarData, SortAlgorithmType, AlgorithmGenerator, SortStep } from '@/types';
import { getAlgorithmFunction } from '@/utils/sortingAlgorithmMap';
import { createInitialBarData } from '@/utils/sortingAlgorithms/helpers';
import { useAudio } from './useAudio';

export const useSortingInstance = (
  algorithmName: SortAlgorithmType,
  initialNumericArray: number[],
  animationSpeed: number, // 0-100
  soundEnabled: boolean,
  onFinishCallback?: () => void
) => {
  const [bars, setBars] = useState<BarData[]>(createInitialBarData(initialNumericArray));
  const [comparisons, setComparisons] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0); // in ms
  const [isSortingThisInstance, setIsSortingThisInstance] = useState(false);
  const [isPausedThisInstance, setIsPausedThisInstance] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const generatorRef = useRef<AlgorithmGenerator | null>(null);
  const currentAlgoGeneratorRef = useRef<ReturnType<AlgorithmGenerator> | null>(null);
  
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0); // For pause/resume
  const animationFrameIdRef = useRef<number | null>(null);

  const { playSound } = useAudio(soundEnabled);

  const resetSort = useCallback((newNumericArray: number[]) => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    setIsSortingThisInstance(false);
    setIsPausedThisInstance(false);
    setIsFinished(false);
    setBars(createInitialBarData(newNumericArray));
    setComparisons(0);
    setTimeElapsed(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    currentAlgoGeneratorRef.current = null;
    generatorRef.current = getAlgorithmFunction(algorithmName);
  }, [algorithmName]);


  useEffect(() => {
    resetSort(initialNumericArray);
  }, [initialNumericArray, algorithmName, resetSort]);


  const stepThroughAlgorithm = useCallback(async () => {
    if (!currentAlgoGeneratorRef.current || isPausedThisInstance || isFinished) {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      return;
    }

    try {
      const result = await currentAlgoGeneratorRef.current.next();

      if (!result.done) {
        const stepData = result.value as SortStep;
        setBars(stepData.array);
        if (stepData.comparisonsMadeThisStep) {
          setComparisons(prev => prev + (stepData.comparisonsMadeThisStep || 0));
        }
        
        if (startTimeRef.current) {
          setTimeElapsed(accumulatedTimeRef.current + (performance.now() - startTimeRef.current));
        }
        animationFrameIdRef.current = requestAnimationFrame(stepThroughAlgorithm);
      } else {
        // Sorting finished
        setIsSortingThisInstance(false);
        setIsFinished(true);
        setBars(result.value as BarData[]); // Final sorted array
        if (startTimeRef.current) {
          const finalTime = accumulatedTimeRef.current + (performance.now() - startTimeRef.current);
          setTimeElapsed(finalTime);
        }
        startTimeRef.current = null;
        if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        onFinishCallback?.();
      }
    } catch (error) {
      console.error("Error during sorting:", error);
      setIsSortingThisInstance(false);
      setIsFinished(true); // Mark as finished even on error to stop
      // Optionally set an error state to display to the user
    }
  }, [isPausedThisInstance, isFinished, onFinishCallback]);

  const startSort = useCallback(() => {
    resetSort(initialNumericArray); // Always reset before starting
    
    const algoFn = getAlgorithmFunction(algorithmName);
    if (!algoFn) {
        console.error("Algorithm function not found for:", algorithmName);
        setIsFinished(true); // Prevent further operations
        return;
    }
    generatorRef.current = algoFn;

    setIsSortingThisInstance(true);
    setIsPausedThisInstance(false);
    setIsFinished(false);
    
    setComparisons(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = performance.now();
    setTimeElapsed(0);

    currentAlgoGeneratorRef.current = generatorRef.current(initialNumericArray, animationSpeed, playSound);
    
    if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    animationFrameIdRef.current = requestAnimationFrame(stepThroughAlgorithm);
  }, [resetSort, initialNumericArray, algorithmName, animationSpeed, playSound, stepThroughAlgorithm]);

  const pauseSort = useCallback(() => {
    if (isSortingThisInstance && !isPausedThisInstance) {
      setIsPausedThisInstance(true);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (startTimeRef.current) {
        accumulatedTimeRef.current += performance.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
    }
  }, [isSortingThisInstance, isPausedThisInstance]);

  const resumeSort = useCallback(() => {
    if (isSortingThisInstance && isPausedThisInstance) {
      setIsPausedThisInstance(false);
      startTimeRef.current = performance.now();
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = requestAnimationFrame(stepThroughAlgorithm);
    }
  }, [isSortingThisInstance, isPausedThisInstance, stepThroughAlgorithm]);
  
  // Effect for animation speed changes during sorting (currently handled by algo's delay fn)
  useEffect(() => {
    if (isSortingThisInstance && currentAlgoGeneratorRef.current) {
      // The generator instance already has the speed baked in when it was created.
      // To truly change speed mid-sort, the generator would need to be aware of a reactive speed prop,
      // or be restarted. For simplicity, current implementation means speed changes apply on next "Start".
      // Or, we can recreate the generator if speed changes. This is complex.
      // The `delay` function in helpers.ts is called on each step with the current `animationSpeed`,
      // so it should adapt.
    }
  }, [animationSpeed, isSortingThisInstance]);


  return {
    bars,
    comparisons,
    timeElapsed,
    isSortingThisInstance,
    isPausedThisInstance,
    isFinished,
    startSort,
    pauseSort,
    resumeSort,
    resetSort,
  };
};
