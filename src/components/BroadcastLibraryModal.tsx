import React, { useState } from 'react';
import {
  X,
  FolderOpen,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Download,
  Upload,
  Check,
  Search,
  BookOpen,
} from 'lucide-react';
import { RadioBroadcast } from '../types/radio';
import { SAMPLE_BROADCAST } from '../data/presets';

interface BroadcastLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBroadcast: RadioBroadcast;
  onLoadBroadcast: (broadcast: RadioBroadcast) => void;
}

export const BroadcastLibraryModal: React.FC<BroadcastLibraryModalProps> = ({
  isOpen,
  onClose,
  currentBroadcast,
  onLoadBroadcast,
}) => {
  const [savedList, setSavedList] = useState<RadioBroadcast[]>(() => {
    try {
      const stored = localStorage.getItem('atheer_school_broadcasts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [SAMPLE_BROADCAST];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const saveToStorage = (list: RadioBroadcast[]) => {
    setSavedList(list);
    try {
      localStorage.setItem('atheer_school_broadcasts', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCurrent = () => {
    const existingIndex = savedList.findIndex((b) => b.id === currentBroadcast.id);
    let updated: RadioBroadcast[];
    if (existingIndex >= 0) {
      updated = [...savedList];
      updated[existingIndex] = { ...currentBroadcast, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        {
          ...currentBroadcast,
          id: `broadcast-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...savedList,
      ];
    }
    saveToStorage(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedList.filter((b) => b.id !== id);
    saveToStorage(updated);
  };

  const handleRestoreSample = () => {
    const updated = [SAMPLE_BROADCAST, ...savedList.filter((b) => b.id !== SAMPLE_BROADCAST.id)];
    saveToStorage(updated);
  };

  const filteredList = savedList.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">مكتبة وأرشيف الإذاعات المدرسية</h3>
              <p className="text-xs text-emerald-100">
                حفظ واسترجاع البرامج الإذاعية المجهزة وتكرار استخدامها
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Top Actions: Search + Save Current */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في الأرشيف بالموضوع أو العنوان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleSaveCurrent}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {saveToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    تم الحفظ في الأرشيف!
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    حفظ الإذاعة الحالية
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRestoreSample}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                title="استعادة النموذج التوضيحي الافتراضي"
              >
                الإذاعة النموذجية
              </button>
            </div>
          </div>

          {/* List of broadcasts */}
          <div className="space-y-3">
            {filteredList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                لا توجد إذاعات تطابق بحثك في الأرشيف.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredList.map((item) => {
                  const isCurrent = item.id === currentBroadcast.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onLoadBroadcast(item);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border transition text-right cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                              الإذاعة المفتوحة حالياً
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          الموضوع: <strong className="text-slate-700">{item.topic}</strong> |{' '}
                          {item.schoolInfo.schoolName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.updatedAt || item.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                        {item.id !== SAMPLE_BROADCAST.id && (
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                            title="حذف من الأرشيف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-medium transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
