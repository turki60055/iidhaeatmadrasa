import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Bell,
  Music,
  ThumbsUp,
  Sparkles,
  Maximize,
  Minimize,
  Type,
  User,
} from 'lucide-react';
import { RadioBroadcast } from '../types/radio';
import {
  playSchoolBell,
  playRadioJingle,
  playApplause,
  speakArabicText,
  stopSpeech,
} from '../utils/audioEffects';

interface LiveStageRehearsalModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: RadioBroadcast;
}

export const LiveStageRehearsalModal: React.FC<LiveStageRehearsalModalProps> = ({
  isOpen,
  onClose,
  broadcast,
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [teleprompterFontSize, setTeleprompterFontSize] = useState<'md' | 'lg' | 'xl' | '2xl'>('xl');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Compile active stage sections
  const sections = [
    {
      id: 'intro',
      title: 'المقدمة الإذاعية',
      presenter: broadcast.introduction.presenterName || 'مقدم الإذاعة',
      grade: broadcast.introduction.presenterGrade,
      text: broadcast.introduction.text,
      badge: '🎙️ المطلع الترحيبي',
    },
    ...(broadcast.quran.enabled
      ? [
          {
            id: 'quran',
            title: `القرآن الكريم (${broadcast.quran.data.surah})`,
            presenter: broadcast.quran.presenterName || 'القارئ',
            grade: broadcast.quran.presenterGrade,
            text: broadcast.quran.data.text,
            extra: `الآيات: ${broadcast.quran.data.verses}`,
            badge: '📖 تلاوة خاشعة',
            isQuran: true,
          },
        ]
      : []),
    ...(broadcast.hadith.enabled
      ? [
          {
            id: 'hadith',
            title: 'الحديث الشريف',
            presenter: broadcast.hadith.presenterName || 'الطالب الملقي',
            grade: broadcast.hadith.presenterGrade,
            text: `${broadcast.hadith.data.text}\n\n(${broadcast.hadith.data.narrator})`,
            badge: '🕌 سنة نبوية',
          },
        ]
      : []),
    ...(broadcast.speech.enabled
      ? [
          {
            id: 'speech',
            title: `كلمة الصباح: ${broadcast.speech.data.title}`,
            presenter: broadcast.speech.presenterName || 'الطالب الملقي',
            grade: broadcast.speech.presenterGrade,
            text: broadcast.speech.data.content,
            badge: '🎤 مقال اليوم',
          },
        ]
      : []),
    ...(broadcast.didYouKnow.enabled
      ? [
          {
            id: 'didYouKnow',
            title: 'فقرة هل تعلم؟',
            presenter: broadcast.didYouKnow.presenterName || 'الطالب الملقي',
            grade: broadcast.didYouKnow.presenterGrade,
            text: broadcast.didYouKnow.items.map((it, idx) => `${idx + 1}. ${it}`).join('\n\n'),
            badge: '💡 معلومات علمية',
          },
        ]
      : []),
    ...(broadcast.wisdom.enabled
      ? [
          {
            id: 'wisdom',
            title: 'حكمة اليوم',
            presenter: broadcast.wisdom.presenterName || 'الطالب الملقي',
            grade: broadcast.wisdom.presenterGrade,
            text: `« ${broadcast.wisdom.data.text} »\n${broadcast.wisdom.data.author ? `- ${broadcast.wisdom.data.author}` : ''}`,
            badge: '💎 درر وحكم',
          },
        ]
      : []),
    ...(broadcast.poetry.enabled
      ? [
          {
            id: 'poetry',
            title: 'فقرة الشعر والأدب',
            presenter: broadcast.poetry.presenterName || 'الطالب الملقي',
            grade: broadcast.poetry.presenterGrade,
            text: `${broadcast.poetry.data.verses}\n${broadcast.poetry.data.poet ? `(${broadcast.poetry.data.poet})` : ''}`,
            badge: '📜 أبيات شعرية',
          },
        ]
      : []),
    ...(broadcast.quiz.enabled
      ? [
          {
            id: 'quiz',
            title: 'سؤال وجائزة الصباح',
            presenter: broadcast.quiz.presenterName || 'المقدم',
            grade: broadcast.quiz.presenterGrade,
            text: `السؤال: ${broadcast.quiz.data.question}\n\nالإجابة: ${broadcast.quiz.data.answer}`,
            badge: '🎁 مسابقة تفاعلية',
          },
        ]
      : []),
    ...(broadcast.supplication.enabled
      ? [
          {
            id: 'supplication',
            title: 'دعاء الصباح',
            presenter: broadcast.supplication.presenterName || 'الطالب الداعي',
            grade: broadcast.supplication.presenterGrade,
            text: broadcast.supplication.text,
            badge: '🤲 دعاء جامع',
          },
        ]
      : []),
    {
      id: 'outro',
      title: 'الخاتمة الإذاعية',
      presenter: broadcast.outro.presenterName || 'مقدم الإذاعة',
      grade: broadcast.outro.presenterGrade,
      text: broadcast.outro.text,
      badge: '🏁 ختام الإذاعة',
    },
  ];

  const currentSection = sections[currentSectionIndex] || sections[0];

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') {
        // RTL next
        if (currentSectionIndex < sections.length - 1) {
          setCurrentSectionIndex((i) => i + 1);
        }
      } else if (e.key === 'ArrowRight') {
        // RTL previous
        if (currentSectionIndex > 0) {
          setCurrentSectionIndex((i) => i - 1);
        }
      } else if (e.key === ' ') {
        setIsTimerRunning((r) => !r);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSectionIndex, sections.length]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSpeakCurrent = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      stopSpeech();
      setIsPlayingAudio(true);
      speakArabicText(currentSection.text, () => setIsPlayingAudio(false));
    }
  };

  const fontSizeStyles = {
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
    '2xl': 'text-3xl sm:text-4xl',
  }[teleprompterFontSize];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden animate-in fade-in">
      {/* Top Header Controls */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            🎙️
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>منصة الإلقاء الصباحي والمؤقت الحي</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                مباشر
              </span>
            </h2>
            <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">{broadcast.title}</p>
          </div>
        </div>

        {/* Stopwatch Timer */}
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700">
          <span className="font-mono text-lg sm:text-xl font-black text-amber-400 tracking-wider">
            {formatTime(timerSeconds)}
          </span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`p-1.5 rounded-lg transition ${
              isTimerRunning ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}
            title={isTimerRunning ? 'إيقاف مؤقت' : 'تشغيل المؤقت'}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setIsTimerRunning(false);
              setTimerSeconds(0);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            title="تصفير المؤقت"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Sound Effects Soundboard */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={playSchoolBell}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
            title="جرس الطابور الصباحي"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>جرس الطابور</span>
          </button>
          <button
            onClick={playRadioJingle}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-teal-400 transition"
            title="فاصل موسيقي إذاعي هادئ"
          >
            <Music className="w-3.5 h-3.5 text-teal-400" />
            <span>فاصل إذاعي</span>
          </button>
          <button
            onClick={playApplause}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition"
            title="تصفيق وتشجيع"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>تصفيق</span>
          </button>
        </div>

        {/* Teleprompter Settings & Close */}
        <div className="flex items-center gap-2">
          {/* Font scale */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setTeleprompterFontSize('md')}
              className={`px-2 py-1 rounded ${teleprompterFontSize === 'md' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              A
            </button>
            <button
              onClick={() => setTeleprompterFontSize('xl')}
              className={`px-2 py-1 rounded font-bold ${teleprompterFontSize === 'xl' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              A+
            </button>
            <button
              onClick={() => setTeleprompterFontSize('2xl')}
              className={`px-2 py-1 rounded font-black ${teleprompterFontSize === '2xl' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
            >
              A++
            </button>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-1 overflow-x-auto">
        {sections.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => {
              stopSpeech();
              setIsPlayingAudio(false);
              setCurrentSectionIndex(idx);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentSectionIndex === idx
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/20 text-[10px] flex items-center justify-center">
              {idx + 1}
            </span>
            <span>{sec.title}</span>
          </button>
        ))}
      </div>

      {/* Main Teleprompter Reader View */}
      <div className="flex-1 p-6 sm:p-12 overflow-y-auto flex flex-col justify-between max-w-5xl mx-auto w-full">
        {/* Presenter & Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {currentSection.badge}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">{currentSection.title}</h1>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
            <User className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">الطالب الملقي: </span>
              <strong className="text-emerald-300">{currentSection.presenter}</strong>
              {currentSection.grade && (
                <span className="text-slate-400 mr-1">({currentSection.grade})</span>
              )}
            </div>
          </div>
        </div>

        {/* Teleprompter Content */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div
            className={`w-full max-w-4xl text-center leading-loose font-medium text-slate-100 whitespace-pre-line ${fontSizeStyles} ${
              currentSection.isQuran ? 'font-serif text-emerald-300' : ''
            }`}
          >
            {currentSection.text}
          </div>
        </div>

        {/* Bottom Cue Hints & Actions */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakCurrent}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>إيقاف النطق</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>تدريب على الإلقاء ومخارج الحروف</span>
                </>
              )}
            </button>

            {/* Mobile Sound Effects */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={playSchoolBell}
                className="p-2.5 rounded-xl bg-slate-800 text-amber-400"
                title="جرس"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button
                onClick={playApplause}
                className="p-2.5 rounded-xl bg-slate-800 text-emerald-400"
                title="تصفيق"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Previous / Next Section Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              disabled={currentSectionIndex === 0}
              onClick={() => {
                stopSpeech();
                setIsPlayingAudio(false);
                setCurrentSectionIndex((i) => Math.max(0, i - 1));
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold text-xs transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الفقرة السابقة</span>
            </button>

            <span className="text-xs font-mono text-slate-500">
              {currentSectionIndex + 1} / {sections.length}
            </span>

            <button
              disabled={currentSectionIndex === sections.length - 1}
              onClick={() => {
                stopSpeech();
                setIsPlayingAudio(false);
                setCurrentSectionIndex((i) => Math.min(sections.length - 1, i + 1));
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <span>الفقرة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
