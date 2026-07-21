'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-800 text-white hover:bg-primary-900',
        accent:
          'border-transparent bg-accent-500 text-ink-950 hover:bg-accent-600',
        secondary:
          'border-transparent bg-primary-950/5 text-ink-900 hover:bg-primary-950/10',
        destructive:
          'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'text-ink-900 border-primary-950/20',
        success:
          'border-transparent bg-green-100 text-green-800',
        warning:
          'border-transparent bg-accent-500/15 text-accent-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
