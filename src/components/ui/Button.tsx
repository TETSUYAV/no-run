import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const computedClass = cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0',
      variant === 'default' &&
        'bg-gradient-to-r from-[#fc5200] via-[#eb4d00] to-[#cc4200] text-white shadow-md shadow-[#fc5200]/25 hover:shadow-lg hover:shadow-[#fc5200]/35 hover:brightness-105 active:brightness-95',
      variant === 'outline' &&
        'border border-[#e6e6e1] bg-white/90 text-[#1d1d1f] shadow-sm hover:bg-[#f3f3f0] hover:border-[#d6d6cf]',
      variant === 'secondary' &&
        'bg-[#fff2eb] text-[#fc5200] hover:bg-[#ffe6da] border border-[#ffd8c7]',
      variant === 'ghost' &&
        'hover:bg-[#f3f3f0] text-[#1d1d1f]',
      size === 'sm' && 'h-8 px-3 text-xs',
      size === 'default' && 'h-10 px-4 py-2 text-sm',
      size === 'lg' && 'h-12 px-6 text-base font-semibold',
      size === 'icon' && 'size-9',
      className
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(computedClass, (children.props as any)?.className),
        ...props,
      });
    }

    return (
      <button ref={ref} className={computedClass} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
