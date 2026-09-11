'use client';

import * as React from 'react';
import { CalendarDays, Clock, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

export interface DateTimePickerProps {
  value: string; // "YYYY-MM-DDTHH:mm"
  onChange: (val: string) => void;
}

// Helper to parse ISO / local datetime string
function parseDateTime(val: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(val);
  if (match) {
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4]),
      minute: Number(match[5]),
    };
  }
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

interface WheelProps {
  items: { value: number; label: string }[];
  value: number;
  onChange: (val: number) => void;
  ariaLabel: string;
}

function Wheel({ items, value, onChange, ariaLabel }: WheelProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isUserScrolling = React.useRef(false);
  const scrollTimeout = React.useRef<any>(null);

  const selectedIndex = Math.max(
    0,
    items.findIndex((it) => it.value === value)
  );

  // Scroll to active index
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || isUserScrolling.current) return;
    const targetTop = 36 * selectedIndex;
    if (Math.abs(el.scrollTop - targetTop) > 1) {
      el.scrollTop = targetTop;
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const index = Math.min(
        items.length - 1,
        Math.max(0, Math.round(el.scrollTop / 36))
      );
      const targetTop = 36 * index;
      el.scrollTo({ top: targetTop, behavior: 'smooth' });
      isUserScrolling.current = false;
      if (items[index] && items[index].value !== value) {
        onChange(items[index].value);
      }
    }, 120);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      tabIndex={0}
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuenow={value}
      className="h-[180px] flex-1 touch-pan-y snap-y snap-mandatory overflow-y-scroll overscroll-contain outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[#fc5200] [&::-webkit-scrollbar]:hidden"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* 2 items spacer top */}
      <div style={{ height: 72 }} aria-hidden="true" />
      {items.map((item, idx) => {
        const isSelected = idx === selectedIndex;
        return (
          <button
            key={item.value}
            type="button"
            tabIndex={-1}
            onClick={() => {
              onChange(item.value);
              const el = containerRef.current;
              if (el) el.scrollTo({ top: 36 * idx, behavior: 'smooth' });
            }}
            className={cn(
              'flex w-full snap-center items-center justify-center text-sm tabular-nums transition-colors duration-150',
              isSelected
                ? 'font-bold text-[#1d1d1f] scale-110'
                : 'text-[#8c8c85] hover:text-[#1d1d1f]'
            )}
            style={{ height: 36, scrollSnapAlign: 'center' }}
          >
            {item.label}
          </button>
        );
      })}
      {/* 2 items spacer bottom */}
      <div style={{ height: 72 }} aria-hidden="true" />
    </div>
  );
}

function WheelContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-2 flex items-center overflow-hidden rounded-2xl border border-[#e6e6e1] bg-[#fbfbf9]">
      {/* Center highlight bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 border-y border-[#ffd8c7] bg-[#fff2eb]/70"
        style={{ height: 36 }}
      />
      {/* Top gradient fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[72px] bg-gradient-to-b from-[#fbfbf9] to-transparent"
      />
      {/* Bottom gradient fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[72px] bg-gradient-to-t from-[#fbfbf9] to-transparent"
      />
      {children}
    </div>
  );
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [activeModal, setActiveModal] = React.useState<null | 'date' | 'heure'>(null);

  const { year, month, day, hour, minute } = React.useMemo(
    () => parseDateTime(value),
    [value]
  );

  // Formatted labels for the buttons
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return `${pad2(day)}/${pad2(month)}/${year}`;
    }
  }, [year, month, day]);

  const formattedTime = `${pad2(hour)}:${pad2(minute)}`;

  // Updates
  const updateDate = (newYear: number, newMonth: number, newDay: number) => {
    const maxDays = daysInMonth(newYear, newMonth);
    const clampedDay = Math.min(newDay, maxDays);
    const dateStr = `${newYear}-${pad2(newMonth)}-${pad2(clampedDay)}`;
    onChange(`${dateStr}T${pad2(hour)}:${pad2(minute)}`);
  };

  const updateTime = (newHour: number, newMinute: number) => {
    const dateStr = `${year}-${pad2(month)}-${pad2(day)}`;
    onChange(`${dateStr}T${pad2(newHour)}:${pad2(newMinute)}`);
  };

  // Wheel datasets
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i).map((y) => ({
    value: y,
    label: String(y),
  }));

  const months = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
    const monthName = new Date(2026, m - 1, 1).toLocaleDateString('fr-FR', {
      month: 'short',
    });
    return {
      value: m,
      label: `${pad2(m)} (${monthName})`,
    };
  });

  const numDays = daysInMonth(year, month);
  const days = Array.from({ length: numDays }, (_, i) => i + 1).map((d) => ({
    value: d,
    label: pad2(d),
  }));

  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: pad2(i),
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: pad2(i),
  }));

  // Quick preset actions for Time
  const setNow = () => {
    const now = new Date();
    updateTime(now.getHours(), now.getMinutes());
  };

  const setMorning = () => {
    updateTime(7, 30);
  };

  const addMinutes = (mins: number) => {
    const total = hour * 60 + minute + mins;
    const nextH = Math.floor((total / 60) % 24);
    const nextM = total % 60;
    updateTime(nextH, nextM);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {/* Date Button */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#666660]">Date</span>
          <button
            type="button"
            onClick={() => setActiveModal('date')}
            className="mt-1.5 flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-[#e6e6e1] bg-white px-3 text-xs font-medium text-[#1d1d1f] shadow-sm transition-all hover:bg-[#fff2eb] hover:border-[#ffd8c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] active:scale-[0.98]"
          >
            <span className="truncate capitalize">{formattedDate}</span>
            <CalendarDays className="size-3.5 shrink-0 text-[#fc5200]" />
          </button>
        </div>

        {/* Time Button */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#666660]">Heure</span>
          <button
            type="button"
            onClick={() => setActiveModal('heure')}
            className="mt-1.5 flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-[#e6e6e1] bg-white px-3 text-xs font-medium text-[#1d1d1f] shadow-sm transition-all hover:bg-[#fff2eb] hover:border-[#ffd8c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc5200] active:scale-[0.98]"
          >
            <span className="tabular-nums font-bold text-[#fc5200]">{formattedTime}</span>
            <Clock className="size-3.5 shrink-0 text-[#fc5200]" />
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm rounded-3xl border border-[#e6e6e1] bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#fff2eb] text-[#fc5200]">
                    {activeModal === 'heure' ? (
                      <Clock className="size-4" />
                    ) : (
                      <CalendarDays className="size-4" />
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#1d1d1f]">
                    {activeModal === 'heure' ? 'Régler l’heure de départ' : 'Régler la date de départ'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex size-7 items-center justify-center rounded-full text-[#666660] hover:bg-[#f3f3f0]"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Time Picker View */}
              {activeModal === 'heure' && (
                <div className="mt-4">
                  {/* Wheel */}
                  <WheelContainer>
                    <Wheel
                      items={hours}
                      value={hour}
                      onChange={(h) => updateTime(h, minute)}
                      ariaLabel="Heure"
                    />
                    <div className="flex items-center px-1 text-lg font-bold text-[#fc5200]">
                      :
                    </div>
                    <Wheel
                      items={minutes}
                      value={minute}
                      onChange={(m) => updateTime(hour, m)}
                      ariaLabel="Minute"
                    />
                  </WheelContainer>

                  {/* Quick Preset Buttons */}
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={setNow}
                      className="rounded-full bg-[#f4f4f1] px-3 py-1 text-[11px] font-medium text-[#1d1d1f] hover:bg-[#fff2eb] hover:text-[#fc5200] transition-colors"
                    >
                      Maintenant
                    </button>
                    <button
                      type="button"
                      onClick={setMorning}
                      className="rounded-full bg-[#f4f4f1] px-3 py-1 text-[11px] font-medium text-[#1d1d1f] hover:bg-[#fff2eb] hover:text-[#fc5200] transition-colors"
                    >
                      07:30
                    </button>
                    <button
                      type="button"
                      onClick={() => addMinutes(15)}
                      className="rounded-full bg-[#f4f4f1] px-3 py-1 text-[11px] font-medium text-[#1d1d1f] hover:bg-[#fff2eb] hover:text-[#fc5200] transition-colors"
                    >
                      +15 min
                    </button>
                    <button
                      type="button"
                      onClick={() => addMinutes(30)}
                      className="rounded-full bg-[#f4f4f1] px-3 py-1 text-[11px] font-medium text-[#1d1d1f] hover:bg-[#fff2eb] hover:text-[#fc5200] transition-colors"
                    >
                      +30 min
                    </button>
                  </div>
                </div>
              )}

              {/* Date Picker View */}
              {activeModal === 'date' && (
                <div className="mt-4">
                  <WheelContainer>
                    <Wheel
                      items={days}
                      value={day}
                      onChange={(d) => updateDate(year, month, d)}
                      ariaLabel="Jour"
                    />
                    <Wheel
                      items={months}
                      value={month}
                      onChange={(m) => updateDate(year, m, day)}
                      ariaLabel="Mois"
                    />
                    <Wheel
                      items={years}
                      value={year}
                      onChange={(y) => updateDate(y, month, day)}
                      ariaLabel="Année"
                    />
                  </WheelContainer>

                  {/* Today shortcut */}
                  <div className="mt-3 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        updateDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
                      }}
                      className="rounded-full bg-[#f4f4f1] px-3 py-1 text-[11px] font-medium text-[#1d1d1f] hover:bg-[#fff2eb] hover:text-[#fc5200] transition-colors"
                    >
                      Aujourd’hui
                    </button>
                  </div>
                </div>
              )}

              {/* Done button */}
              <div className="mt-5">
                <Button
                  size="lg"
                  className="w-full h-11 text-sm font-semibold"
                  onClick={() => setActiveModal(null)}
                >
                  Terminé
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
