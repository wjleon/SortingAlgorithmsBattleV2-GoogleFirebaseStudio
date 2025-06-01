import type { SortAlgorithmType } from '@/types';
import { ALL_SORTING_ALGORITHMS } from '@/config/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AlgorithmSelectorProps {
  id: string;
  label: string;
  selectedValue: SortAlgorithmType;
  onValueChange: (value: SortAlgorithmType) => void;
  disabled?: boolean;
}

export function AlgorithmSelector({ id, label, selectedValue, onValueChange, disabled }: AlgorithmSelectorProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <Select
        value={selectedValue}
        onValueChange={(value) => onValueChange(value as SortAlgorithmType)}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="w-full md:w-[200px]">
          <SelectValue placeholder="Select algorithm" />
        </SelectTrigger>
        <SelectContent>
          {ALL_SORTING_ALGORITHMS.map((algo) => (
            <SelectItem key={algo} value={algo}>
              {algo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
