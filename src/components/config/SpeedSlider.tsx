import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SpeedSliderProps {
  value: number; // 0-100
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function SpeedSlider({ value, onChange, disabled }: SpeedSliderProps) {
  return (
    <div className="flex flex-col space-y-2 w-full md:w-[200px]">
      <Label htmlFor="speed-slider" className="text-sm font-medium">Animation Speed</Label>
      <Slider
        id="speed-slider"
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={(newValue) => onChange(newValue[0])}
        disabled={disabled}
        className="py-2"
      />
    </div>
  );
}
