import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Download,
  Loader2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Layers,
  Trash2,
  ArrowUp,
  BookMarked,
} from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { BOOKLET_PAGES } from './data/bookletPages';
import { ExerciseData, SleepDayEntry, SleepLogMap } from './types/booklet';
import { NasmatLogoMark } from './components/BrandMotifs';
import { BreathingModal } from './components/BreathingModal';
import { BookletPageView, FontScale } from './components/BookletPageView';
import { MyAnswersModal } from './components/MyAnswersModal';

const STORAGE_EXERCISES_KEY = 'nasmat_hayah_exercises_v2';
const STORAGE_SLEEP_KEY = 'nasmat_hayah_sleep_v2';
const STORAGE_PAGE_KEY = 'nasmat_hayah_current_page';
const STORAGE_FONT_SCALE_KEY = 'nasmat_hayah_font_scale';
const STORAGE_LINE_HEIGHT_KEY = 'nasmat_hayah_line_height';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PAGE_KEY);
      const parsed = saved ? Number(saved) : 0;
      return parsed >= 0 && parsed < BOOKLET_PAGES.length ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const [viewMode, setViewMode] = useState<'reader' | 'all'>('reader');
  const [fontScale, setFontScale] = useState<FontScale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FONT_SCALE_KEY);
      return saved === 'sm' || saved === 'md' || saved === 'lg' ? saved : 'md';
    } catch {
      return 'md';
    }
  });
  const [lineHeight, setLineHeight] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LINE_HEIGHT_KEY);
      const num = saved ? Number(saved) : 1.8;
      if (!Number.isNaN(num) && num >= 1.4 && num <= 2.4) {
        return num.toFixed(1);
      }
      return '1.8';
    } catch {
      return '1.8';
    }
  });
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [answersModalOpen, setAnswersModalOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfProgress, setPdfProgress] = useState('');
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [exercises, setExercises] = useState<ExerciseData>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_EXERCISES_KEY) ||
        localStorage.getItem('nasmat_alhayat_exercises');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [sleepLog, setSleepLog] = useState<SleepLogMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SLEEP_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const touchStartX = useRef<number | null>(null);
  const readerTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXERCISES_KEY, JSON.stringify(exercises));
    } catch {
      // Ignore storage quota errors
    }
  }, [exercises]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SLEEP_KEY, JSON.stringify(sleepLog));
    } catch {
      // Ignore storage quota errors
    }
  }, [sleepLog]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PAGE_KEY, String(currentPage));
    } catch {
      // Ignore storage quota errors
    }
  }, [currentPage]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FONT_SCALE_KEY, fontScale);
    } catch {
      // Ignore storage quota errors
    }
  }, [fontScale]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LINE_HEIGHT_KEY, lineHeight);
    } catch {
      // Ignore storage quota errors
    }
  }, [lineHeight]);

  // Keyboard navigation in single-page reader mode (RTL: Left = Next, Right = Prev)
  useEffect(() => {
    if (viewMode !== 'reader' || breathingOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowLeft') {
        setCurrentPage((p) => Math.min(BOOKLET_PAGES.length - 1, p + 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPage((p) => Math.max(0, p - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, breathingOpen]);

  const showTemporaryNotice = (msg: string) => {
    setStatusNotice(msg);
    window.setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleInputChange = (key: string, value: string) => {
    setExercises((prev) => ({ ...prev, [key]: value }));
  };

  const handleSleepChange = (day: number, field: keyof SleepDayEntry, value: string) => {
    setSleepLog((prev) => ({
      ...prev,
      [day]: {
        quality: prev[day]?.quality || '',
        phoneBeforeBed: prev[day]?.phoneBeforeBed || '',
        stress: prev[day]?.stress || '',
        [field]: value,
      },
    }));
  };

  const navigateToPage = (index: number) => {
    const safeIdx = Math.max(0, Math.min(BOOKLET_PAGES.length - 1, index));
    if (viewMode === 'reader') {
      setCurrentPage(safeIdx);
      readerTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const target = document.getElementById(`interactive-all-page-${safeIdx}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImportPlan = () => {
    const decline = exercises.page4_symptoms?.split(',').filter(Boolean).join(' · ') || '';
    const drains = [
      exercises.page5_stress1,
      exercises.page5_stress2,
      exercises.page5_stress3,
      exercises.page10_drain,
    ]
      .filter((s) => s && s.trim())
      .join(' · ');

    const helps = exercises.page10_restore?.trim() || '';
    const safePerson = exercises.page16_safe_contact?.trim() || '';

    setExercises((prev) => ({
      ...prev,
      plan_decline: prev.plan_decline?.trim() ? prev.plan_decline : decline,
      plan_drain: prev.plan_drain?.trim() ? prev.plan_drain : drains,
      plan_helps: prev.plan_helps?.trim() ? prev.plan_helps : helps,
      plan_person: prev.plan_person?.trim() ? prev.plan_person : safePerson,
    }));
    showTemporaryNotice('تم استيراد إجاباتك واختياراتك السابقة إلى خطتك.');
  };

  const handleClearAll = () => {
    setExercises({});
    setSleepLog({});
    try {
      localStorage.removeItem(STORAGE_EXERCISES_KEY);
      localStorage.removeItem('nasmat_alhayat_exercises');
      localStorage.removeItem(STORAGE_SLEEP_KEY);
    } catch {
      // ignore
    }
    setConfirmClear(false);
    showTemporaryNotice('تم مسح جميع الإجابات؛ الكتيب جاهز للبدء من جديد.');
  };

  const handlePrintPaper = () => {
    window.print();
  };

  const buildFontEmbedCSS = async (): Promise<string> => {
    try {
      const cssUrl =
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap';
      const res = await fetch(cssUrl);
      if (!res.ok) return '';
      let cssText = await res.text();
      const urlMatches = Array.from(cssText.matchAll(/url\(([^)]+)\)/g));
      const uniqueUrls = Array.from(new Set(urlMatches.map((m) => m[1].replace(/['"]/g, ''))));

      await Promise.all(
        uniqueUrls.map(async (fontUrl) => {
          try {
            const fontRes = await fetch(fontUrl);
            if (!fontRes.ok) return;
            const blob = await fontRes.blob();
            const dataUri = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(String(reader.result || ''));
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            if (dataUri) {
              cssText = cssText.split(fontUrl).join(dataUri);
            }
          } catch {
            // Skip individual font asset if unavailable
          }
        })
      );
      return cssText;
    } catch {
      return '';
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setPdfError(null);
    setPdfProgress('جاري تحضير الخطوط والصفحات...');

    // Allow React to mount/unhide #pdf-booklet-container offscreen
    await new Promise((resolve) => setTimeout(resolve, 180));

    const container = document.getElementById('pdf-booklet-container');
    if (!container) {
      setIsGenerating(false);
      setPdfProgress('');
      return;
    }

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      const imgs = Array.from(container.querySelectorAll('img'));
      await Promise.all(
        imgs.map((img) => (typeof img.decode === 'function' ? img.decode().catch(() => {}) : Promise.resolve()))
      );

      const pageElements = Array.from(container.querySelectorAll<HTMLElement>('.booklet-page'));
      if (pageElements.length === 0) {
        throw new Error('لم يتم العثور على صفحات الكتيب');
      }

      const fontEmbedCSS = await buildFontEmbedCSS();

      // A5 dimensions in mm: 148 x 210
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a5',
        orientation: 'portrait',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pageElements.length; i++) {
        const el = pageElements[i];
        setPdfProgress(`جاري تجهيز صفحة ${i + 1} من ${pageElements.length}...`);

        const isCover = i === 0;
        const dataUrl = await toJpeg(el, {
          quality: 0.94,
          pixelRatio: 2,
          backgroundColor: isCover ? '#0F4C5C' : '#FFFFFF',
          cacheBust: true,
          fontEmbedCSS,
          skipFonts: fontEmbedCSS === '',
        });

        const imgProps = pdf.getImageProperties(dataUrl);
        let renderW = pageWidth;
        let renderH = (imgProps.height * renderW) / imgProps.width;

        if (renderH > pageHeight) {
          renderH = pageHeight;
          renderW = (imgProps.width * renderH) / imgProps.height;
        }

        const x = (pageWidth - renderW) / 2;
        const y = (pageHeight - renderH) / 2;

        if (i > 0) {
          pdf.addPage('a5', 'portrait');
        }

        if (isCover) {
          pdf.setFillColor(15, 76, 92);
        } else {
          pdf.setFillColor(255, 255, 255);
        }
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        pdf.addImage(dataUrl, 'JPEG', x, y, renderW, renderH, undefined, 'FAST');
      }

      pdf.save('nasmat-hayah-booklet.pdf');
      showTemporaryNotice('تم تجهيز وتنزيل ملف الكتيب (19 صفحة A5) بنجاح.');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setPdfError('تعذر إنشاء ملف PDF تلقائياً، يمكنك استخدام زر "طباعة ورقية" واختيار "حفظ كملف PDF".');
    } finally {
      setIsGenerating(false);
      setPdfProgress('');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || viewMode !== 'reader') return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < 50) return;

    // In RTL: swiping right-to-left (negative diff) advances or swiping left-to-right advances intuitively:
    if (diff > 50) {
      setCurrentPage((p) => Math.min(BOOKLET_PAGES.length - 1, p + 1));
    } else if (diff < -50) {
      setCurrentPage((p) => Math.max(0, p - 1));
    }
  };

  const activeMeta = BOOKLET_PAGES[currentPage];
  const progressPercent = Math.round(((currentPage + 1) / BOOKLET_PAGES.length) * 100);
  const filledAnswersCount =
    Object.values(exercises).filter((v) => typeof v === 'string' && v.trim().length > 0).length +
    (Object.values(sleepLog).some((d) => d.quality || d.phoneBeforeBed || d.stress) ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FFF7E9] text-[#2E2E2E] font-body flex flex-col selection:bg-[#FFB6B9] selection:text-[#0F4C5C]">
      {/* Top Bar: Clean 3-Zone Contract */}
      <header className="app-top-bar bg-[#0F4C5C] text-white border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateToPage(0)}
            className="flex items-center gap-2.5 text-white hover:opacity-90 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <NasmatLogoMark size="xs" />
            <span className="font-heading font-bold text-base sm:text-lg tracking-tight">
              نسمة حياة
            </span>
          </button>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav
            aria-label="التنقل السريع"
            className="hidden md:flex items-center gap-6 text-sm font-sub text-white/90"
          >
            <button
              type="button"
              onClick={() => navigateToPage(0)}
              className="hover:text-[#FFC857] hover:underline underline-offset-4 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              الغلاف
            </button>
            <button
              type="button"
              onClick={() => navigateToPage(2)}
              className="hover:text-[#FFC857] hover:underline underline-offset-4 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              الفهرس
            </button>
            <button
              type="button"
              onClick={() => setBreathingOpen(true)}
              className="hover:text-[#7CC9B6] hover:underline underline-offset-4 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              تمرين التنفس
            </button>
            <button
              type="button"
              onClick={() => navigateToPage(16)}
              className="text-[#FFB6B9] hover:text-white hover:underline underline-offset-4 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              حالات الطوارئ
            </button>
          </nav>

          {/* Zone 3: Primary CTA — Interactive Answers Journal */}
          <button
            type="button"
            onClick={() => setAnswersModalOpen(true)}
            className="flex items-center gap-2 bg-[#FF8A65] hover:bg-[#e57753] text-white px-4 py-2 rounded-xl font-heading font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer whitespace-nowrap shrink-0 tabular-nums"
          >
            <BookMarked className="w-4 h-4" />
            <span>دفتر إجاباتي{filledAnswersCount > 0 ? ` (${filledAnswersCount})` : ''}</span>
          </button>
        </div>
      </header>

      {/* Interactive Booklet Workspace */}
      <main className="interactive-reader-shell flex-1 max-w-4xl mx-auto w-full px-4 py-5 sm:py-7 flex flex-col gap-5">
        <div ref={readerTopRef} />

        {/* Reader Utility Toolbar */}
        <section
          aria-label="أدوات القراءة والطباعة"
          className="bg-white border border-[#7CC9B6]/60 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs"
        >
          {/* View Mode Segmented Switch */}
          <div className="flex items-center gap-1 p-1 bg-[#FFF7E9] rounded-xl border border-[#7CC9B6]/40">
            <button
              type="button"
              onClick={() => setViewMode('reader')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'reader'
                  ? 'bg-[#0F4C5C] text-white shadow-xs'
                  : 'text-[#0F4C5C] hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>صفحة بصفحة</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'all'
                  ? 'bg-[#0F4C5C] text-white shadow-xs'
                  : 'text-[#0F4C5C] hover:bg-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>جميع الصفحات (19)</span>
            </button>
          </div>

          {/* Mobile Quick Actions (Breathing & Emergency) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => navigateToPage(2)}
              className="px-2.5 py-1.5 rounded-lg bg-[#FFF7E9] border border-[#7CC9B6]/50 text-xs font-heading font-bold text-[#0F4C5C] cursor-pointer whitespace-nowrap"
            >
              الفهرس
            </button>
            <button
              type="button"
              onClick={() => setBreathingOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#7CC9B6]/20 text-xs font-heading font-bold text-[#0F4C5C] cursor-pointer whitespace-nowrap"
            >
              تنفس
            </button>
            <button
              type="button"
              onClick={() => navigateToPage(16)}
              className="px-2.5 py-1.5 rounded-lg bg-[#6D1B3B]/10 text-xs font-heading font-bold text-[#6D1B3B] cursor-pointer whitespace-nowrap"
            >
              طوارئ
            </button>
          </div>

          {/* Font Scale, Line Height Slider, Print & Clear Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5 bg-[#FFF7E9] border border-[#7CC9B6]/40 rounded-lg p-0.5">
              {(['sm', 'md', 'lg'] as FontScale[]).map((sz, i) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontScale(sz)}
                  title="حجم خط القراءة"
                  className={`px-2 py-1 rounded-md text-xs font-heading font-bold cursor-pointer ${
                    fontScale === sz
                      ? 'bg-white text-[#0F4C5C] shadow-xs'
                      : 'text-[#2E2E2E]/70 hover:text-[#0F4C5C]'
                  }`}
                >
                  {i === 0 ? 'أ-' : i === 1 ? 'أ' : 'أ+'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-[#FFF7E9] border border-[#7CC9B6]/40 rounded-lg px-2.5 py-1 min-h-[34px]">
              <label
                htmlFor="line-height-slider"
                className="text-[11px] sm:text-xs font-heading font-bold text-[#0F4C5C] whitespace-nowrap"
              >
                تباعد الأسطر
              </label>
              <input
                id="line-height-slider"
                type="range"
                min={1.4}
                max={2.4}
                step={0.1}
                value={Number(lineHeight)}
                onChange={(e) => setLineHeight(Number(e.target.value).toFixed(1))}
                aria-label="تغيير المسافة بين الأسطر"
                className="w-20 sm:w-24 accent-[#0F4C5C] cursor-pointer"
              />
              <span className="text-[11px] font-heading font-bold text-[#0F4C5C] tabular-nums w-8 text-center">
                {lineHeight}×
              </span>
            </div>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 bg-[#0F4C5C] hover:bg-[#093440] disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-xs font-heading font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isGenerating ? pdfProgress || 'جاري التحضير...' : 'حفظ PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPaper}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FFF7E9] border border-[#7CC9B6] text-[#0F4C5C] px-3 py-1.5 rounded-lg text-xs font-heading font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>

            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1 text-xs font-heading font-semibold text-[#6D1B3B] hover:bg-[#6D1B3B]/10 px-2.5 py-1.5 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الإجابات</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#6D1B3B]/10 px-2.5 py-1 rounded-lg">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-heading font-bold text-[#6D1B3B] hover:underline cursor-pointer whitespace-nowrap"
                >
                  تأكيد المسح
                </button>
                <span className="text-[#2E2E2E]/40">·</span>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-xs font-heading font-semibold text-[#2E2E2E] hover:underline cursor-pointer whitespace-nowrap"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Feedback / Error Banners */}
        {statusNotice && (
          <div className="bg-[#7CC9B6]/20 border border-[#7CC9B6] text-[#0F4C5C] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-heading font-semibold text-center">
            {statusNotice}
          </div>
        )}

        {pdfError && (
          <div className="bg-[#6D1B3B]/10 border border-[#6D1B3B]/50 text-[#6D1B3B] rounded-xl px-4 py-3 text-xs sm:text-sm font-heading font-semibold">
            {pdfError}
          </div>
        )}

        {/* VIEW MODE A: INTERACTIVE PAGE-BY-PAGE BOOKLET */}
        {viewMode === 'reader' ? (
          <div
            className="flex flex-col gap-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Progress Track & Current Chapter */}
            <div className="max-w-[680px] mx-auto w-full">
              <div className="flex items-center justify-between text-xs text-[#0F4C5C] font-sub mb-1.5">
                <span className="font-heading font-bold truncate">{activeMeta.title}</span>
                <span className="tabular-nums shrink-0">
                  {activeMeta.pageNumber === null
                    ? 'الغلاف · 1 من 19'
                    : `صفحة ${activeMeta.pageNumber} من 18`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#7CC9B6]/40">
                <div
                  className="h-full bg-[#0F4C5C] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Active Interactive Page */}
            <BookletPageView
              pageIndex={currentPage}
              mode="interactive"
              fontScale={fontScale}
              lineHeight={lineHeight}
              exercises={exercises}
              sleepLog={sleepLog}
              onInputChange={handleInputChange}
              onSleepChange={handleSleepChange}
              onNavigate={navigateToPage}
              onOpenBreathing={() => setBreathingOpen(true)}
              onImportPlan={handleImportPlan}
              onOpenAnswers={() => setAnswersModalOpen(true)}
            />

            {/* Page Turn Controls */}
            <nav
              aria-label="التنقل بين صفحات الكتيب"
              className="max-w-[680px] mx-auto w-full flex items-center justify-between gap-3 pt-1"
            >
              <button
                type="button"
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="inline-flex items-center gap-1.5 bg-white border border-[#7CC9B6] hover:bg-[#7CC9B6]/15 disabled:opacity-40 disabled:cursor-not-allowed text-[#0F4C5C] px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm cursor-pointer transition min-h-[42px]"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <select
                aria-label="الانتقال إلى صفحة محددة"
                value={currentPage}
                onChange={(e) => navigateToPage(Number(e.target.value))}
                className="bg-white border border-[#7CC9B6] text-[#0F4C5C] rounded-xl px-3 py-2 text-xs sm:text-sm font-heading font-semibold max-w-[210px] sm:max-w-[280px] truncate cursor-pointer min-h-[42px]"
              >
                {BOOKLET_PAGES.map((p) => (
                  <option key={p.id} value={p.index}>
                    {p.pageNumber === null
                      ? `الغلاف: ${p.title}`
                      : `ص ${p.pageNumber}: ${p.title}`}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage === BOOKLET_PAGES.length - 1}
                className="inline-flex items-center gap-1.5 bg-[#0F4C5C] hover:bg-[#093440] disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm cursor-pointer transition min-h-[42px]"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </nav>
          </div>
        ) : (
          /* VIEW MODE B: ALL 19 PAGES CONTINUOUS SCROLL */
          <div className="flex flex-col gap-7">
            {BOOKLET_PAGES.map((p) => (
              <div key={p.id} id={`interactive-all-page-${p.index}`}>
                <BookletPageView
                  pageIndex={p.index}
                  mode="interactive"
                  fontScale={fontScale}
                  lineHeight={lineHeight}
                  exercises={exercises}
                  sleepLog={sleepLog}
                  onInputChange={handleInputChange}
                  onSleepChange={handleSleepChange}
                  onNavigate={navigateToPage}
                  onOpenBreathing={() => setBreathingOpen(true)}
                  onImportPlan={handleImportPlan}
                  onOpenAnswers={() => setAnswersModalOpen(true)}
                />
              </div>
            ))}

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 bg-white border border-[#7CC9B6] text-[#0F4C5C] px-5 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm cursor-pointer hover:bg-[#7CC9B6]/15"
              >
                <ArrowUp className="w-4 h-4" />
                <span>العودة إلى أعلى الكتيب</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer bg-[#093440] text-white py-5 border-t border-white/10 text-xs mt-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right">
          <div>
            <span className="font-heading font-bold text-sm">مبادرة نسمة حياة</span>
            <span className="text-white/60 mx-2">·</span>
            <span className="text-white/80">دليل مبسط للصحة النفسية (19 صفحة بمقاس A5)</span>
          </div>
          <div className="text-[#FFC857] font-sub">
            "كثيرون يعيشون الحياة... وقليلون يستمتعون بها"
          </div>
        </div>
      </footer>

      {/* Dedicated 19-Page A5 Print & PDF Export Container (Always formatted for pen/PDF, hidden until print or PDF capture) */}
      <div
        id="pdf-booklet-container"
        aria-hidden={!isGenerating}
        className={
          isGenerating
            ? 'fixed -left-[12000px] top-0 w-[560px] bg-white pointer-events-none'
            : 'hidden print:block'
        }
      >
        {BOOKLET_PAGES.map((p) => (
          <BookletPageView
            key={`print-${p.id}`}
            pageIndex={p.index}
            mode="print"
            exercises={exercises}
            sleepLog={sleepLog}
            onInputChange={handleInputChange}
            onSleepChange={handleSleepChange}
          />
        ))}
      </div>

      {/* Guided 4-7-8 Breathing Modal */}
      <BreathingModal isOpen={breathingOpen} onClose={() => setBreathingOpen(false)} />

      {/* Interactive Answers Journal Modal */}
      <MyAnswersModal
        isOpen={answersModalOpen}
        onClose={() => setAnswersModalOpen(false)}
        exercises={exercises}
        sleepLog={sleepLog}
        onJumpToPage={navigateToPage}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
}
