import React, { useState, useEffect } from 'react';
import { X, Copy, Check, PenLine, Download } from 'lucide-react';
import { ExerciseData, SleepLogMap } from '../types/booklet';

interface AnswerSection {
  pageIndex: number;
  pageTitle: string;
  entries: { label: string; value: string }[];
}

export const MyAnswersModal = ({
  isOpen,
  onClose,
  exercises,
  sleepLog,
  onJumpToPage,
  onDownloadPDF,
}: {
  isOpen: boolean;
  onClose: () => void;
  exercises: ExerciseData;
  sleepLog: SleepLogMap;
  onJumpToPage: (index: number) => void;
  onDownloadPDF: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sleepDaysFilled = Object.entries(sleepLog)
    .filter(([, v]) => v.quality || v.phoneBeforeBed || v.stress)
    .map(
      ([day, v]) =>
        `اليوم ${Number(day) + 1}: ${v.quality || '-'} | هاتف: ${v.phoneBeforeBed || '-'} | توتر: ${v.stress || '-'}`
    )
    .join('\n');

  const sections: AnswerSection[] = [
    {
      pageIndex: 0,
      pageTitle: 'الغلاف والترحيب',
      entries: [
        { label: 'الاسم / اللقب', value: exercises.owner_name || '' },
        { label: 'حالة القلب اليوم', value: exercises.mood_now || '' },
        { label: 'كلمة لنفسي في البداية', value: exercises.page1_note || '' },
      ],
    },
    {
      pageIndex: 3,
      pageTitle: 'صفحة 3 · هل أنت بخير فعلاً؟',
      entries: [
        { label: 'هل تشعر بتعب داخلي رغم الهدوء الخارجي؟', value: exercises.page3_feeling || '' },
        { label: 'أكثر جملة لمستني', value: exercises.page3_resonance || '' },
      ],
    },
    {
      pageIndex: 4,
      pageTitle: 'صفحة 4 · نفسي تعبانة... بس مالي؟',
      entries: [
        { label: 'العلامات التي ألاحظها الآن', value: exercises.page4_symptoms || '' },
        { label: 'ما الذي تغير فيَّ مؤخرًا؟', value: exercises.page4_q1 || '' },
      ],
    },
    {
      pageIndex: 5,
      pageTitle: 'صفحة 5 · الضغط النفسي',
      entries: [
        {
          label: 'المستنزف 1',
          value: [exercises.page5_stress1, exercises.page5_stress1_action].filter(Boolean).join(' — '),
        },
        {
          label: 'المستنزف 2',
          value: [exercises.page5_stress2, exercises.page5_stress2_action].filter(Boolean).join(' — '),
        },
        {
          label: 'المستنزف 3',
          value: [exercises.page5_stress3, exercises.page5_stress3_action].filter(Boolean).join(' — '),
        },
      ],
    },
    {
      pageIndex: 6,
      pageTitle: 'صفحة 6 · عندما تفقد الأشياء طعمها',
      entries: [
        { label: 'هل ما زلت أستمتع؟', value: exercises.page6_enjoy || '' },
        { label: 'هل يؤثر في حياتي؟', value: exercises.page6_affect || '' },
        { label: 'شيء أتمنى استعادة متعته', value: exercises.page6_missed_joy || '' },
      ],
    },
    {
      pageIndex: 7,
      pageTitle: 'صفحة 7 · مشاعرك ليست عدوك',
      entries: [
        { label: 'الشعور الغالب', value: exercises.page7_emotion || '' },
        { label: 'ماذا حدث؟', value: exercises.page7_what || '' },
        { label: 'ماذا شعرت؟', value: exercises.page7_felt || '' },
        { label: 'ماذا كنت تحتاج؟', value: exercises.page7_need || '' },
        { label: 'كيف تصرفت؟', value: exercises.page7_acted || '' },
      ],
    },
    {
      pageIndex: 8,
      pageTitle: 'صفحة 8 · القلق وكثرة التفكير',
      entries: [
        { label: 'الفكرة المقلقة', value: exercises.page8_prob || '' },
        { label: 'هل أستطيع فعل شيء الآن؟', value: exercises.page8_canDo || '' },
        { label: 'الخطوة الصغيرة', value: exercises.page8_step || '' },
        { label: 'ما أستطيع التحكم فيه', value: exercises.page8_control || '' },
      ],
    },
    {
      pageIndex: 9,
      pageTitle: 'صفحة 9 · متابع النوم',
      entries: [
        { label: 'سجل الأسبوع', value: sleepDaysFilled },
        { label: 'ملاحظات النوم', value: exercises.page9_sleep_notes || '' },
      ],
    },
    {
      pageIndex: 10,
      pageTitle: 'صفحة 10 · ميزانية الطاقة',
      entries: [
        { label: 'أشياء تستنزف طاقتي', value: exercises.page10_drain || '' },
        { label: 'أشياء تجدد طاقتي', value: exercises.page10_restore || '' },
        { label: 'ما سأقلله هذا الأسبوع', value: exercises.page10_reduce || '' },
      ],
    },
    {
      pageIndex: 11,
      pageTitle: 'صفحة 11 · الحدود ليست قسوة',
      entries: [
        { label: 'مساحة وضع الحد', value: exercises.page11_boundary_who || '' },
        { label: 'جملة الحدود الخاصة بي', value: exercises.page11_my_boundary || '' },
      ],
    },
    {
      pageIndex: 12,
      pageTitle: 'صفحة 12 · عندما يؤذينا شخص آخر',
      entries: [
        { label: 'ما يؤذيني تحديدًا', value: exercises.page12_hurt || '' },
        { label: 'هل أستطيع وضع حد؟', value: exercises.page12_limit || '' },
        { label: 'هل أستطيع الابتعاد؟', value: exercises.page12_distance || '' },
        { label: 'هل أحتاج شخصًا يساعدني؟', value: exercises.page12_help || '' },
      ],
    },
    {
      pageIndex: 13,
      pageTitle: 'صفحات 13–16 · الوعي والاستعانة بمختص والطوارئ',
      entries: [
        { label: 'سؤال أود طرحه على مختص', value: exercises.page13_question_for_pro || '' },
        { label: 'الخطوة الأقرب لي', value: exercises.page15_choice || '' },
        { label: 'تساؤلاتي قبل الجلسة', value: exercises.page15_questions || '' },
        { label: 'الشخص الآمن للطوارئ', value: exercises.page16_safe_contact || '' },
        { label: 'أقرب منشأة طوارئ', value: exercises.page16_nearest_er || '' },
      ],
    },
    {
      pageIndex: 17,
      pageTitle: 'صفحة 17–18 · خطة نسمة حياة وعهدي لنفسي',
      entries: [
        { label: 'علامات التدهور المبكرة', value: exercises.plan_decline || '' },
        { label: 'أكثر ما يستنزفني', value: exercises.plan_drain || '' },
        { label: 'ما يساعدني عادةً', value: exercises.plan_helps || '' },
        { label: 'الشخص الآمن', value: exercises.plan_person || '' },
        { label: 'المختص أو الجهة', value: exercises.plan_pro || '' },
        { label: 'خطوتي عند الاحتياج', value: exercises.plan_step || '' },
        { label: 'عهد لطيف لنفسي', value: exercises.page18_promise || '' },
      ],
    },
  ];

  const filledSections = sections
    .map((sec) => ({
      ...sec,
      entries: sec.entries.filter((e) => e.value && e.value.trim().length > 0),
    }))
    .filter((sec) => sec.entries.length > 0);

  const handleCopyAll = async () => {
    const text = filledSections
      .map(
        (sec) =>
          `【${sec.pageTitle}】\n` +
          sec.entries.map((e) => `- ${e.label}: ${e.value}`).join('\n')
      )
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(text || 'لم يتم تدوين إجابات بعد.');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#093440]/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="answers-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] bg-[#FFF7E9] border border-[#7CC9B6] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0F4C5C] text-white px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <h2 id="answers-modal-title" className="font-heading text-lg font-bold">
              دفتر إجاباتي ومشاركاتي
            </h2>
            <p className="text-xs text-white/80">
              كل ما تكتبه وتختاره داخل الكتيب يُحفظ تلقائيًا في هذا الجهاز
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق دفتر الإجابات"
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {filledSections.length === 0 ? (
            <div className="bg-white border border-[#7CC9B6]/60 rounded-xl p-8 text-center space-y-3">
              <PenLine className="w-8 h-8 text-[#FF8A65] mx-auto" />
              <h3 className="font-heading font-bold text-base text-[#0F4C5C]">
                لم تبدأ الكتابة بعد
              </h3>
              <p className="text-xs sm:text-sm text-[#2E2E2E]/80 max-w-md mx-auto">
                كل صفحة في الكتيب تحتوي على مساحات للكتابة واختيارات تفاعلية. ابدأ بالتصفح والكتابة وستتجمع كل إجاباتك هنا تلقائيًا.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onJumpToPage(1);
                }}
                className="bg-[#0F4C5C] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold cursor-pointer"
              >
                ابدأ من الصفحة الأولى
              </button>
            </div>
          ) : (
            filledSections.map((sec) => (
              <div
                key={sec.pageTitle}
                className="bg-white border border-[#7CC9B6]/60 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#7CC9B6]/30">
                  <h3 className="font-heading font-bold text-sm text-[#0F4C5C]">
                    {sec.pageTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onJumpToPage(sec.pageIndex);
                    }}
                    className="text-xs font-heading font-bold text-[#FF8A65] hover:underline cursor-pointer shrink-0"
                  >
                    تعديل في الصفحة
                  </button>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  {sec.entries.map((entry) => (
                    <div key={entry.label} className="bg-[#FCF9F2] rounded-lg p-2.5">
                      <span className="font-heading font-bold text-[#0F4C5C] block text-xs mb-0.5">
                        {entry.label}:
                      </span>
                      <span className="text-[#2E2E2E] whitespace-pre-wrap">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border-t border-[#7CC9B6]/40 px-5 py-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={filledSections.length === 0}
            className="inline-flex items-center gap-1.5 bg-[#FFF7E9] border border-[#7CC9B6] hover:bg-[#7CC9B6]/15 disabled:opacity-40 text-[#0F4C5C] px-4 py-2 rounded-xl text-xs font-heading font-bold cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ ملخصك' : 'نسخ ملخص إجاباتي'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onDownloadPDF();
            }}
            className="inline-flex items-center gap-1.5 bg-[#0F4C5C] hover:bg-[#093440] text-white px-4 py-2 rounded-xl text-xs font-heading font-bold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>حفظ نسخة PDF بإجاباتي</span>
          </button>
        </div>
      </div>
    </div>
  );
};
