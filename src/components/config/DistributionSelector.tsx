import type { DistributionType } from '@/types';
import { ALL_DISTRIBUTIONS } from '@/config/constants';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DistributionSelectorProps {
  selectedValue: DistributionType;
  onValueChange: (value: DistributionType) => void;
  disabled?: boolean;
}

export function DistributionSelector({ selectedValue, onValueChange, disabled }: DistributionSelectorProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Label className="text-sm font-medium">Distribution of Elements</Label>
      <RadioGroup
        value={selectedValue}
        onValueChange={(value) => onValueChange(value as DistributionType)}
        className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
        disabled={disabled}
      >
        {ALL_DISTRIBUTIONS.map((dist) => (
          <div key={dist} className="flex items-center space-x-2">
            <RadioGroupItem value={dist} id={`dist-${dist.replace(/\s+/g, '-')}`} disabled={disabled}/>
            <Label htmlFor={`dist-${dist.replace(/\s+/g, '-')}`} className="font-normal">{dist}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
