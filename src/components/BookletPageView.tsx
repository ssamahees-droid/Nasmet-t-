import React, { useState } from 'react';
import {
  Heart,
  Wind,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  BatteryCharging,
  AlertTriangle,
  CheckSquare,
  Square,
  PenLine,
  BookMarked,
} from 'lucide-react';
import { BOOKLET_PAGES, TOC_ITEMS } from '../data/bookletPages';
import { ExerciseData, PageCategory, SleepDayEntry, SleepLogMap } from '../types/booklet';
import {
  BotanicalLeaves,
  BrushStrokeUnderline,
  NasmatLogoMark,
  SunHorizonIcon,
  WaveBreezeDivider,
} from './BrandMotifs';

export type RenderMode = 'interactive' | 'print';
export type FontScale = 'sm' | 'md' | 'lg';

interface PageViewProps {
  pageIndex: number;
  mode: RenderMode;
  fontScale?: FontScale;
  lineHeight?: string;
  exercises: ExerciseData;
  sleepLog: SleepLogMap;
  onInputChange: (key: string, value: string) => void;
  onSleepChange: (day: number, field: keyof SleepDayEntry, value: string) => void;
  onNavigate?: (pageIndex: number) => void;
  onOpenBreathing?: () => void;
  onImportPlan?: () => void;
  onOpenAnswers?: () => void;
}

const PrintableTextField = ({
  value,
  onChange,
  placeholder,
  multiline = false,
  lines = 3,
  mode,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  multiline?: boolean;
  lines?: number;
  mode: RenderMode;
}) => {
  if (mode === 'print') {
    const trimmed = value.trim();
    if (trimmed) {
      return (
        <div className="w-full bg-[#FCF9F2] border border-[#7CC9B6]/60 rounded-lg px-2.5 py-1.5 text-xs text-[#2E2E2E] whitespace-pre-wrap break-words leading-relaxed">
          {value}
        </div>
      );
    }

    const lineCount = multiline ? lines : 1;
    return (
      <div className="w-full space-y-2.5 py-1" aria-hidden="true">
        {Array.from({ length: lineCount }).map((_, idx) => (
          <div key={idx} className="w-full border-b border-dashed border-[#8B5E3C]/45 h-3.5" />
        ))}
      </div>
    );
  }

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={lines}
        className="w-full bg-white border border-[#7CC9B6] rounded-xl p-3 text-sm text-[#2E2E2E] placeholder:text-[#2E2E2E]/45 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#7CC9B6]/35 resize-y transition"
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white border border-[#7CC9B6] rounded-xl px-3 py-2 text-sm text-[#2E2E2E] placeholder:text-[#2E2E2E]/45 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#7CC9B6]/35 transition"
    />
  );
};

