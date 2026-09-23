import React from 'react';
import {
  Radio,
  Sparkles,
  Printer,
  PlayCircle,
  Users,
  FolderOpen,
  Download,
  School,
  FileText,
  PlusCircle,
  Copy,
  Check,
} from 'lucide-react';
import { RadioBroadcast } from '../types/radio';
import { copyBroadcastAsText, exportBroadcastToWord } from '../utils/exportUtils';

interface HeaderProps {
  broadcast: RadioBroadcast;
  onOpenAIModal: () => void;
  onOpenSchoolInfo: () => void;
  onOpenStudents: () => void;
  onOpenPrint: () => void;
  onOpenLive: () => void;
  onOpenLibrary: () => void;
  onNewBroadcast: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  broadcast,
  onOpenAIModal,
  onOpenSchoolInfo,
  onOpenStudents,
  onOpenPrint,
  onOpenLive,
  onOpenLibrary,
  onNewBroadcast,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = copyBroadcastAsText(broadcast);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-50">
              <Radio className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  أثـيـر
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    الإذاعة المدرسية
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                استوديو التوليد الذكي، التنسيق الاحترافي والطباعة الرسمية
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* AI Generator Button */}
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>توليد بالذكاء الاصطناعي</span>
            </button>

            {/* Print Button */}
            <button
              onClick={onOpenPrint}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-xs sm:text-sm transition cursor-pointer"
              title="معاينة وطباعة النماذج الرسمية"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">طباعة وتصدير</span>
            </button>

            {/* Live Rehearsal Button */}
            <button
              onClick={onOpenLive}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs sm:text-sm transition cursor-pointer"
              title="وضع البث الصباحي المباشر والتدريب"
            >
              <PlayCircle className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">بث الطابور</span>
            </button>

            {/* Students Manager */}
            <button
              onClick={onOpenStudents}
              className="p-2 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
              title="توزيع الطلاب على الفقرات"
            >
              <Users className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">الطلاب</span>
            </button>

            {/* School Info */}
            <button
              onClick={onOpenSchoolInfo}
              className="p-2 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
              title="بيانات المدرسة والترويسة"
            >
              <School className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">المدرسة</span>
            </button>

            {/* Library */}
            <button
              onClick={onOpenLibrary}
              className="p-2 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
              title="أرشيف ومكتبة الإذاعات"
            >
              <FolderOpen className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">الأرشيف</span>
            </button>

            {/* Quick Copy / Export Dropdown */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-1 mr-1">
              <button
                onClick={handleCopy}
                className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                title="نسخ نص الإذاعة كاملاً"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => exportBroadcastToWord(broadcast)}
                className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition"
                title="تصدير كملف Word (.doc)"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onNewBroadcast}
                className="p-2 text-slate-600 hover:text-indigo-700 hover:bg-slate-100 rounded-lg transition"
                title="إنشاء برنامج إذاعي جديد"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
