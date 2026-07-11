import { cn } from '@/lib/utils'

type Tone = 'muted' | 'brand' | 'info' | 'success' | 'warning'

const toneStyles: Record<Tone, string> = {
  muted: 'bg-secondary text-muted-foreground',
  brand: 'bg-brand/15 text-brand',
  info: 'bg-chart-1/12 text-chart-1',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/25 text-warning-foreground',
}

export function StatusBadge({
  label,
  tone = 'muted',
  dot = true,
  className,
}: {
  label: string
  tone?: Tone
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {label}
    </span>
  )
}
