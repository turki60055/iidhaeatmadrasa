import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Sliders,
  Sparkles,
  School,
  CheckSquare,
  Square,
  Award,
  BookOpen,
} from 'lucide-react';
import { RadioBroadcast, PrintTemplateType } from '../types/radio';
import { copyBroadcastAsText, exportBroadcastToWord } from '../utils/exportUtils';

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
  const [template, setTemplate] = useState<PrintTemplateType>('official');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showSignatures, setShowSignatures] = useState(true);
  const [showHeaders, setShowHeaders] = useState(true);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const fontSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      {/* Top Controls Toolbar (Hidden when printing) */}
      <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 text-white px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-lg print:hidden">
        {/* Template Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">النموذج:</span>
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setTemplate('official')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                template === 'official'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              النموذج الرسمي المعتمد
            </button>
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                template === 'modern'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              النموذج الأكاديمي العصري
            </button>
            <button
              onClick={() => setTemplate('cue_sheet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                template === 'cue_sheet'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              جدول منظم الميكروفون
            </button>
            <button
              onClick={() => setTemplate('student_cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                template === 'student_cards'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              بطاقات الطلاب (A5)
            </button>
          </div>
        </div>

        {/* Formatting & Customization */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font size */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <span className="text-[11px] text-slate-400 px-1.5">الخط:</span>
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-emerald-600' : 'text-slate-300'}`}
            >
              صغير
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-2 py-0.5 rounded ${fontSize === 'md' ? 'bg-emerald-600' : 'text-slate-300'}`}
            >
              متوسط
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-emerald-600' : 'text-slate-300'}`}
            >
              كبير
            </button>
          </div>

          {/* Toggles */}
          <button
            onClick={() => setShowSignatures(!showSignatures)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {showSignatures ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
            <span>التواقيع</span>
          </button>

          <button
            onClick={() => setIsGrayscale(!isGrayscale)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {isGrayscale ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5" />}
            <span>توفير حبر (B&W)</span>
          </button>

          {/* Actions */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="نسخ النص كاملاً"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>نسخ</span>
          </button>

          <button
            onClick={() => exportBroadcastToWord(broadcast)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow"
            title="تحميل مستند Word جاهز للطباعة"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ملف Word (.doc)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black transition shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة فورية</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Print Container Sheet */}
      <div className="flex-1 p-4 sm:p-8 flex justify-center items-start print:p-0">
        <div
          className={`w-full max-w-4xl bg-white shadow-2xl print:shadow-none print:w-full print:max-w-none text-slate-900 transition-all ${
            isGrayscale ? 'filter grayscale' : ''
          }`}
          style={{ minHeight: '297mm' }}
        >
          {/* ========================================================= */}
          {/* TEMPLATE 1: OFFICIAL EMBROIDERED MINISTRY CERTIFICATE      */}
          {/* ========================================================= */}
          {template === 'official' && (
            <div className="p-8 sm:p-12 border-8 border-double border-slate-300 print:border-slate-800 space-y-6 relative">
              {/* Official Header */}
              {showHeaders && (
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start text-xs sm:text-sm font-semibold">
                  <div className="text-right space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm sm:text-base">
                      {schoolInfo.countryMinistry}
                    </div>
                    <div>{schoolInfo.educationDirectorate}</div>
                    <div className="font-extrabold text-emerald-800 text-sm sm:text-base">
                      {schoolInfo.schoolName}
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center mx-auto bg-slate-50 text-slate-800">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="font-black text-xs text-slate-800">البرنامج الإذاعي اليومي</div>
                    <div className="text-[10px] text-slate-500">
                      {schoolInfo.semester} - {schoolInfo.academicYear}
                    </div>
                  </div>

                  <div className="text-left space-y-0.5" dir="rtl">
                    <div>
                      اليوم: <span className="font-bold">{schoolInfo.dayOfWeek}</span>
                    </div>
                    <div>الهجري: {schoolInfo.hijriDate}</div>
                    <div>الميلادي: {schoolInfo.gregorianDate}</div>
                  </div>
                </div>
              )}

              {/* Title Ribbon */}
              <div className="text-center py-4 px-6 bg-slate-50 border border-slate-300 rounded-xl">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                  ✨ {broadcast.title} ✨
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold">
                  موضوع الإذاعة: <span className="text-emerald-800">{broadcast.topic}</span> |
                  المرحلة: <span>{schoolInfo.schoolStage}</span>
                </p>
              </div>

              {/* Sections Flow */}
              <div className={`space-y-4 ${fontSizeClass}`}>
                {/* 1. Intro */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 mb-2">
                    <span className="font-black text-emerald-900 flex items-center gap-1.5">
                      🎙️ المقدمة الإذاعية
                    </span>
                    {broadcast.introduction.presenterName && (
                      <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        الطالب: {broadcast.introduction.presenterName} (
                        {broadcast.introduction.presenterGrade})
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-line leading-relaxed text-slate-800">
                    {broadcast.introduction.text}
                  </p>
                </div>

                {/* 2. Quran */}
                {broadcast.quran.enabled && (
                  <div className="border border-emerald-300 rounded-xl p-4 bg-emerald-50/40">
                    <div className="flex justify-between items-center border-b border-emerald-200 pb-1.5 mb-2">
                      <span className="font-black text-emerald-950 flex items-center gap-1.5">
                        📖 القرآن الكريم [{broadcast.quran.data.surah} - الآيات:{' '}
                        {broadcast.quran.data.verses}]
                      </span>
                      {broadcast.quran.presenterName && (
                        <span className="text-xs font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          القارئ: {broadcast.quran.presenterName} (
                          {broadcast.quran.presenterGrade})
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-center text-emerald-950 leading-loose text-base sm:text-lg">
                      {broadcast.quran.data.text}
                    </p>
                  </div>
                )}

                {/* 3. Hadith */}
                {broadcast.hadith.enabled && (
                  <div className="border border-amber-300 rounded-xl p-4 bg-amber-50/40">
                    <div className="flex justify-between items-center border-b border-amber-200 pb-1.5 mb-2">
                      <span className="font-black text-amber-950 flex items-center gap-1.5">
                        🕌 الحديث الشريف
                      </span>
                      {broadcast.hadith.presenterName && (
                        <span className="text-xs font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                          الطالب: {broadcast.hadith.presenterName} (
                          {broadcast.hadith.presenterGrade})
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed text-slate-900">{broadcast.hadith.data.text}</p>
                    <div className="text-xs text-amber-800 mt-1 font-semibold">
                      ({broadcast.hadith.data.narrator})
                    </div>
                  </div>
                )}

                {/* 4. Speech */}
                {broadcast.speech.enabled && (
                  <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 mb-2">
                      <span className="font-black text-indigo-950 flex items-center gap-1.5">
                        🎤 كلمة الصباح: {broadcast.speech.data.title}
                      </span>
                      {broadcast.speech.presenterName && (
                        <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          الطالب: {broadcast.speech.presenterName} (
                          {broadcast.speech.presenterGrade})
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-line leading-relaxed text-slate-800">
                      {broadcast.speech.data.content}
                    </p>
                  </div>
                )}

                {/* 5. Did You Know */}
                {broadcast.didYouKnow.enabled && (
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/30">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 mb-2">
                      <span className="font-black text-slate-900 flex items-center gap-1.5">
                        💡 فقرة هل تعلم؟
                      </span>
                      {broadcast.didYouKnow.presenterName && (
                        <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          الطالب: {broadcast.didYouKnow.presenterName}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-800">
                      {broadcast.didYouKnow.items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 6. Wisdom & Poetry Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {broadcast.wisdom.enabled && (
                    <div className="border border-teal-200 rounded-xl p-3.5 bg-teal-50/30">
                      <div className="font-black text-teal-950 mb-1 flex justify-between text-xs">
                        <span>💎 حكمة اليوم</span>
                        <span>{broadcast.wisdom.presenterName}</span>
                      </div>
                      <p className="italic text-slate-800">« {broadcast.wisdom.data.text} »</p>
                      {broadcast.wisdom.data.author && (
                        <div className="text-[10px] text-slate-500 mt-1">
                          - {broadcast.wisdom.data.author}
                        </div>
                      )}
                    </div>
                  )}

                  {broadcast.poetry.enabled && (
                    <div className="border border-purple-200 rounded-xl p-3.5 bg-purple-50/30">
                      <div className="font-black text-purple-950 mb-1 flex justify-between text-xs">
                        <span>📜 فقرة الشعر</span>
                        <span>{broadcast.poetry.presenterName}</span>
                      </div>
                      <p className="font-serif text-center whitespace-pre-line text-purple-950">
                        {broadcast.poetry.data.verses}
                      </p>
                    </div>
                  )}
                </div>

                {/* 7. Quiz */}
                {broadcast.quiz.enabled && (
                  <div className="border border-rose-200 rounded-xl p-3.5 bg-rose-50/30">
                    <div className="font-black text-rose-950 mb-1 flex justify-between text-xs">
                      <span>🎁 سؤال وجائزة الصباح</span>
                      <span>{broadcast.quiz.presenterName}</span>
                    </div>
                    <div className="text-slate-900">
                      <strong>السؤال:</strong> {broadcast.quiz.data.question}
                    </div>
                    <div className="text-emerald-800 text-xs mt-1">
                      <strong>الإجابة:</strong> {broadcast.quiz.data.answer}
                    </div>
                  </div>
                )}

                {/* 8. Supplication */}
                {broadcast.supplication.enabled && (
                  <div className="border border-blue-200 rounded-xl p-3.5 bg-blue-50/30">
                    <div className="font-black text-blue-950 mb-1 flex justify-between text-xs">
                      <span>🤲 دعاء الصباح</span>
                      <span>{broadcast.supplication.presenterName}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{broadcast.supplication.text}</p>
                  </div>
                )}

                {/* 9. Outro */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="font-black text-slate-900 mb-1 flex justify-between text-xs">
                    <span>🏁 الخاتمة الإذاعية</span>
                    <span>{broadcast.outro.presenterName}</span>
                  </div>
                  <p className="text-slate-800">{broadcast.outro.text}</p>
                </div>
              </div>

              {/* Official Signatures Table */}
              {showSignatures && (
                <div className="pt-8 border-t-2 border-slate-900 mt-8">
                  <div className="grid grid-cols-3 text-center text-xs sm:text-sm font-bold text-slate-800">
                    <div className="space-y-8">
                      <div>مقدم الإذاعة</div>
                      <div className="text-slate-900 font-extrabold">
                        {schoolInfo.headStudent || '...........................'}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>مشرف الإذاعة المدرسية</div>
                      <div className="text-slate-900 font-extrabold">
                        {schoolInfo.broadcastSupervisor || '...........................'}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>مدير / قائد المدرسة</div>
                      <div className="text-slate-900 font-extrabold">
                        {schoolInfo.schoolPrincipal || '...........................'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-200 pt-2">
                    <span>تم الإنشاء عبر منصة أثير للإذاعة المدرسية الذكية</span>
                    <span>ختم المدرسة الرسمي ⭕</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TEMPLATE 2: MODERN CLEAN ACADEMIC DESIGN                  */}
          {/* ========================================================= */}
          {template === 'modern' && (
            <div className="p-8 sm:p-12 space-y-6">
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-emerald-200 bg-white/10 px-2.5 py-1 rounded-full">
                      {schoolInfo.countryMinistry}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black mt-2">{broadcast.title}</h1>
                    <p className="text-sm text-emerald-100 mt-1">{schoolInfo.schoolName}</p>
                  </div>
                  <div className="text-left text-xs text-emerald-100 font-medium" dir="rtl">
                    <div>{schoolInfo.dayOfWeek}</div>
                    <div>{schoolInfo.hijriDate}</div>
                    <div>{schoolInfo.semester}</div>
                  </div>
                </div>
              </div>

              <div className={`space-y-4 ${fontSizeClass}`}>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-emerald-800 mb-2">المقدمة الإذاعية</h3>
                  <p className="leading-relaxed">{broadcast.introduction.text}</p>
                  {broadcast.introduction.presenterName && (
                    <div className="text-xs text-slate-500 mt-2 font-semibold">
                      إلقاء: {broadcast.introduction.presenterName}
                    </div>
                  )}
                </div>

                {broadcast.quran.enabled && (
                  <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                    <h3 className="font-bold text-emerald-900 mb-2">
                      القرآن الكريم ({broadcast.quran.data.surah})
                    </h3>
                    <p className="font-serif text-base leading-loose text-center text-emerald-950">
                      {broadcast.quran.data.text}
                    </p>
                  </div>
                )}

                {broadcast.hadith.enabled && (
                  <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200">
                    <h3 className="font-bold text-amber-900 mb-2">الحديث الشريف</h3>
                    <p className="leading-relaxed">{broadcast.hadith.data.text}</p>
                    <div className="text-xs text-amber-800 mt-1">
                      {broadcast.hadith.data.narrator}
                    </div>
                  </div>
                )}

                {broadcast.speech.enabled && (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <h3 className="font-bold text-indigo-900 mb-2">
                      كلمة الصباح: {broadcast.speech.data.title}
                    </h3>
                    <p className="leading-relaxed">{broadcast.speech.data.content}</p>
                  </div>
                )}

                {broadcast.didYouKnow.enabled && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-2">هل تعلم؟</h3>
                    <ul className="space-y-1 list-disc list-inside">
                      {broadcast.didYouKnow.items.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">الخاتمة الإذاعية</h3>
                  <p>{broadcast.outro.text}</p>
                </div>
              </div>

              {showSignatures && (
                <div className="grid grid-cols-2 pt-8 border-t border-slate-200 text-center text-xs font-bold text-slate-700">
                  <div>مشرف الإذاعة: {schoolInfo.broadcastSupervisor}</div>
                  <div>قائد المدرسة: {schoolInfo.schoolPrincipal}</div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TEMPLATE 3: RADIO STAGE CUE SHEET (ORGANIZER TABLE)       */}
          {/* ========================================================= */}
          {template === 'cue_sheet' && (
            <div className="p-8 sm:p-12 space-y-6">
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-black text-slate-900">
                    جدول تنظيم البث الإذاعي الصباحي
                  </h1>
                  <p className="text-xs text-slate-500 font-bold">
                    {schoolInfo.schoolName} | {schoolInfo.dayOfWeek} ({schoolInfo.hijriDate})
                  </p>
                </div>
                <div className="text-left font-bold text-xs">
                  موضوع اليوم: <span className="text-emerald-700">{broadcast.topic}</span>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-300 p-2.5 w-12 text-center">#</th>
                    <th className="border border-slate-300 p-2.5 w-32 text-right">الفقرة</th>
                    <th className="border border-slate-300 p-2.5 w-40 text-right">الطالب المشارك</th>
                    <th className="border border-slate-300 p-2.5 text-right">نص الفقرة / الملاحظات</th>
                    <th className="border border-slate-300 p-2.5 w-16 text-center">المدة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2.5 text-center font-bold">1</td>
                    <td className="border border-slate-300 p-2.5 font-bold">المقدمة والترحيب</td>
                    <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                      {broadcast.introduction.presenterName || 'مقدم الإذاعة'}
                    </td>
                    <td className="border border-slate-300 p-2.5 text-slate-700">
                      {broadcast.introduction.text.substring(0, 150)}...
                    </td>
                    <td className="border border-slate-300 p-2.5 text-center">1 د</td>
                  </tr>

                  {broadcast.quran.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center font-bold">2</td>
                      <td className="border border-slate-300 p-2.5 font-bold">القرآن الكريم</td>
                      <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                        {broadcast.quran.presenterName || 'القارئ'}
                      </td>
                      <td className="border border-slate-300 p-2.5 font-serif text-emerald-950">
                        {broadcast.quran.data.surah} ({broadcast.quran.data.verses})
                      </td>
                      <td className="border border-slate-300 p-2.5 text-center">1 د</td>
                    </tr>
                  )}

                  {broadcast.hadith.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center font-bold">3</td>
                      <td className="border border-slate-300 p-2.5 font-bold">الحديث الشريف</td>
                      <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                        {broadcast.hadith.presenterName}
                      </td>
                      <td className="border border-slate-300 p-2.5">
                        {broadcast.hadith.data.text.substring(0, 100)}...
                      </td>
                      <td className="border border-slate-300 p-2.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  {broadcast.speech.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center font-bold">4</td>
                      <td className="border border-slate-300 p-2.5 font-bold">كلمة الصباح</td>
                      <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                        {broadcast.speech.presenterName}
                      </td>
                      <td className="border border-slate-300 p-2.5">
                        <strong>{broadcast.speech.data.title}:</strong>{' '}
                        {broadcast.speech.data.content.substring(0, 120)}...
                      </td>
                      <td className="border border-slate-300 p-2.5 text-center">1.5 د</td>
                    </tr>
                  )}

                  {broadcast.didYouKnow.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center font-bold">5</td>
                      <td className="border border-slate-300 p-2.5 font-bold">هل تعلم؟</td>
                      <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                        {broadcast.didYouKnow.presenterName}
                      </td>
                      <td className="border border-slate-300 p-2.5">
                        {broadcast.didYouKnow.items.length} معلومات علمية
                      </td>
                      <td className="border border-slate-300 p-2.5 text-center">1 د</td>
                    </tr>
                  )}

                  {broadcast.wisdom.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center font-bold">6</td>
                      <td className="border border-slate-300 p-2.5 font-bold">حكمة اليوم</td>
                      <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                        {broadcast.wisdom.presenterName}
                      </td>
                      <td className="border border-slate-300 p-2.5">{broadcast.wisdom.data.text}</td>
                      <td className="border border-slate-300 p-2.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  {broadcast.poetry.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center font-bold">7</td>
                      <td className="border border-slate-300 p-2.5 font-bold">فقرة الشعر</td>
                      <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                        {broadcast.poetry.presenterName}
                      </td>
                      <td className="border border-slate-300 p-2.5 font-serif">
                        {broadcast.poetry.data.verses}
                      </td>
                      <td className="border border-slate-300 p-2.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  {broadcast.quiz.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center font-bold">8</td>
                      <td className="border border-slate-300 p-2.5 font-bold">سؤال وجائزة</td>
                      <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                        {broadcast.quiz.presenterName}
                      </td>
                      <td className="border border-slate-300 p-2.5">
                        {broadcast.quiz.data.question}
                      </td>
                      <td className="border border-slate-300 p-2.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  {broadcast.supplication.enabled && (
                    <tr>
                      <td className="border border-slate-300 p-2.5 text-center font-bold">9</td>
                      <td className="border border-slate-300 p-2.5 font-bold">دعاء الصباح</td>
                      <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                        {broadcast.supplication.presenterName}
                      </td>
                      <td className="border border-slate-300 p-2.5">
                        {broadcast.supplication.text.substring(0, 100)}...
                      </td>
                      <td className="border border-slate-300 p-2.5 text-center">0.5 د</td>
                    </tr>
                  )}

                  <tr>
                    <td className="border border-slate-300 p-2.5 text-center font-bold">10</td>
                    <td className="border border-slate-300 p-2.5 font-bold">الخاتمة وتحية العلم</td>
                    <td className="border border-slate-300 p-2.5 font-semibold text-emerald-800">
                      {broadcast.outro.presenterName || 'مقدم الإذاعة'}
                    </td>
                    <td className="border border-slate-300 p-2.5">{broadcast.outro.text}</td>
                    <td className="border border-slate-300 p-2.5 text-center">0.5 د</td>
                  </tr>
                </tbody>
              </table>

              {showSignatures && (
                <div className="pt-6 border-t border-slate-300 flex justify-between text-xs font-bold text-slate-700">
                  <div>مشرف الإذاعة: {schoolInfo.broadcastSupervisor}</div>
                  <div>مدير المدرسة: {schoolInfo.schoolPrincipal}</div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TEMPLATE 4: INDIVIDUAL STUDENT CUE CARDS (A5 / POCKET)   */}
          {/* ========================================================= */}
          {template === 'student_cards' && (
            <div className="p-6 sm:p-10 space-y-6">
              <div className="text-center border-b border-slate-300 pb-3">
                <h2 className="text-lg font-black text-slate-900">
                  بطاقات إلقاء الطلاب الفردية (للطباعة والقص)
                </h2>
                <p className="text-xs text-slate-500">
                  يحمل كل طالب بطاقته الخاصة أثناء الوقوف أمام الميكروفون
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Intro Card */}
                <div className="border-2 border-dashed border-slate-400 p-4 rounded-2xl bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-300 pb-1.5 mb-2">
                      <span className="font-bold text-xs text-emerald-800">
                        🎙️ فقرة: المقدمة الإذاعية
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">
                        الطالب: {broadcast.introduction.presenterName || 'المقدم'}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line text-slate-800">
                      {broadcast.introduction.text}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-1 mt-3 flex justify-between">
                    <span>{schoolInfo.schoolName}</span>
                    <span>قف بثقة وتأنَّ في القراءة</span>
                  </div>
                </div>

                {/* Quran Card */}
                {broadcast.quran.enabled && (
                  <div className="border-2 border-dashed border-emerald-400 p-4 rounded-2xl bg-emerald-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-emerald-300 pb-1.5 mb-2">
                        <span className="font-bold text-xs text-emerald-900">
                          📖 فقرة: القرآن الكريم ({broadcast.quran.data.surah})
                        </span>
                        <span className="text-[11px] font-bold text-emerald-800">
                          القارئ: {broadcast.quran.presenterName}
                        </span>
                      </div>
                      <p className="font-serif text-sm leading-loose text-center text-emerald-950">
                        {broadcast.quran.data.text}
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-600 border-t border-emerald-200 pt-1 mt-3 flex justify-between">
                      <span>الآيات: {broadcast.quran.data.verses}</span>
                      <span>رتل بتؤدة وخشوع</span>
                    </div>
                  </div>
                )}

                {/* Hadith Card */}
                {broadcast.hadith.enabled && (
                  <div className="border-2 border-dashed border-amber-400 p-4 rounded-2xl bg-amber-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-amber-300 pb-1.5 mb-2">
                        <span className="font-bold text-xs text-amber-900">
                          🕌 فقرة: الحديث الشريف
                        </span>
                        <span className="text-[11px] font-bold text-amber-800">
                          الطالب: {broadcast.hadith.presenterName}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-900">
                        {broadcast.hadith.data.text}
                      </p>
                      <div className="text-[10px] text-amber-700 mt-1">
                        ({broadcast.hadith.data.narrator})
                      </div>
                    </div>
                    <div className="text-[10px] text-amber-600 border-t border-amber-200 pt-1 mt-3 flex justify-between">
                      <span>{schoolInfo.schoolName}</span>
                      <span>الصلاة على النبي ﷺ عند ذكره</span>
                    </div>
                  </div>
                )}

                {/* Speech Card */}
                {broadcast.speech.enabled && (
                  <div className="border-2 border-dashed border-indigo-400 p-4 rounded-2xl bg-indigo-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-indigo-300 pb-1.5 mb-2">
                        <span className="font-bold text-xs text-indigo-900">
                          🎤 كلمة الصباح: {broadcast.speech.data.title}
                        </span>
                        <span className="text-[11px] font-bold text-indigo-800">
                          الطالب: {broadcast.speech.presenterName}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-800">
                        {broadcast.speech.data.content}
                      </p>
                    </div>
                    <div className="text-[10px] text-indigo-600 border-t border-indigo-200 pt-1 mt-3 flex justify-between">
                      <span>{schoolInfo.schoolName}</span>
                      <span>نبرة واضحة ومقنعة</span>
                    </div>
                  </div>
                )}

                {/* Did you know Card */}
                {broadcast.didYouKnow.enabled && (
                  <div className="border-2 border-dashed border-yellow-400 p-4 rounded-2xl bg-yellow-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-yellow-300 pb-1.5 mb-2">
                        <span className="font-bold text-xs text-yellow-900">
                          💡 فقرة: هل تعلم؟
                        </span>
                        <span className="text-[11px] font-bold text-yellow-800">
                          الطالب: {broadcast.didYouKnow.presenterName}
                        </span>
                      </div>
                      <ul className="text-xs space-y-1 list-disc list-inside text-slate-800">
                        {broadcast.didYouKnow.items.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-[10px] text-yellow-700 border-t border-yellow-200 pt-1 mt-3 flex justify-between">
                      <span>{schoolInfo.schoolName}</span>
                      <span>وقفة خفيفة بين كل معلومة</span>
                    </div>
                  </div>
                )}

                {/* Wisdom & Poetry Card */}
                {broadcast.wisdom.enabled && (
                  <div className="border-2 border-dashed border-teal-400 p-4 rounded-2xl bg-teal-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-teal-300 pb-1.5 mb-2">
                        <span className="font-bold text-xs text-teal-900">💎 فقرة: حكمة اليوم</span>
                        <span className="text-[11px] font-bold text-teal-800">
                          الطالب: {broadcast.wisdom.presenterName}
                        </span>
                      </div>
                      <p className="text-xs italic text-slate-900">
                        « {broadcast.wisdom.data.text} »
                      </p>
                      {broadcast.wisdom.data.author && (
                        <div className="text-[10px] text-slate-500 mt-1">
                          - {broadcast.wisdom.data.author}
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-teal-700 border-t border-teal-200 pt-1 mt-3 flex justify-between">
                      <span>{schoolInfo.schoolName}</span>
                      <span>إلقاء هادئ وبليغ</span>
                    </div>
                  </div>
                )}

                {/* Poetry Card */}
                {broadcast.poetry.enabled && (
                  <div className="border-2 border-dashed border-purple-400 p-4 rounded-2xl bg-purple-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-purple-300 pb-1.5 mb-2">
                        <span className="font-bold text-xs text-purple-900">
                          📜 فقرة: الشعر والأدب
                        </span>
                        <span className="text-[11px] font-bold text-purple-800">
                          الطالب: {broadcast.poetry.presenterName}
                        </span>
                      </div>
                      <p className="font-serif text-xs leading-loose text-center text-purple-950">
                        {broadcast.poetry.data.verses}
                      </p>
                    </div>
                    <div className="text-[10px] text-purple-700 border-t border-purple-200 pt-1 mt-3 flex justify-between">
                      <span>{schoolInfo.schoolName}</span>
                      <span>مراعاة الوزن الموسيقي</span>
                    </div>
                  </div>
                )}

                {/* Quiz & Supplication Card */}
                {broadcast.quiz.enabled && (
                  <div className="border-2 border-dashed border-rose-400 p-4 rounded-2xl bg-rose-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-rose-300 pb-1.5 mb-2">
                        <span className="font-bold text-xs text-rose-900">
                          🎁 فقرة: سؤال وجائزة
                        </span>
                        <span className="text-[11px] font-bold text-rose-800">
                          الطالب: {broadcast.quiz.presenterName}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">
                        السؤال: {broadcast.quiz.data.question}
                      </p>
                      <p className="text-xs text-emerald-800 mt-1">
                        الإجابة: {broadcast.quiz.data.answer}
                      </p>
                    </div>
                    <div className="text-[10px] text-rose-700 border-t border-rose-200 pt-1 mt-3 flex justify-between">
                      <span>{schoolInfo.schoolName}</span>
                      <span>نبرة حماسية وتشجيع الزملاء</span>
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
