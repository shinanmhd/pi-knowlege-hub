import { cn } from '@/lib/utils/cn'
import { getInitials } from '@/lib/utils/format'

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-7 w-7 text-xs',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
  xl: 'h-12 w-12 text-base',
} as const

const colorSeeds = [
  'bg-primary/20 text-primary',
  'bg-secondary/20 text-secondary',
  'bg-success/20 text-success',
  'bg-warning/20 text-warning',
  'bg-danger/20 text-danger',
  'bg-purple-500/20 text-purple-400',
  'bg-pink-500/20 text-pink-400',
]

function seedColor(name: string): string {
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0)
  return colorSeeds[code % colorSeeds.length]
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  src?: string | null
  size?: keyof typeof sizes
}

export function Avatar({ name, src, size = 'md', className, ...props }: AvatarProps) {
  const initials = getInitials(name)
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold shrink-0 select-none overflow-hidden',
        sizes[size],
        !src && seedColor(name),
        className,
      )}
      title={name}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  )
}
