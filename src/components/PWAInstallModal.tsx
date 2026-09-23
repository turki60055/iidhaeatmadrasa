import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Monitor,
  Share2,
  PlusSquare,
  Sparkles,
  CheckCircle2,
  Radio,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, isStandalone, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop'>(isIOS ? 'mobile' : 'mobile');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Hero with App Icon */}
        <div className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-slate-900 p-6 sm:p-8 text-white text-center overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-slate-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* App Icon Showcase */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-500 p-1.5 shadow-2xl shadow-emerald-500/40 ring-4 ring-white/30 transform transition group-hover:scale-105">
                <img
                  src="/pwa-512x512.png"
                  alt="أيقونة تطبيق أثير الإذاعي"
                  className="w-full h-full object-cover rounded-2xl shadow-inner"
                  onError={(e) => {
                    // Fallback to SVG
                    (e.target as HTMLImageElement).src = '/icon.svg';
                  }}
                />
              </div>
              <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>أيقونة مخصصة</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black mt-4 text-white tracking-tight flex items-center gap-2">
              <span>تثبيت تطبيق أثـيـر</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-sm font-medium">
              الإذاعة المدرسية الذكية على شاشة جوالك وسطح المكتب بأيقونة رسمية فاخرة وسريعة
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Status Alert if already installed */}
          {isInstalled || isStandalone ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs sm:text-sm font-bold">
                التطبيق مثبت بالفعل ويعمل بالكامل كبرنامج مستقل على جهازك بأيقونته المميزة!
              </div>
            </div>
          ) : (
            <>
              {/* Direct 1-Click Install Button (Chromium / Android / Desktop) */}
              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>تثبيت التطبيق الآن على الشاشة الرئيسية</span>
                </button>
              )}

              {/* Tabs for Guide (Mobile vs Desktop) */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('mobile')}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'mobile'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>الجوال (Android / iPhone)</span>
                </button>

                <button
                  onClick={() => setActiveTab('desktop')}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'desktop'
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>الكمبيوتر / سطح المكتب</span>
                </button>
              </div>

              {/* Mobile Guide */}
              {activeTab === 'mobile' && (
                <div className="space-y-3.5 text-slate-800">
                  {/* iOS Safari Guide */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold"></span>
                      <span>هواتف الآيفون والآيباد (Safari):</span>
                    </div>
                    <ol className="text-xs sm:text-sm text-slate-600 space-y-2 list-decimal list-inside font-medium pr-1">
                      <li>
                        اضغط على زر <strong>المشاركة <Share2 className="w-3.5 h-3.5 inline text-blue-600" /></strong> في أسفل متصفح Safari.
                      </li>
                      <li>
                        مرر لأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية» <PlusSquare className="w-3.5 h-3.5 inline text-emerald-600" /></strong>.
                      </li>
                      <li>
                        اضغط على <strong>«إضافة» (Add)</strong> بالأعلى لتظهر أيقونة التطبيق الخضراء الذهبية في شاشتك فوراً.
                      </li>
                    </ol>
                  </div>

                  {/* Android Guide */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5">
                    <div className="font-bold text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">🤖</span>
                      <span>هواتف الأندرويد (Chrome / Samsung Internet):</span>
                    </div>
                    <ol className="text-xs sm:text-sm text-emerald-900 space-y-2 list-decimal list-inside font-medium pr-1">
                      <li>
                        اضغط على القائمة (الثلاث نقاط <strong>⋮</strong>) في أعلى يمين المتصفح.
                      </li>
                      <li>
                        اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                      </li>
                      <li>
                        سيتم إضافة أيقونة <strong>«أثير الإذاعة»</strong> كبرنامج مستقل بدون شريط المتصفح.
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Desktop Guide */}
              {activeTab === 'desktop' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-emerald-600" />
                    <span>متصفح Chrome أو Microsoft Edge على الكمبيوتر:</span>
                  </div>
                  <ol className="text-xs sm:text-sm text-slate-600 space-y-2 list-decimal list-inside font-medium pr-1">
                    <li>
                      انظر إلى شريط العنوان في الأعلى، ستجد أيقونة <strong>«تثبيت التطبيق» <Download className="w-3.5 h-3.5 inline text-emerald-600" /></strong> في طرف الشريط.
                    </li>
                    <li>
                      أو اضغط على قائمة المتصفح (<strong>⋮</strong>) ثم اختر <strong>«تثبيت أثير الإذاعة المدرسية»</strong>.
                    </li>
                    <li>
                      ستظهر أيقونة البرنامج مباشرة على سطح المكتب وقائمة ابدأ وتعمل كنافذة برنامج مستقلة.
                    </li>
                  </ol>
                </div>
              )}

              {/* Features List */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-700 font-bold">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>فتح فوري وسريع بدون إنترنت</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>حفظ آمن لبيانات الإذاعات</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>أثير • إصدار PWA التقدمي</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
