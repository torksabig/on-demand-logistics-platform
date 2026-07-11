import { Pill, Flower2, Wrench, ShoppingBasket, Store } from 'lucide-react'
import { verticalMeta, type Vertical } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export const verticalIcon: Record<Vertical, typeof Pill> = {
  pharmacy: Pill,
  flowers: Flower2,
  spare_parts: Wrench,
  groceries: ShoppingBasket,
  retail: Store,
}

export function VerticalBadge({
  vertical,
  className,
}: {
  vertical: Vertical
  className?: string
}) {
  const Icon = verticalIcon[vertical]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground',
        className,
      )}
    >
      <Icon className="size-3.5" />
      {verticalMeta[vertical].short}
    </span>
  )
}
