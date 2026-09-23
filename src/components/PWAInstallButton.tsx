import React, { useState } from 'react';
import { Download, Sparkles, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'floating' | 'banner' | 'menu';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isStandalone, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running in standalone mode (installed app), we don't need to show installation CTA
  if (isStandalone) {
    return null;
  }

  const handleClick = async () => {
    // If native prompt is available, we can trigger direct prompt or open modal with guide
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (variant === 'menu') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-700/25 cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-white/20 p-0.5 flex items-center justify-center">
              <img src="/pwa-192x192.png" alt="أيقونة أثير" className="w-5 h-5 rounded-md" />
            </div>
            <span>تثبيت التطبيق على الجوال / سطح المكتب</span>
          </div>
          <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
            أيقونة مميزة
          </span>
        </button>

        <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white font-bold text-xs lg:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer border border-emerald-400/30 ${className}`}
        title="تثبيت تطبيق أثير بأيقونته الرسمية على جهازك"
      >
        <div className="w-5 h-5 rounded-md bg-white/20 p-0.5 shrink-0 flex items-center justify-center">
          <img src="/pwa-192x192.png" alt="أيقونة التطبيق" className="w-4 h-4 rounded-xs" />
        </div>
        <span>تثبيت التطبيق</span>
        <span className="hidden xl:inline text-[10px] bg-amber-300 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
          أيقونة PWA
        </span>
      </button>

      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
