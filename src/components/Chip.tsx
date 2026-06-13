import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function Chip({ label, selected, onToggle, disabled }: ChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
        selected
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-card text-foreground border-border hover:border-primary/40',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {label}
    </button>
  );
}
