import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FieldProps {
  label: string;
  value?: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function Field({ label, value, hint, children, className, htmlFor }: FieldProps) {
  const autoId = React.useId();
  const id = htmlFor ?? autoId;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-[#666660]">
          {label}
        </label>
        {value !== undefined && (
          <span className="inline-flex min-w-[4.25rem] items-center justify-center text-xs font-semibold tabular-nums text-[#fc5200] bg-[#fff2eb] px-2 py-0.5 rounded-md border border-[#ffd8c7]/70 text-center">
            {value}
          </span>
        )}
      </div>
      <div>{children}</div>
      {hint && <p className="text-[11px] leading-relaxed text-[#666660]">{hint}</p>}
    </div>
  );
}
