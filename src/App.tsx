/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Printer,
  PlayCircle,
  Users,
  School,
  FolderOpen,
  Download,
  BookOpen,
  Calendar,
  Check,
  PlusCircle,
  Wand2,
  ChevronLeft,
  Flame,
  Award,
  HelpCircle,
  Share2,
  Copy,
} from 'lucide-react';
import { RadioBroadcast, SchoolInfo } from './types/radio';
import { SAMPLE_BROADCAST, INITIAL_SCHOOL_INFO, PRESET_TOPICS } from './data/presets';
import { Header } from './components/Header';
import { SchoolInfoModal } from './components/SchoolInfoModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { SectionEditor } from './components/SectionEditor';
import { StudentsManagerModal } from './components/StudentsManagerModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { LiveStageRehearsalModal } from './components/LiveStageRehearsalModal';
import { BroadcastLibraryModal } from './components/BroadcastLibraryModal';
import { AiEnhancerModal } from './components/AiEnhancerModal';
import { exportBroadcastToWord, copyBroadcastAsText } from './utils/exportUtils';

export default function App() {
  const [broadcast, setBroadcast] = useState<RadioBroadcast>(() => {
    try {
      const saved = localStorage.getItem('atheer_current_broadcast');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_BROADCAST;
  });

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);

  // Single section AI enhancer modal
  const [aiEnhancerState, setAiEnhancerState] = useState<{
    isOpen: boolean;
    sectionKey: string;
    sectionTitle: string;
    currentContent: any;
  }>({
    isOpen: false,
    sectionKey: '',
    sectionTitle: '',
    currentContent: null,
  });

  const [copiedToast, setCopiedToast] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('atheer_current_broadcast', JSON.stringify(broadcast));
    } catch (e) {
      console.error(e);
    }
  }, [broadcast]);

  const handleUpdateBroadcast = (updated: RadioBroadcast) => {
    setBroadcast(updated);
  };

  const handleSchoolInfoSave = (newInfo: SchoolInfo) => {
    setBroadcast((prev) => ({
      ...prev,
      schoolInfo: newInfo,
    }));
  };

  const handleAiGenerated = (generatedData: Partial<RadioBroadcast>) => {
    setBroadcast((prev) => ({
      ...prev,
      ...generatedData,
      id: `broadcast-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleOpenAiEnhancer = (sectionKey: string, sectionTitle: string, currentContent: any) => {
    setAiEnhancerState({
      isOpen: true,
      sectionKey,
      sectionTitle,
      currentContent,
    });
  };

  const handleApplyAiEnhancerResult = (updatedContent: any) => {
    const key = aiEnhancerState.sectionKey;
    const updated = { ...broadcast };

    if (key === 'intro') {
      updated.introduction.text =
        typeof updatedContent === 'string' ? updatedContent : updatedContent.text || updatedContent.content;
    } else if (key === 'quran') {
      if (typeof updatedContent === 'object') {
        updated.quran.data = { ...updated.quran.data, ...updatedContent };
      } else if (typeof updatedContent === 'string') {
        updated.quran.data.text = updatedContent;
      }
    } else if (key === 'hadith') {
      if (typeof updatedContent === 'object') {
        updated.hadith.data = { ...updated.hadith.data, ...updatedContent };
      } else if (typeof updatedContent === 'string') {
        updated.hadith.data.text = updatedContent;
      }
    } else if (key === 'speech') {
      if (typeof updatedContent === 'object') {
        updated.speech.data = { ...updated.speech.data, ...updatedContent };
      } else if (typeof updatedContent === 'string') {
        updated.speech.data.content = updatedContent;
      }
    } else if (key === 'didYouKnow') {
      if (Array.isArray(updatedContent)) {
        updated.didYouKnow.items = updatedContent;
      }
    } else if (key === 'wisdom') {
      if (typeof updatedContent === 'object') {
        updated.wisdom.data = { ...updated.wisdom.data, ...updatedContent };
      } else if (typeof updatedContent === 'string') {
        updated.wisdom.data.text = updatedContent;
      }
    } else if (key === 'poetry') {
      if (typeof updatedContent === 'object') {
        updated.poetry.data = { ...updated.poetry.data, ...updatedContent };
      } else if (typeof updatedContent === 'string') {
        updated.poetry.data.verses = updatedContent;
      }
    } else if (key === 'quiz') {
      if (typeof updatedContent === 'object') {
        updated.quiz.data = { ...updated.quiz.data, ...updatedContent };
      }
    } else if (key === 'supplication') {
      updated.supplication.text =
        typeof updatedContent === 'string' ? updatedContent : updatedContent.text;
    } else if (key === 'outro') {
      updated.outro.text =
        typeof updatedContent === 'string' ? updatedContent : updatedContent.text;
    }

    setBroadcast(updated);
  };

  const handleNewBroadcast = () => {
    setIsAiModalOpen(true);
  };

  const handleCopyScript = () => {
    const text = copyBroadcastAsText(broadcast);
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-['Cairo',sans-serif]">
      {/* Top Header */}
      <Header
        broadcast={broadcast}
        onOpenAIModal={() => setIsAiModalOpen(true)}
        onOpenSchoolInfo={() => setIsSchoolModalOpen(true)}
        onOpenStudents={() => setIsStudentsModalOpen(true)}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenLive={() => setIsLiveModalOpen(true)}
        onOpenLibrary={() => setIsLibraryModalOpen(true)}
        onNewBroadcast={handleNewBroadcast}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* School Metadata Banner Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-700/50 flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {broadcast.schoolInfo.countryMinistry || 'وزارة التعليم'}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {broadcast.schoolInfo.educationDirectorate}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {broadcast.schoolInfo.schoolName}
              </h2>
              <button
                onClick={() => setIsSchoolModalOpen(true)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-bold transition cursor-pointer"
              >
                تعديل الترويسة ✏️
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                اليوم: <strong className="text-white">{broadcast.schoolInfo.dayOfWeek}</strong>
              </span>
              <span>•</span>
              <span>{broadcast.schoolInfo.hijriDate}</span>
              <span>•</span>
              <span>مشرف الإذاعة: <strong className="text-emerald-300">{broadcast.schoolInfo.broadcastSupervisor}</strong></span>
              <span>•</span>
              <span>مدير المدرسة: <strong className="text-white">{broadcast.schoolInfo.schoolPrincipal}</strong></span>
            </div>
          </div>

          {/* Quick Action Badges on Banner */}
          <div className="flex flex-wrap items-center gap-2 z-10">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>توليد إذاعة جديدة</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-300" />
              <span>معاينة النماذج والطباعة</span>
            </button>
          </div>
        </div>

        {/* Quick Topic Prompts Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">⚡ مواضيع ومناسبات مميزة للإذاعة:</span>
              <span className="text-xs text-slate-500 hidden sm:inline">انقر لتوليد برنامج إذاعي متكامل فوراً</span>
            </div>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>المزيد من المواضيع</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              'بر الوالدين.. طريق الجنة ونبع البركة',
              'الذكاء الاصطناعي ومستقبل التعليم',
              'التفوق الدراسي وسحر تنظيم الوقت',
              'احترام المعلم وتقدير أهل الفضل والعلم',
              'الصّدق والأمانة.. سر النجاح',
              'الغذاء الصحي والنشاط البدني في الصباح',
              'حب الوطن والانتماء والعطاء المستمر',
            ].map((topicItem, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAiModalOpen(true);
                }}
                className="text-xs px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-700 hover:text-emerald-900 font-semibold transition shrink-0 cursor-pointer"
              >
                {topicItem}
              </button>
            ))}
          </div>
        </div>

        {/* Central Workspace: Section Editor */}
        <SectionEditor
          broadcast={broadcast}
          onChange={handleUpdateBroadcast}
          onOpenAiEnhancer={handleOpenAiEnhancer}
          onOpenStudentsModal={() => setIsStudentsModalOpen(true)}
        />

        {/* Presenting Tips Callout */}
        {broadcast.presentingTips && broadcast.presentingTips.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>إرشادات ونصائح الإلقاء الصباحي للطلاب المشاركين:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {broadcast.presentingTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 p-3 rounded-2xl border border-amber-200/80 text-xs text-slate-800 leading-relaxed font-medium"
                >
                  <span className="font-bold text-amber-800 ml-1">#{idx + 1}</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Quick Action Dock */}
      <div className="sticky bottom-4 z-30 max-w-4xl mx-auto px-4 w-full print:hidden">
        <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-3xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
              🎙️
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{broadcast.title}</div>
              <div className="text-[10px] text-slate-400 truncate">
                {broadcast.schoolInfo.schoolName} • {broadcast.schoolInfo.dayOfWeek}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleCopyScript}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="نسخ نص الإذاعة كاملاً"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">نسخ النص</span>
            </button>

            <button
              onClick={() => exportBroadcastToWord(broadcast)}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="تصدير كملف Word للطباعة والتعديل"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تصدير Word</span>
            </button>

            <button
              onClick={() => setIsLiveModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="بدء الإلقاء الصباحي المباشر والمؤقت"
            >
              <PlayCircle className="w-4 h-4" />
              <span>البث الصباحي</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/25"
              title="طباعة النماذج الرسمية"
            >
              <Printer className="w-4 h-4" />
              <span>الطباعة الرسمية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 print:hidden mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">أثير - منصة الإذاعة المدرسية الذكية</span>
            <span>•</span>
            <span>تصميم وطباعة النماذج المعتمدة لمدارس العالم العربي</span>
          </div>
          <div>
            جميع الحقوق محفوظة للمدرسة والمعلم © {new Date().getFullYear()}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AIGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerated={handleAiGenerated}
        currentBroadcast={broadcast}
      />

      <SchoolInfoModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        schoolInfo={broadcast.schoolInfo}
        onSave={handleSchoolInfoSave}
      />

      <StudentsManagerModal
        isOpen={isStudentsModalOpen}
        onClose={() => setIsStudentsModalOpen(false)}
        broadcast={broadcast}
        onChange={handleUpdateBroadcast}
      />

      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        broadcast={broadcast}
      />

      <LiveStageRehearsalModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        broadcast={broadcast}
      />

      <BroadcastLibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        currentBroadcast={broadcast}
        onLoadBroadcast={(b) => setBroadcast(b)}
      />

      <AiEnhancerModal
        isOpen={aiEnhancerState.isOpen}
        onClose={() => setAiEnhancerState({ ...aiEnhancerState, isOpen: false })}
        sectionKey={aiEnhancerState.sectionKey}
        sectionTitle={aiEnhancerState.sectionTitle}
        topic={broadcast.topic}
        currentContent={aiEnhancerState.currentContent}
        onApply={handleApplyAiEnhancerResult}
      />
    </div>
  );
}
