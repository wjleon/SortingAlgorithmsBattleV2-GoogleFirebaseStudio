import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MIN_ELEMENTS, MAX_ELEMENTS } from '@/config/constants';

interface ElementCountInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function ElementCountInput({ value, onChange, disabled }: ElementCountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = parseInt(e.target.value, 10);
    if (isNaN(num)) {
      num = MIN_ELEMENTS; // Or keep current value, or set to min
    }
    // No immediate clamping here, rely on onBlur or form submission for final validation
    // but page.tsx will clamp.
    onChange(num);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let num = parseInt(e.target.value, 10);
    if (isNaN(num)) num = MIN_ELEMENTS;
    if (num < MIN_ELEMENTS) num = MIN_ELEMENTS;
    if (num > MAX_ELEMENTS) num = MAX_ELEMENTS;
    onChange(num); // Ensure value is clamped on blur
  };


  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="element-count" className="text-sm font-medium">Number of Elements ({MIN_ELEMENTS}-{MAX_ELEMENTS})</Label>
      <Input
        id="element-count"
        type="number"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        min={MIN_ELEMENTS}
        max={MAX_ELEMENTS}
        disabled={disabled}
        className="w-full md:w-[180px]"
      />
    </div>
  );
}
