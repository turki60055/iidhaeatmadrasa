import React, { useState } from 'react';
import {
  X,
  Users,
  UserPlus,
  Trash2,
  Sparkles,
  Shuffle,
  Check,
  RotateCcw,
} from 'lucide-react';
import { RadioBroadcast, StudentPresenter } from '../types/radio';

interface StudentsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: RadioBroadcast;
  onChange: (updated: RadioBroadcast) => void;
}

export const StudentsManagerModal: React.FC<StudentsManagerModalProps> = ({
  isOpen,
  onClose,
  broadcast,
  onChange,
}) => {
  const [students, setStudents] = useState<StudentPresenter[]>(broadcast.students || []);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('');

  if (!isOpen) return null;

  const sectionsList = [
    { id: 'intro', label: 'المقدمة الإذاعية', current: broadcast.introduction.presenterName },
    { id: 'quran', label: 'القرآن الكريم', current: broadcast.quran.presenterName, enabled: broadcast.quran.enabled },
    { id: 'hadith', label: 'الحديث الشريف', current: broadcast.hadith.presenterName, enabled: broadcast.hadith.enabled },
    { id: 'speech', label: 'كلمة الصباح', current: broadcast.speech.presenterName, enabled: broadcast.speech.enabled },
    { id: 'didYouKnow', label: 'هل تعلم؟', current: broadcast.didYouKnow.presenterName, enabled: broadcast.didYouKnow.enabled },
    { id: 'wisdom', label: 'حكمة اليوم', current: broadcast.wisdom.presenterName, enabled: broadcast.wisdom.enabled },
    { id: 'poetry', label: 'فقرة الشعر', current: broadcast.poetry.presenterName, enabled: broadcast.poetry.enabled },
    { id: 'quiz', label: 'سؤال وجائزة', current: broadcast.quiz.presenterName, enabled: broadcast.quiz.enabled },
    { id: 'supplication', label: 'دعاء الصباح', current: broadcast.supplication.presenterName, enabled: broadcast.supplication.enabled },
    { id: 'outro', label: 'الخاتمة الإذاعية', current: broadcast.outro.presenterName },
  ].filter((s) => s.enabled !== false);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStudent: StudentPresenter = {
      id: `std-${Date.now()}`,
      name: newName.trim(),
      grade: newGrade.trim() || 'الصف الثاني المتوسط',
    };

    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setNewName('');
    setNewGrade('');
  };

  const handleRemoveStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
  };

  const handleClearAllStudents = () => {
    setStudents([]);
  };

  // Auto assign students to active sections
  const handleAutoDistribute = () => {
    if (students.length === 0) return;

    const updatedBroadcast = { ...broadcast };
    const activeSections = sectionsList;

    activeSections.forEach((sec, idx) => {
      const student = students[idx % students.length];
      if (!student) return;

      if (sec.id === 'intro') {
        updatedBroadcast.introduction.presenterName = student.name;
        updatedBroadcast.introduction.presenterGrade = student.grade;
      } else if (sec.id === 'quran') {
        updatedBroadcast.quran.presenterName = student.name;
        updatedBroadcast.quran.presenterGrade = student.grade;
      } else if (sec.id === 'hadith') {
        updatedBroadcast.hadith.presenterName = student.name;
        updatedBroadcast.hadith.presenterGrade = student.grade;
      } else if (sec.id === 'speech') {
        updatedBroadcast.speech.presenterName = student.name;
        updatedBroadcast.speech.presenterGrade = student.grade;
      } else if (sec.id === 'didYouKnow') {
        updatedBroadcast.didYouKnow.presenterName = student.name;
        updatedBroadcast.didYouKnow.presenterGrade = student.grade;
      } else if (sec.id === 'wisdom') {
        updatedBroadcast.wisdom.presenterName = student.name;
        updatedBroadcast.wisdom.presenterGrade = student.grade;
      } else if (sec.id === 'poetry') {
        updatedBroadcast.poetry.presenterName = student.name;
        updatedBroadcast.poetry.presenterGrade = student.grade;
      } else if (sec.id === 'quiz') {
        updatedBroadcast.quiz.presenterName = student.name;
        updatedBroadcast.quiz.presenterGrade = student.grade;
      } else if (sec.id === 'supplication') {
        updatedBroadcast.supplication.presenterName = student.name;
        updatedBroadcast.supplication.presenterGrade = student.grade;
      } else if (sec.id === 'outro') {
        updatedBroadcast.outro.presenterName = student.name;
        updatedBroadcast.outro.presenterGrade = student.grade;
      }
    });

    updatedBroadcast.students = students;
    onChange(updatedBroadcast);
    onClose();
  };

  const handleSaveAndSync = () => {
    onChange({
      ...broadcast,
      students,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">جماعة الإذاعة والطلاب المشاركون</h3>
              <p className="text-[11px] sm:text-xs text-emerald-100">
                تسجيل أسماء الطلاب وتوزيع الفقرات تلقائياً بضغطة زر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Add Student Form */}
          <form onSubmit={handleAddStudent} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="اكتب اسم الطالب..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              placeholder="اكتب الصف (مثال: الصف الثاني)..."
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة طالب</span>
            </button>
          </form>

          {/* Quick Distribution & Clear Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-emerald-50 p-3 sm:p-3.5 rounded-2xl border border-emerald-200 gap-2">
            <div className="text-xs text-emerald-900 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>لديك {students.length} طلاب مسجلين في جماعة الإذاعة</span>
            </div>
            <div className="flex items-center gap-2">
              {students.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllStudents}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="مسح كافة الطلاب والبدء من جديد"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>تفريغ القائمة</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleAutoDistribute}
                disabled={students.length === 0}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  students.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>توزيع تلقائي على الفقرات</span>
              </button>
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">قائمة الطلاب المسجلين:</label>
            {students.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-xs space-y-1">
                <div className="font-bold text-slate-600">لا يوجد طلاب مسجلون حالياً</div>
                <div>أدخل اسم الطالب والصف أعلاه لتسجيل أعضاء جماعة الإذاعة وتوزيعهم بسهولة.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {students.map((std, idx) => (
                  <div
                    key={std.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{std.name}</div>
                        <div className="text-[11px] text-slate-500">{std.grade}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(std.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-medium transition cursor-pointer"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={handleSaveAndSync}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Check className="w-4 h-4" />
            <span>حفظ القائمة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
