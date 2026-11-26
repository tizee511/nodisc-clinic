import React from 'react';
import { Check } from 'lucide-react';

export interface WizardStepItem<T extends number = number> {
  step: T;
  label: string;
}

interface WizardStepperProps<T extends number> {
  steps: WizardStepItem<T>[];
  currentStep: T;
  maxReachedStep: T;
  isStepCompleted?: (step: T) => boolean;
  onStepClick: (step: T) => void;
  counterLabel: string;
}

export function WizardStepper<T extends number>({
  steps,
  currentStep,
  maxReachedStep,
  isStepCompleted,
  onStepClick,
  counterLabel,
}: WizardStepperProps<T>) {
  const currentIdx = Math.max(
    0,
    steps.findIndex((s) => s.step === currentStep)
  );
  const progressPct = steps.length > 1 ? (currentIdx / (steps.length - 1)) * 100 : 0;
  const activeLabel = steps.find((s) => s.step === currentStep)?.label || '';

  return (
    <div className="bg-slate-50/90 border-b border-slate-200 px-4 sm:px-8 py-5 space-y-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#0F4C5C] bg-[#0F4C5C]/10 px-2.5 py-1 rounded-md">
          {counterLabel}
        </span>
        <span className="text-xs font-semibold text-slate-600">{activeLabel}</span>
      </div>

      {/* Continuous Line Timeline Stepper (no boxes around steps) */}
      <div className="relative">
        {/* Track Line connecting centers of first and last step */}
        <div
          aria-hidden="true"
          className="absolute top-4 sm:top-[18px] start-[12.5%] end-[12.5%] h-[3px] bg-slate-200 rounded-full overflow-hidden"
        >
          <div
            className="absolute top-0 start-0 h-full rounded-full bg-gradient-to-r from-[#0F4C5C] via-[#0284C7] to-emerald-500 transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-1 sm:gap-2">
          {steps.map(({ step, label }) => {
            const isActive = currentStep === step;
            const isCompleted = isStepCompleted
              ? isStepCompleted(step)
              : step < currentStep;
            const canJump = step <= maxReachedStep || step < currentStep;

            return (
              <button
                key={step}
                type="button"
                disabled={!canJump}
                onClick={() => onStepClick(step)}
                aria-current={isActive ? 'step' : undefined}
                className={`group flex flex-col items-center text-center gap-2 bg-transparent border-0 p-0 focus-visible:outline-none ${
                  canJump ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full inline-flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ring-4 ring-slate-50 transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#0F4C5C] to-[#0284C7] text-white shadow-[0_4px_14px_-2px_rgba(2,132,199,0.55)] scale-110'
                      : isCompleted
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs group-hover:scale-105'
                      : 'bg-white border-2 border-slate-300 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step}
                </span>

                <span
                  className={`text-[11px] sm:text-xs font-bold leading-snug line-clamp-2 max-w-[90px] sm:max-w-none transition-colors ${
                    isActive
                      ? 'text-[#0F4C5C]'
                      : isCompleted
                      ? 'text-emerald-700 group-hover:text-emerald-800'
                      : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
