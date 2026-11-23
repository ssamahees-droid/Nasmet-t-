import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Wind } from 'lucide-react';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const PHASE_CONFIG: Record<
  Exclude<Phase, 'idle'>,
  { label: string; hint: string; seconds: number; next: Exclude<Phase, 'idle'> }
> = {
  inhale: {
    label: 'شهيق هادئ',
    hint: 'اسحب الهواء ببطء من أنفك',
    seconds: 4,
    next: 'hold',
  },
  hold: {
    label: 'ثبات لطيف',
    hint: 'احتفظ بالنَفَس برفق دون شدّ',
    seconds: 7,
    next: 'exhale',
  },
  exhale: {
    label: 'زفير طويل',
    hint: 'أخرج الهواء ببطء من فمك وأرخِ كتفيك',
    seconds: 8,
    next: 'inhale',
  },
};

export const BreathingModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isRunning || phase === 'idle') return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        const nextPhase = PHASE_CONFIG[phase].next;
        if (phase === 'exhale') {
          setCycles((c) => c + 1);
        }
        setPhase(nextPhase);
        return PHASE_CONFIG[nextPhase].seconds;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, phase]);

  if (!isOpen) return null;

  const handleToggle = () => {
    if (!isRunning) {
      if (phase === 'idle') {
        setPhase('inhale');
        setSecondsLeft(4);
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('idle');
    setSecondsLeft(4);
    setCycles(0);
  };

  const circleScaleClass =
    phase === 'inhale'
      ? 'scale-115 bg-[#7CC9B6]/35 border-[#0F4C5C]'
      : phase === 'hold'
      ? 'scale-115 bg-[#FFC857]/30 border-[#8B5E3C]'
      : phase === 'exhale'
      ? 'scale-90 bg-[#A8D8F0]/35 border-[#0F4C5C]'
      : 'scale-100 bg-[#FFF7E9] border-[#7CC9B6]';

  const currentInfo =
    phase === 'idle'
      ? { label: 'مستعد؟', hint: 'تمرين تنفس 4-7-8 لتهدئة الجهاز العصبي' }
      : PHASE_CONFIG[phase];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#093440]/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breathing-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFF7E9] border border-[#7CC9B6] rounded-2xl shadow-2xl p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق تمرين التنفس"
          className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white border border-[#7CC9B6]/60 text-[#0F4C5C] hover:bg-[#7CC9B6]/15 flex items-center justify-center transition cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F4C5C]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 text-xs font-sub text-[#2E7D32] mb-1">
          <Wind className="w-4 h-4" />
          <span>واحة الهدوء · تمرين 4-7-8</span>
        </div>

        <h2
          id="breathing-title"
          className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1"
        >
          خذ نفسًا عميقًا الآن
        </h2>
        <p className="text-xs text-[#2E2E2E]/75 mb-6">
          ثلاث دورات فقط كافية لإرسال إشارة أمان لعقلك وجسدك
        </p>

        {/* Breathing Circle */}
        <div className="h-52 flex items-center justify-center my-2">
          <div
            className={`w-40 h-40 rounded-full border-2 flex flex-col items-center justify-center transition-transform duration-1000 ease-out shadow-sm ${circleScaleClass}`}
          >
            <span className="font-heading text-3xl font-bold text-[#0F4C5C] tabular-nums">
              {phase === 'idle' ? '4·7·8' : secondsLeft}
            </span>
            <span className="font-heading text-sm font-bold text-[#0F4C5C] mt-1">
              {currentInfo.label}
            </span>
          </div>
        </div>

        <p className="text-sm font-sub text-[#2E2E2E] min-h-[24px] mb-5">
          {currentInfo.hint}
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-2 bg-[#0F4C5C] hover:bg-[#093440] text-white px-6 py-2.5 rounded-xl font-heading font-bold text-sm transition cursor-pointer whitespace-nowrap shrink-0"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'إيقاف مؤقت' : phase === 'idle' ? 'ابدأ التمرين' : 'استكمال'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 bg-white border border-[#7CC9B6] hover:bg-[#7CC9B6]/15 text-[#0F4C5C] px-4 py-2.5 rounded-xl font-heading font-bold text-sm transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-[#7CC9B6]/40 flex items-center justify-center gap-4 text-xs text-[#2E2E2E]/75 tabular-nums">
          <span>الدورات المكتملة: <strong className="text-[#0F4C5C]">{cycles}</strong></span>
          <span aria-hidden="true">·</span>
          <span>شهيق 4ث · حبس 7ث · زفير 8ث</span>
        </div>
      </div>
    </div>
  );
};
