import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Sparkles,
  School,
  CheckSquare,
  Square,
  BookOpen,
  ExternalLink,
  Loader2,
  Smartphone,
  User,
  Layers,
} from 'lucide-react';
import { RadioBroadcast } from '../types/radio';
import {
  PrintTemplateType,
  copyBroadcastAsText,
  exportBroadcastToWord,
  exportBroadcastToDirectPdf,
  printDocumentDirectly,
  openPrintInNewWindow,
} from '../utils/exportUtils';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: RadioBroadcast;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  broadcast,
}) => {
  const [template, setTemplate] = useState<PrintTemplateType>('student_pages');
  const [showSignatures, setShowSignatures] = useState(true);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Sync body class for print
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-print-active');
    } else {
      document.body.classList.remove('modal-print-active');
    }
    return () => {
      document.body.classList.remove('modal-print-active');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { schoolInfo } = broadcast;

  // Build active sections for student pages
  const sectionsList: Array<{
    id: string;
    num: number;
    title: string;
    icon: string;
    presenterName: string;
    presenterGrade?: string;
    duration: string;
    themeColor: string;
    themeBg: string;
    badgeBg: string;
    contentNode: React.ReactNode;
    guidance: string;
  }> = [];

  let count = 1;

  // 1. Intro
  sectionsList.push({
    id: 'intro',
    num: count++,
    title: 'المقدمة الإذاعية',
    icon: '🎙️',
    presenterName: broadcast.introduction.presenterName || 'مقدم البرنامج الإذاعي',
    presenterGrade: broadcast.introduction.presenterGrade,
    duration: '1.5 دقيقة',
    themeColor: 'border-emerald-700 text-emerald-900',
    themeBg: 'bg-emerald-50/70',
    badgeBg: 'bg-emerald-700 text-white',
    contentNode: (
      <div className="p-4 sm:p-5 bg-white border-2 border-emerald-300 rounded-xl shadow-xs">
        <div className="text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose text-slate-900 whitespace-pre-line text-justify font-bold">
          {broadcast.introduction.text}
        </div>
      </div>
    ),
    guidance: 'ابدأ بالبسملة والترحيب بالمعلمين والزملاء بنبرة صوت حماسية وواثقة.',
  });

  // 2. Quran
  if (broadcast.quran.enabled) {
    sectionsList.push({
      id: 'quran',
      num: count++,
      title: `القرآن الكريم (${broadcast.quran.data.surah})`,
      icon: '📖',
      presenterName: broadcast.quran.presenterName || 'قارئ القرآن الكريم',
      presenterGrade: broadcast.quran.presenterGrade,
      duration: '1.5 دقيقة',
      themeColor: 'border-emerald-800 text-emerald-950',
      themeBg: 'bg-emerald-50/90',
      badgeBg: 'bg-emerald-800 text-white',
      contentNode: (
        <div className="space-y-3 sm:space-y-4">
          <div className="text-center font-black text-emerald-900 text-sm sm:text-base">
            أعوذ بالله من الشيطان الرجيم • بسم الله الرحمن الرحيم
          </div>
          <div className="font-serif text-lg sm:text-2xl md:text-2.5xl text-center text-emerald-950 font-bold p-5 sm:p-6 bg-white border-2.5 border-emerald-400 rounded-2xl shadow-xs leading-loose">
            « {broadcast.quran.data.text} »
          </div>
          <div className="text-center font-black text-emerald-800 text-xs sm:text-sm">
            [ سورة {broadcast.quran.data.surah} - الآيات: {broadcast.quran.data.verses} ]
          </div>
        </div>
      ),
      guidance: 'رتل الآيات بخشوع وتمهل مع مراعاة أحكام التجويد ومخارج الحروف.',
    });
  }

  // 3. Hadith
  if (broadcast.hadith.enabled) {
    sectionsList.push({
      id: 'hadith',
      num: count++,
      title: 'الحديث الشريف',
      icon: '🕌',
      presenterName: broadcast.hadith.presenterName || 'قارئ الحديث الشريف',
      presenterGrade: broadcast.hadith.presenterGrade,
      duration: '1 دقيقة',
      themeColor: 'border-amber-700 text-amber-950',
      themeBg: 'bg-amber-50/80',
      badgeBg: 'bg-amber-700 text-white',
      contentNode: (
        <div className="space-y-3 sm:space-y-4">
          <div className="text-center font-black text-amber-900 text-sm sm:text-base">
            قال رسول الله ﷺ:
          </div>
          <div className="text-base sm:text-xl md:text-2xl text-center text-amber-950 font-bold p-5 sm:p-6 bg-white border-2.5 border-amber-300 rounded-2xl shadow-xs leading-loose">
            « {broadcast.hadith.data.text} »
          </div>
          <div className="text-center font-black text-amber-900 text-xs sm:text-sm">
            ({broadcast.hadith.data.narrator})
          </div>
        </div>
      ),
      guidance: 'اذكر الحديث بوضوح مع الصلاة على النبي ﷺ عند ذكره.',
    });
  }

  // 4. Speech
  if (broadcast.speech.enabled) {
    sectionsList.push({
      id: 'speech',
      num: count++,
      title: `كلمة الصباح: ${broadcast.speech.data.title}`,
      icon: '🎤',
      presenterName: broadcast.speech.presenterName || 'ملقي كلمة الصباح',
      presenterGrade: broadcast.speech.presenterGrade,
      duration: '2 دقيقة',
      themeColor: 'border-indigo-700 text-indigo-950',
      themeBg: 'bg-indigo-50/80',
      badgeBg: 'bg-indigo-700 text-white',
      contentNode: (
        <div className="p-4 sm:p-5 bg-white border-2 border-indigo-300 rounded-xl shadow-xs">
          <div className="text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose text-slate-900 whitespace-pre-line text-justify font-bold">
            {broadcast.speech.data.content}
          </div>
        </div>
      ),
      guidance: 'ألقِ الكلمة بنبرة واضحة ومؤثرة مع النظر إلى زملائك ومعلميك.',
    });
  }

  // 5. Did You Know
  if (broadcast.didYouKnow.enabled) {
    sectionsList.push({
      id: 'didYouKnow',
      num: count++,
      title: 'فقرة هل تعلم؟',
      icon: '💡',
      presenterName: broadcast.didYouKnow.presenterName || 'مقدم فقرة هل تعلم',
      presenterGrade: broadcast.didYouKnow.presenterGrade,
      duration: '1.5 دقيقة',
      themeColor: 'border-cyan-700 text-cyan-950',
      themeBg: 'bg-cyan-50/80',
      badgeBg: 'bg-cyan-700 text-white',
      contentNode: (
        <div className="space-y-2.5 sm:space-y-3">
          {broadcast.didYouKnow.items.map((it, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-white border-2 border-cyan-300 rounded-xl shadow-xs"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-700 text-white font-black flex items-center justify-center text-sm sm:text-base shrink-0">
                {idx + 1}
              </div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-cyan-950 leading-snug sm:leading-normal">
                هل تعلم أن {it}
              </div>
            </div>
          ))}
        </div>
      ),
      guidance: 'ابدأ كل معلومة بعبارة (هل تعلم أن...) بصوت مسموع وواضح.',
    });
  }

  // 6. Wisdom
  if (broadcast.wisdom.enabled) {
    sectionsList.push({
      id: 'wisdom',
      num: count++,
      title: 'حكمة اليوم',
      icon: '💎',
      presenterName: broadcast.wisdom.presenterName || 'مقدم الحكمة',
      presenterGrade: broadcast.wisdom.presenterGrade,
      duration: '1 دقيقة',
      themeColor: 'border-teal-700 text-teal-950',
      themeBg: 'bg-teal-50/80',
      badgeBg: 'bg-teal-700 text-white',
      contentNode: (
        <div className="p-6 sm:p-8 bg-white border-2.5 border-teal-300 rounded-2xl shadow-xs text-center space-y-3">
          <div className="text-lg sm:text-2xl md:text-2.5xl font-black italic text-teal-950 leading-relaxed sm:leading-loose">
            « {broadcast.wisdom.data.text} »
          </div>
          {broadcast.wisdom.data.author && (
            <div className="text-sm sm:text-base font-bold text-teal-800">
              - {broadcast.wisdom.data.author}
            </div>
          )}
        </div>
      ),
      guidance: 'ألقِ الحكمة بتمهل مع التركيز على مغزاها التربوي الجميل.',
    });
  }

  // 7. Poetry
  if (broadcast.poetry.enabled) {
    sectionsList.push({
      id: 'poetry',
      num: count++,
      title: 'فقرة الشعر والأدب',
      icon: '📜',
      presenterName: broadcast.poetry.presenterName || 'ملقي الشعر',
      presenterGrade: broadcast.poetry.presenterGrade,
      duration: '1.5 دقيقة',
      themeColor: 'border-purple-700 text-purple-950',
      themeBg: 'bg-purple-50/80',
      badgeBg: 'bg-purple-700 text-white',
      contentNode: (
        <div className="p-6 sm:p-8 bg-white border-2.5 border-purple-300 rounded-2xl shadow-xs text-center">
          <div className="font-serif text-base sm:text-xl md:text-2xl font-bold text-purple-950 whitespace-pre-line leading-relaxed sm:leading-loose">
            {broadcast.poetry.data.verses}
          </div>
        </div>
      ),
      guidance: 'ألقِ الأبيات بنغمة شعرية معبرة وواضحة.',
    });
  }

  // 8. Quiz
  if (broadcast.quiz.enabled) {
    sectionsList.push({
      id: 'quiz',
      num: count++,
      title: 'سؤال وجائزة الصباح',
      icon: '🎁',
      presenterName: broadcast.quiz.presenterName || 'مقدم المسابقة',
      presenterGrade: broadcast.quiz.presenterGrade,
      duration: '2 دقيقة',
      themeColor: 'border-rose-700 text-rose-950',
      themeBg: 'bg-rose-50/80',
      badgeBg: 'bg-rose-700 text-white',
      contentNode: (
        <div className="space-y-3 sm:space-y-4">
          <div className="p-4 sm:p-5 bg-white border-2 border-rose-300 rounded-xl shadow-xs space-y-1.5">
            <div className="text-xs font-bold text-rose-600">السؤال المطروح للطلاب:</div>
            <div className="text-base sm:text-lg md:text-xl font-black text-rose-950 leading-relaxed">
              {broadcast.quiz.data.question}
            </div>
          </div>
          <div className="p-3.5 sm:p-4 bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-xl">
            <div className="text-xs font-bold text-emerald-800">الإجابة النموذجية الصحيحة:</div>
            <div className="text-sm sm:text-base md:text-lg font-black text-emerald-950 mt-1">
              {broadcast.quiz.data.answer}
            </div>
          </div>
        </div>
      ),
      guidance: 'اطرح السؤال مرتين بوضوح، وادعُ أحد الزملاء للإجابة واستلام الجائزة.',
    });
  }

  // 9. Supplication
  if (broadcast.supplication.enabled) {
    sectionsList.push({
      id: 'supplication',
      num: count++,
      title: 'دعاء الصباح',
      icon: '🤲',
      presenterName: broadcast.supplication.presenterName || 'قارئ الدعاء',
      presenterGrade: broadcast.supplication.presenterGrade,
      duration: '1 دقيقة',
      themeColor: 'border-blue-700 text-blue-950',
      themeBg: 'bg-blue-50/80',
      badgeBg: 'bg-blue-700 text-white',
      contentNode: (
        <div className="p-6 sm:p-8 bg-white border-2.5 border-blue-300 rounded-2xl shadow-xs text-center space-y-3">
          <div className="text-base sm:text-xl md:text-2xl font-bold text-blue-950 whitespace-pre-line leading-relaxed sm:leading-loose">
            {broadcast.supplication.text}
          </div>
          <div className="text-sm sm:text-lg font-black text-blue-700">
            « اللَّهُمَّ آمِين .. اللَّهُمَّ آمِين »
          </div>
        </div>
      ),
      guidance: 'ادعُ بخشوع وسكينة، واطلب من الجميع التأمين خلفك.',
    });
  }

  // 10. Outro
  sectionsList.push({
    id: 'outro',
    num: count++,
    title: 'الخاتمة الإذاعية',
    icon: '🏁',
    presenterName: broadcast.outro.presenterName || 'مقدم البرنامج الإذاعي',
    presenterGrade: broadcast.outro.presenterGrade,
    duration: '1 دقيقة',
    themeColor: 'border-slate-700 text-slate-900',
    themeBg: 'bg-slate-50',
    badgeBg: 'bg-slate-800 text-white',
    contentNode: (
      <div className="p-4 sm:p-5 bg-white border-2 border-slate-300 rounded-xl shadow-xs">
        <div className="text-base sm:text-lg md:text-xl leading-relaxed sm:leading-loose text-slate-900 whitespace-pre-line text-justify font-bold">
          {broadcast.outro.text}
        </div>
      </div>
    ),
    guidance: 'اختم الإذاعة بالشكر للمدير والمعلمين والطلاب، وتمنَّ لهم يوماً دراسياً موفقاً.',
  });

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const filename = `بطاقات_الإذاعة_${broadcast.topic ? broadcast.topic.replace(/\s+/g, '_') : 'مدرسية'}.pdf`;
      const success = await exportBroadcastToDirectPdf('printable-broadcast-document', filename);
      if (!success) {
        openPrintInNewWindow(broadcast, template, { showSignatures, isGrayscale });
      }
    } catch (e) {
      console.error(e);
      openPrintInNewWindow(broadcast, template, { showSignatures, isGrayscale });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleTriggerPrint = () => {
    printDocumentDirectly();
  };

  return (
    <div
      id="print-portal-container"
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 backdrop-blur-xs overflow-y-auto print:static print:bg-white print:overflow-visible print:p-0"
    >
      {/* Top Controls Toolbar */}
      <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white px-3 py-2 sm:px-6 sm:py-2.5 shadow-xl print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* Template Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 font-bold shrink-0">نمط الطباعة:</span>
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
              <button
                onClick={() => setTemplate('student_pages')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  template === 'student_pages'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>📑 صفحة كاملة لكل قسم باسم الطالب (10 صفحات مضبوطة)</span>
              </button>

              <button
                onClick={() => setTemplate('official_single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  template === 'official_single'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>📄 تقرير الإدارة (صفحة A4 شاملة)</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setShowSignatures(!showSignatures)}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="إظهار أو إخفاء التواقيع"
            >
              {showSignatures ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
              <span className="text-xs">التواقيع</span>
            </button>

            {/* Direct PDF Download */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black transition shadow-md shadow-emerald-500/25 cursor-pointer active:scale-95 disabled:opacity-50"
              title="تنزيل ملف PDF فوري عالي الدقة"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري إنشاء PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تحميل PDF ({template === 'student_pages' ? '10 صفحات لكل قسم' : 'صفحة شاملة'})</span>
                </>
              )}
            </button>

            {/* Print button */}
            <button
              onClick={handleTriggerPrint}
              className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-bold transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة فورية</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-3 sm:p-5 flex justify-center items-start print:p-0 print:m-0 print:w-full">
        <div
          id="printable-broadcast-document"
          className="w-full max-w-[210mm] text-slate-900 print:w-full print:max-w-none print:m-0"
        >
          {/* ========================================================================= */}
          {/* TEMPLATE: MULTI-PAGE INDIVIDUAL STUDENT CARDS (EXACT 1 PAGE EACH)          */}
          {/* ========================================================================= */}
          {template === 'student_pages' && (
            <div className="space-y-6 print:space-y-0">
              {sectionsList.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="student-page-render-card bg-white p-3.5 sm:p-5 border-2 border-slate-900 rounded-xl shadow-lg print:shadow-none print:rounded-none print:border-2 print:border-slate-900 flex flex-col justify-between"
                  style={{
                    pageBreakAfter: idx < sectionsList.length - 1 ? 'always' : 'avoid',
                    breakAfter: idx < sectionsList.length - 1 ? 'page' : 'avoid',
                    minHeight: '235mm',
                    height: '245mm',
                    maxHeight: '248mm',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top School Header (Compact & Crisp) */}
                  <div className="border-b-2 border-slate-900 pb-1.5 flex justify-between items-center shrink-0">
                    <div className="text-right space-y-0.5">
                      <div className="font-bold text-[11px] text-slate-900">
                        {schoolInfo.countryMinistry || 'وزارة التعليم'}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {schoolInfo.educationDirectorate || 'الإدارة التعليمية'}
                      </div>
                      <div className="font-black text-xs text-emerald-900">
                        {schoolInfo.schoolName || 'اسم المدرسة'}
                      </div>
                    </div>

                    <div className="text-center space-y-0.5">
                      <div className="inline-block px-2.5 py-0.5 border border-slate-900 rounded-full font-black text-[11px] bg-slate-50 text-slate-900">
                        بطاقة إلقاء الفقرة الإذاعية
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        الموضوع: <span className="text-emerald-800 font-black">{broadcast.topic}</span>
                      </div>
                    </div>

                    <div className="text-left space-y-0.5 text-[11px] font-bold" dir="rtl">
                      <div>اليوم: <strong className="text-slate-900">{schoolInfo.dayOfWeek}</strong></div>
                      <div className="text-slate-600 font-medium text-[10px]">{schoolInfo.hijriDate}</div>
                      <div className="text-slate-500 font-medium text-[9px]">{schoolInfo.academicYear}</div>
                    </div>
                  </div>

                  {/* Presenter & Section Hero Banner */}
                  <div
                    className={`my-2 p-2.5 sm:p-3 rounded-xl border-1.5 flex justify-between items-center gap-2.5 shrink-0 ${sec.themeBg} ${sec.themeColor}`}
                  >
                    <div>
                      <div className="text-[11px] font-bold text-slate-600">الفقرة رقم ({sec.num}):</div>
                      <h2 className="text-base sm:text-xl font-black mt-0.5 flex items-center gap-1.5">
                        <span>{sec.icon}</span>
                        <span>{sec.title}</span>
                      </h2>
                    </div>

                    <div className="bg-white border border-slate-900 px-3 py-1.5 rounded-lg shadow-xs text-left shrink-0">
                      <div className="text-[9px] font-bold text-slate-500">الطالب الملقي:</div>
                      <div className="text-sm sm:text-base font-black text-emerald-900">
                        {sec.presenterName}
                      </div>
                      {sec.presenterGrade && (
                        <div className="text-[10px] font-bold text-slate-600">
                          الصف: {sec.presenterGrade}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Content (Enlarged and Fills the Page Center) */}
                  <div className="flex-1 flex flex-col justify-center my-auto py-1">
                    {sec.contentNode}
                  </div>

                  {/* Bottom: Stage Guidance & Supervisor Sign */}
                  <div className="mt-1.5 pt-1.5 border-t-1.5 border-slate-900 space-y-1.5 shrink-0">
                    <div className="p-2 bg-slate-50 border border-dashed border-slate-400 rounded-lg text-[11px] text-slate-700 flex items-center justify-between">
                      <div>
                        <strong>💡 إرشادات الإلقاء:</strong> {sec.guidance}
                      </div>
                      <span className="font-bold bg-slate-200 px-1.5 py-0.5 rounded text-[10px] shrink-0">
                        ⏱️ {sec.duration}
                      </span>
                    </div>

                    {showSignatures && (
                      <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-700 px-1 pt-1 border-t border-slate-200">
                        <div>مشرف الإذاعة: {schoolInfo.broadcastSupervisor || '...........................'}</div>
                        <div className="text-slate-400 text-[10px]">ختم المدرسة ⭕</div>
                        <div>مدير / مديرة المدرسة: {schoolInfo.schoolPrincipal || '...........................'}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE: OFFICIAL SINGLE-PAGE A4 OVERVIEW                                */}
          {/* ========================================================================= */}
          {template === 'official_single' && (
            <div className="p-4 sm:p-5 border-2 border-slate-900 rounded-xl bg-white text-[10pt] leading-tight space-y-2">
              <div className="border-b-2 border-slate-900 pb-1.5 flex justify-between items-start">
                <div className="text-right space-y-0.5">
                  <div className="font-bold text-[10px] text-slate-900">{schoolInfo.countryMinistry || 'وزارة التعليم'}</div>
                  <div className="text-[9px] text-slate-600">{schoolInfo.educationDirectorate || 'الإدارة العامة للتعليم'}</div>
                  <div className="font-black text-[11px] text-emerald-900">{schoolInfo.schoolName || 'اسم المدرسة'}</div>
                </div>

                <div className="text-center space-y-0.5">
                  <div className="w-6 h-6 rounded-full border border-slate-900 flex items-center justify-center mx-auto bg-slate-50">
                    <BookOpen className="w-3 h-3 text-slate-900" />
                  </div>
                  <div className="font-black text-[10.5px] text-slate-900">البرنامج الإذاعي اليومي</div>
                  <div className="text-[8px] text-slate-500">{schoolInfo.semester} • {schoolInfo.academicYear}</div>
                </div>

                <div className="text-left space-y-0.5 text-[9.5px]" dir="rtl">
                  <div>اليوم: <strong className="text-slate-900">{schoolInfo.dayOfWeek}</strong></div>
                  <div className="text-slate-600 text-[9px]">{schoolInfo.hijriDate}</div>
                  <div className="text-slate-500 text-[8.5px]">المرحلة: {schoolInfo.schoolStage}</div>
                </div>
              </div>

              <div className="text-center py-1 bg-slate-100 border border-slate-300 rounded-md">
                <h1 className="text-sm font-black text-slate-900">🎙️ {broadcast.title}</h1>
                <p className="text-[9px] text-slate-600 font-semibold">موضوع الإذاعة: <span className="text-emerald-900 font-bold">{broadcast.topic}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                <div className="border border-slate-300 rounded-md p-1.5 bg-slate-50/60">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-0.5 mb-1 font-bold">
                    <span className="text-emerald-900">🎙️ المقدمة الإذاعية</span>
                    <span className="text-[8px] bg-white px-1 border border-slate-300 rounded">{broadcast.introduction.presenterName}</span>
                  </div>
                  <p className="line-clamp-3 leading-relaxed">{broadcast.introduction.text}</p>
                </div>

                {broadcast.quran.enabled && (
                  <div className="border border-emerald-400 rounded-md p-1.5 bg-emerald-50/40">
                    <div className="flex justify-between items-center border-b border-emerald-200 pb-0.5 mb-1 font-bold text-emerald-950">
                      <span>📖 القرآن الكريم ({broadcast.quran.data.surah})</span>
                      <span className="text-[8px] bg-white px-1 border border-emerald-300 rounded">{broadcast.quran.presenterName}</span>
                    </div>
                    <p className="font-serif text-center font-bold text-emerald-950 line-clamp-3 leading-relaxed">{broadcast.quran.data.text}</p>
                  </div>
                )}

                {broadcast.hadith.enabled && (
                  <div className="border border-amber-400 rounded-md p-1.5 bg-amber-50/40">
                    <div className="flex justify-between items-center border-b border-amber-200 pb-0.5 mb-1 font-bold text-amber-950">
                      <span>🕌 الحديث الشريف</span>
                      <span className="text-[8px] bg-white px-1 border border-amber-300 rounded">{broadcast.hadith.presenterName}</span>
                    </div>
                    <p className="line-clamp-3 leading-relaxed">{broadcast.hadith.data.text}</p>
                  </div>
                )}

                {broadcast.speech.enabled && (
                  <div className="border border-indigo-300 rounded-md p-1.5 bg-indigo-50/30">
                    <div className="flex justify-between items-center border-b border-indigo-200 pb-0.5 mb-1 font-bold text-indigo-950">
                      <span>🎤 كلمة الصباح: {broadcast.speech.data.title}</span>
                      <span className="text-[8px] bg-white px-1 border border-indigo-300 rounded">{broadcast.speech.presenterName}</span>
                    </div>
                    <p className="line-clamp-3 leading-relaxed">{broadcast.speech.data.content}</p>
                  </div>
                )}
              </div>

              {showSignatures && (
                <div className="pt-1 border-t-2 border-slate-900 grid grid-cols-3 text-center text-[9px] font-bold text-slate-800">
                  <div>مقدم الإذاعة: {schoolInfo.headStudent || '...........'}</div>
                  <div>مشرف الإذاعة: {schoolInfo.broadcastSupervisor || '...........'}</div>
                  <div>مدير المدرسة: {schoolInfo.schoolPrincipal || '...........'}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
