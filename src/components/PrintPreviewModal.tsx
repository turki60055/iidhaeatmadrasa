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
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';
import { RadioBroadcast } from '../types/radio';
import { copyBroadcastAsText, exportBroadcastToWord } from '../utils/exportUtils';

export type PrintTemplateType = 'official_single' | 'modern_single' | 'cue_sheet' | 'detailed' | 'student_cards';

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
  const [template, setTemplate] = useState<PrintTemplateType>('official_single');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('sm');
  const [showSignatures, setShowSignatures] = useState(true);
  const [showHeaders, setShowHeaders] = useState(true);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync body class for clean print isolation
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

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = copyBroadcastAsText(broadcast);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/85 backdrop-blur-sm overflow-y-auto print:static print:bg-white print:overflow-visible">
      {/* Top Controls Toolbar (Hidden completely when printing) */}
      <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 text-white px-3 py-2.5 sm:px-6 sm:py-3 flex flex-wrap items-center justify-between gap-2 shadow-xl print:hidden">
        {/* Template Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <span className="text-xs text-slate-400 font-bold hidden md:inline shrink-0">النموذج:</span>
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
            <button
              onClick={() => setTemplate('official_single')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                template === 'official_single'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📄 الرسمي (صفحة واحدة A4)</span>
            </button>
            <button
              onClick={() => setTemplate('modern_single')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                template === 'modern_single'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🎨 العصري (صفحة واحدة)</span>
            </button>
            <button
              onClick={() => setTemplate('cue_sheet')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                template === 'cue_sheet'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📊 جدول الميكروفون</span>
            </button>
            <button
              onClick={() => setTemplate('detailed')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer hidden sm:flex items-center gap-1 ${
                template === 'detailed'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📑 المفصل الكامل</span>
            </button>
            <button
              onClick={() => setTemplate('student_cards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer hidden sm:flex items-center gap-1 ${
                template === 'student_cards'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📇 بطاقات الطلاب</span>
            </button>
          </div>
        </div>

        {/* Formatting & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Font Size Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <span className="text-[11px] text-slate-400 px-1.5 hidden sm:inline">الخط:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded text-xs ${fontSize === 'sm' ? 'bg-emerald-600 font-bold text-white' : 'text-slate-300'}`}
              title="خط صغير ملائم لصفحة واحدة"
            >
              مدمج (A4)
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-2 py-1 rounded text-xs ${fontSize === 'md' ? 'bg-emerald-600 font-bold text-white' : 'text-slate-300'}`}
            >
              متوسط
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded text-xs hidden sm:block ${fontSize === 'lg' ? 'bg-emerald-600 font-bold text-white' : 'text-slate-300'}`}
            >
              كبير
            </button>
          </div>

          {/* Toggles */}
          <button
            onClick={() => setShowSignatures(!showSignatures)}
            className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {showSignatures ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
            <span className="text-xs">التواقيع</span>
          </button>

          <button
            onClick={() => setIsGrayscale(!isGrayscale)}
            className="hidden sm:flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isGrayscale ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
            <span>أبيض وأسود</span>
          </button>

          {/* Word Download */}
          <button
            onClick={() => exportBroadcastToWord(broadcast)}
            className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow"
            title="تحميل مستند Word قابل للتعديل"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Word</span>
          </button>

          {/* Direct Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black transition shadow-md shadow-emerald-500/25 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة فورية</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Print Paper Canvas */}
      <div className="flex-1 p-2 sm:p-6 flex justify-center items-start print:p-0 print:m-0 print:w-full">
        <div
          className={`printable-paper w-full max-w-[210mm] bg-white text-slate-900 shadow-2xl print:shadow-none print:w-full print:max-w-none print:m-0 transition-all ${
            isGrayscale ? 'filter grayscale' : ''
          }`}
        >
          {/* ========================================================================= */}
          {/* TEMPLATE 1: OFFICIAL SINGLE-PAGE A4 (GUARANTEED TO FIT 1 SINGLE PAGE)      */}
          {/* ========================================================================= */}
          {template === 'official_single' && (
            <div className="p-4 sm:p-6 print:p-4 border-2 sm:border-4 border-slate-900 text-slate-900 space-y-2.5 print:space-y-2 bg-white text-[11px] leading-tight">
              {/* Header */}
              {showHeaders && (
                <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-start">
                  <div className="text-right space-y-0.5">
                    <div className="font-bold text-xs text-slate-900">
                      {schoolInfo.countryMinistry || 'وزارة التعليم'}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      {schoolInfo.educationDirectorate || 'الإدارة العامة للتعليم'}
                    </div>
                    <div className="font-extrabold text-xs text-emerald-900">
                      {schoolInfo.schoolName || 'اسم المدرسة'}
                    </div>
                  </div>

                  <div className="text-center space-y-0.5">
                    <div className="w-8 h-8 rounded-full border border-slate-900 flex items-center justify-center mx-auto bg-slate-50 text-slate-900">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="font-black text-xs text-slate-900">البرنامج الإذاعي اليومي</div>
                    <div className="text-[9px] text-slate-500">
                      {schoolInfo.semester} • {schoolInfo.academicYear}
                    </div>
                  </div>

                  <div className="text-left space-y-0.5" dir="rtl">
                    <div className="text-[10px]">
                      اليوم: <strong className="text-slate-900">{schoolInfo.dayOfWeek}</strong>
                    </div>
                    <div className="text-[10px] text-slate-600">{schoolInfo.hijriDate}</div>
                    <div className="text-[9px] text-slate-500">المرحلة: {schoolInfo.schoolStage}</div>
                  </div>
                </div>
              )}

              {/* Title Banner */}
              <div className="text-center py-1.5 px-3 bg-slate-100 border border-slate-300 rounded-lg">
                <h1 className="text-sm sm:text-base font-black text-slate-900">
                  🎙️ {broadcast.title}
                </h1>
                <p className="text-[10px] text-slate-600 font-semibold">
                  موضوع الإذاعة: <span className="text-emerald-900 font-bold">{broadcast.topic}</span>
                </p>
              </div>

              {/* Compact 2-Column / Flow Grid Designed specifically for 1-Page A4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2 text-[10.5px]">
                {/* 1. Introduction */}
                <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/60 avoid-break">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-1 font-bold text-slate-900">
                    <span className="text-emerald-900">🎙️ المقدمة الإذاعية</span>
                    {broadcast.introduction.presenterName && (
                      <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-slate-300">
                        {broadcast.introduction.presenterName}
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-slate-800 line-clamp-4">
                    {broadcast.introduction.text}
                  </p>
                </div>

                {/* 2. Quran */}
                {broadcast.quran.enabled && (
                  <div className="border border-emerald-400 rounded-lg p-2 bg-emerald-50/40 avoid-break">
                    <div className="flex justify-between items-center border-b border-emerald-200 pb-1 mb-1 font-bold text-emerald-950">
                      <span>📖 القرآن الكريم ({broadcast.quran.data.surah})</span>
                      {broadcast.quran.presenterName && (
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-emerald-300">
                          {broadcast.quran.presenterName}
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-center text-emerald-950 leading-relaxed line-clamp-3">
                      {broadcast.quran.data.text}
                    </p>
                  </div>
                )}

                {/* 3. Hadith */}
                {broadcast.hadith.enabled && (
                  <div className="border border-amber-400 rounded-lg p-2 bg-amber-50/40 avoid-break">
                    <div className="flex justify-between items-center border-b border-amber-200 pb-1 mb-1 font-bold text-amber-950">
                      <span>🕌 الحديث الشريف</span>
                      {broadcast.hadith.presenterName && (
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-amber-300">
                          {broadcast.hadith.presenterName}
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed text-slate-900 line-clamp-3">
                      {broadcast.hadith.data.text}
                    </p>
                    <div className="text-[9px] text-amber-800 mt-0.5">
                      ({broadcast.hadith.data.narrator})
                    </div>
                  </div>
                )}

                {/* 4. Speech */}
                {broadcast.speech.enabled && (
                  <div className="border border-indigo-300 rounded-lg p-2 bg-indigo-50/30 avoid-break">
                    <div className="flex justify-between items-center border-b border-indigo-200 pb-1 mb-1 font-bold text-indigo-950">
                      <span>🎤 كلمة الصباح: {broadcast.speech.data.title}</span>
                      {broadcast.speech.presenterName && (
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-indigo-300">
                          {broadcast.speech.presenterName}
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed text-slate-800 line-clamp-4">
                      {broadcast.speech.data.content}
                    </p>
                  </div>
                )}

                {/* 5. Did You Know */}
                {broadcast.didYouKnow.enabled && (
                  <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/60 avoid-break">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-1 font-bold text-slate-900">
                      <span>💡 هل تعلم؟</span>
                      {broadcast.didYouKnow.presenterName && (
                        <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-slate-300">
                          {broadcast.didYouKnow.presenterName}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-0.5 list-disc list-inside text-slate-800">
                      {broadcast.didYouKnow.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="line-clamp-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 6. Wisdom & Poetry */}
                <div className="grid grid-cols-2 gap-1.5 avoid-break">
                  {broadcast.wisdom.enabled && (
                    <div className="border border-teal-300 rounded-lg p-1.5 bg-teal-50/30">
                      <div className="font-bold text-teal-950 text-[10px] mb-0.5 flex justify-between">
                        <span>💎 حكمة اليوم</span>
                        <span>{broadcast.wisdom.presenterName}</span>
                      </div>
                      <p className="italic text-slate-800 text-[9.5px] leading-tight line-clamp-2">
                        « {broadcast.wisdom.data.text} »
                      </p>
                    </div>
                  )}

                  {broadcast.poetry.enabled && (
                    <div className="border border-purple-300 rounded-lg p-1.5 bg-purple-50/30">
                      <div className="font-bold text-purple-950 text-[10px] mb-0.5 flex justify-between">
                        <span>📜 الشعر</span>
                        <span>{broadcast.poetry.presenterName}</span>
                      </div>
                      <p className="font-serif text-purple-950 text-[9.5px] text-center whitespace-pre-line line-clamp-2">
                        {broadcast.poetry.data.verses}
                      </p>
                    </div>
                  )}
                </div>

                {/* 7. Quiz & Supplication */}
                <div className="grid grid-cols-2 gap-1.5 avoid-break">
                  {broadcast.quiz.enabled && (
                    <div className="border border-rose-300 rounded-lg p-1.5 bg-rose-50/30">
                      <div className="font-bold text-rose-950 text-[10px] mb-0.5 flex justify-between">
                        <span>🎁 سؤال وجائزة</span>
                        <span>{broadcast.quiz.presenterName}</span>
                      </div>
                      <div className="text-[9.5px] text-slate-900 line-clamp-1">
                        <strong>س:</strong> {broadcast.quiz.data.question}
                      </div>
                      <div className="text-[9.5px] text-emerald-800 line-clamp-1">
                        <strong>ج:</strong> {broadcast.quiz.data.answer}
                      </div>
                    </div>
                  )}

                  {broadcast.supplication.enabled && (
                    <div className="border border-blue-300 rounded-lg p-1.5 bg-blue-50/30">
                      <div className="font-bold text-blue-950 text-[10px] mb-0.5 flex justify-between">
                        <span>🤲 دعاء الصباح</span>
                        <span>{broadcast.supplication.presenterName}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-800 leading-tight line-clamp-2">
                        {broadcast.supplication.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* 8. Outro */}
                <div className="border border-slate-300 rounded-lg p-2 bg-slate-50/60 md:col-span-2 print:col-span-2 avoid-break">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1 mb-1 font-bold text-slate-900">
                    <span>🏁 الخاتمة الإذاعية</span>
                    {broadcast.outro.presenterName && (
                      <span className="text-[9px] bg-white px-1.5 py-0.2 rounded border border-slate-300">
                        {broadcast.outro.presenterName}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 leading-relaxed line-clamp-2">
                    {broadcast.outro.text}
                  </p>
                </div>
              </div>

              {/* Signatures Row */}
              {showSignatures && (
                <div className="pt-2 border-t-2 border-slate-900 mt-2 avoid-break">
                  <div className="grid grid-cols-3 text-center text-[10.5px] font-bold text-slate-800">
                    <div>
                      <div>مقدم الإذاعة</div>
                      <div className="text-slate-900 font-extrabold mt-2">
                        {schoolInfo.headStudent || '...........................'}
                      </div>
                    </div>
                    <div>
                      <div>مشرف الإذاعة المدرسية</div>
                      <div className="text-slate-900 font-extrabold mt-2">
                        {schoolInfo.broadcastSupervisor || '...........................'}
                      </div>
                    </div>
                    <div>
                      <div>مدير / مديرة المدرسة</div>
                      <div className="text-slate-900 font-extrabold mt-2">
                        {schoolInfo.schoolPrincipal || '...........................'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-200 pt-1">
                    <span>منصة أثير للإذاعة المدرسية الذكية</span>
                    <span>ختم المدرسة الرسمي ⭕</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 2: MODERN CLEAN ACADEMIC (SINGLE PAGE A4)                        */}
          {/* ========================================================================= */}
          {template === 'modern_single' && (
            <div className="p-4 sm:p-6 print:p-4 text-slate-900 space-y-2.5 print:space-y-2 bg-white text-[11px] leading-tight">
              {/* Modern Ribbon Header */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-3.5 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-emerald-200 font-bold">
                    {schoolInfo.countryMinistry || 'وزارة التعليم'} • {schoolInfo.educationDirectorate || 'الإدارة التعليمية'}
                  </div>
                  <h1 className="text-base sm:text-lg font-black mt-0.5">{broadcast.title}</h1>
                  <p className="text-xs text-emerald-100 font-bold">{schoolInfo.schoolName || 'اسم المدرسة'}</p>
                </div>
                <div className="text-left text-[10px] text-emerald-100 font-medium" dir="rtl">
                  <div>اليوم: <strong className="text-white">{schoolInfo.dayOfWeek}</strong></div>
                  <div>{schoolInfo.hijriDate}</div>
                  <div>{schoolInfo.semester}</div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2 text-[10.5px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 avoid-break">
                  <h3 className="font-bold text-emerald-900 mb-1 flex justify-between">
                    <span>المقدمة الإذاعية</span>
                    <span className="text-[9px] text-slate-500">{broadcast.introduction.presenterName}</span>
                  </h3>
                  <p className="leading-relaxed line-clamp-4">{broadcast.introduction.text}</p>
                </div>

                {broadcast.quran.enabled && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 avoid-break">
                    <h3 className="font-bold text-emerald-950 mb-1 flex justify-between">
                      <span>القرآن الكريم ({broadcast.quran.data.surah})</span>
                      <span className="text-[9px] text-emerald-800">{broadcast.quran.presenterName}</span>
                    </h3>
                    <p className="font-serif text-center leading-relaxed text-emerald-950 line-clamp-3">
                      {broadcast.quran.data.text}
                    </p>
                  </div>
                )}

                {broadcast.hadith.enabled && (
                  <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 avoid-break">
                    <h3 className="font-bold text-amber-950 mb-1 flex justify-between">
                      <span>الحديث الشريف</span>
                      <span className="text-[9px] text-amber-800">{broadcast.hadith.presenterName}</span>
                    </h3>
                    <p className="leading-relaxed line-clamp-3">{broadcast.hadith.data.text}</p>
                    <div className="text-[9px] text-amber-800 mt-0.5">({broadcast.hadith.data.narrator})</div>
                  </div>
                )}

                {broadcast.speech.enabled && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-200 avoid-break">
                    <h3 className="font-bold text-indigo-950 mb-1 flex justify-between">
                      <span>كلمة الصباح: {broadcast.speech.data.title}</span>
                      <span className="text-[9px] text-indigo-800">{broadcast.speech.presenterName}</span>
                    </h3>
                    <p className="leading-relaxed line-clamp-4">{broadcast.speech.data.content}</p>
                  </div>
                )}

                {broadcast.didYouKnow.enabled && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 avoid-break">
                    <h3 className="font-bold text-slate-900 mb-1 flex justify-between">
                      <span>هل تعلم؟</span>
                      <span className="text-[9px] text-slate-500">{broadcast.didYouKnow.presenterName}</span>
                    </h3>
                    <ul className="space-y-0.5 list-disc list-inside">
                      {broadcast.didYouKnow.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="line-clamp-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 avoid-break">
                  <h3 className="font-bold text-slate-900 mb-1 flex justify-between">
                    <span>الخاتمة الإذاعية</span>
                    <span className="text-[9px] text-slate-500">{broadcast.outro.presenterName}</span>
                  </h3>
                  <p className="leading-relaxed line-clamp-3">{broadcast.outro.text}</p>
                </div>
              </div>

              {/* Signatures */}
              {showSignatures && (
                <div className="grid grid-cols-2 pt-2 border-t border-slate-200 text-center text-[10.5px] font-bold text-slate-700 avoid-break">
                  <div>مشرف الإذاعة: {schoolInfo.broadcastSupervisor || '...........................'}</div>
                  <div>قائد / مدير المدرسة: {schoolInfo.schoolPrincipal || '...........................'}</div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 3: RADIO CUE SHEET (ORGANIZER TABLE - SINGLE PAGE A4)             */}
          {/* ========================================================================= */}
          {template === 'cue_sheet' && (
            <div className="p-4 sm:p-6 print:p-4 text-slate-900 space-y-3 bg-white text-[11px]">
              <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-center">
                <div>
                  <h1 className="text-sm sm:text-base font-black text-slate-900">
                    جدول تنظيم البث الإذاعي الصباحي
                  </h1>
                  <p className="text-[10px] text-slate-600 font-bold">
                    {schoolInfo.schoolName} | {schoolInfo.dayOfWeek} ({schoolInfo.hijriDate})
                  </p>
                </div>
                <div className="text-left font-bold text-xs">
                  موضوع اليوم: <span className="text-emerald-700">{broadcast.topic}</span>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold">
                    <th className="border border-slate-300 p-1.5 w-8 text-center">#</th>
                    <th className="border border-slate-300 p-1.5 w-24 text-right">الفقرة</th>
                    <th className="border border-slate-300 p-1.5 w-32 text-right">الطالب المشارك</th>
                    <th className="border border-slate-300 p-1.5 text-right">نص وملاحظات الفقرة</th>
                    <th className="border border-slate-300 p-1.5 w-12 text-center">المدة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center font-bold">1</td>
                    <td className="border border-slate-300 p-1.5 font-bold">المقدمة</td>
                    <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                      {broadcast.introduction.presenterName || 'مقدم الإذاعة'}
                    </td>
                    <td className="border border-slate-300 p-1.5 text-slate-700 line-clamp-2">
                      {broadcast.introduction.text.substring(0, 100)}...
                    </td>
                    <td className="border border-slate-300 p-1.5 text-center">1 د</td>
                  </tr>

                  {broadcast.quran.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">2</td>
                      <td className="border border-slate-300 p-1.5 font-bold">القرآن الكريم</td>
                      <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                        {broadcast.quran.presenterName || 'القارئ'}
                      </td>
                      <td className="border border-slate-300 p-1.5 font-serif text-emerald-950">
                        {broadcast.quran.data.surah} ({broadcast.quran.data.verses})
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">1 د</td>
                    </tr>
                  )}

                  {broadcast.hadith.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">3</td>
                      <td className="border border-slate-300 p-1.5 font-bold">الحديث الشريف</td>
                      <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                        {broadcast.hadith.presenterName}
                      </td>
                      <td className="border border-slate-300 p-1.5">
                        {broadcast.hadith.data.text.substring(0, 80)}...
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  {broadcast.speech.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">4</td>
                      <td className="border border-slate-300 p-1.5 font-bold">كلمة الصباح</td>
                      <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                        {broadcast.speech.presenterName}
                      </td>
                      <td className="border border-slate-300 p-1.5">
                        {broadcast.speech.data.title}: {broadcast.speech.data.content.substring(0, 80)}...
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">1.5 د</td>
                    </tr>
                  )}

                  {broadcast.didYouKnow.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">5</td>
                      <td className="border border-slate-300 p-1.5 font-bold">هل تعلم؟</td>
                      <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                        {broadcast.didYouKnow.presenterName}
                      </td>
                      <td className="border border-slate-300 p-1.5">
                        {broadcast.didYouKnow.items.length} معلومات علمية وثقافية
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">1 د</td>
                    </tr>
                  )}

                  {broadcast.wisdom.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">6</td>
                      <td className="border border-slate-300 p-1.5 font-bold">حكمة اليوم</td>
                      <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                        {broadcast.wisdom.presenterName}
                      </td>
                      <td className="border border-slate-300 p-1.5">{broadcast.wisdom.data.text}</td>
                      <td className="border border-slate-300 p-1.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  {broadcast.poetry.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">7</td>
                      <td className="border border-slate-300 p-1.5 font-bold">الشعر</td>
                      <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                        {broadcast.poetry.presenterName}
                      </td>
                      <td className="border border-slate-300 p-1.5 font-serif line-clamp-1">
                        {broadcast.poetry.data.verses}
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  {broadcast.quiz.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">8</td>
                      <td className="border border-slate-300 p-1.5 font-bold">سؤال وجائزة</td>
                      <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                        {broadcast.quiz.presenterName}
                      </td>
                      <td className="border border-slate-300 p-1.5">
                        {broadcast.quiz.data.question}
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  {broadcast.supplication.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-1.5 text-center font-bold">9</td>
                      <td className="border border-slate-300 p-1.5 font-bold">دعاء الصباح</td>
                      <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                        {broadcast.supplication.presenterName}
                      </td>
                      <td className="border border-slate-300 p-1.5">
                        {broadcast.supplication.text.substring(0, 80)}...
                      </td>
                      <td className="border border-slate-300 p-1.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  <tr>
                    <td className="border border-slate-300 p-1.5 text-center font-bold">10</td>
                    <td className="border border-slate-300 p-1.5 font-bold">الخاتمة</td>
                    <td className="border border-slate-300 p-1.5 text-emerald-800 font-semibold">
                      {broadcast.outro.presenterName || 'مقدم الإذاعة'}
                    </td>
                    <td className="border border-slate-300 p-1.5">{broadcast.outro.text.substring(0, 80)}...</td>
                    <td className="border border-slate-300 p-1.5 text-center">0.5 د</td>
                  </tr>
                </tbody>
              </table>

              {showSignatures && (
                <div className="pt-2 border-t border-slate-300 flex justify-between text-[10.5px] font-bold text-slate-700 avoid-break">
                  <div>مشرف الإذاعة: {schoolInfo.broadcastSupervisor || '...........................'}</div>
                  <div>مدير / مديرة المدرسة: {schoolInfo.schoolPrincipal || '...........................'}</div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 4: DETAILED MULTI-PAGE (FULL PARAGRAPHS)                         */}
          {/* ========================================================================= */}
          {template === 'detailed' && (
            <div className="p-6 sm:p-8 space-y-4 bg-white text-slate-900 text-xs leading-relaxed">
              <div className="text-center border-b-2 border-slate-900 pb-3">
                <h1 className="text-xl font-black">{broadcast.title}</h1>
                <p className="text-xs text-slate-600 font-bold">{schoolInfo.schoolName} • {schoolInfo.dayOfWeek} ({schoolInfo.hijriDate})</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-emerald-900 mb-1">المقدمة الإذاعية:</div>
                  <p className="whitespace-pre-line">{broadcast.introduction.text}</p>
                </div>

                {broadcast.quran.enabled && (
                  <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-200">
                    <div className="font-bold text-emerald-950 mb-1">القرآن الكريم ({broadcast.quran.data.surah}):</div>
                    <p className="font-serif leading-loose text-center">{broadcast.quran.data.text}</p>
                  </div>
                )}

                {broadcast.hadith.enabled && (
                  <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200">
                    <div className="font-bold text-amber-950 mb-1">الحديث الشريف:</div>
                    <p>{broadcast.hadith.data.text}</p>
                  </div>
                )}

                {broadcast.speech.enabled && (
                  <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-200">
                    <div className="font-bold text-indigo-950 mb-1">كلمة الصباح ({broadcast.speech.data.title}):</div>
                    <p className="whitespace-pre-line">{broadcast.speech.data.content}</p>
                  </div>
                )}

                {broadcast.didYouKnow.enabled && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">هل تعلم؟:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {broadcast.didYouKnow.items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">الخاتمة:</div>
                  <p>{broadcast.outro.text}</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 5: INDIVIDUAL STUDENT CARDS                                      */}
          {/* ========================================================================= */}
          {template === 'student_cards' && (
            <div className="p-4 sm:p-6 space-y-4 bg-white text-slate-900 text-xs">
              <div className="text-center border-b border-slate-300 pb-2">
                <h2 className="text-base font-black">بطاقات إلقاء الطلاب الفردية (للطباعة والقص)</h2>
                <p className="text-[10px] text-slate-500">يحمل كل طالب بطاقته الخاصة أمام الميكروفون</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3">
                <div className="border-2 border-dashed border-slate-400 p-3 rounded-xl bg-slate-50 avoid-break flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-xs text-emerald-900 mb-1">🎙️ المقدمة الإذاعية</div>
                    <p className="text-[11px] leading-relaxed line-clamp-4">{broadcast.introduction.text}</p>
                  </div>
                  <div className="text-[9px] text-slate-400 border-t border-slate-200 pt-1 mt-2 flex justify-between">
                    <span>الطالب: {broadcast.introduction.presenterName || 'المقدم'}</span>
                    <span>{schoolInfo.schoolName}</span>
                  </div>
                </div>

                {broadcast.quran.enabled && (
                  <div className="border-2 border-dashed border-emerald-400 p-3 rounded-xl bg-emerald-50/40 avoid-break flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs text-emerald-950 mb-1">📖 القرآن الكريم ({broadcast.quran.data.surah})</div>
                      <p className="font-serif text-[11px] text-center leading-loose">{broadcast.quran.data.text}</p>
                    </div>
                    <div className="text-[9px] text-emerald-700 border-t border-emerald-200 pt-1 mt-2 flex justify-between">
                      <span>القارئ: {broadcast.quran.presenterName}</span>
                      <span>رتل بخشوع</span>
                    </div>
                  </div>
                )}

                {broadcast.hadith.enabled && (
                  <div className="border-2 border-dashed border-amber-400 p-3 rounded-xl bg-amber-50/40 avoid-break flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs text-amber-950 mb-1">🕌 الحديث الشريف</div>
                      <p className="text-[11px] leading-relaxed">{broadcast.hadith.data.text}</p>
                    </div>
                    <div className="text-[9px] text-amber-800 border-t border-amber-200 pt-1 mt-2 flex justify-between">
                      <span>الطالب: {broadcast.hadith.presenterName}</span>
                      <span>({broadcast.hadith.data.narrator})</span>
                    </div>
                  </div>
                )}

                {broadcast.speech.enabled && (
                  <div className="border-2 border-dashed border-indigo-400 p-3 rounded-xl bg-indigo-50/40 avoid-break flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs text-indigo-950 mb-1">🎤 كلمة الصباح: {broadcast.speech.data.title}</div>
                      <p className="text-[11px] leading-relaxed line-clamp-4">{broadcast.speech.data.content}</p>
                    </div>
                    <div className="text-[9px] text-indigo-800 border-t border-indigo-200 pt-1 mt-2 flex justify-between">
                      <span>الطالب: {broadcast.speech.presenterName}</span>
                      <span>نبرة واضحة ومقنعة</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
