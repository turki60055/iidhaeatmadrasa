import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Wand2,
  Clock,
  GraduationCap,
  Volume2,
  CheckSquare,
  Square,
  Lightbulb,
  Loader2,
  BookOpen,
  HelpCircle,
  Tag,
  Search,
} from 'lucide-react';
import { RadioBroadcast } from '../types/radio';
import { PRESET_TOPICS } from '../data/presets';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (broadcastData: Partial<RadioBroadcast>) => void;
  currentBroadcast: RadioBroadcast;
}

const ALL_SECTIONS = [
  { id: 'intro', label: 'المقدمة الإذاعية', icon: '🎙️', desc: 'مطلع ترحيبي فصيح ومميز' },
  { id: 'quran', label: 'القرآن الكريم', icon: '📖', desc: 'آيات مع التشكيل ورقم السورة' },
  { id: 'hadith', label: 'الحديث الشريف', icon: '🕌', desc: 'حديث صحيح وتخريجه' },
  { id: 'speech', label: 'كلمة الصباح', icon: '🎤', desc: 'مقال توجيهي بليغ وموجز' },
  { id: 'didYouKnow', label: 'هل تعلم؟', icon: '💡', desc: '3-4 حقائق علمية وثقافية' },
  { id: 'wisdom', label: 'حكمة اليوم', icon: '💎', desc: 'حكمة بليغة ومعبرة' },
  { id: 'poetry', label: 'فقرة الشعر', icon: '📜', desc: 'أبيات شعرية فصيحة' },
  { id: 'quiz', label: 'سؤال وجائزة', icon: '🎁', desc: 'مسابقة تفاعلية مع الجواب' },
  { id: 'supplication', label: 'دعاء الصباح', icon: '🤲', desc: 'دعاء جامع للوطن والجميع' },
  { id: 'outro', label: 'الخاتمة الإذاعية', icon: '🏁', desc: 'تحية العلم والختام' },
];

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
  currentBroadcast,
}) => {
  const [topic, setTopic] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [tone, setTone] = useState('فصيح وملهم وبليغ');
  const [gradeLevel, setGradeLevel] = useState(
    currentBroadcast.schoolInfo.schoolStage === 'ابتدائي'
      ? 'المرحلة الابتدائية'
      : currentBroadcast.schoolInfo.schoolStage === 'ثانوي'
      ? 'المرحلة الثانوية'
      : 'المرحلة المتوسطة'
  );
  const [targetDuration, setTargetDuration] = useState('5-7 دقائق');
  const [customInstructions, setCustomInstructions] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'intro',
    'quran',
    'hadith',
    'speech',
    'didYouKnow',
    'wisdom',
    'poetry',
    'quiz',
    'supplication',
    'outro',
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [suggestedTopics, setSuggestedTopics] = useState<any[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const loadingStepsTexts = [
    'جاري تحليل الموضوع وتحديد الأهداف التربوية...',
    'صياغة المقدمة الترحيبية والكلمات البليغة...',
    'انتقاء الآيات القرآنية والأحاديث النبوية الموثوقة...',
    'توليد حقائق "هل تعلم" وحكمة اليوم والمسابقة...',
    'ضبط الفصاحة والتشكيل وتجهيز بطاقات الإلقاء...',
  ];

  const handleToggleSection = (id: string) => {
    if (selectedSections.includes(id)) {
      if (selectedSections.length === 1) return; // keep at least one
      setSelectedSections(selectedSections.filter((s) => s !== id));
    } else {
      setSelectedSections([...selectedSections, id]);
    }
  };

  const handleSelectPreset = (title: string) => {
    setTopic(title);
  };

  const handleFetchAiSuggestions = async () => {
    try {
      setIsSuggesting(true);
      const res = await fetch('/api/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeLevel,
          category: categoryFilter !== 'الكل' ? categoryFilter : 'متنوع ومبتكر',
        }),
      });
      const data = await res.json();
      if (data.success && data.topics) {
        setSuggestedTopics(data.topics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMessage('يرجى كتابة أو اختيار موضوع للإذاعة المدرسية.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingStepsTexts.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch('/api/generate-radio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          gradeLevel,
          tone,
          targetDuration,
          schoolName: currentBroadcast.schoolInfo.schoolName,
          selectedSections,
          customInstructions: customInstructions.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'حدث خطأ أثناء الاتصال بنموذج الذكاء الاصطناعي');
      }

      const b = data.broadcast;

      const generatedBroadcast: Partial<RadioBroadcast> = {
        title: b.title || topic,
        topic: b.topic || topic,
        tone,
        targetDuration,
        introduction: {
          text: b.introduction || currentBroadcast.introduction.text,
          presenterName:
            currentBroadcast.introduction.presenterName ||
            (currentBroadcast.schoolInfo.headStudent !== 'اكتب اسم مقدم الإذاعة'
              ? currentBroadcast.schoolInfo.headStudent
              : ''),
          presenterGrade: currentBroadcast.introduction.presenterGrade || '',
          estimatedMinutes: 1,
        },
        quran: {
          enabled: selectedSections.includes('quran'),
          data: b.quran || currentBroadcast.quran.data,
          presenterName: currentBroadcast.quran.presenterName || '',
          presenterGrade: currentBroadcast.quran.presenterGrade || '',
          estimatedMinutes: 1,
        },
        hadith: {
          enabled: selectedSections.includes('hadith'),
          data: b.hadith || currentBroadcast.hadith.data,
          presenterName: currentBroadcast.hadith.presenterName || '',
          presenterGrade: currentBroadcast.hadith.presenterGrade || '',
          estimatedMinutes: 0.5,
        },
        speech: {
          enabled: selectedSections.includes('speech'),
          data: b.speech || currentBroadcast.speech.data,
          presenterName: currentBroadcast.speech.presenterName || '',
          presenterGrade: currentBroadcast.speech.presenterGrade || '',
          estimatedMinutes: 1.5,
        },
        didYouKnow: {
          enabled: selectedSections.includes('didYouKnow'),
          items: b.didYouKnow || currentBroadcast.didYouKnow.items,
          presenterName: currentBroadcast.didYouKnow.presenterName || '',
          presenterGrade: currentBroadcast.didYouKnow.presenterGrade || '',
          estimatedMinutes: 1,
        },
        wisdom: {
          enabled: selectedSections.includes('wisdom'),
          data: b.wisdom || currentBroadcast.wisdom.data,
          presenterName: currentBroadcast.wisdom.presenterName || '',
          presenterGrade: currentBroadcast.wisdom.presenterGrade || '',
          estimatedMinutes: 0.5,
        },
        poetry: {
          enabled: selectedSections.includes('poetry'),
          data: b.poetry || currentBroadcast.poetry.data,
          presenterName: currentBroadcast.poetry.presenterName || '',
          presenterGrade: currentBroadcast.poetry.presenterGrade || '',
          estimatedMinutes: 0.5,
        },
        quiz: {
          enabled: selectedSections.includes('quiz'),
          data: b.quiz || currentBroadcast.quiz.data,
          presenterName: currentBroadcast.quiz.presenterName || '',
          presenterGrade: currentBroadcast.quiz.presenterGrade || '',
          estimatedMinutes: 0.5,
        },
        supplication: {
          enabled: selectedSections.includes('supplication'),
          text: b.supplication || currentBroadcast.supplication.text,
          presenterName: currentBroadcast.supplication.presenterName || '',
          presenterGrade: currentBroadcast.supplication.presenterGrade || '',
          estimatedMinutes: 0.5,
        },
        outro: {
          text: b.outro || currentBroadcast.outro.text,
          presenterName:
            currentBroadcast.outro.presenterName ||
            (currentBroadcast.schoolInfo.headStudent !== 'اكتب اسم مقدم الإذاعة'
              ? currentBroadcast.schoolInfo.headStudent
              : ''),
          presenterGrade: currentBroadcast.outro.presenterGrade || '',
          estimatedMinutes: 0.5,
        },
        presentingTips: b.presentingTips || currentBroadcast.presentingTips,
        updatedAt: new Date().toISOString(),
      };

      onGenerated(generatedBroadcast);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const filteredPresetTopics = PRESET_TOPICS.filter(
    (cat) => categoryFilter === 'الكل' || cat.category === categoryFilter
  ).flatMap((c) => c.topics.filter((t) => t.title.includes(searchQuery) || t.desc.includes(searchQuery)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">المولّد الذكي للإذاعة المدرسية</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  Gemini 3.8 AI
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                توليد نصوص فصيحة، وفقرات قرآنية وأحاديث موثوقة ومسابقات شيقة تناسب مرحلتك المدرسية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-500/20 flex items-center justify-center shadow-xl">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs animate-bounce shadow">
                ✨
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              جاري توليد البرنامج الإذاعي بالذكاء الاصطناعي...
            </h3>
            <p className="text-sm font-semibold text-emerald-700 max-w-md mb-6 animate-pulse">
              {loadingStepsTexts[loadingStep]}
            </p>
            <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${((loadingStep + 1) / loadingStepsTexts.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 mt-4">
              قد يستغرق التوليد بضع ثوانٍ لضمان أعلى درجات الفصاحة والتدقيق
            </span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleGenerate} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Topic Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                موضوع الإذاعة المدرسية <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleFetchAiSuggestions}
                disabled={isSuggesting}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                {isSuggesting ? 'جاري الاقتراح...' : 'اقتراح أفكار بالذكاء الاصطناعي'}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="اكتب فكرة الإذاعة، مثال: بر الوالدين، الذكاء الاصطناعي، يوم المعلم، التفوق وتنظيم الوقت..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 text-slate-900 font-bold text-sm sm:text-base outline-none transition"
              />
              {topic && (
                <button
                  type="button"
                  onClick={() => setTopic('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* AI Suggested topics popup / cards */}
            {suggestedTopics.length > 0 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                  <span>💡 اقتراحات الذكاء الاصطناعي لموضوع اليوم:</span>
                  <button
                    type="button"
                    onClick={() => setSuggestedTopics([])}
                    className="text-amber-700 hover:text-amber-900 text-[10px]"
                  >
                    إغلاق
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedTopics.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(sug.title)}
                      className="text-right p-2 rounded-xl bg-white border border-amber-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition cursor-pointer"
                    >
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>{sug.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          {sug.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{sug.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preset Topics Explorer */}
          <div className="space-y-2.5 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                بنك المواضيع الجاهزة للإذاعة:
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['الكل', 'القيم والأخلاق', 'العلم والذكاء والابتكار', 'النجاح وتطوير الذات', 'الصحة والبيئة والرياضة', 'المناسبات والوطن'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
              {filteredPresetTopics.slice(0, 9).map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(t.title)}
                  className={`text-right p-2.5 rounded-xl border transition flex flex-col justify-between cursor-pointer ${
                    topic === t.title
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 text-emerald-950 font-bold'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold leading-snug">{t.title}</span>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="text-emerald-700 font-semibold">{t.tag}</span>
                    <span>{t.stage}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Broadcast Settings: Stage, Tone, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Grade Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                المرحلة الدراسية
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="المرحلة الابتدائية (الصفوف الأولية)">ابتدائي - صفوف أولية (أسلوب بسيط وجذاب)</option>
                <option value="المرحلة الابتدائية (الصفوف العليا)">ابتدائي - صفوف عليا (مشوق وتفاعلي)</option>
                <option value="المرحلة المتوسطة">المرحلة المتوسطة (فصيح ومعرفي)</option>
                <option value="المرحلة الثانوية">المرحلة الثانوية (بليغ وعميق وفكري)</option>
                <option value="جميع المراحل التعليمية">عام لجميع المراحل</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                أسلوب ونبرة الإلقاء
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="فصيح وبليغ ورصين">فصيح وبليغ ورصين (لغة عربية عالية)</option>
                <option value="حماسي ومشوق وملهم">حماسي ومشوق وملهم للطابور</option>
                <option value="تربوي إرشادي وهادئ">تربوي وإرشادي وهادئ</option>
                <option value="علمي وثقافي تفاعلي">علمي وثقافي تفاعلي</option>
                <option value="شاعري ومسجوع ورنان">شاعري ومسجوع وجميل</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                المدة المستهدفة للإذاعة
              </label>
              <select
                value={targetDuration}
                onChange={(e) => setTargetDuration(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="3-4 دقائق">إذاعة سريعة (3 - 4 دقائق)</option>
                <option value="5-7 دقائق">إذاعة نموذجية (5 - 7 دقائق)</option>
                <option value="8-10 دقائق">إذاعة احتفالية مفصلة (8 - 10 دقائق)</option>
              </select>
            </div>
          </div>

          {/* Section Selection Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                تحديد الفقرات المطلوب تضمينها وتوليدها:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSections(ALL_SECTIONS.map((s) => s.id))}
                  className="text-[11px] text-emerald-700 hover:underline font-bold cursor-pointer"
                >
                  تحديد الكل
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSections(['intro', 'quran', 'hadith', 'speech', 'outro'])
                  }
                  className="text-[11px] text-slate-600 hover:underline font-bold cursor-pointer"
                >
                  الفقرات الأساسية فقط
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {ALL_SECTIONS.map((section) => {
                const isChecked = selectedSections.includes(section.id);
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleToggleSection(section.id)}
                    className={`p-2.5 rounded-xl border text-right transition flex items-center gap-2 cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{section.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs leading-tight truncate">{section.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{section.desc}</div>
                    </div>
                    {isChecked ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Teacher Instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              توجيهات أو إضافات خاصة من المعلم / المشرف (اختياري)
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="مثال: ركز على دور الطلاب في الحفاظ على الكتب المدرسية، أو أضف إشارة إلى مسابقة أو مناسبة محددة في المدرسة..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm text-slate-800 outline-none resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              سيتم توليد المحتوى وتوزيعه تلقائياً على نموذج الإذاعة القابل للتعديل والطباعة.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Wand2 className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>ابدأ التوليد الذكي</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
