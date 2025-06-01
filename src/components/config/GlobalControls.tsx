import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface GlobalControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isSorting: boolean;
  isPaused: boolean;
}

export function GlobalControls({ onStart, onPause, onReset, isSorting, isPaused }: GlobalControlsProps) {
  return (
    <div className="flex space-x-2 items-end">
      <Button onClick={onStart} disabled={isSorting && !isPaused} aria-label="Start Sorting">
        <Play className="mr-2 h-4 w-4" /> Start
      </Button>
      <Button onClick={onPause} disabled={!isSorting || isPaused} variant="outline" aria-label="Pause Sorting">
        <Pause className="mr-2 h-4 w-4" /> Pause
      </Button>
      <Button onClick={onReset} variant="outline" aria-label="Reset Visualizations">
        <RotateCcw className="mr-2 h-4 w-4" /> Reset
      </Button>
    </div>
  );
}
