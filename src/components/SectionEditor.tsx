import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Square,
  CheckSquare,
  Trash2,
  Plus,
  Clock,
  User,
  HelpCircle,
  GripVertical,
  ChevronDown,
  ChevronUp,
  VolumeX,
} from 'lucide-react';
import { RadioBroadcast } from '../types/radio';
import { speakArabicText, stopSpeech } from '../utils/audioEffects';

interface SectionEditorProps {
  broadcast: RadioBroadcast;
  onChange: (updated: RadioBroadcast) => void;
  onOpenAiEnhancer: (sectionKey: string, sectionTitle: string, currentContent: any) => void;
  onOpenStudentsModal: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  broadcast,
  onChange,
  onOpenAiEnhancer,
  onOpenStudentsModal,
}) => {
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleCollapse = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSpeak = (key: string, text: string) => {
    if (playingKey === key) {
      stopSpeech();
      setPlayingKey(null);
    } else {
      stopSpeech();
      setPlayingKey(key);
      speakArabicText(text, () => setPlayingKey(null));
    }
  };

  // Helper to add custom section
  const handleAddCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection = {
      id: newId,
      title: 'فقرة جديدة (إعلان أو تكريم)',
      content: 'اكتب نص الفقرة هنا...',
      presenterName: '',
      presenterGrade: '',
      estimatedMinutes: 1,
    };
    onChange({
      ...broadcast,
      customSections: [...broadcast.customSections, newSection],
    });
  };

  const handleRemoveCustomSection = (id: string) => {
    onChange({
      ...broadcast,
      customSections: broadcast.customSections.filter((s) => s.id !== id),
    });
  };

  // Calculate total duration
  const totalMinutes =
    (broadcast.introduction.estimatedMinutes || 1) +
    (broadcast.quran.enabled ? broadcast.quran.estimatedMinutes || 1 : 0) +
    (broadcast.hadith.enabled ? broadcast.hadith.estimatedMinutes || 0.5 : 0) +
    (broadcast.speech.enabled ? broadcast.speech.estimatedMinutes || 1.5 : 0) +
    (broadcast.didYouKnow.enabled ? broadcast.didYouKnow.estimatedMinutes || 1 : 0) +
    (broadcast.wisdom.enabled ? broadcast.wisdom.estimatedMinutes || 0.5 : 0) +
    (broadcast.poetry.enabled ? broadcast.poetry.estimatedMinutes || 0.5 : 0) +
    (broadcast.quiz.enabled ? broadcast.quiz.estimatedMinutes || 0.5 : 0) +
    (broadcast.supplication.enabled ? broadcast.supplication.estimatedMinutes || 0.5 : 0) +
    (broadcast.outro.estimatedMinutes || 0.5) +
    broadcast.customSections.reduce((acc, s) => acc + (s.estimatedMinutes || 1), 0);

  return (
    <div className="space-y-6">
      {/* Overview & Program Header Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              الموضوع الرئيسي
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
              المدة التقديرية: ~{totalMinutes} دقائق
            </span>
          </div>
          <input
            type="text"
            value={broadcast.title}
            onChange={(e) => onChange({ ...broadcast, title: e.target.value })}
            className="text-base sm:text-2xl font-black text-slate-900 w-full outline-none hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-200 rounded-xl px-2 py-1 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <button
            onClick={onOpenStudentsModal}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>توزيع الطلاب ({broadcast.students.length})</span>
          </button>
          <button
            onClick={handleAddCustomSection}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فقرة مخصصة</span>
          </button>
        </div>
      </div>

      {/* 1. Introduction Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-lg">
              🎙️
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">المقدمة الإذاعية والترحيب</h3>
              <p className="text-xs text-slate-500">مطلع ترحيبي بليغ يفتتح به برنامج الصباح</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('intro', broadcast.introduction.text)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع للنص"
            >
              {playingKey === 'intro' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() =>
                onOpenAiEnhancer('intro', 'المقدمة الإذاعية', broadcast.introduction.text)
              }
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('intro')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['intro'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {!collapsedSections['intro'] && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex-1 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="اسم الطالب المقدم..."
                  value={broadcast.introduction.presenterName || ''}
                  onChange={(e) =>
                    onChange({
                      ...broadcast,
                      introduction: { ...broadcast.introduction, presenterName: e.target.value },
                    })
                  }
                  className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 w-full outline-none focus:border-emerald-500"
                />
              </div>
              <div className="w-full sm:w-48">
                <input
                  type="text"
                  placeholder="الصف الدراسي..."
                  value={broadcast.introduction.presenterGrade || ''}
                  onChange={(e) =>
                    onChange({
                      ...broadcast,
                      introduction: { ...broadcast.introduction, presenterGrade: e.target.value },
                    })
                  }
                  className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 w-full outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <textarea
              rows={4}
              value={broadcast.introduction.text}
              onChange={(e) =>
                onChange({
                  ...broadcast,
                  introduction: { ...broadcast.introduction, text: e.target.value },
                })
              }
              className="w-full p-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm leading-relaxed text-slate-800 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 2. Quran Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({
                  ...broadcast,
                  quran: { ...broadcast.quran, enabled: !broadcast.quran.enabled },
                })
              }
              className="p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
            >
              {broadcast.quran.enabled ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-lg">
              📖
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">القرآن الكريم</h3>
              <p className="text-xs text-slate-500">
                {broadcast.quran.data.surah || 'الآيات الكريمة'} ({broadcast.quran.data.verses || ''})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('quran', broadcast.quran.data.text)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'quran' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() =>
                onOpenAiEnhancer('quran', 'القرآن الكريم', broadcast.quran.data)
              }
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
              title="تحسين أو اقتراح آيات بديلة"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('quran')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['quran'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {broadcast.quran.enabled && !collapsedSections['quran'] && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم القارئ..."
                value={broadcast.quran.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    quran: { ...broadcast.quran, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="اسم السورة (سورة الإسراء)..."
                value={broadcast.quran.data.surah}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    quran: {
                      ...broadcast.quran,
                      data: { ...broadcast.quran.data, surah: e.target.value },
                    },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="الآيات (23 - 24)..."
                value={broadcast.quran.data.verses}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    quran: {
                      ...broadcast.quran,
                      data: { ...broadcast.quran.data, verses: e.target.value },
                    },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>

            <textarea
              rows={3}
              value={broadcast.quran.data.text}
              onChange={(e) =>
                onChange({
                  ...broadcast,
                  quran: {
                    ...broadcast.quran,
                    data: { ...broadcast.quran.data, text: e.target.value },
                  },
                })
              }
              className="w-full p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 focus:border-emerald-500 font-serif text-base sm:text-lg leading-loose text-emerald-950 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 3. Hadith Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({
                  ...broadcast,
                  hadith: { ...broadcast.hadith, enabled: !broadcast.hadith.enabled },
                })
              }
              className="p-1 text-slate-400 hover:text-amber-600 transition cursor-pointer"
            >
              {broadcast.hadith.enabled ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-lg">
              🕌
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">الحديث الشريف</h3>
              <p className="text-xs text-slate-500">حديث نبوي صحيح مع الراوي والتخريج</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('hadith', broadcast.hadith.data.text)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'hadith' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() =>
                onOpenAiEnhancer('hadith', 'الحديث الشريف', broadcast.hadith.data)
              }
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('hadith')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['hadith'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {broadcast.hadith.enabled && !collapsedSections['hadith'] && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم الطالب الملقي..."
                value={broadcast.hadith.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    hadith: { ...broadcast.hadith, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="تخريج الحديث (رواه البخاري ومسلم)..."
                value={broadcast.hadith.data.narrator}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    hadith: {
                      ...broadcast.hadith,
                      data: { ...broadcast.hadith.data, narrator: e.target.value },
                    },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>

            <textarea
              rows={3}
              value={broadcast.hadith.data.text}
              onChange={(e) =>
                onChange({
                  ...broadcast,
                  hadith: {
                    ...broadcast.hadith,
                    data: { ...broadcast.hadith.data, text: e.target.value },
                  },
                })
              }
              className="w-full p-4 rounded-2xl border border-amber-200 bg-amber-50/20 focus:border-amber-500 text-sm leading-relaxed text-slate-900 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 4. Speech Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({
                  ...broadcast,
                  speech: { ...broadcast.speech, enabled: !broadcast.speech.enabled },
                })
              }
              className="p-1 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
            >
              {broadcast.speech.enabled ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-lg">
              🎤
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">كلمة الصباح</h3>
              <p className="text-xs text-slate-500">
                {broadcast.speech.data.title || 'مقال توجيهي بليغ'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('speech', broadcast.speech.data.content)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'speech' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() =>
                onOpenAiEnhancer('speech', 'كلمة الصباح', broadcast.speech.data)
              }
              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('speech')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['speech'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {broadcast.speech.enabled && !collapsedSections['speech'] && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم الطالب الملقي..."
                value={broadcast.speech.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    speech: { ...broadcast.speech, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="عنوان الكلمة..."
                value={broadcast.speech.data.title}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    speech: {
                      ...broadcast.speech,
                      data: { ...broadcast.speech.data, title: e.target.value },
                    },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-indigo-900 outline-none"
              />
            </div>

            <textarea
              rows={4}
              value={broadcast.speech.data.content}
              onChange={(e) =>
                onChange({
                  ...broadcast,
                  speech: {
                    ...broadcast.speech,
                    data: { ...broadcast.speech.data, content: e.target.value },
                  },
                })
              }
              className="w-full p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm leading-relaxed text-slate-800 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 5. Did You Know Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({
                  ...broadcast,
                  didYouKnow: {
                    ...broadcast.didYouKnow,
                    enabled: !broadcast.didYouKnow.enabled,
                  },
                })
              }
              className="p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
            >
              {broadcast.didYouKnow.enabled ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-yellow-50 text-yellow-700 font-bold flex items-center justify-center text-lg">
              💡
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">فقرة هل تعلم؟</h3>
              <p className="text-xs text-slate-500">
                {broadcast.didYouKnow.items.length} معلومات وحقائق شيقة
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('didYouKnow', broadcast.didYouKnow.items.join('. '))}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'didYouKnow' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() =>
                onOpenAiEnhancer('didYouKnow', 'هل تعلم', broadcast.didYouKnow.items)
              }
              className="p-2 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-yellow-800 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('didYouKnow')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['didYouKnow'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {broadcast.didYouKnow.enabled && !collapsedSections['didYouKnow'] && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم الطالب الملقي..."
                value={broadcast.didYouKnow.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    didYouKnow: { ...broadcast.didYouKnow, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 w-full outline-none"
              />
            </div>

            <div className="space-y-2">
              {broadcast.didYouKnow.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-yellow-600 mt-2.5 shrink-0">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...broadcast.didYouKnow.items];
                      newItems[idx] = e.target.value;
                      onChange({
                        ...broadcast,
                        didYouKnow: { ...broadcast.didYouKnow, items: newItems },
                      });
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = broadcast.didYouKnow.items.filter((_, i) => i !== idx);
                      onChange({
                        ...broadcast,
                        didYouKnow: { ...broadcast.didYouKnow, items: newItems },
                      });
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...broadcast,
                    didYouKnow: {
                      ...broadcast.didYouKnow,
                      items: [...broadcast.didYouKnow.items, 'هل تعلم أن...'],
                    },
                  });
                }}
                className="text-xs font-bold text-yellow-700 hover:text-yellow-800 flex items-center gap-1 mt-2 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة معلومة جديدة
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Wisdom Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({
                  ...broadcast,
                  wisdom: { ...broadcast.wisdom, enabled: !broadcast.wisdom.enabled },
                })
              }
              className="p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
            >
              {broadcast.wisdom.enabled ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-lg">
              💎
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">حكمة اليوم</h3>
              <p className="text-xs text-slate-500">حكمة بليغة ومعبرة</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('wisdom', broadcast.wisdom.data.text)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'wisdom' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() =>
                onOpenAiEnhancer('wisdom', 'حكمة اليوم', broadcast.wisdom.data)
              }
              className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('wisdom')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['wisdom'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {broadcast.wisdom.enabled && !collapsedSections['wisdom'] && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم الطالب الملقي..."
                value={broadcast.wisdom.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    wisdom: { ...broadcast.wisdom, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="قائل الحكمة أو المصدر..."
                value={broadcast.wisdom.data.author || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    wisdom: {
                      ...broadcast.wisdom,
                      data: { ...broadcast.wisdom.data, author: e.target.value },
                    },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
            <textarea
              rows={2}
              value={broadcast.wisdom.data.text}
              onChange={(e) =>
                onChange({
                  ...broadcast,
                  wisdom: {
                    ...broadcast.wisdom,
                    data: { ...broadcast.wisdom.data, text: e.target.value },
                  },
                })
              }
              className="w-full p-4 rounded-2xl border border-teal-200 bg-teal-50/20 text-sm text-slate-800 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 7. Poetry Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({
                  ...broadcast,
                  poetry: { ...broadcast.poetry, enabled: !broadcast.poetry.enabled },
                })
              }
              className="p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
            >
              {broadcast.poetry.enabled ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-lg">
              📜
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">فقرة الشعر والأدب</h3>
              <p className="text-xs text-slate-500">أبيات شعرية فصيحة وموزونة</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('poetry', broadcast.poetry.data.verses)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'poetry' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() =>
                onOpenAiEnhancer('poetry', 'فقرة الشعر', broadcast.poetry.data)
              }
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('poetry')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['poetry'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {broadcast.poetry.enabled && !collapsedSections['poetry'] && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم الطالب الملقي..."
                value={broadcast.poetry.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    poetry: { ...broadcast.poetry, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="الشاعر أو القائل..."
                value={broadcast.poetry.data.poet || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    poetry: {
                      ...broadcast.poetry,
                      data: { ...broadcast.poetry.data, poet: e.target.value },
                    },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none"
              />
            </div>
            <textarea
              rows={3}
              value={broadcast.poetry.data.verses}
              onChange={(e) =>
                onChange({
                  ...broadcast,
                  poetry: {
                    ...broadcast.poetry,
                    data: { ...broadcast.poetry.data, verses: e.target.value },
                  },
                })
              }
              className="w-full p-4 rounded-2xl border border-purple-200 bg-purple-50/20 text-center font-serif text-sm leading-loose text-purple-950 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 8. Quiz Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({
                  ...broadcast,
                  quiz: { ...broadcast.quiz, enabled: !broadcast.quiz.enabled },
                })
              }
              className="p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
            >
              {broadcast.quiz.enabled ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 font-bold flex items-center justify-center text-lg">
              🎁
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">سؤال وجائزة الصباح</h3>
              <p className="text-xs text-slate-500">مسابقة تفاعلية مع الطلاب في الطابور</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                handleSpeak(
                  'quiz',
                  `السؤال: ${broadcast.quiz.data.question}. الإجابة: ${broadcast.quiz.data.answer}`
                )
              }
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'quiz' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onOpenAiEnhancer('quiz', 'سؤال وجائزة', broadcast.quiz.data)}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('quiz')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['quiz'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {broadcast.quiz.enabled && !collapsedSections['quiz'] && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم الطالب المقدم..."
                value={broadcast.quiz.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    quiz: { ...broadcast.quiz, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 w-full outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">السؤال:</label>
              <input
                type="text"
                value={broadcast.quiz.data.question}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    quiz: {
                      ...broadcast.quiz,
                      data: { ...broadcast.quiz.data, question: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-800 mb-1">
                الإجابة النموذجية:
              </label>
              <input
                type="text"
                value={broadcast.quiz.data.answer}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    quiz: {
                      ...broadcast.quiz,
                      data: { ...broadcast.quiz.data, answer: e.target.value },
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-xs sm:text-sm font-bold text-emerald-950 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 9. Supplication Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange({
                  ...broadcast,
                  supplication: {
                    ...broadcast.supplication,
                    enabled: !broadcast.supplication.enabled,
                  },
                })
              }
              className="p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
            >
              {broadcast.supplication.enabled ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-lg">
              🤲
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">دعاء الصباح</h3>
              <p className="text-xs text-slate-500">دعاء جامع للوطن والوالدين والمعلمين والطلاب</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('supplication', broadcast.supplication.text)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'supplication' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() =>
                onOpenAiEnhancer('supplication', 'دعاء الصباح', broadcast.supplication.text)
              }
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('supplication')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['supplication'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {broadcast.supplication.enabled && !collapsedSections['supplication'] && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم الطالب الداعي..."
                value={broadcast.supplication.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    supplication: { ...broadcast.supplication, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 w-full outline-none"
              />
            </div>
            <textarea
              rows={3}
              value={broadcast.supplication.text}
              onChange={(e) =>
                onChange({
                  ...broadcast,
                  supplication: { ...broadcast.supplication, text: e.target.value },
                })
              }
              className="w-full p-4 rounded-2xl border border-blue-200 bg-blue-50/20 text-sm leading-relaxed text-slate-900 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* 10. Outro Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-lg">
              🏁
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">الخاتمة الإذاعية</h3>
              <p className="text-xs text-slate-500">وداعية راقية وتحية العلم</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleSpeak('outro', broadcast.outro.text)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              title="استماع"
            >
              {playingKey === 'outro' ? (
                <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onOpenAiEnhancer('outro', 'الخاتمة الإذاعية', broadcast.outro.text)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="تحسين بالذكاء الاصطناعي"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCollapse('outro')}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              {collapsedSections['outro'] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {!collapsedSections['outro'] && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <input
                type="text"
                placeholder="اسم الطالب المقدم..."
                value={broadcast.outro.presenterName || ''}
                onChange={(e) =>
                  onChange({
                    ...broadcast,
                    outro: { ...broadcast.outro, presenterName: e.target.value },
                  })
                }
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 w-full outline-none"
              />
            </div>
            <textarea
              rows={3}
              value={broadcast.outro.text}
              onChange={(e) =>
                onChange({
                  ...broadcast,
                  outro: { ...broadcast.outro, text: e.target.value },
                })
              }
              className="w-full p-4 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-800 outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* Custom Sections */}
      {broadcast.customSections.map((sec, idx) => (
        <div
          key={sec.id}
          className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-dashed border-emerald-300 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xl">⭐</span>
              <input
                type="text"
                value={sec.title}
                onChange={(e) => {
                  const updated = [...broadcast.customSections];
                  updated[idx].title = e.target.value;
                  onChange({ ...broadcast, customSections: updated });
                }}
                className="font-bold text-base text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none px-1"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleRemoveCustomSection(sec.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                title="حذف الفقرة المخصصة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex gap-3">
              <input
                type="text"
                placeholder="اسم الطالب الملقي..."
                value={sec.presenterName || ''}
                onChange={(e) => {
                  const updated = [...broadcast.customSections];
                  updated[idx].presenterName = e.target.value;
                  onChange({ ...broadcast, customSections: updated });
                }}
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex-1 outline-none"
              />
            </div>
            <textarea
              rows={3}
              value={sec.content}
              onChange={(e) => {
                const updated = [...broadcast.customSections];
                updated[idx].content = e.target.value;
                onChange({ ...broadcast, customSections: updated });
              }}
              className="w-full p-4 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-800 outline-none resize-y"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
