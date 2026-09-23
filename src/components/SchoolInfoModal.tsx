import React, { useState } from 'react';
import {
  X,
  School,
  Building,
  Calendar,
  User,
  Shield,
  Upload,
  Check,
  Sparkles,
  BookOpen,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { SchoolInfo } from '../types/radio';
import { MINISTRY_PRESETS, SCHOOL_EMBLEMS } from '../data/presets';

interface SchoolInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  onSave: (newInfo: SchoolInfo) => void;
}

export const SchoolInfoModal: React.FC<SchoolInfoModalProps> = ({
  isOpen,
  onClose,
  schoolInfo,
  onSave,
}) => {
  const [formData, setFormData] = useState<SchoolInfo>(schoolInfo);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: typeof MINISTRY_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      countryMinistry: preset.ministry,
      educationDirectorate: preset.directorate,
      schoolStage: (preset.stage as any) || prev.schoolStage,
    }));
  };

  const handleClearAll = () => {
    setFormData({
      countryMinistry: 'المملكة العربية السعودية - وزارة التعليم',
      educationDirectorate: 'الإدارة العامة للتعليم',
      schoolName: 'اسم المدرسة',
      schoolStage: 'متوسط',
      academicYear: '1447 / 1448 هـ',
      semester: 'الفصل الدراسي الثاني',
      dayOfWeek: 'الأحد',
      hijriDate: '15 ربيع الأول 1448 هـ',
      gregorianDate: '2026/09/27 م',
      broadcastSupervisor: 'اكتب اسم المشرف',
      schoolPrincipal: 'اكتب اسم المدير',
      headStudent: 'اكتب اسم مقدم الإذاعة',
      selectedEmblem: 'torch',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <School className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold">بيانات المدرسة والترويسة الرسمية</h2>
              <p className="text-[11px] sm:text-xs text-slate-300">
                تظهر هذه البيانات في رأس النماذج المطبوعة والشهادات وتوزيع الفقرات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Country Presets Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              تعبئة سريعة حسب الوزارة / الدولة:
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200"
              title="إعادة التعيين والتعبئة من جديد"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة الضبط</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {MINISTRY_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition shadow-2xs font-medium cursor-pointer"
              >
                {preset.country}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-5 max-h-[70vh] sm:max-h-[65vh] overflow-y-auto">
          {/* Official Hierarchy */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              الجهة التعليمية والمدرسة
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الدولة والوزارة
                </label>
                <input
                  type="text"
                  required
                  value={formData.countryMinistry}
                  onChange={(e) => setFormData({ ...formData, countryMinistry: e.target.value })}
                  placeholder="المملكة العربية السعودية - وزارة التعليم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الإدارة التعليمية / المنطقة
                </label>
                <input
                  type="text"
                  required
                  value={formData.educationDirectorate}
                  onChange={(e) =>
                    setFormData({ ...formData, educationDirectorate: e.target.value })
                  }
                  placeholder="الإدارة العامة للتعليم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم المدرسة الكامل
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="اكتب اسم المدرسة هنا (مثال: مدرسة الأندلس الأهلية)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm font-bold text-slate-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المرحلة الدراسية
                </label>
                <select
                  value={formData.schoolStage}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolStage: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs sm:text-sm outline-none transition bg-white"
                >
                  <option value="ابتدائي">المرحلة الابتدائية</option>
                  <option value="متوسط">المرحلة المتوسطة / الإعدادية</option>
                  <option value="ثانوي">المرحلة الثانوية</option>
                  <option value="مشترك">مجمع تعليمي مشترك</option>
                </select>
              </div>
            </div>
          </div>

          {/* School Leadership & Supervisors */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              المسؤولون والتوقيعات الرسمية
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مشرف / رائد الإذاعة
                </label>
                <input
                  type="text"
                  value={formData.broadcastSupervisor}
                  onChange={(e) =>
                    setFormData({ ...formData, broadcastSupervisor: e.target.value })
                  }
                  placeholder="اكتب اسم المشرف..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مدير / مديرة المدرسة</label>
                <input
                  type="text"
                  value={formData.schoolPrincipal}
                  onChange={(e) => setFormData({ ...formData, schoolPrincipal: e.target.value })}
                  placeholder="اكتب اسم المدير..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مقدم الإذاعة الرئيسي
                </label>
                <input
                  type="text"
                  value={formData.headStudent}
                  onChange={(e) => setFormData({ ...formData, headStudent: e.target.value })}
                  placeholder="اكتب اسم مقدم الإذاعة..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Academic Term & Date */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              العام الدراسي والتاريخ
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">العام الدراسي</label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="1447 / 1448 هـ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الفصل الدراسي</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="الفصل الدراسي الثاني"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اليوم</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 outline-none bg-white"
                >
                  <option value="الأحد">الأحد</option>
                  <option value="الإثنين">الإثنين</option>
                  <option value="الثلاثاء">الثلاثاء</option>
                  <option value="الأربعاء">الأربعاء</option>
                  <option value="الخميس">الخميس</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  التاريخ الهجري
                </label>
                <input
                  type="text"
                  value={formData.hijriDate}
                  onChange={(e) => setFormData({ ...formData, hijriDate: e.target.value })}
                  placeholder="15 ربيع الأول 1448 هـ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* School Logo / Emblem Selection */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              شعار الترويسة في النماذج الرسمية
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SCHOOL_EMBLEMS.map((emblem) => {
                const isSelected = (formData.selectedEmblem || 'torch') === emblem.id;
                return (
                  <button
                    key={emblem.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedEmblem: emblem.id })}
                    className={`p-2 sm:p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">{emblem.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  تم الحفظ بنجاح!
                </>
              ) : (
                'حفظ وتطبيق البيانات'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
