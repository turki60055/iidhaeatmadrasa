import React, { useState } from 'react';
import {
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
  Menu,
  X,
  ChevronLeft,
  Share2,
  Smartphone,
} from 'lucide-react';
import { RadioBroadcast } from '../types/radio';
import { copyBroadcastAsText, exportBroadcastToWord } from '../utils/exportUtils';
import { PWAInstallButton } from './PWAInstallButton';
import { PWAInstallModal } from './PWAInstallModal';

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
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleCopy = () => {
    const text = copyBroadcastAsText(broadcast);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMobileAction = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Logo & Brand with Distinctive App Icon */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div 
                onClick={() => setIsInstallModalOpen(true)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20 ring-3 ring-emerald-50 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                title="أيقونة تطبيق أثير الرسمية - انقر لتثبيت البرنامج"
              >
                <img
                  src="/pwa-192x192.png"
                  alt="أثير الإذاعة المدرسية"
                  className="w-full h-full object-cover rounded-[14px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icon.svg';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                    أثـيـر
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      الإذاعة المدرسية
                    </span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  إعداد وتوليد فقرات الإذاعة والطباعة الرسمية
                </p>
              </div>
            </div>

            {/* Desktop Action Buttons (Visible on md and above) */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {/* PWA Install Button */}
              <PWAInstallButton />

              {/* AI Generator Button */}
              <button
                onClick={onOpenAIModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs lg:text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>توليد بالذكاء الاصطناعي</span>
              </button>

              {/* Print Button */}
              <button
                onClick={onOpenPrint}
                className="flex items-center gap-1.5 px-3 py-2 lg:px-3.5 lg:py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs lg:text-sm transition cursor-pointer"
                title="معاينة وطباعة النماذج الرسمية"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                <span>طباعة وتصدير</span>
              </button>

              {/* Live Stage Button */}
              <button
                onClick={onOpenLive}
                className="flex items-center gap-1.5 px-3 py-2 lg:px-3.5 lg:py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs lg:text-sm transition cursor-pointer"
                title="وضع البث الصباحي المباشر والتدريب"
              >
                <PlayCircle className="w-4 h-4 text-amber-600" />
                <span>بث الطابور</span>
              </button>

              {/* Students Manager */}
              <button
                onClick={onOpenStudents}
                className="px-3 py-2 lg:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs lg:text-sm transition flex items-center gap-1.5 cursor-pointer"
                title="توزيع الطلاب على الفقرات"
              >
                <Users className="w-4 h-4 text-slate-600" />
                <span>الطلاب</span>
              </button>

              {/* School Info */}
              <button
                onClick={onOpenSchoolInfo}
                className="px-3 py-2 lg:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs lg:text-sm transition flex items-center gap-1.5 cursor-pointer"
                title="بيانات المدرسة والترويسة"
              >
                <School className="w-4 h-4 text-slate-600" />
                <span>المدرسة</span>
              </button>

              {/* Library */}
              <button
                onClick={onOpenLibrary}
                className="px-3 py-2 lg:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs lg:text-sm transition flex items-center gap-1.5 cursor-pointer"
                title="أرشيف ومكتبة الإذاعات"
              >
                <FolderOpen className="w-4 h-4 text-slate-600" />
                <span>الأرشيف</span>
              </button>

              {/* Quick Actions Dropdown / Tools */}
              <div className="flex items-center gap-1 border-r border-slate-200 pr-1.5 mr-1">
                <button
                  onClick={handleCopy}
                  className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  title="نسخ نص الإذاعة كاملاً"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => exportBroadcastToWord(broadcast)}
                  className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  title="تصدير كملف Word (.doc)"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={onNewBroadcast}
                  className="p-2 text-slate-600 hover:text-indigo-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  title="إنشاء برنامج إذاعي جديد"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Top Header Actions */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => setIsInstallModalOpen(true)}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 active:scale-95 transition flex items-center gap-1"
                title="تثبيت التطبيق على الجوال"
              >
                <img src="/pwa-192x192.png" alt="أيقونة التطبيق" className="w-4 h-4 rounded-xs" />
                <span className="text-[11px] font-bold">تثبيت</span>
              </button>

              <button
                onClick={onOpenAIModal}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 active:scale-95 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>توليد AI</span>
              </button>

              <button
                onClick={onOpenPrint}
                className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 active:scale-95 transition"
                title="طباعة"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer"
                aria-label="القائمة الرئيسية"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer / Sheet (Slide Down) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative z-10 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 p-0.5 shadow-sm">
                  <img src="/pwa-192x192.png" alt="أيقونة أثير" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm">أثـيـر • الإذاعة المدرسية</div>
                  <div className="text-[10px] text-slate-500 font-bold">تطبيق الويب التقدمي المعتمد</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PWA Install Promotion in Mobile Drawer */}
            <div className="space-y-1.5">
              <PWAInstallButton variant="menu" />
            </div>

            {/* Quick Actions Group */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 px-1">⚡ الإجراءات والتوليد</div>
              <button
                onClick={() => handleMobileAction(onOpenAIModal)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs sm:text-sm shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>توليد إذاعة ذكية بالذكاء الاصطناعي</span>
                </div>
                <ChevronLeft className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => handleMobileAction(onOpenLive)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <PlayCircle className="w-4 h-4 text-amber-600" />
                  <span>وضع البث الصباحي المباشر والملقن</span>
                </div>
                <ChevronLeft className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => handleMobileAction(onOpenPrint)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-indigo-600" />
                  <span>معاينة النماذج الرسمية والطباعة</span>
                </div>
                <ChevronLeft className="w-4 h-4 opacity-75" />
              </button>
            </div>

            {/* Management Group */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-bold text-slate-400 px-1">🏫 إدارة المدرسة والطلاب</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMobileAction(onOpenSchoolInfo)}
                  className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800"
                >
                  <School className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="font-bold text-xs">بيانات المدرسة</span>
                  <span className="text-[10px] text-slate-500">الترويسة والتوقيعات</span>
                </button>

                <button
                  onClick={() => handleMobileAction(onOpenStudents)}
                  className="flex flex-col items-start p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800"
                >
                  <Users className="w-5 h-5 text-teal-600 mb-1" />
                  <span className="font-bold text-xs">جماعة الإذاعة</span>
                  <span className="text-[10px] text-slate-500">توزيع الطلاب</span>
                </button>
              </div>

              <button
                onClick={() => handleMobileAction(onOpenLibrary)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen className="w-4 h-4 text-slate-600" />
                  <span>أرشيف ومكتبة الإذاعات المحفوظة</span>
                </div>
                <ChevronLeft className="w-4 h-4 opacity-75" />
              </button>
            </div>

            {/* Export & Copy Group */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[11px] font-bold text-slate-400 px-1">📄 التصدير والمشاركة</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-bold text-xs flex flex-col items-center gap-1"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    exportBroadcastToWord(broadcast);
                  }}
                  className="p-2.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-center font-bold text-xs flex flex-col items-center gap-1"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>ملف Word</span>
                </button>

                <button
                  onClick={() => handleMobileAction(onNewBroadcast)}
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-center font-bold text-xs flex flex-col items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4 text-indigo-600" />
                  <span>إذاعة جديدة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Install Modal */}
      <PWAInstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
    </>
  );
};
