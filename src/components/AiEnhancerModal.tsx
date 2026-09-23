import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  Check,
  Loader2,
  Feather,
  Baby,
  Maximize2,
  BookCheck,
  RefreshCw,
} from 'lucide-react';

interface AiEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionKey: string;
  sectionTitle: string;
  topic: string;
  currentContent: any;
  onApply: (updatedContent: any) => void;
}

export const AiEnhancerModal: React.FC<AiEnhancerModalProps> = ({
  isOpen,
  onClose,
  sectionKey,
  sectionTitle,
  topic,
  currentContent,
  onApply,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('poetic');
  const [isLoading, setIsLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const actions = [
    {
      id: 'poetic',
      title: 'صياغة مسجوعة وبلاغية رنانة',
      desc: 'إعادة الصياغة بأسلوب عربي فصيح وجميل يجذب أسماع الطابور الصباحي',
      icon: Feather,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'tashkeel',
      title: 'ضبط الحركات والتشكيل اللغوي',
      desc: 'تشكيل أواخر الكلمات والآيات لتسهيل قراءة الطالب بدون أخطاء نحوية',
      icon: BookCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'simplify',
      title: 'تبسيط للمرحلة الابتدائية',
      desc: 'جعل الأسلوب سهلاً وواضحاً ومحبباً للأطفال والصغار',
      icon: Baby,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'lengthen',
      title: 'توسيع الفكرة وإثراء المعنى',
      desc: 'إضافة جمل إرشادية وأفكار أعمق للفقرة',
      icon: Maximize2,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'new',
      title: 'توليد فكرة بديلة وجديدة تماماً',
      desc: 'صياغة محتوى مختلف ومبتكر للفقرة في نفس الموضوع',
      icon: RefreshCw,
      color: 'text-teal-600 bg-teal-50',
    },
  ];

  const handleRunAi = async () => {
    setIsLoading(true);
    setError('');
    setPreviewContent(null);

    try {
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey,
          topic,
          currentContent,
          action: selectedAction,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'تعذر معالجة الطلب');
      }

      setPreviewContent(data.result);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء معالجة الذكاء الاصطناعي');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyResult = () => {
    if (previewContent) {
      onApply(previewContent);
      onClose();
    }
  };

  const renderContentPreview = (content: any) => {
    if (!content) return null;
    if (typeof content === 'string') {
      return <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">{content}</p>;
    }
    if (Array.isArray(content)) {
      return (
        <ul className="space-y-2 list-disc list-inside text-sm text-slate-800">
          {content.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    if (typeof content === 'object') {
      return (
        <div className="space-y-2 text-sm text-slate-800">
          {content.title && <div className="font-bold text-emerald-800">العنوان: {content.title}</div>}
          {content.content && <p className="whitespace-pre-line leading-relaxed">{content.content}</p>}
          {content.text && <p className="whitespace-pre-line leading-relaxed">{content.text}</p>}
          {content.verses && <p className="font-serif italic leading-relaxed">{content.verses}</p>}
          {content.question && (
            <div>
              <span className="font-bold">السؤال:</span> {content.question}
            </div>
          )}
          {content.answer && (
            <div className="text-emerald-700">
              <span className="font-bold">الجواب:</span> {content.answer}
            </div>
          )}
        </div>
      );
    }
    return JSON.stringify(content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">تطوير وتحسين: {sectionTitle}</h3>
              <p className="text-xs text-emerald-100">
                إعادة صياغة أو تشكيل بالذكاء الاصطناعي لموضوع: {topic}
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
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
              {error}
            </div>
          )}

          {/* Action Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">اختر نوع التحسين المطلوب:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {actions.map((act) => {
                const IconComponent = act.icon;
                const isSelected = selectedAction === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setSelectedAction(act.id)}
                    className={`p-3 rounded-2xl border text-right transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{act.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{act.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Button */}
          <div>
            <button
              onClick={handleRunAi}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري المعالجة بالذكاء الاصطناعي...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  معالجة الفقرة الآن
                </>
              )}
            </button>
          </div>

          {/* Result Preview Box */}
          {previewContent && (
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-emerald-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 border-b border-emerald-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  النتيجة المقترحة:
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  جاهزة للتطبيق
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                {renderContentPreview(previewContent)}
              </div>
              <button
                type="button"
                onClick={handleApplyResult}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                اعتماد وتحديث الفقرة في الإذاعة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
