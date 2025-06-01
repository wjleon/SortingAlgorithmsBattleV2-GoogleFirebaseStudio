import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Volume2, VolumeX } from "lucide-react";

interface AudioToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export function AudioToggle({ enabled, onToggle, disabled }: AudioToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="audio-toggle"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={disabled}
        aria-labelledby="audio-toggle-label"
      />
      <Label htmlFor="audio-toggle" id="audio-toggle-label" className="flex items-center text-sm font-medium">
        {enabled ? <Volume2 className="mr-1 h-4 w-4" /> : <VolumeX className="mr-1 h-4 w-4" />}
        Sound
      </Label>
    </div>
  );
}