const PrintableRadioGroup = ({
  options,
  value,
  onChange,
  mode,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  mode: RenderMode;
}) => {
  if (mode === 'print') {
    return (
      <div className="flex flex-wrap gap-4 py-1 text-xs font-medium text-[#0F4C5C]">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <div key={opt} className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border ${
                  selected
                    ? 'border-[#0F4C5C] bg-[#0F4C5C]'
                    : 'border-[#0F4C5C]/60 bg-white'
                }`}
              >
                {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className={selected ? 'font-bold text-[#0F4C5C]' : 'text-[#2E2E2E]'}>
                {opt}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? '' : opt)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-heading font-semibold border transition cursor-pointer min-h-[40px] ${
              active
                ? 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-xs'
                : 'bg-white text-[#0F4C5C] border-[#7CC9B6]/80 hover:bg-[#7CC9B6]/15'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};

const CategoryDividerColor: Record<PageCategory, string> = {
  cover: '#FFC857',
  intro: '#0F4C5C',
  joyful: '#7CC9B6',
  emotional: '#5E4B8B',
  emergency: '#6D1B3B',
  closing: '#2E7D32',
};

const LINE_HEIGHT_CLASS_MAP: Record<string, string> = {
  '1.4': 'leading-[1.4] [&_p]:leading-[1.4] [&_li]:leading-[1.4] [&_textarea]:leading-[1.4] [&_.prose-box]:leading-[1.4]',
  '1.5': 'leading-[1.5] [&_p]:leading-[1.5] [&_li]:leading-[1.5] [&_textarea]:leading-[1.5] [&_.prose-box]:leading-[1.5]',
  '1.6': 'leading-[1.6] [&_p]:leading-[1.6] [&_li]:leading-[1.6] [&_textarea]:leading-[1.6] [&_.prose-box]:leading-[1.6]',
  '1.7': 'leading-[1.7] [&_p]:leading-[1.7] [&_li]:leading-[1.7] [&_textarea]:leading-[1.7] [&_.prose-box]:leading-[1.7]',
  '1.8': 'leading-[1.8] [&_p]:leading-[1.8] [&_li]:leading-[1.8] [&_textarea]:leading-[1.8] [&_.prose-box]:leading-[1.8]',
  '1.9': 'leading-[1.9] [&_p]:leading-[1.9] [&_li]:leading-[1.9] [&_textarea]:leading-[1.9] [&_.prose-box]:leading-[1.9]',
  '2.0': 'leading-[2.0] [&_p]:leading-[2.0] [&_li]:leading-[2.0] [&_textarea]:leading-[2.0] [&_.prose-box]:leading-[2.0]',
  '2.1': 'leading-[2.1] [&_p]:leading-[2.1] [&_li]:leading-[2.1] [&_textarea]:leading-[2.1] [&_.prose-box]:leading-[2.1]',
  '2.2': 'leading-[2.2] [&_p]:leading-[2.2] [&_li]:leading-[2.2] [&_textarea]:leading-[2.2] [&_.prose-box]:leading-[2.2]',
  '2.3': 'leading-[2.3] [&_p]:leading-[2.3] [&_li]:leading-[2.3] [&_textarea]:leading-[2.3] [&_.prose-box]:leading-[2.3]',
  '2.4': 'leading-[2.4] [&_p]:leading-[2.4] [&_li]:leading-[2.4] [&_textarea]:leading-[2.4] [&_.prose-box]:leading-[2.4]',
};

const PageShell = ({
  metaIndex,
  mode,
  fontScale = 'md',
  lineHeight = '1.8',
  children,
}: {
  metaIndex: number;
  mode: RenderMode;
  fontScale?: FontScale;
  lineHeight?: string;
  children: React.ReactNode;
}) => {
  const meta = BOOKLET_PAGES[metaIndex];
  const isEmergency = meta.category === 'emergency';
  const accentColor = CategoryDividerColor[meta.category];
  const interactiveLineHeightClass =
    LINE_HEIGHT_CLASS_MAP[lineHeight] || LINE_HEIGHT_CLASS_MAP['1.8'];

  const textSizeClass =
    mode === 'print'
      ? 'text-[12.5px] leading-relaxed'
      : fontScale === 'lg'
      ? `text-base sm:text-[17px] ${interactiveLineHeightClass}`
      : fontScale === 'sm'
      ? `text-xs sm:text-sm ${interactiveLineHeightClass}`
      : `text-sm sm:text-[15px] ${interactiveLineHeightClass}`;

  const containerClass =
    mode === 'print'
      ? `booklet-page w-[560px] min-h-[794px] bg-white px-7 py-6 flex flex-col justify-between border ${
          isEmergency ? 'border-[#6D1B3B]/40' : 'border-[#7CC9B6]/50'
        }`
      : `booklet-page w-full max-w-[680px] mx-auto bg-white p-6 sm:p-9 rounded-2xl border shadow-sm min-h-[540px] flex flex-col justify-between ${
          isEmergency ? 'border-[#6D1B3B]/40' : 'border-[#7CC9B6]/60'
        }`;

  return (
    <article className={`${containerClass} ${textSizeClass}`} id={`booklet-page-${meta.index}`}>
      <div>
        <header
          className={`flex items-center justify-between gap-4 pb-3 mb-5 border-b ${
            isEmergency ? 'border-[#6D1B3B]/25' : 'border-[#7CC9B6]/50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-heading font-semibold tracking-wide">
            <span style={{ color: accentColor }}>{meta.headerTitle}</span>
            {meta.pageNumber !== null && (
              <>
                <span className="text-[#2E2E2E]/35" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#2E2E2E]/70 tabular-nums">صفحة {meta.pageNumber}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-heading font-bold text-[#0F4C5C]">نسمة حياة</span>
            <NasmatLogoMark size="xs" />
          </div>
        </header>

        {children}
      </div>

      {meta.pageNumber !== null && (
        <footer className="mt-6 pt-3 border-t border-[#7CC9B6]/30 flex items-center justify-between text-[11px] text-[#2E2E2E]/65 font-sub tabular-nums">
          <span>مبادرة نسمة حياة · كتيب تفاعلي للتأمل والتعافي</span>
          <span className="font-heading font-bold text-[#0F4C5C]">
            صفحة {meta.pageNumber} من 18
          </span>
        </footer>
      )}
    </article>
  );
};

const MOOD_SUGGESTIONS: {
  id: string;
  label: string;
  targetPage: number;
  targetTitle: string;
  note: string;
}[] = [
  {
    id: 'مرهق ومستنزَف',
    label: 'مرهق ومستنزَف',
    targetPage: 10,
    targetTitle: 'أنت لست آلة: ميزانية الطاقة',
    note: 'التعب المستمر رسالة من جسدك ونفسك بأنك أعطيت أكثر مما شحنت. لنبدأ بفحص ميزانية طاقتك.',
  },
  {
    id: 'قلق وكثير التفكير',
    label: 'قلق وكثير التفكير',
    targetPage: 8,
    targetTitle: 'القلق وكثرة التفكير',
    note: 'دوران الأفكار يرهق العقل. سنرتّب معًا ما تستطيع التحكم فيه ونهدئ جهازك العصبي.',
  },
  {
    id: 'فاقد للشغف والمتعة',
    label: 'فاقد للشغف والمتعة',
    targetPage: 6,
    targetTitle: 'عندما تفقد الأشياء طعمها',
    note: 'أن تفقد الحماس لأشياء كنت تحبها ليس كسلًا؛ دعنا نلاحظ الإشارة بهدوء ودون قسوة على نفسك.',
  },
  {
    id: 'مثقل بإرضاء الآخرين',
    label: 'مثقل بإرضاء الآخرين',
    targetPage: 11,
    targetTitle: 'الحدود ليست قسوة',
    note: 'تعلم قول "لا" بلطف ووضوح يحمي قلبك وطاقتك قبل أن تنهار.',
  },
  {
    id: 'أقرأ للتوعية والاستكشاف',
    label: 'أقرأ للتوعية والاستكشاف',
    targetPage: 3,
    targetTitle: 'المقدمة: هل أنت بخير فعلاً؟',
    note: 'مرحبًا بك! اقرأ ودوّن تأملاتك على مهلك، فهذا الكتيب رفيق هادئ لحالتك.',
  },
];

const PAGE4_SYMPTOMS = [
  'عصبية أكثر من المعتاد',
  'فقدان الاستمتاع بالأشياء',
  'صعوبة في النوم أو نوم زائد',
  'تعب مستمر وصعوبة في التركيز',
  'رغبة في الابتعاد عن الناس',
  'ضغط دائم وكثرة تفكير',
  'تغيرات في الشهية وشعور بالفراغ',
];

const QUICK_EMOTIONS = ['غضب', 'حزن', 'خوف', 'ضغط', 'إحباط', 'تشتت'];

const BOUNDARY_PHRASES = [
  'أنا لا أستطيع القيام بهذا الآن، وأحتاج إلى مساحة للراحة.',
  'محتاج أفكر وأرد عليك لاحقًا.',
  'أقدّر ظروفك، لكن طاقتي اليوم لا تسمح بذلك.',
];

const SLEEP_DAYS = [
  'اليوم 1',
  'اليوم 2',
  'اليوم 3',
  'اليوم 4',
  'اليوم 5',
  'اليوم 6',
  'اليوم 7',
];

const PAGE13_REASONS = [
  { id: 'understand', label: 'لأفهم ما أشعر به بكلمات أوضح' },
  { id: 'compare', label: 'لأبحث عن تشخيص دقيق لحالتي بنفسي' },
  { id: 'reassure', label: 'لأعرف هل حان وقت زيارة مختص' },
];

const PAGE14_SIGNS = [
  { id: 'duration', label: 'الأعراض مستمرة منذ أسابيع وتؤثر في عملي أو دراستي.' },
  { id: 'relations', label: 'تأثرت علاقاتي أو أصبحت المهام المعتادة ثقيلة جدًا.' },
  { id: 'alone', label: 'محاولاتي وحدي لم تعد كافية وأحتاج لمختص يفهمني.' },
];

export const BookletPageView: React.FC<PageViewProps> = ({
  pageIndex,
  mode,
  fontScale = 'md',
  lineHeight = '1.8',
  exercises,
  sleepLog,
  onInputChange,
  onSleepChange,
  onNavigate,
  onOpenBreathing,
  onImportPlan,
  onOpenAnswers,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const hasProgressOnPage = (idx: number): boolean => {
    switch (idx) {
      case 0:
        return Boolean(exercises.owner_name?.trim());
      case 1:
        return Boolean(exercises.mood_now || exercises.page1_note?.trim());
      case 3:
        return Boolean(exercises.page3_feeling || exercises.page3_resonance?.trim());
      case 4:
        return Boolean(exercises.page4_q1?.trim() || exercises.page4_symptoms);
      case 5:
        return Boolean(
          exercises.page5_stress1?.trim() ||
            exercises.page5_stress2?.trim() ||
            exercises.page5_stress3?.trim()
        );
      case 6:
        return Boolean(
          exercises.page6_enjoy || exercises.page6_affect || exercises.page6_missed_joy?.trim()
        );
      case 7:
        return Boolean(exercises.page7_what?.trim() || exercises.page7_emotion);
      case 8:
        return Boolean(exercises.page8_prob?.trim() || exercises.page8_canDo);
      case 9:
        return Object.keys(sleepLog).length > 0 || Boolean(exercises.page9_sleep_notes?.trim());
      case 10:
        return Boolean(exercises.page10_drain?.trim() || exercises.page10_restore?.trim());
      case 11:
        return Boolean(exercises.page11_my_boundary?.trim() || exercises.page11_boundary_who);
      case 12:
        return Boolean(exercises.page12_hurt?.trim() || exercises.page12_limit?.trim());
      case 13:
        return Boolean(exercises.page13_reasons || exercises.page13_question_for_pro?.trim());
      case 14:
        return Boolean(exercises.page14_signs);
      case 15:
        return Boolean(exercises.page15_choice || exercises.page15_questions?.trim());
      case 16:
        return Boolean(exercises.page16_safe_contact?.trim() || exercises.page16_nearest_er?.trim());
      case 17:
        return Boolean(exercises.plan_decline?.trim() || exercises.plan_step?.trim());
      case 18:
        return Boolean(exercises.page18_promise?.trim());
      default:
        return false;
    }
  };

  const toggleCommaItem = (key: string, id: string) => {
    const current = (exercises[key] || '').split(',').filter(Boolean);
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    onInputChange(key, next.join(','));
  };

  const handleCopyPhrase = async (phrase: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(phrase);
      setCopiedIdx(idx);
      window.setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  // ---------------- PAGE 0: INTERACTIVE COVER ----------------
  if (pageIndex === 0) {
    const coverShellClass =
      mode === 'print'
        ? 'booklet-page w-[560px] min-h-[794px] bg-gradient-to-br from-[#0F4C5C] to-[#093440] text-white p-8 flex flex-col justify-between text-center relative'
        : 'booklet-page w-full max-w-[680px] mx-auto bg-gradient-to-br from-[#0F4C5C] to-[#093440] text-white p-6 sm:p-10 rounded-2xl shadow-lg min-h-[560px] flex flex-col justify-between text-center relative';

    return (
      <article className={coverShellClass} id="booklet-page-0">
        <div className="border border-white/20 rounded-xl p-5 sm:p-8 flex-1 flex flex-col justify-between items-center">
          <div className="space-y-2">
            <p className="text-[#FFC857] font-heading font-semibold text-xs sm:text-sm tracking-wide">
              "كثيرون يعيشون الحياة... وقليلون يستمتعون بها"
            </p>
            <div className="flex justify-center">
              <WaveBreezeDivider color="#7CC9B6" className="opacity-80" />
            </div>
          </div>

          <div className="flex flex-col items-center my-4 w-full max-w-md">
            <NasmatLogoMark size="lg" className="mb-4 shadow-md" />

            <div className="text-[#7CC9B6] font-heading font-semibold text-base sm:text-lg mb-1">
              مبادرة
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight text-white mb-2">
              « نسمة حياة »
            </h2>
            <BrushStrokeUnderline color="#FF8A65" className="mb-3" />

            <p className="text-sm sm:text-base text-[#FFF7E9] leading-relaxed font-sub">
              نحو مجتمع يهتم بالصحة النفسية كما يهتم بالصحة الجسدية
            </p>
            <p className="text-[#FFC857] font-heading font-bold text-sm sm:text-base mt-1.5">
              "لأن مش كل وجع بيبان"
            </p>

            {/* Interactive Personalization Right on Cover */}
            <div className="w-full mt-5 bg-white/10 border border-white/25 rounded-xl p-3.5 text-right">
              <label
                htmlFor="cover-owner-name"
                className="block text-xs font-heading font-semibold text-[#FFC857] mb-1.5"
              >
                {mode === 'print'
                  ? 'هذا الكتيب مساحتك الخاصة:'
                  : 'هذا الكتيب مساحتك التفاعلية الخاصة — اكتب اسمك أو لقبًا تحبه:'}
              </label>
              {mode === 'print' ? (
                <div className="text-sm font-heading font-bold text-white border-b border-dashed border-white/50 pb-1">
                  {exercises.owner_name?.trim() || '...........................................'}
                </div>
              ) : (
                <input
                  id="cover-owner-name"
                  type="text"
                  value={exercises.owner_name || ''}
                  onChange={(e) => onInputChange('owner_name', e.target.value)}
                  placeholder="اكتب اسمك هنا لتبدأ نسختك التفاعلية..."
                  className="w-full bg-white text-[#2E2E2E] placeholder:text-[#2E2E2E]/45 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#FFC857]"
                />
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            {mode === 'interactive' && onNavigate && (
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate(1)}
                  className="inline-flex items-center gap-2 bg-[#FF8A65] hover:bg-[#e57753] text-white px-6 py-3 rounded-xl font-heading font-bold text-sm transition shadow-md cursor-pointer"
                >
                  <PenLine className="w-4 h-4" />
                  <span>
                    {exercises.owner_name?.trim()
                      ? `ابدأ التفاعل يا ${exercises.owner_name.trim()}`
                      : 'ابدأ الكتابة والتصفح'}
                  </span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(2)}
                  className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-4 py-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  <span>تصفح الفهرس</span>
                </button>
              </div>
            )}
            <p className="text-xs text-[#FFF7E9]/75 font-sub">
              كتيب إلكتروني تفاعلي للكتابة والتأمل · تُحفظ إجاباتك تلقائيًا في جهازك
            </p>
          </div>
        </div>
      </article>
    );
  }

  // ---------------- PAGE 1: WELCOME + MOOD CHECK-IN + FREE NOTE ----------------
  if (pageIndex === 1) {
    const selectedMood = MOOD_SUGGESTIONS.find((m) => m.id === exercises.mood_now);

    return (
      <PageShell metaIndex={1} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <div className="text-center pt-1">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BotanicalLeaves color="#2E7D32" />
            <Heart className="w-6 h-6 fill-[#FF8A65] text-[#FF8A65]" />
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0F4C5C] mb-1">
            {exercises.owner_name?.trim()
              ? `أهلاً بك يا ${exercises.owner_name.trim()} في مساحتك الآمنة`
              : 'أهلاً بك في مساحتك الآمنة'}
          </h2>
          <div className="flex justify-center mb-4">
            <BrushStrokeUnderline color="#7CC9B6" />
          </div>

          <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-4 sm:p-5 mb-5">
            <p className="text-lg sm:text-xl font-heading font-bold text-[#0F4C5C] leading-relaxed">
              "أنت لست وحدك، وهذا الكتيب مساحتك الخاصة للبدء من جديد."
            </p>
          </div>
        </div>

        {/* Interactive Mood Check-In */}
        <div className="bg-[#FCF9F2] border border-[#7CC9B6]/60 rounded-xl p-4 space-y-4 text-right">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F4C5C]">
              1. اختر ما يصف حال قلبك الآن:
            </h3>
            {mode === 'interactive' && onOpenBreathing && (
              <button
                type="button"
                onClick={onOpenBreathing}
                className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#2E7D32] hover:text-[#0F4C5C] underline-offset-4 hover:underline cursor-pointer shrink-0"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>تمرين تنفس هادئ</span>
              </button>
            )}
          </div>

          <PrintableRadioGroup
            mode={mode}
            options={MOOD_SUGGESTIONS.map((m) => m.label)}
            value={exercises.mood_now || ''}
            onChange={(val) => onInputChange('mood_now', val)}
          />

          {mode === 'interactive' && selectedMood && (
            <div className="bg-white border border-[#7CC9B6] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-[#2E2E2E] prose-box">
                {selectedMood.note}
              </p>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate(selectedMood.targetPage)}
                  className="inline-flex items-center gap-1.5 bg-[#FF8A65] hover:bg-[#e57753] text-white px-3.5 py-2 rounded-lg text-xs font-heading font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>ابدأ بـ: {selectedMood.targetTitle}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div>
            <label className="font-heading font-bold text-xs sm:text-sm text-[#0F4C5C] block mb-1.5">
              2. كلمة قصيرة تود قولها لنفسك وأنت تفتح هذا الكتيب:
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page1_note || ''}
              onChange={(val) => onInputChange('page1_note', val)}
              placeholder="مثال: سأكون لطيفًا مع نفسي اليوم..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 2: INTERACTIVE TOC ----------------
  if (pageIndex === 2) {
    return (
      <PageShell metaIndex={2} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h2 className="font-heading text-2xl font-bold text-[#0F4C5C]">
            دليل مبسط للصحة النفسية
          </h2>
          {mode === 'interactive' && onOpenAnswers && (
            <button
              type="button"
              onClick={onOpenAnswers}
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#0F4C5C] bg-[#FFF7E9] border border-[#7CC9B6] hover:bg-[#7CC9B6]/15 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>عرض دفتر إجاباتي</span>
            </button>
          )}
        </div>
        <BrushStrokeUnderline color="#FF8A65" className="mb-4" />

        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-3.5 mb-4 text-xs sm:text-sm prose-box">
          <strong className="text-[#0F4C5C]">فكرة الكتيب:</strong> مساحة تفاعلية للكتابة والاختيار وفهم ما تمر به خطوة بخطوة، مع حفظ تلقائي لإجاباتك.
        </div>

        <h3 className="font-heading text-sm sm:text-base font-bold text-[#2E7D32] mb-2">
          محتويات الكتيب {mode === 'interactive' ? '(اضغط على أي عنوان للتفاعل معه)' : ''}
        </h3>

        <div className={mode === 'print' ? 'space-y-0.5 text-[11px]' : 'space-y-1 text-xs sm:text-sm'}>
          {TOC_ITEMS.map((item, idx) => {
            const done = hasProgressOnPage(item.index);
            const rowContent = (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#0F4C5C]/10 text-[#0F4C5C] font-heading font-bold text-[11px] tabular-nums shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[#2E2E2E] font-medium truncate">
                    {item.tocTitle}
                  </span>
                  {mode === 'interactive' && done && (
                    <span
                      className="text-[#2E7D32] text-xs font-bold shrink-0"
                      title="تمت الإجابة في هذه الصفحة"
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[#FF8A65] font-heading font-bold text-xs shrink-0 tabular-nums mr-2">
                  صفحة {item.pageNumber}
                </span>
              </>
            );

            if (mode === 'interactive' && onNavigate) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.index)}
                  className="w-full flex items-center justify-between border-b border-dotted border-[#7CC9B6]/70 py-1.5 px-2 rounded-lg hover:bg-[#FFF7E9] transition text-right cursor-pointer"
                >
                  {rowContent}
                </button>
              );
            }

            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-dotted border-[#7CC9B6]/60 py-1 px-1"
              >
                {rowContent}
              </div>
            );
          })}
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 3: INTRO (NOW INTERACTIVE!) ----------------
  if (pageIndex === 3) {
    return (
      <PageShell metaIndex={3} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          هل أنت بخير فعلاً؟
        </h2>
        <BrushStrokeUnderline color="#FF8A65" className="mb-4" />

        <p className="mb-3">
          قد تكون حياتك تبدو جيدة من الخارج. تعمل، وتدرس، وتتزوج، وتربي أبناءك، وتنجح في عملك، وتضحك مع من حولك...
        </p>
        <p className="mb-3">
          ومع ذلك، قد تستيقظ يومًا وتشعر أنك متعب من الداخل. لا تعرف لماذا. لا يوجد حدث كبير يبرر حزنك، ولا مشكلة واضحة تستطيع أن تشير إليها وتقول: <strong>"هذا هو السبب"</strong>.
        </p>
        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-3.5 my-3 prose-box">
          ومع ذلك... تشعر بالضيق. تفقد رغبتك في الأشياء التي كنت تحبها. تكثر أفكارك. تقل طاقتك. تصبح أبسط الأمور ثقيلة عليك.
        </div>
        <p className="mb-4">
          هذا الألم حقيقي، حتى لو لم يستطع أحد رؤيته. هذا الكتيب ليس للتشخيص؛ هو دعوة لأن تتوقف قليلاً وتكتب وتسمع نفسك بصدق.
        </p>

        {/* Interactive Reflection on Intro */}
        <div className="bg-[#FCF9F2] border border-[#FF8A65]/50 rounded-xl p-4 space-y-3">
          <div className="font-heading font-bold text-xs sm:text-sm text-[#0F4C5C]">
            تفاعل سريع: هل تمر أحيانًا بشعور أنك تبدو بخير من الخارج، لكنك متعب من الداخل؟
          </div>
          <PrintableRadioGroup
            mode={mode}
            options={['نعم، كثيرًا', 'أحيانًا', 'نادرًا']}
            value={exercises.page3_feeling || ''}
            onChange={(val) => onInputChange('page3_feeling', val)}
          />
          {mode === 'interactive' && exercises.page3_feeling && (
            <p className="text-xs text-[#2E7D32] font-semibold">
              شكرًا لصدقك مع نفسك؛ الاعتراف بما نشعر به هو الخطوة الأولى للراحة.
            </p>
          )}
          <div>
            <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
              جملة لمستني هنا أو شعور أود تسجيله في البداية:
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page3_resonance || ''}
              onChange={(val) => onInputChange('page3_resonance', val)}
              placeholder="اكتب ما خطر في بالك أثناء قراءة المقدمة..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 4: TIRED SOUL (CLICKABLE SYMPTOM PICKER + TEXT) ----------------
  if (pageIndex === 4) {
    const selectedSymptoms = (exercises.page4_symptoms || '').split(',').filter(Boolean);

    return (
      <PageShell metaIndex={4} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          نفسي تعبانة... بس مالي؟
        </h2>
        <BrushStrokeUnderline color="#5E4B8B" className="mb-4" />

        <p className="mb-2.5">
          أحيانًا لا يبدأ التعب النفسي في صورة واضحة. لا يأتي ومعه ورقة تقول: <em>"أنا قلق"</em> أو <em>"أنا منهك"</em>.
        </p>
        <p className="text-xs font-heading font-bold text-[#0F4C5C] mb-2">
          {mode === 'interactive'
            ? 'حدّد العلامات التي لاحظتها على نفسك مؤخرًا:'
            : 'قد يظهر التعب النفسي في صورة:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {PAGE4_SYMPTOMS.map((sym) => {
            const checked = selectedSymptoms.includes(sym);
            if (mode === 'print') {
              return (
                <div key={sym} className="flex items-center gap-2 text-xs py-0.5">
                  <span
                    className={`inline-block w-3.5 h-3.5 rounded border shrink-0 ${
                      checked ? 'bg-[#0F4C5C] border-[#0F4C5C]' : 'border-[#0F4C5C]/60 bg-white'
                    }`}
                  />
                  <span>{sym}</span>
                </div>
              );
            }
            return (
              <button
                key={sym}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleCommaItem('page4_symptoms', sym)}
                className={`flex items-center gap-2 text-right px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${
                  checked
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                    : 'bg-[#FCF9F2] text-[#2E2E2E] border-[#7CC9B6]/60 hover:bg-[#FFF7E9]'
                }`}
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#7CC9B6] shrink-0" />
                )}
                <span>{sym}</span>
              </button>
            );
          })}
        </div>

        <p className="mb-3 text-xs sm:text-sm">
          وجود عرض واحد لا يعني بالضرورة اضطرابًا نفسيًا؛ المهم هو شدة الأعراض واستمرارها وتأثيرها في حياتك.
        </p>

        <div className="bg-[#FFF7E9] border border-[#FF8A65]/50 rounded-xl p-4">
          <div className="font-heading font-bold text-[#0F4C5C] mb-1">
            مساحة كتابة — توقف واسأل نفسك:
          </div>
          <label className="block text-xs font-semibold text-[#8B5E3C] mb-2">
            ما الشيء الذي تغير فيَّ مؤخرًا ولم أنتبه إليه؟
          </label>
          <PrintableTextField
            multiline
            lines={3}
            mode={mode}
            value={exercises.page4_q1 || ''}
            onChange={(val) => onInputChange('page4_q1', val)}
            placeholder="اكتب هنا تأملك الشخصي بحرية..."
          />
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 5: STRESS ----------------
  if (pageIndex === 5) {
    const items = [
      { key: 'page5_stress1', actionKey: 'page5_stress1_action', num: 1, ph: 'الشيء المستنزف الأول...' },
      { key: 'page5_stress2', actionKey: 'page5_stress2_action', num: 2, ph: 'الشيء المستنزف الثاني...' },
      { key: 'page5_stress3', actionKey: 'page5_stress3_action', num: 3, ph: 'الشيء المستنزف الثالث...' },
    ];
    const actionOptions = ['أستطيع تغييره', 'أستطيع تقليله', 'أحتاج مساعدة'];

    return (
      <PageShell metaIndex={5} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          الضغط النفسي: الطبيعي مقابل المستمر
        </h2>
        <BrushStrokeUnderline color="#8B5E3C" className="mb-4" />

        <p className="mb-3">
          كلنا نتعرض للضغط... لكن لسنا جميعًا نتأثر بالطريقة نفسها. الضغط النفسي قد يكون استجابة طبيعية لمواقف صعبة، لكن المشكلة تبدأ عندما يصبح مستمرًا أو شديدًا لدرجة تؤثر في حياتنا اليومية.
        </p>
        <p className="mb-4">
          لا تسأل نفسك فقط: <em>"إيه اللي مضايقني؟"</em>، اسأل أيضًا: <strong>"إيه اللي بيستنزفني باستمرار؟"</strong>
        </p>

        <div className="bg-[#FFF7E9] border border-[#FF8A65]/50 rounded-xl p-4 space-y-3">
          <div className="font-heading font-bold text-[#0F4C5C]">
            اكتب أكثر ثلاثة أشياء تستنزفك حاليًا ثم اختر ما يناسبها:
          </div>

          {items.map((item) => (
            <div key={item.key} className="bg-white/90 border border-[#7CC9B6]/50 rounded-lg p-2.5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xs text-[#0F4C5C] tabular-nums">
                  {item.num}.
                </span>
                <div className="flex-1">
                  <PrintableTextField
                    mode={mode}
                    value={exercises[item.key] || ''}
                    onChange={(val) => onInputChange(item.key, val)}
                    placeholder={item.ph}
                  />
                </div>
              </div>
              <PrintableRadioGroup
                mode={mode}
                options={actionOptions}
                value={exercises[item.actionKey] || ''}
                onChange={(val) => onInputChange(item.actionKey, val)}
              />
            </div>
          ))}
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 6: LOSING JOY ----------------
  if (pageIndex === 6) {
    const needsAttention =
      exercises.page6_enjoy === 'لا' || exercises.page6_affect === 'نعم';

    return (
      <PageShell metaIndex={6} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          عندما تفقد الأشياء طعمها
        </h2>
        <BrushStrokeUnderline color="#5E4B8B" className="mb-4" />

        <p className="mb-3">
          من العلامات التي تستحق الانتباه أن يبدأ الإنسان في فقدان الاهتمام أو المتعة بأشياء كان يستمتع بها سابقًا. قد يقول: <em>"مش فارق معايا"</em>، <em>"حتى الحاجات اللي كنت بحبها مبقتش تفرق"</em>.
        </p>
        <p className="mb-4">
          هذا ليس مجرد "كسل". فقدان المتعة المستمر قد يكون أحد أعراض الاكتئاب، لكن المعلومة تساعدك على الانتباه، وليست بديلاً عن التقييم المتخصص.
        </p>

        <div className="bg-[#FFF7E9] border border-[#FF8A65]/50 rounded-xl p-4 space-y-3.5">
          <div className="font-heading font-bold text-[#0F4C5C]">اختر إجابتك ودوّن تأملك:</div>

          <div>
            <p className="text-xs sm:text-sm font-semibold mb-2 text-[#2E2E2E]">
              هل ما زلت أستمتع بالأشياء التي كنت أستمتع بها؟
            </p>
            <PrintableRadioGroup
              mode={mode}
              options={['نعم', 'أحيانًا', 'لا']}
              value={exercises.page6_enjoy || ''}
              onChange={(val) => onInputChange('page6_enjoy', val)}
            />
          </div>

          <div>
            <p className="text-xs sm:text-sm font-semibold mb-2 text-[#2E2E2E]">
              هل هذا التغير مستمر ويؤثر في حياتي؟
            </p>
            <PrintableRadioGroup
              mode={mode}
              options={['نعم', 'لا']}
              value={exercises.page6_affect || ''}
              onChange={(val) => onInputChange('page6_affect', val)}
            />
          </div>

          {mode === 'interactive' && (exercises.page6_enjoy || exercises.page6_affect) && (
            <div
              className={`rounded-xl p-3 border text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                needsAttention
                  ? 'bg-[#6D1B3B]/8 border-[#6D1B3B]/35 text-[#6D1B3B]'
                  : 'bg-[#7CC9B6]/15 border-[#7CC9B6] text-[#0F4C5C]'
              }`}
            >
              <span>
                {needsAttention
                  ? 'إجابتك تشير إلى إشارة مهمة تستحق ألا تتجاهلها؛ لست مضطرًا لحمل هذا الثقل وحدك.'
                  : 'من الرائع ملاحظة حالتك بوعي؛ الاستمرار في تفقد نفسك يحميك مبكرًا.'}
              </span>
              {needsAttention && onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate(14)}
                  className="bg-[#6D1B3B] text-white px-3 py-1.5 rounded-lg text-xs font-heading font-bold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  متى أستعين بمختص؟
                </button>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
              شيء واحد كنت أستمتع به وأتمنى استعادة طعمه:
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page6_missed_joy || ''}
              onChange={(val) => onInputChange('page6_missed_joy', val)}
              placeholder="مثال: القراءة، الجلوس في الهدوء، لقاء صديق..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 7: FEELINGS ARE NOT YOUR ENEMY ----------------
  if (pageIndex === 7) {
    return (
      <PageShell metaIndex={7} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          مشاعرك ليست عدوك
        </h2>
        <BrushStrokeUnderline color="#7CC9B6" className="mb-4" />

        <p className="mb-3">
          الغضب ليس دائمًا مشكلة. والحزن ليس ضعفًا. والخوف ليس جبنًا. المشاعر تخبرنا بشيء، لكن الشعور لا يجب أن يكون هو الذي يتخذ القرار بدلاً منا.
        </p>

        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-3.5 mb-4 text-xs sm:text-sm prose-box">
          <strong>بدل:</strong> "أنا غضبان، إذن لازم أهاجم". ← <strong>جرّب:</strong> ماذا حدث؟ ماذا أشعر؟ ماذا أحتاج؟ ما التصرف الأفضل الآن؟
        </div>

        <div className="bg-[#FCF9F2] border border-[#FF8A65]/50 rounded-xl p-4 space-y-2.5">
          <div className="font-heading font-bold text-[#0F4C5C] text-sm">
            تمرين «سمِّ شعورك» — اختر شعورًا غلب عليك واكتب الموقف:
          </div>

          {mode === 'interactive' && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              {QUICK_EMOTIONS.map((emo) => {
                const active = exercises.page7_emotion === emo;
                return (
                  <button
                    key={emo}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      onInputChange('page7_emotion', active ? '' : emo);
                      if (!active && !exercises.page7_felt) {
                        onInputChange('page7_felt', emo);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-heading font-semibold border cursor-pointer transition ${
                      active
                        ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                        : 'bg-white text-[#0F4C5C] border-[#7CC9B6] hover:bg-[#7CC9B6]/15'
                    }`}
                  >
                    {emo}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="font-bold text-[#0F4C5C] block mb-1">ماذا حدث؟</span>
              <PrintableTextField
                mode={mode}
                value={exercises.page7_what || ''}
                onChange={(val) => onInputChange('page7_what', val)}
                placeholder="الموقف باختصار..."
              />
            </div>
            <div>
              <span className="font-bold text-[#0F4C5C] block mb-1">ماذا شعرت؟</span>
              <PrintableTextField
                mode={mode}
                value={exercises.page7_felt || ''}
                onChange={(val) => onInputChange('page7_felt', val)}
                placeholder="اسم الشعور..."
              />
            </div>
            <div>
              <span className="font-bold text-[#0F4C5C] block mb-1">ماذا كنت تحتاج وقتها؟</span>
              <PrintableTextField
                mode={mode}
                value={exercises.page7_need || ''}
                onChange={(val) => onInputChange('page7_need', val)}
                placeholder="احتواء، حدود، راحة..."
              />
            </div>
            <div>
              <span className="font-bold text-[#0F4C5C] block mb-1">كيف تصرفت؟</span>
              <PrintableTextField
                mode={mode}
                value={exercises.page7_acted || ''}
                onChange={(val) => onInputChange('page7_acted', val)}
                placeholder="رد فعلك..."
              />
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 8: OVERTHINKING & ANXIETY ----------------
  if (pageIndex === 8) {
    const canDo = exercises.page8_canDo;

    return (
      <PageShell metaIndex={8} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
              القلق وكثرة التفكير: لما دماغك ما تسكتش
            </h2>
            <BrushStrokeUnderline color="#5E4B8B" className="mb-3" />
          </div>
          {mode === 'interactive' && onOpenBreathing && (
            <button
              type="button"
              onClick={onOpenBreathing}
              className="inline-flex items-center gap-1.5 bg-[#7CC9B6]/20 hover:bg-[#7CC9B6]/35 text-[#0F4C5C] px-3 py-2 rounded-xl text-xs font-heading font-bold shrink-0 cursor-pointer"
            >
              <Wind className="w-4 h-4" />
              <span>هدّئ عقلك الآن</span>
            </button>
          )}
        </div>

        <p className="mb-2.5">
          هل حدث أن تضع رأسك على الوسادة، ثم يبدأ عقلك في تشغيل كل شيء من جديد؟ التفكير المستمر دون الوصول إلى حل يتحول إلى دائرة تستنزفنا.
        </p>

        <div className="bg-[#FFF7E9] border border-[#FF8A65]/50 rounded-xl p-4 space-y-3 text-xs">
          <div className="font-heading font-bold text-[#0F4C5C] text-sm">
            جرّب هذا التمرين عندما تدور الفكرة في رأسك:
          </div>

          <div>
            <span className="font-bold text-[#0F4C5C] block mb-1">ما المشكلة التي تشغلك الآن؟</span>
            <PrintableTextField
              mode={mode}
              value={exercises.page8_prob || ''}
              onChange={(val) => onInputChange('page8_prob', val)}
              placeholder="اكتب الفكرة المقلقة هنا..."
            />
          </div>

          <div>
            <span className="font-bold text-[#0F4C5C] block mb-1.5">
              هل أستطيع فعل شيء حيالها الآن؟
            </span>
            <PrintableRadioGroup
              mode={mode}
              options={['نعم', 'لا']}
              value={canDo || ''}
              onChange={(val) => onInputChange('page8_canDo', val)}
            />
          </div>

          {(mode === 'print' || canDo === 'نعم' || !canDo) && (
            <div className={canDo === 'نعم' ? 'p-2.5 rounded-lg bg-[#7CC9B6]/15 border border-[#7CC9B6]' : ''}>
              <span className="font-bold text-[#0F4C5C] block mb-1">
                إذا كانت نعم: ما الخطوة الصغيرة التي أستطيع القيام بها؟
              </span>
              <PrintableTextField
                mode={mode}
                value={exercises.page8_step || ''}
                onChange={(val) => onInputChange('page8_step', val)}
                placeholder="خطوة عملية بسيطة اليوم..."
              />
            </div>
          )}

          {(mode === 'print' || canDo === 'لا' || !canDo) && (
            <div className={canDo === 'لا' ? 'p-2.5 rounded-lg bg-[#A8D8F0]/20 border border-[#0F4C5C]/30' : ''}>
              <span className="font-bold text-[#0F4C5C] block mb-1">
                إذا كانت لا: ما الذي أستطيع التحكم فيه بدلاً منها الآن؟
              </span>
              <PrintableTextField
                mode={mode}
                value={exercises.page8_control || ''}
                onChange={(val) => onInputChange('page8_control', val)}
                placeholder="مثل: تنفس، ترك الهاتف، النوم، الدعاء..."
              />
            </div>
          )}
        </div>

        <p className="text-xs text-[#2E7D32] font-semibold mt-3">
          الفكرة ليست أن تمنع عقلك من التفكير، وإنما أن تتعلم متى يتحول التفكير إلى استنزافك.
        </p>
      </PageShell>
    );
  }

  // ---------------- PAGE 9: 7-DAY INTERACTIVE SLEEP TRACKER ----------------
  if (pageIndex === 9) {
    const trackedCount = Object.values(sleepLog).filter(
      (d) => d.quality || d.phoneBeforeBed || d.stress
    ).length;
    const phoneAndBadSleep = Object.values(sleepLog).filter(
      (d) => d.phoneBeforeBed === 'نعم' && (d.quality === 'متقطع' || d.quality === 'صعب')
    ).length;

    return (
      <PageShell metaIndex={9} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          عندما يصبح النوم مشكلة
        </h2>
        <BrushStrokeUnderline color="#7CC9B6" className="mb-3" />

        <p className="mb-3">
          النوم ليس مجرد وقت يتوقف فيه الجسم عن العمل؛ إنه جزء أساسي من صحتنا النفسية والجسدية. اضطرابه المستمر يزيد صعوبة التعامل مع الضغوط والمشاعر.
        </p>

        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-3.5 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading font-bold text-xs sm:text-sm text-[#0F4C5C]">
              متابع النوم التفاعلي (اضغط للاختيار يوميًا)
            </span>
            {mode === 'interactive' && (
              <span className="text-[11px] font-sub text-[#2E7D32] tabular-nums">
                تم تسجيل {trackedCount} من 7 أيام
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-[11px] sm:text-xs">
              <thead>
                <tr className="border-b border-[#7CC9B6] text-[#0F4C5C] font-heading">
                  <th className="py-1.5 px-1.5">اليوم</th>
                  <th className="py-1.5 px-1.5">جودة النوم</th>
                  <th className="py-1.5 px-1.5">هاتف قبل النوم</th>
                  <th className="py-1.5 px-1.5">التوتر اليومي</th>
                </tr>
              </thead>
              <tbody>
                {SLEEP_DAYS.map((dayLabel, dIdx) => {
                  const entry = sleepLog[dIdx] || {
                    quality: '',
                    phoneBeforeBed: '',
                    stress: '',
                  };
                  return (
                    <tr key={dayLabel} className="border-b border-[#7CC9B6]/35">
                      <td className="py-1.5 px-1.5 font-heading font-bold text-[#0F4C5C] whitespace-nowrap">
                        {dayLabel}
                      </td>
                      <td className="py-1 px-1">
                        {mode === 'print' ? (
                          <span className="text-[#2E2E2E]/85">
                            {entry.quality || 'مريح / متقطع / صعب'}
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            {(['مريح', 'متقطع', 'صعب'] as const).map((q) => (
                              <button
                                key={q}
                                type="button"
                                onClick={() =>
                                  onSleepChange(dIdx, 'quality', entry.quality === q ? '' : q)
                                }
                                className={`px-2 py-1 rounded text-[11px] border cursor-pointer ${
                                  entry.quality === q
                                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                                    : 'bg-white text-[#2E2E2E] border-[#7CC9B6]/60'
                                }`}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-1 px-1">
                        {mode === 'print' ? (
                          <span className="text-[#2E2E2E]/85">
                            {entry.phoneBeforeBed || 'نعم / لا'}
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            {(['نعم', 'لا'] as const).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() =>
                                  onSleepChange(
                                    dIdx,
                                    'phoneBeforeBed',
                                    entry.phoneBeforeBed === p ? '' : p
                                  )
                                }
                                className={`px-2 py-1 rounded text-[11px] border cursor-pointer ${
                                  entry.phoneBeforeBed === p
                                    ? 'bg-[#FF8A65] text-white border-[#FF8A65]'
                                    : 'bg-white text-[#2E2E2E] border-[#7CC9B6]/60'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-1 px-1">
                        {mode === 'print' ? (
                          <span className="text-[#2E2E2E]/85">
                            {entry.stress || 'منخفض / متوسط / مرتفع'}
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            {(['منخفض', 'متوسط', 'مرتفع'] as const).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() =>
                                  onSleepChange(dIdx, 'stress', entry.stress === s ? '' : s)
                                }
                                className={`px-2 py-1 rounded text-[11px] border cursor-pointer ${
                                  entry.stress === s
                                    ? 'bg-[#5E4B8B] text-white border-[#5E4B8B]'
                                    : 'bg-white text-[#2E2E2E] border-[#7CC9B6]/60'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {mode === 'interactive' && trackedCount > 0 && (
            <div className="mt-2.5 text-xs text-[#0F4C5C] bg-white rounded-lg p-2.5 border border-[#7CC9B6]/60">
              {phoneAndBadSleep > 0
                ? `ملاحظة من متابعك: تكرر استخدام الهاتف قبل النوم مع نوم غير مريح في ${phoneAndBadSleep} أيام. جرب إبعاد الشاشات 30 دقيقة قبل النوم.`
                : 'ممتاز! متابعتك للنمط تساعدك على اكتشاف العوامل التي تحسّن جودة نومك.'}
            </div>
          )}

          <div className="mt-3">
            <span className="font-bold text-xs text-[#0F4C5C] block mb-1">
              هل هناك نمط يتكرر؟ (اكتب ملاحظاتك عن النوم):
            </span>
            <PrintableTextField
              multiline
              lines={2}
              mode={mode}
              value={exercises.page9_sleep_notes || ''}
              onChange={(val) => onInputChange('page9_sleep_notes', val)}
              placeholder="مواعيد النوم أو ملاحظات أسبوعك..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 10: NOT A MACHINE + ENERGY BATTERY ----------------
  if (pageIndex === 10) {
    const drainLines = (exercises.page10_drain || '').split('\n').filter((s) => s.trim()).length;
    const restoreLines = (exercises.page10_restore || '').split('\n').filter((s) => s.trim()).length;
    const batteryPercent = Math.max(
      15,
      Math.min(95, 50 + restoreLines * 15 - drainLines * 12)
    );

    return (
      <PageShell metaIndex={10} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
              أنت لست آلة: ميزانية الطاقة
            </h2>
            <BrushStrokeUnderline color="#FFC857" className="mb-3" />
          </div>
          <SunHorizonIcon color="#FF8A65" />
        </div>

        <p className="mb-2.5">
          أحيانًا نعيش وكأن المطلوب منا أن نكون متاحين طوال الوقت... ثم نتساءل: <strong>"أنا ليه خلصت؟"</strong> لأن الإنسان له طاقة محدودة، والعناية بالنفس هي إدارة ذكية لهذه الطاقة.
        </p>

        {mode === 'interactive' && (
          <div className="bg-[#FCF9F2] border border-[#7CC9B6]/60 rounded-xl p-3.5 mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#0F4C5C]">
              <BatteryCharging className="w-5 h-5 text-[#2E7D32]" />
              <span>مؤشر توازن طاقتك:</span>
            </div>
            <div className="flex-1 h-3 bg-white rounded-full border border-[#7CC9B6]/60 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${batteryPercent}%`,
                  backgroundColor:
                    batteryPercent >= 60 ? '#2E7D32' : batteryPercent >= 40 ? '#FFC857' : '#FF8A65',
                }}
              />
            </div>
            <span className="text-xs font-heading font-bold text-[#0F4C5C] tabular-nums">
              {batteryPercent}%
            </span>
          </div>
        )}

        <div className="bg-[#FFF7E9] border border-[#FF8A65]/50 rounded-xl p-4 space-y-3 text-xs">
          <div className="font-heading font-bold text-[#0F4C5C] text-sm">
            تمرين «ميزانية الطاقة» — اكتب في الخانات التالية:
          </div>
          <div>
            <label className="font-bold text-[#6D1B3B] block mb-1">
              أشياء تستنزف طاقتك (كل بند في سطر):
            </label>
            <PrintableTextField
              multiline
              lines={2}
              mode={mode}
              value={exercises.page10_drain || ''}
              onChange={(val) => onInputChange('page10_drain', val)}
              placeholder="مثال: السهر، كثرة الالتزامات، مقارنة نفسي بالآخرين..."
            />
          </div>
          <div>
            <label className="font-bold text-[#2E7D32] block mb-1">
              أشياء تساعدك على استعادة طاقتك (كل بند في سطر):
            </label>
            <PrintableTextField
              multiline
              lines={2}
              mode={mode}
              value={exercises.page10_restore || ''}
              onChange={(val) => onInputChange('page10_restore', val)}
              placeholder="مثال: المشي، ساعة هدوء، الحديث مع صديق آمن..."
            />
          </div>
          <div>
            <label className="font-bold text-[#0F4C5C] block mb-1">
              ما الشيء الذي يمكنني تقليله هذا الأسبوع؟
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page10_reduce || ''}
              onChange={(val) => onInputChange('page10_reduce', val)}
              placeholder="قرار بسيط هذا الأسبوع..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 11: BOUNDARIES ----------------
  if (pageIndex === 11) {
    return (
      <PageShell metaIndex={11} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          الحدود ليست قسوة
        </h2>
        <BrushStrokeUnderline color="#7CC9B6" className="mb-4" />

        <p className="mb-3">
          قد تؤذي نفسك وأنت تحاول إرضاء الجميع. وضع الحدود لا يعني أن تصبح قاسيًا؛ يعني أن تعرف: <strong>ما الذي أقبله؟ وما الذي لا أقبله؟ وما الذي أستطيع تحمله؟</strong>
        </p>

        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-3.5 space-y-2 mb-3.5">
          <div className="font-heading font-bold text-xs sm:text-sm text-[#0F4C5C]">
            جمل لطيفة جاهزة (اضغط نسخ لتجربتها):
          </div>
          {BOUNDARY_PHRASES.map((phrase, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#7CC9B6]/50 rounded-lg p-2 flex items-center justify-between gap-2 text-xs sm:text-sm"
            >
              <span className="font-medium text-[#2E2E2E]">"{phrase}"</span>
              {mode === 'interactive' && (
                <button
                  type="button"
                  onClick={() => handleCopyPhrase(phrase, idx)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#7CC9B6]/20 hover:bg-[#7CC9B6]/35 text-[#0F4C5C] text-xs font-heading font-bold shrink-0 cursor-pointer"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#FCF9F2] border border-[#FF8A65]/50 rounded-xl p-4 space-y-3">
          <div>
            <span className="font-heading font-bold text-xs sm:text-sm text-[#0F4C5C] block mb-2">
              في أي مساحة تحتاج وضع حد لطيف هذه الفترة؟
            </span>
            <PrintableRadioGroup
              mode={mode}
              options={['العمل', 'العائلة', 'الأصدقاء', 'مع نفسي']}
              value={exercises.page11_boundary_who || ''}
              onChange={(val) => onInputChange('page11_boundary_who', val)}
            />
          </div>

          <div>
            <label className="font-heading font-bold text-xs sm:text-sm text-[#0F4C5C] block mb-1.5">
              صِغ جملة حدود خاصة بك:
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page11_my_boundary || ''}
              onChange={(val) => onInputChange('page11_my_boundary', val)}
              placeholder="مثال: أعتذر اليوم لأن وقتي ممتلئ..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 12: HURT BY OTHERS ----------------
  if (pageIndex === 12) {
    return (
      <PageShell metaIndex={12} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          عندما يؤذينا شخص آخر
        </h2>
        <BrushStrokeUnderline color="#5E4B8B" className="mb-4" />

        <p className="mb-3">
          ليس كل ألم نفسي سببه مرض نفسي. أحيانًا يكون الإنسان يعيش داخل علاقة مؤذية أو بيئة قاسية. إذا كان مصدر الأذى ما زال موجودًا، فنحن بحاجة إلى النظر إليه بصدق.
        </p>

        <div className="bg-[#FFF7E9] border border-[#5E4B8B]/40 rounded-xl p-4 space-y-2.5 text-xs mb-3">
          <div className="font-heading font-bold text-[#0F4C5C] text-sm">
            اسأل نفسك بصدق واكتب إجاباتك:
          </div>
          <div>
            <span className="font-bold text-[#0F4C5C] block mb-1">ما الذي يؤذيني تحديدًا؟</span>
            <PrintableTextField
              mode={mode}
              value={exercises.page12_hurt || ''}
              onChange={(val) => onInputChange('page12_hurt', val)}
              placeholder="صف السلوك أو الموقف المؤذي..."
            />
          </div>
          <div>
            <span className="font-bold text-[#0F4C5C] block mb-1">هل أستطيع وضع حد له؟</span>
            <PrintableTextField
              mode={mode}
              value={exercises.page12_limit || ''}
              onChange={(val) => onInputChange('page12_limit', val)}
              placeholder="نعم / لا وكيف..."
            />
          </div>
          <div>
            <span className="font-bold text-[#0F4C5C] block mb-1">هل أستطيع الابتعاد عنه أو تقليل الاحتكاك؟</span>
            <PrintableTextField
              mode={mode}
              value={exercises.page12_distance || ''}
              onChange={(val) => onInputChange('page12_distance', val)}
              placeholder="خطوة تقليل الاحتكاك..."
            />
          </div>
          <div>
            <span className="font-bold text-[#0F4C5C] block mb-1">هل أحتاج إلى شخص آمن يساعدني على التعامل معه؟</span>
            <PrintableTextField
              mode={mode}
              value={exercises.page12_help || ''}
              onChange={(val) => onInputChange('page12_help', val)}
              placeholder="من يمكنه مساندتك؟"
            />
          </div>
        </div>

        <p className="text-xs font-bold text-[#6D1B3B] leading-relaxed">
          وإذا كان الأذى يتضمن عنفًا أو تهديدًا أو استغلالاً، فلا تتحمل وحدك؛ ابحث عن مساعدة آمنة ومناسبة لوضعك.
        </p>
      </PageShell>
    );
  }

  // ---------------- PAGE 13: NO SELF-DIAGNOSIS (STANDALONE INTERACTIVE PAGE) ----------------
  if (pageIndex === 13) {
    const selected = (exercises.page13_reasons || '').split(',').filter(Boolean);

    return (
      <PageShell metaIndex={13} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          لا تحاول أن تعالج نفسك من الإنترنت
        </h2>
        <BrushStrokeUnderline color="#0F4C5C" className="mb-4" />

        <p className="mb-3">
          قد تبحث عن أعراضك فتجد عشرات التشخيصات، ثم تبدأ تجربة نصائح أو أدوية من نفسك. المعلومات الصحية تساعدنا على الفهم، لكنها لا تقوم مقام التقييم المهني.
        </p>

        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-3.5 mb-3 text-sm">
          دور مبادرة <strong>«نسمة حياة»</strong> هو التوعية والكشف المبكر والتوجيه والإحالة، وليس تشخيص الناس بأنفسهم.
        </div>

        <div className="bg-[#FCF9F2] border border-[#7CC9B6]/60 rounded-xl p-4 space-y-2.5">
          <div className="font-heading font-bold text-xs sm:text-sm text-[#0F4C5C]">
            وقفة وعي: لماذا تبحث عن الأعراض الآن؟
          </div>
          {PAGE13_REASONS.map((r) => {
            const checked = selected.includes(r.id);
            if (mode === 'print') {
              return (
                <div key={r.id} className="flex items-center gap-2 text-xs">
                  <span
                    className={`inline-block w-3.5 h-3.5 rounded border ${
                      checked ? 'bg-[#0F4C5C] border-[#0F4C5C]' : 'border-[#0F4C5C]/60 bg-white'
                    }`}
                  />
                  <span>{r.label}</span>
                </div>
              );
            }
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleCommaItem('page13_reasons', r.id)}
                className="w-full flex items-center gap-2.5 text-right text-xs sm:text-sm py-1.5 px-2 rounded-lg hover:bg-white cursor-pointer"
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#7CC9B6] shrink-0" />
                )}
                <span>{r.label}</span>
              </button>
            );
          })}
          {mode === 'interactive' && selected.includes('compare') && (
            <p className="text-xs text-[#6D1B3B] font-semibold pt-1">
              تذكير لطيف: القراءة تمنحك لغة تصف بها ألمك، لكن المختص فقط هو من يضع الصورة التشخيصية الكاملة بأمان.
            </p>
          )}

          <div className="pt-2">
            <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
              اكتب سؤالاً تود طرحه على مختص بدلاً من البحث العشوائي:
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page13_question_for_pro || ''}
              onChange={(val) => onInputChange('page13_question_for_pro', val)}
              placeholder="مثال: هل ما أشعر به من إرهاق سببه الضغط أم يحتاج تقييمًا؟"
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 14: DO I NEED A SPECIALIST? ----------------
  if (pageIndex === 14) {
    const selected = (exercises.page14_signs || '').split(',').filter(Boolean);

    return (
      <PageShell metaIndex={14} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          هل أحتاج إلى مختص؟
        </h2>
        <BrushStrokeUnderline color="#2E7D32" className="mb-4" />

        <p className="mb-4">
          ليس من الضروري أن تصل إلى أسوأ مرحلة حتى تطلب المساعدة. حدّد العلامات التي تنطبق عليك الآن:
        </p>

        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-4 space-y-2.5 mb-5">
          {PAGE14_SIGNS.map((sign) => {
            const checked = selected.includes(sign.id);
            if (mode === 'print') {
              return (
                <div key={sign.id} className="flex items-start gap-2 text-xs py-1">
                  <span
                    className={`inline-block w-3.5 h-3.5 rounded border mt-0.5 shrink-0 ${
                      checked ? 'bg-[#0F4C5C] border-[#0F4C5C]' : 'border-[#0F4C5C]/60 bg-white'
                    }`}
                  />
                  <span>{sign.label}</span>
                </div>
              );
            }

            return (
              <button
                key={sign.id}
                type="button"
                onClick={() => toggleCommaItem('page14_signs', sign.id)}
                className={`w-full flex items-start gap-2.5 text-right p-2.5 rounded-xl border transition cursor-pointer ${
                  checked
                    ? 'bg-white border-[#0F4C5C] text-[#0F4C5C]'
                    : 'bg-white/60 border-[#7CC9B6]/50 text-[#2E2E2E] hover:bg-white'
                }`}
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 text-[#0F4C5C] mt-0.5 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#7CC9B6] mt-0.5 shrink-0" />
                )}
                <span className="text-xs sm:text-sm leading-relaxed">{sign.label}</span>
              </button>
            );
          })}
        </div>

        {mode === 'interactive' && selected.length > 0 && (
          <div className="bg-[#7CC9B6]/20 border border-[#7CC9B6] rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-[#0F4C5C] font-medium">
              وجود علامة واحدة أو أكثر يكفي تمامًا لتمنح نفسك حق الحصول على جلسة تقييم مريحة ومحايدة.
            </p>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate(15)}
                className="bg-[#0F4C5C] text-white px-3.5 py-2 rounded-lg text-xs font-heading font-bold shrink-0 cursor-pointer"
              >
                أخصائي أم طبيب؟
              </button>
            )}
          </div>
        )}

        <p className="font-heading font-bold text-[#0F4C5C]">
          طلب المساعدة ليس حكمًا على شخصيتك؛ إنه قرار بأنك لا تريد أن تظل عالقًا في الألم.
        </p>
      </PageShell>
    );
  }

  // ---------------- PAGE 15: PSYCHOLOGIST VS PSYCHIATRIST (NOW INTERACTIVE!) ----------------
  if (pageIndex === 15) {
    return (
      <PageShell metaIndex={15} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <h2 className="font-heading text-2xl font-bold text-[#0F4C5C] mb-1">
          أخصائي نفسي أم طبيب نفسي؟
        </h2>
        <BrushStrokeUnderline color="#0F4C5C" className="mb-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-3.5">
            <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F4C5C] mb-1.5">
              الأخصائي النفسي (Psychologist)
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2E2E] prose-box">
              مختص في التقييم النفسي، الجلسات الكلامية، والعلاج النفسي السلوكي والمعرفي بحسب ترخيصه. لا يصف أدوية.
            </p>
          </div>

          <div className="bg-[#FCF9F2] border border-[#2E7D32]/50 rounded-xl p-3.5">
            <h3 className="font-heading font-bold text-sm sm:text-base text-[#2E7D32] mb-1.5">
              الطبيب النفسي (Psychiatrist)
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2E2E] prose-box">
              طبيب بشري متخصص في الصحة النفسية، يُجري التقييم الطبي الشامل ويصف الأدوية عند الحاجة.
            </p>
          </div>
        </div>

        <div className="bg-[#A8D8F0]/20 border border-[#0F4C5C]/25 rounded-xl p-3.5 mb-4 prose-box text-xs sm:text-sm">
          <strong className="text-[#0F4C5C]">القاعدة المطمئنة:</strong> ليس المطلوب أن تعرف وحدك أيهما تحتاج؛ ابدأ بطلب تقييم من مختص مؤهل، وهو يوجهك للخطوة المناسبة.
        </div>

        <div className="bg-[#FCF9F2] border border-[#7CC9B6]/60 rounded-xl p-4 space-y-3">
          <div>
            <span className="font-heading font-bold text-xs sm:text-sm text-[#0F4C5C] block mb-2">
              ما الخطوة الأقرب لراحتك الآن؟
            </span>
            <PrintableRadioGroup
              mode={mode}
              options={['أخصائي نفسي', 'طبيب نفسي', 'تقييم أولي يحدد لي']}
              value={exercises.page15_choice || ''}
              onChange={(val) => onInputChange('page15_choice', val)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0F4C5C] mb-1">
              نقاط أو تساؤلات أود تذكرها في أول جلسة:
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page15_questions || ''}
              onChange={(val) => onInputChange('page15_questions', val)}
              placeholder="اكتب أهم ما تريد الحديث عنه..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 16: EMERGENCY (NOW INTERACTIVE PERSONAL SAFETY CONTACTS!) ----------------
  if (pageIndex === 16) {
    return (
      <PageShell metaIndex={16} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <div className="flex items-center gap-2 text-[#6D1B3B] mb-2">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h2 className="font-heading text-2xl font-bold text-[#6D1B3B]">
            متى تصبح المسألة طارئة؟
          </h2>
        </div>
        <BrushStrokeUnderline color="#6D1B3B" className="mb-4" />

        <div className="bg-[#6D1B3B]/8 border border-[#6D1B3B]/40 rounded-xl p-4 space-y-2 mb-4">
          <h3 className="font-heading font-bold text-sm sm:text-base text-[#6D1B3B]">
            علامات تستدعي مساعدة عاجلة فورًا:
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-[#2E2E2E] pr-1 text-xs sm:text-sm">
            <li>وجود خطر فوري على سلامة الشخص أو من حوله.</li>
            <li>أفكار أو خطة أو نية لإيذاء النفس أو شخص آخر.</li>
            <li>فقدان القدرة على الحفاظ على السلامة الشخصية.</li>
          </ul>
          <p className="text-xs font-bold text-[#6D1B3B] pt-1">
            لا تبقَ وحدك، وتوجّه فورًا لخدمات الطوارئ أو أقرب منشأة صحية.
          </p>
        </div>

        <div className="bg-[#FFF7E9] border border-[#6D1B3B]/35 rounded-xl p-4 space-y-3 text-xs">
          <div className="font-heading font-bold text-sm text-[#6D1B3B]">
            جهز أرقام الطوارئ الخاصة بك مسبقًا لتكون أمامك فورًا:
          </div>
          <div>
            <label className="font-bold text-[#0F4C5C] block mb-1">
              اسم ورقم شخص آمن أتصل به فورًا عند الضرورة:
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page16_safe_contact || ''}
              onChange={(val) => onInputChange('page16_safe_contact', val)}
              placeholder="الاسم والرقم..."
            />
          </div>
          <div>
            <label className="font-bold text-[#0F4C5C] block mb-1">
              أقرب مستشفى طوارئ أو خط مساندة في بلدي:
            </label>
            <PrintableTextField
              mode={mode}
              value={exercises.page16_nearest_er || ''}
              onChange={(val) => onInputChange('page16_nearest_er', val)}
              placeholder="اسم المستشفى أو رقم الطوارئ المحلي..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 17: MY PERSONAL NASMAT HAYAH PLAN ----------------
  if (pageIndex === 17) {
    return (
      <PageShell metaIndex={17} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h2 className="font-heading text-2xl font-bold text-[#0F4C5C]">
            خطة «نسمة حياة» الخاصة بي
          </h2>
          {mode === 'interactive' && onImportPlan && (
            <button
              type="button"
              onClick={onImportPlan}
              className="inline-flex items-center gap-1.5 bg-[#7CC9B6]/20 hover:bg-[#7CC9B6]/35 text-[#0F4C5C] px-3 py-1.5 rounded-lg text-xs font-heading font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>استيراد من تماريني السابقة</span>
            </button>
          )}
        </div>
        <BrushStrokeUnderline color="#FF8A65" className="mb-4" />

        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-4 space-y-2.5 text-xs">
          <div>
            <strong className="text-[#0F4C5C] block mb-1">
              عندما أبدأ في التدهور، ألاحظ أنني:
            </strong>
            <PrintableTextField
              mode={mode}
              value={exercises.plan_decline || ''}
              onChange={(val) => onInputChange('plan_decline', val)}
              placeholder="مثال: أنسحب من الناس، يسوء نومي، أتوتر بسرعة..."
            />
          </div>
          <div>
            <strong className="text-[#0F4C5C] block mb-1">
              أكثر الأشياء التي تستنزفني:
            </strong>
            <PrintableTextField
              mode={mode}
              value={exercises.plan_drain || ''}
              onChange={(val) => onInputChange('plan_drain', val)}
              placeholder="مواقف أو عادات تستنزفك..."
            />
          </div>
          <div>
            <strong className="text-[#0F4C5C] block mb-1">
              الأشياء التي تساعدني عادةً:
            </strong>
            <PrintableTextField
              mode={mode}
              value={exercises.plan_helps || ''}
              onChange={(val) => onInputChange('plan_helps', val)}
              placeholder="مشي، تنفس 4-7-8، كتابة، راحة..."
            />
          </div>
          <div>
            <strong className="text-[#0F4C5C] block mb-1">
              الشخص الآمن الذي أستطيع التحدث معه:
            </strong>
            <PrintableTextField
              mode={mode}
              value={exercises.plan_person || ''}
              onChange={(val) => onInputChange('plan_person', val)}
              placeholder="اسم صديق أو فرد عائلة تثق به..."
            />
          </div>
          <div>
            <strong className="text-[#0F4C5C] block mb-1">
              المختص أو الجهة التي يمكنني طلب المساعدة منها:
            </strong>
            <PrintableTextField
              mode={mode}
              value={exercises.plan_pro || ''}
              onChange={(val) => onInputChange('plan_pro', val)}
              placeholder="اسم عيادة، مستشفى، أو خط دعم نفسي..."
            />
          </div>
          <div>
            <strong className="text-[#0F4C5C] block mb-1">
              الخطوة التي سأقوم بها إذا لم أعد قادرًا على التعامل وحدي:
            </strong>
            <PrintableTextField
              mode={mode}
              value={exercises.plan_step || ''}
              onChange={(val) => onInputChange('plan_step', val)}
              placeholder="خطوة عملية واضحة..."
            />
          </div>
        </div>
      </PageShell>
    );
  }

  // ---------------- PAGE 18: CLOSING (NOW INTERACTIVE WITH PERSONAL PROMISE!) ----------------
  return (
    <PageShell metaIndex={18} mode={mode} fontScale={fontScale} lineHeight={lineHeight}>
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <BotanicalLeaves color="#2E7D32" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0F4C5C] mb-1">
          رسالة إليك
        </h2>
        <div className="flex justify-center mb-4">
          <WaveBreezeDivider color="#FF8A65" />
        </div>

        <p className="mb-2">
          ربما قضيت وقتًا طويلاً وأنت تقول: <strong>"أنا لازم أستحمل"</strong>، وأخفيت تعبك لأنك تخاف أن يراك الآخرون ضعيفًا.
        </p>

        <div className="bg-[#FFF7E9] border border-[#7CC9B6] rounded-xl p-4 my-3 prose-box text-[#2E2E2E]">
          توقف قليلاً. اسأل نفسك: <strong>"وأنا... عامل إيه؟"</strong>
          <br />
          <strong className="text-[#0F4C5C] block mt-1.5">
            طلب المساعدة ليس هزيمة... أحيانًا يكون أول خطوة في طريق العودة إلى الحياة.
          </strong>
        </div>

        <div className="bg-[#FCF9F2] border border-[#FF8A65]/50 rounded-xl p-4 text-right mb-4">
          <label className="block text-xs sm:text-sm font-heading font-bold text-[#0F4C5C] mb-1.5">
            قبل أن تغلق الكتيب: ما العهد اللطيف الذي تقطعه لنفسك اليوم؟
          </label>
          <PrintableTextField
            mode={mode}
            value={exercises.page18_promise || ''}
            onChange={(val) => onInputChange('page18_promise', val)}
            placeholder="مثال: سأعطي نفسي نصف ساعة راحة يوميًا دون تأنيب..."
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <NasmatLogoMark size="md" />
          <div className="text-xs font-sub text-[#FF8A65] font-semibold">
            "كثيرون يعيشون الحياة... وقليلون يستمتعون بها"
          </div>

          {mode === 'interactive' && onOpenAnswers && (
            <button
              type="button"
              onClick={onOpenAnswers}
              className="mt-2 inline-flex items-center gap-2 bg-[#0F4C5C] hover:bg-[#093440] text-white px-5 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm cursor-pointer transition"
            >
              <BookMarked className="w-4 h-4" />
              <span>عرض ملخص كل إجاباتي</span>
            </button>
          )}
        </div>
      </div>
    </PageShell>
  );
};
