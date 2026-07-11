import { cn } from '@/lib/utils'

export function Logo({
  className,
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'light'
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          aria-hidden="true"
        >
          <path
            d="M3 8h9l3 4h6M3 8v8h3m9-4v4m0 0h3m-3 0H9m-3 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm9 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          'font-display text-lg font-bold tracking-tight',
          variant === 'light' ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        Relay
      </span>
    </span>
  )
}
