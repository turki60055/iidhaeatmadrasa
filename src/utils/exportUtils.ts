import { RadioBroadcast } from '../types/radio';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export type PrintTemplateType = 'student_pages' | 'official_single' | 'modern_single' | 'cue_sheet';

/**
 * Generates pristine, stand-alone HTML formatted for printing.
 * Supports both multi-page student cards (strictly ONE page per section/student) and single-page overview.
 */
export function generatePrintableHtml(
  broadcast: RadioBroadcast,
  template: PrintTemplateType = 'student_pages',
  options: { showSignatures?: boolean; isGrayscale?: boolean } = {}
): string {
  const { schoolInfo } = broadcast;
  const showSignatures = options.showSignatures !== false;
  const isGrayscale = options.isGrayscale || false;

  // Build the list of active sections for individual student pages
  const sections: Array<{
    id: string;
    num: number;
    title: string;
    icon: string;
    presenterName: string;
    presenterGrade?: string;
    duration: string;
    themeColor: string;
    themeBg: string;
    contentHtml: string;
    extraNote?: string;
  }> = [];

  let secNum = 1;

  // 1. Introduction
  sections.push({
    id: 'intro',
    num: secNum++,
    title: 'المقدمة الإذاعية',
    icon: '🎙️',
    presenterName: broadcast.introduction.presenterName || 'مقدم البرنامج الإذاعي',
    presenterGrade: broadcast.introduction.presenterGrade,
    duration: '1.5 دقيقة',
    themeColor: '#047857',
    themeBg: '#f0fdf4',
    contentHtml: `<div style="font-size: 14pt; line-height: 2.1; white-space: pre-line; color: #0f172a; text-align: justify; font-weight: 700; padding: 12px 16px; background: #ffffff; border: 2px solid #86efac; border-radius: 12px;">${broadcast.introduction.text}</div>`,
    extraNote: 'ابدأ بالبسملة والترحيب بالمعلمين والزملاء بنبرة صوت حماسية واثقة.',
  });

  // 2. Quran
  if (broadcast.quran.enabled) {
    sections.push({
      id: 'quran',
      num: secNum++,
      title: `القرآن الكريم (${broadcast.quran.data.surah})`,
      icon: '📖',
      presenterName: broadcast.quran.presenterName || 'قارئ القرآن الكريم',
      presenterGrade: broadcast.quran.presenterGrade,
      duration: '1.5 دقيقة',
      themeColor: '#15803d',
      themeBg: '#f0fdf4',
      contentHtml: `
        <div style="text-align: center; margin-bottom: 8px; font-weight: 900; color: #166534; font-size: 12pt;">
          أعوذ بالله من الشيطان الرجيم • بسم الله الرحمن الرحيم
        </div>
        <div style="font-family: 'Amiri', serif; font-size: 19pt; line-height: 2.3; text-align: center; color: #14532d; font-weight: 900; padding: 16px 20px; background: #ffffff; border: 2px solid #86efac; border-radius: 14px;">
          « ${broadcast.quran.data.text} »
        </div>
        <div style="text-align: center; margin-top: 8px; color: #166534; font-size: 11pt; font-weight: 900;">
          [ سورة ${broadcast.quran.data.surah} - الآيات: ${broadcast.quran.data.verses} ]
        </div>
      `,
      extraNote: 'رتل الآيات بخشوع وتمهل مع مراعاة أحكام التجويد والوقف.',
    });
  }

  // 3. Hadith
  if (broadcast.hadith.enabled) {
    sections.push({
      id: 'hadith',
      num: secNum++,
      title: 'الحديث الشريف',
      icon: '🕌',
      presenterName: broadcast.hadith.presenterName || 'قارئ الحديث الشريف',
      presenterGrade: broadcast.hadith.presenterGrade,
      duration: '1 دقيقة',
      themeColor: '#854d0e',
      themeBg: '#fefce8',
      contentHtml: `
        <div style="text-align: center; margin-bottom: 8px; font-weight: 900; color: #854d0e; font-size: 12pt;">
          قال رسول الله ﷺ:
        </div>
        <div style="font-size: 17pt; line-height: 2.2; text-align: center; color: #713f12; font-weight: 900; padding: 16px 20px; background: #ffffff; border: 2px solid #fde047; border-radius: 14px;">
          « ${broadcast.hadith.data.text} »
        </div>
        <div style="text-align: center; margin-top: 8px; color: #854d0e; font-size: 11pt; font-weight: 900;">
          (${broadcast.hadith.data.narrator})
        </div>
      `,
      extraNote: 'اذكر الحديث بوضوح مع الصلاة على النبي ﷺ عند ذكره.',
    });
  }

  // 4. Speech
  if (broadcast.speech.enabled) {
    sections.push({
      id: 'speech',
      num: secNum++,
      title: `كلمة الصباح: ${broadcast.speech.data.title}`,
      icon: '🎤',
      presenterName: broadcast.speech.presenterName || 'ملقي كلمة الصباح',
      presenterGrade: broadcast.speech.presenterGrade,
      duration: '2 دقيقة',
      themeColor: '#4338ca',
      themeBg: '#eef2ff',
      contentHtml: `
        <div style="font-size: 13.5pt; line-height: 2; white-space: pre-line; color: #1e1b4b; text-align: justify; font-weight: 700; padding: 12px 16px; background: #ffffff; border: 2px solid #c7d2fe; border-radius: 12px;">
          ${broadcast.speech.data.content}
        </div>
      `,
      extraNote: 'ألقِ الكلمة بنبرة واضحة ومؤثرة مع توزيع نظراتك على زملائك ومعلميك.',
    });
  }

  // 5. Did You Know
  if (broadcast.didYouKnow.enabled) {
    sections.push({
      id: 'didYouKnow',
      num: secNum++,
      title: 'فقرة هل تعلم؟',
      icon: '💡',
      presenterName: broadcast.didYouKnow.presenterName || 'مقدم فقرة هل تعلم',
      presenterGrade: broadcast.didYouKnow.presenterGrade,
      duration: '1.5 دقيقة',
      themeColor: '#0e7490',
      themeBg: '#ecfeff',
      contentHtml: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${broadcast.didYouKnow.items
            .map(
              (item, i) => `
            <div style="display: flex; align-items: center; gap: 10px; background: #ffffff; border: 1.5px solid #a5f3fc; border-radius: 10px; padding: 10px 14px;">
              <span style="background: #0891b2; color: #fff; font-weight: 900; font-size: 12pt; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${i + 1}</span>
              <span style="font-size: 14pt; line-height: 1.6; color: #155e75; font-weight: 800;">هل تعلم أن ${item}</span>
            </div>
          `
            )
            .join('')}
        </div>
      `,
      extraNote: 'ابدأ كل معلومة بعبارة (هل تعلم أن...) بصوت مسموع وواضح.',
    });
  }

  // 6. Wisdom
  if (broadcast.wisdom.enabled) {
    sections.push({
      id: 'wisdom',
      num: secNum++,
      title: 'حكمة اليوم',
      icon: '💎',
      presenterName: broadcast.wisdom.presenterName || 'مقدم الحكمة',
      presenterGrade: broadcast.wisdom.presenterGrade,
      duration: '1 دقيقة',
      themeColor: '#0f766e',
      themeBg: '#f0fdfa',
      contentHtml: `
        <div style="padding: 22px 18px; background: #ffffff; border: 2px solid #99f6e4; border-radius: 14px; text-align: center;">
          <div style="font-size: 19pt; line-height: 2.2; color: #115e59; font-weight: 900; font-style: italic;">
            « ${broadcast.wisdom.data.text} »
          </div>
          ${
            broadcast.wisdom.data.author
              ? `<div style="margin-top: 12px; font-size: 13pt; color: #0f766e; font-weight: 900;">- ${broadcast.wisdom.data.author}</div>`
              : ''
          }
        </div>
      `,
      extraNote: 'ألقِ الحكمة بتمهل مع التركيز على مغزاها التربوي.',
    });
  }

  // 7. Poetry
  if (broadcast.poetry.enabled) {
    sections.push({
      id: 'poetry',
      num: secNum++,
      title: 'فقرة الشعر والأدب',
      icon: '📜',
      presenterName: broadcast.poetry.presenterName || 'ملقي الشعر',
      presenterGrade: broadcast.poetry.presenterGrade,
      duration: '1.5 دقيقة',
      themeColor: '#7e22ce',
      themeBg: '#faf5ff',
      contentHtml: `
        <div style="padding: 20px 16px; background: #ffffff; border: 2px solid #e9d5ff; border-radius: 14px; text-align: center;">
          <div style="font-family: 'Amiri', serif; font-size: 18pt; line-height: 2.5; color: #581c87; font-weight: 900; white-space: pre-line;">
            ${broadcast.poetry.data.verses}
          </div>
        </div>
      `,
      extraNote: 'ألقِ الأبيات بنغمة شعرية معبرة وواضحة.',
    });
  }

  // 8. Quiz
  if (broadcast.quiz.enabled) {
    sections.push({
      id: 'quiz',
      num: secNum++,
      title: 'سؤال وجائزة الصباح',
      icon: '🎁',
      presenterName: broadcast.quiz.presenterName || 'مقدم المسابقة',
      presenterGrade: broadcast.quiz.presenterGrade,
      duration: '2 دقيقة',
      themeColor: '#be123c',
      themeBg: '#fff1f2',
      contentHtml: `
        <div style="padding: 14px 18px; background: #ffffff; border: 2px solid #fecdd3; border-radius: 12px; margin-bottom: 12px;">
          <div style="font-size: 11pt; font-weight: 900; color: #9f1239; margin-bottom: 4px;">السؤال المطروح للطلاب:</div>
          <div style="font-size: 16pt; font-weight: 900; color: #881337; line-height: 1.8;">
            ${broadcast.quiz.data.question}
          </div>
        </div>
        <div style="padding: 12px 16px; background: #f0fdf4; border: 1.5px dashed #86efac; border-radius: 12px;">
          <div style="font-size: 10.5pt; font-weight: 900; color: #166534; margin-bottom: 3px;">الإجابة النموذجية الصحيحة:</div>
          <div style="font-size: 14pt; font-weight: 900; color: #15803d;">
            ${broadcast.quiz.data.answer}
          </div>
        </div>
      `,
      extraNote: 'اطرح السؤال مرتين بوضوح، وادعُ أحد الزملاء للإجابة واستلام الجائزة.',
    });
  }

  // 9. Supplication
  if (broadcast.supplication.enabled) {
    sections.push({
      id: 'supplication',
      num: secNum++,
      title: 'دعاء الصباح',
      icon: '🤲',
      presenterName: broadcast.supplication.presenterName || 'قارئ الدعاء',
      presenterGrade: broadcast.supplication.presenterGrade,
      duration: '1 دقيقة',
      themeColor: '#1d4ed8',
      themeBg: '#eff6ff',
      contentHtml: `
        <div style="padding: 20px 16px; background: #ffffff; border: 2px solid #bfdbfe; border-radius: 14px; text-align: center;">
          <div style="font-size: 17pt; line-height: 2.3; color: #1e3a8a; font-weight: 900; white-space: pre-line;">
            ${broadcast.supplication.text}
          </div>
          <div style="margin-top: 14px; font-size: 14pt; color: #2563eb; font-weight: 900;">
            « اللَّهُمَّ آمِين .. اللَّهُمَّ آمِين »
          </div>
        </div>
      `,
      extraNote: 'ادعُ بخشوع وسكينة، واطلب من الجميع التأمين خلفك.',
    });
  }

  // 10. Outro
  sections.push({
    id: 'outro',
    num: secNum++,
    title: 'الخاتمة الإذاعية',
    icon: '🏁',
    presenterName: broadcast.outro.presenterName || 'مقدم البرنامج الإذاعي',
    presenterGrade: broadcast.outro.presenterGrade,
    duration: '1 دقيقة',
    themeColor: '#334155',
    themeBg: '#f8fafc',
    contentHtml: `<div style="font-size: 14pt; line-height: 2.1; white-space: pre-line; color: #0f172a; text-align: justify; font-weight: 700; padding: 12px 16px; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 12px;">${broadcast.outro.text}</div>`,
    extraNote: 'اختم الإذاعة بالشكر للمدير والمعلمين والطلاب، وتمنَّ لهم يوماً دراسياً موفقاً.',
  });

  // If student individual pages template is chosen:
  if (template === 'student_pages') {
    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>بطاقات الطلاب - ${broadcast.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Amiri:wght@700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 5mm 6mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #0f172a;
      font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
      direction: rtl;
    }
    .student-page {
      width: 100%;
      height: 245mm;
      max-height: 248mm;
      min-height: 230mm;
      padding: 8px 12px;
      margin: 0 auto 12px auto;
      background: #ffffff;
      border: 2px solid #0f172a;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
      overflow: hidden;
      box-sizing: border-box;
      ${isGrayscale ? 'filter: grayscale(100%);' : ''}
    }
    .student-page:last-child {
      page-break-after: avoid !important;
      break-after: avoid !important;
      margin-bottom: 0 !important;
    }
    .header-bar {
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .presenter-hero {
      margin: 6px 0;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1.5px solid #0f172a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    .content-area {
      flex: 1;
      padding: 6px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .guidance-box {
      background: #f8fafc;
      border: 1px dashed #64748b;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 9pt;
      color: #334155;
    }
    .footer-bar {
      border-top: 1px solid #0f172a;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      font-weight: bold;
      color: #475569;
      flex-shrink: 0;
    }
    @media screen {
      body {
        background: #e2e8f0;
        padding: 12px;
      }
      .student-page {
        max-width: 210mm;
        box-shadow: 0 6px 16px rgba(0,0,0,0.12);
      }
      .print-btn-bar {
        text-align: center;
        margin-bottom: 12px;
        position: sticky;
        top: 8px;
        z-index: 100;
      }
      .print-btn {
        background: #059669;
        color: #ffffff;
        border: none;
        padding: 10px 24px;
        font-size: 14px;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(5, 150, 105, 0.35);
        font-family: inherit;
      }
    }
    @media print {
      .print-btn-bar {
        display: none !important;
      }
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .student-page {
        margin: 0 !important;
        border-radius: 0 !important;
        height: 245mm !important;
        max-height: 248mm !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-btn-bar">
    <button class="print-btn" onclick="window.print()">🖨️ طباعة بطاقات الطلاب الفردية (Ctrl + P)</button>
  </div>

  ${sections
    .map(
      (sec) => `
    <div class="student-page">
      <!-- Header -->
      <div class="header-bar">
        <div style="text-align: right; line-height: 1.25;">
          <div style="font-weight: bold; font-size: 9pt; color: #0f172a;">${schoolInfo.countryMinistry || 'وزارة التعليم'}</div>
          <div style="font-size: 8pt; color: #475569;">${schoolInfo.educationDirectorate || 'الإدارة التعليمية'}</div>
          <div style="font-weight: 900; font-size: 10pt; color: #047857;">${schoolInfo.schoolName || 'اسم المدرسة'}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 10pt; font-weight: 900; color: #0f172a; padding: 2px 10px; border: 1.5px solid #0f172a; border-radius: 14px; background: #f8fafc;">
            بطاقة إلقاء الفقرة الإذاعية
          </div>
          <div style="font-size: 8.5pt; color: #64748b; margin-top: 1px; font-weight: bold;">
            الموضوع: <span style="color: #047857;">${broadcast.topic}</span>
          </div>
        </div>
        <div style="text-align: left; line-height: 1.25;" dir="rtl">
          <div style="font-size: 8.5pt; font-weight: bold;">اليوم: ${schoolInfo.dayOfWeek}</div>
          <div style="font-size: 8pt; color: #475569;">${schoolInfo.hijriDate}</div>
          <div style="font-size: 7.5pt; color: #64748b;">${schoolInfo.academicYear}</div>
        </div>
      </div>

      <!-- Presenter & Section Hero Banner -->
      <div class="presenter-hero" style="background-color: ${sec.themeBg}; border-color: ${sec.themeColor};">
        <div>
          <div style="font-size: 9pt; font-weight: bold; color: ${sec.themeColor};">الفقرة رقم (${sec.num}):</div>
          <div style="font-size: 14pt; font-weight: 900; color: #0f172a; margin-top: 1px;">
            ${sec.icon} ${sec.title}
          </div>
        </div>
        <div style="text-align: left; background: #ffffff; padding: 4px 12px; border-radius: 6px; border: 1px solid ${sec.themeColor};">
          <div style="font-size: 8pt; color: #64748b; font-weight: bold;">الطالب الملقي:</div>
          <div style="font-size: 12.5pt; font-weight: 900; color: ${sec.themeColor};">
            ${sec.presenterName}
          </div>
          ${sec.presenterGrade ? `<div style="font-size: 7.5pt; color: #475569; font-weight: bold;">الصف: ${sec.presenterGrade}</div>` : ''}
        </div>
      </div>

      <!-- Main Content to be read on stage (Enlarged) -->
      <div class="content-area">
        ${sec.contentHtml}
      </div>

      <!-- Bottom: Stage Guidance & Supervisor Sign -->
      <div>
        ${
          sec.extraNote
            ? `
        <div class="guidance-box">
          <strong>💡 إرشادات الإلقاء للمقدم:</strong> ${sec.extraNote} (المدة المقدرة: ${sec.duration})
        </div>`
            : ''
        }

        <div class="footer-bar" style="margin-top: 6px;">
          <div>مشرف الإذاعة المدرسية: ${schoolInfo.broadcastSupervisor || '...........................'}</div>
          <div>البرنامج الإذاعي معتمد رسميًا ⭕</div>
          <div>مدير / مديرة المدرسة: ${schoolInfo.schoolPrincipal || '...........................'}</div>
        </div>
      </div>
    </div>
  `
    )
    .join('')}
</body>
</html>`;
  }

  // Fallback / Single page official overview
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>إذاعة مدرسية - ${broadcast.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Amiri:wght@700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 5mm 6mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { margin: 0; padding: 0; background: #ffffff; color: #0f172a; font-family: 'Cairo', sans-serif; font-size: 10pt; line-height: 1.35; direction: rtl; }
    .page-container { width: 100%; max-width: 100%; margin: 0 auto; padding: 0; ${isGrayscale ? 'filter: grayscale(100%);' : ''} }
    .official-border { border: 2px solid #0f172a; border-radius: 6px; padding: 8px 10px; background: #ffffff; }
    .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 4px; margin-bottom: 6px; }
    .header-table td { vertical-align: top; }
    .badge { display: inline-block; font-size: 8pt; font-weight: 700; padding: 1px 5px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; color: #334155; }
    .title-banner { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 8px; text-align: center; margin-bottom: 6px; }
    .title-banner h1 { margin: 0; font-size: 12.5pt; font-weight: 900; color: #0f172a; }
    .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 5px; }
    .section-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 7px; background: #f8fafc; font-size: 9pt; }
    .section-card.full-width { grid-column: span 2; }
    .section-card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; margin-bottom: 3px; font-weight: 800; font-size: 9pt; color: #0f172a; }
    .signatures-row { margin-top: 5px; border-top: 1.5px solid #0f172a; padding-top: 4px; display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; font-size: 8.5pt; font-weight: 700; }
    .sig-name { margin-top: 12px; font-weight: 800; color: #0f172a; }
    .footer-bar { margin-top: 3px; border-top: 1px dashed #cbd5e1; padding-top: 2px; display: flex; justify-content: space-between; font-size: 7pt; color: #64748b; }
    @media print { body { background: #ffffff !important; padding: 0 !important; } }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="official-border">
      <table class="header-table">
        <tr>
          <td style="width: 35%; text-align: right; line-height: 1.3;">
            <div style="font-weight: 800; font-size: 9.5pt; color: #0f172a;">${schoolInfo.countryMinistry || 'وزارة التعليم'}</div>
            <div style="font-size: 8pt; color: #475569;">${schoolInfo.educationDirectorate || 'الإدارة التعليمية'}</div>
            <div style="font-weight: 900; font-size: 10pt; color: #047857;">${schoolInfo.schoolName || 'اسم المدرسة'}</div>
          </td>
          <td style="width: 30%; text-align: center; vertical-align: middle;">
            <div style="display: inline-block; padding: 2px 8px; border: 1.5px solid #0f172a; border-radius: 16px; font-weight: 900; font-size: 9pt; background: #f8fafc;">
              البرنامج الإذاعي الصباحي
            </div>
            <div style="font-size: 7.5pt; color: #64748b; margin-top: 2px; font-weight: 600;">
              ${schoolInfo.semester || 'الفصل الدراسي الأول'} • ${schoolInfo.academicYear || '1446-1447هـ'}
            </div>
          </td>
          <td style="width: 35%; text-align: left; line-height: 1.3;" dir="rtl">
            <div style="font-size: 8.5pt;">اليوم: <strong style="color: #0f172a;">${schoolInfo.dayOfWeek || 'الأحد'}</strong></div>
            <div style="font-size: 8pt; color: #475569;">${schoolInfo.hijriDate || ''}</div>
            <div style="font-size: 7.5pt; color: #64748b;">المرحلة: <strong>${schoolInfo.schoolStage || 'المرحلة الدراسية'}</strong></div>
          </td>
        </tr>
      </table>

      <div class="title-banner">
        <h1>🎙️ ${broadcast.title}</h1>
        <p>موضوع الإذاعة: <strong style="color: #047857;">${broadcast.topic}</strong></p>
      </div>

      <div class="grid-2col">
        <div class="section-card">
          <div class="section-card-header">
            <span style="color: #047857;">🎙️ المقدمة الإذاعية</span>
            ${broadcast.introduction.presenterName ? `<span class="badge">${broadcast.introduction.presenterName}</span>` : ''}
          </div>
          <div style="white-space: pre-line; line-height: 1.3;">${broadcast.introduction.text}</div>
        </div>

        ${
          broadcast.quran.enabled
            ? `
        <div class="section-card" style="background: #f0fdf4; border-color: #86efac;">
          <div class="section-card-header" style="color: #14532d;">
            <span>📖 القرآن الكريم (${broadcast.quran.data.surah})</span>
            ${broadcast.quran.presenterName ? `<span class="badge" style="background:#fff;">${broadcast.quran.presenterName}</span>` : ''}
          </div>
          <p style="font-family: 'Amiri', serif; text-align: center; color: #14532d; font-weight: bold; margin: 0;">${broadcast.quran.data.text}</p>
        </div>`
            : ''
        }

        ${
          broadcast.hadith.enabled
            ? `
        <div class="section-card" style="background: #fefce8; border-color: #fde047;">
          <div class="section-card-header" style="color: #713f12;">
            <span>🕌 الحديث الشريف</span>
            ${broadcast.hadith.presenterName ? `<span class="badge" style="background:#fff;">${broadcast.hadith.presenterName}</span>` : ''}
          </div>
          <p style="color: #713f12; margin: 0;">${broadcast.hadith.data.text}</p>
        </div>`
            : ''
        }

        ${
          broadcast.speech.enabled
            ? `
        <div class="section-card" style="background: #f5f3ff; border-color: #ddd6fe;">
          <div class="section-card-header" style="color: #4c1d95;">
            <span>🎤 كلمة الصباح: ${broadcast.speech.data.title}</span>
            ${broadcast.speech.presenterName ? `<span class="badge" style="background:#fff;">${broadcast.speech.presenterName}</span>` : ''}
          </div>
          <div style="color: #1e1b4b;">${broadcast.speech.data.content}</div>
        </div>`
            : ''
        }
      </div>

      ${
        showSignatures
          ? `
      <div class="signatures-row">
        <div><div>مقدم الإذاعة</div><div class="sig-name">${schoolInfo.headStudent || '...............'}</div></div>
        <div><div>مشرف الإذاعة</div><div class="sig-name">${schoolInfo.broadcastSupervisor || '...............'}</div></div>
        <div><div>مدير المدرسة</div><div class="sig-name">${schoolInfo.schoolPrincipal || '...............'}</div></div>
      </div>`
          : ''
      }
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates and downloads a crystal-clear PDF file directly onto the mobile device/PC.
 * Accurately renders each student card onto EXACTLY 1 single A4 PDF page.
 */
export async function exportBroadcastToDirectPdf(
  elementId: string,
  filename: string = 'الإذاعة_المدرسية.pdf'
): Promise<boolean> {
  const container = document.getElementById(elementId);
  if (!container) return false;

  try {
    const studentCards = container.querySelectorAll('.student-page-render-card');

    if (studentCards && studentCards.length > 0) {
      // Multi-page export (strictly one page per student)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 5;
      const renderWidth = pdfWidth - margin * 2;

      for (let i = 0; i < studentCards.length; i++) {
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        const cardElement = studentCards[i] as HTMLElement;
        const canvas = await html2canvas(cardElement, {
          scale: 2.2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 800,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const renderHeight = (canvas.height * renderWidth) / canvas.width;
        // Strictly fit in 1 single page height
        const finalHeight = Math.min(renderHeight, pdfHeight - margin * 2);

        pdf.addImage(imgData, 'JPEG', margin, margin, renderWidth, finalHeight, undefined, 'FAST');
      }

      pdf.save(filename);
      return true;
    } else {
      // Single page document export
      const canvas = await html2canvas(container, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 4;
      const renderWidth = pdfWidth - margin * 2;
      const renderHeight = (canvas.height * renderWidth) / canvas.width;
      const finalHeight = Math.min(renderHeight, pdfHeight - margin * 2);

      pdf.addImage(imgData, 'JPEG', margin, margin, renderWidth, finalHeight, undefined, 'FAST');
      pdf.save(filename);
      return true;
    }
  } catch (err) {
    console.error('Error generating direct PDF:', err);
    return false;
  }
}

/**
 * Universal safe print trigger.
 */
export function printDocumentDirectly() {
  window.print();
}

/**
 * Opens the pristine printable document in a new tab or window.
 */
export function openPrintInNewWindow(
  broadcast: RadioBroadcast,
  template: PrintTemplateType = 'student_pages',
  options: { showSignatures?: boolean; isGrayscale?: boolean } = {}
) {
  const html = generatePrintableHtml(broadcast, template, options);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}

export function exportBroadcastToWord(broadcast: RadioBroadcast) {
  const { schoolInfo } = broadcast;

  let contentHtml = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset='utf-8'>
    <title>${broadcast.title}</title>
    <style>
      body { font-family: 'Cairo', 'Traditional Arabic', Arial, sans-serif; direction: rtl; text-align: right; margin: 25px; }
      .header-table { width: 100%; border-bottom: 2px solid #1e3a8a; margin-bottom: 15px; padding-bottom: 8px; }
      .title-box { text-align: center; background-color: #f1f5f9; padding: 10px; border: 1px solid #cbd5e1; margin-bottom: 15px; border-radius: 6px; }
      .title { font-size: 18pt; font-weight: bold; color: #1e3a8a; margin: 0; }
      .subtitle { font-size: 12pt; color: #475569; margin-top: 4px; }
      .section-card { border: 1px solid #e2e8f0; margin-bottom: 12px; padding: 10px 14px; background: #fafafa; }
      .section-title { font-size: 13pt; font-weight: bold; color: #047857; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; }
      .presenter-badge { font-size: 9.5pt; color: #64748b; font-weight: normal; margin-right: 12px; }
      .section-body { font-size: 11pt; line-height: 1.6; color: #1e293b; }
      .quran-box { background-color: #f0fdf4; border-right: 4px solid #16a34a; padding: 8px; font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 13pt; }
      .hadith-box { background-color: #fefce8; border-right: 4px solid #ca8a04; padding: 8px; }
      .signatures-table { width: 100%; margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 15px; text-align: center; font-size: 10.5pt; font-weight: bold; }
    </style>
  </head>
  <body>
    <table class="header-table">
      <tr>
        <td style="width: 35%; text-align: right; vertical-align: top; font-size: 9.5pt; line-height: 1.4;">
          <strong>${schoolInfo.countryMinistry}</strong><br/>
          ${schoolInfo.educationDirectorate}<br/>
          <strong>${schoolInfo.schoolName}</strong>
        </td>
        <td style="width: 30%; text-align: center; vertical-align: middle;">
          <h2 style="color: #1e3a8a; margin: 0; font-size: 14pt;">البرنامج الإذاعي المدرسي</h2>
          <span style="font-size: 9.5pt; color: #64748b;">${schoolInfo.semester} - ${schoolInfo.academicYear}</span>
        </td>
        <td style="width: 35%; text-align: left; vertical-align: top; font-size: 9.5pt; line-height: 1.4; direction: rtl;">
          اليوم: <strong>${schoolInfo.dayOfWeek}</strong><br/>
          التاريخ الهجري: ${schoolInfo.hijriDate}<br/>
          التاريخ الميلادي: ${schoolInfo.gregorianDate}
        </td>
      </tr>
    </table>

    <div class="title-box">
      <div class="title">✨ ${broadcast.title} ✨</div>
      <div class="subtitle">الموضوع: ${broadcast.topic} | إعداد جماعة الإذاعة المدرسية</div>
    </div>

    <!-- Introduction -->
    <div class="section-card">
      <div class="section-title">
        🎙️ المقدمة الإذاعية
        ${broadcast.introduction.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.introduction.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body">${broadcast.introduction.text.replace(/\n/g, '<br/>')}</div>
    </div>

    ${
      broadcast.quran.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        📖 القرآن الكريم [${broadcast.quran.data.surah} - الآيات: ${broadcast.quran.data.verses}]
        ${broadcast.quran.presenterName ? `<span class="presenter-badge">تلاوة الطالب: <strong>${broadcast.quran.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body quran-box">${broadcast.quran.data.text.replace(/\n/g, '<br/>')}</div>
    </div>`
        : ''
    }

    ${
      broadcast.hadith.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        🕌 الحديث الشريف
        ${broadcast.hadith.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.hadith.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body hadith-box">
        ${broadcast.hadith.data.text.replace(/\n/g, '<br/>')}
        <div style="font-size: 9.5pt; color: #854d0e; margin-top: 4px;">(${broadcast.hadith.data.narrator})</div>
      </div>
    </div>`
        : ''
    }

    ${
      broadcast.speech.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        🎤 كلمة الصباح: ${broadcast.speech.data.title}
        ${broadcast.speech.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.speech.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body">${broadcast.speech.data.content.replace(/\n/g, '<br/>')}</div>
    </div>`
        : ''
    }

    ${
      broadcast.didYouKnow.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        💡 فقرة هل تعلم؟
        ${broadcast.didYouKnow.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.didYouKnow.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body">
        <ul>
          ${broadcast.didYouKnow.items.map((it) => `<li>${it}</li>`).join('')}
        </ul>
      </div>
    </div>`
        : ''
    }

    ${
      broadcast.wisdom.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        💎 حكمة اليوم
        ${broadcast.wisdom.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.wisdom.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body">
        <blockquote>« ${broadcast.wisdom.data.text} »</blockquote>
        ${broadcast.wisdom.data.author ? `<div style="font-size: 9.5pt; color: #64748b;">- ${broadcast.wisdom.data.author}</div>` : ''}
      </div>
    </div>`
        : ''
    }

    ${
      broadcast.poetry.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        📜 فقرة الشعر والأدب
        ${broadcast.poetry.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.poetry.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body" style="text-align: center; font-style: italic; white-space: pre-line;">
        ${broadcast.poetry.data.verses}
      </div>
    </div>`
        : ''
    }

    ${
      broadcast.quiz.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        🎁 سؤال وجائزة الصباح
        ${broadcast.quiz.presenterName ? `<span class="presenter-badge">تقديم الطالب: <strong>${broadcast.quiz.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body">
        <p><strong>السؤال:</strong> ${broadcast.quiz.data.question}</p>
        <p style="color: #15803d;"><strong>الإجابة النموذجية:</strong> ${broadcast.quiz.data.answer}</p>
      </div>
    </div>`
        : ''
    }

    ${
      broadcast.supplication.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        🤲 دعاء الصباح
        ${broadcast.supplication.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.supplication.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body">${broadcast.supplication.text.replace(/\n/g, '<br/>')}</div>
    </div>`
        : ''
    }

    <!-- Outro -->
    <div class="section-card">
      <div class="section-title">
        🏁 الخاتمة الإذاعية
        ${broadcast.outro.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.outro.presenterName}</strong></span>` : ''}
      </div>
      <div class="section-body">${broadcast.outro.text.replace(/\n/g, '<br/>')}</div>
    </div>

    <!-- Signatures -->
    <table class="signatures-table">
      <tr>
        <td>
          مقدم الإذاعة<br/><br/>
          <strong>${schoolInfo.headStudent || '........................'}</strong>
        </td>
        <td>
          مشرف الإذاعة المدرسية<br/><br/>
          <strong>${schoolInfo.broadcastSupervisor || '........................'}</strong>
        </td>
        <td>
          مدير المدرسة<br/><br/>
          <strong>${schoolInfo.schoolPrincipal || '........................'}</strong>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff', contentHtml], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `إذاعة_مدرسية_${broadcast.topic.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyBroadcastAsText(broadcast: RadioBroadcast): string {
  const { schoolInfo } = broadcast;
  let text = `========================================\n`;
  text += `${schoolInfo.countryMinistry}\n`;
  text += `${schoolInfo.educationDirectorate}\n`;
  text += `${schoolInfo.schoolName}\n`;
  text += `اليوم: ${schoolInfo.dayOfWeek} | ${schoolInfo.hijriDate} (${schoolInfo.gregorianDate})\n`;
  text += `========================================\n`;
  text += `✨ البرنامج الإذاعي: ${broadcast.title} ✨\n`;
  text += `الموضوع: ${broadcast.topic}\n\n`;

  text += `--- المقدمة الإذاعية ---\n`;
  if (broadcast.introduction.presenterName) {
    text += `(إلقاء الطالب: ${broadcast.introduction.presenterName})\n`;
  }
  text += `${broadcast.introduction.text}\n\n`;

  if (broadcast.quran.enabled) {
    text += `--- القرآن الكريم [${broadcast.quran.data.surah}] ---\n`;
    if (broadcast.quran.presenterName) text += `(تلاوة الطالب: ${broadcast.quran.presenterName})\n`;
    text += `${broadcast.quran.data.text}\n\n`;
  }

  if (broadcast.hadith.enabled) {
    text += `--- الحديث الشريف ---\n`;
    if (broadcast.hadith.presenterName) text += `(إلقاء الطالب: ${broadcast.hadith.presenterName})\n`;
    text += `${broadcast.hadith.data.text}\n`;
    text += `(${broadcast.hadith.data.narrator})\n\n`;
  }

  if (broadcast.speech.enabled) {
    text += `--- كلمة الصباح: ${broadcast.speech.data.title} ---\n`;
    if (broadcast.speech.presenterName) text += `(إلقاء الطالب: ${broadcast.speech.presenterName})\n`;
    text += `${broadcast.speech.data.content}\n\n`;
  }

  if (broadcast.didYouKnow.enabled) {
    text += `--- هل تعلم؟ ---\n`;
    if (broadcast.didYouKnow.presenterName) text += `(إلقاء الطالب: ${broadcast.didYouKnow.presenterName})\n`;
    broadcast.didYouKnow.items.forEach((it, idx) => {
      text += `${idx + 1}. ${it}\n`;
    });
    text += `\n`;
  }

  if (broadcast.wisdom.enabled) {
    text += `--- حكمة اليوم ---\n`;
    if (broadcast.wisdom.presenterName) text += `(إلقاء الطالب: ${broadcast.wisdom.presenterName})\n`;
    text += `« ${broadcast.wisdom.data.text} »\n`;
    if (broadcast.wisdom.data.author) text += `- ${broadcast.wisdom.data.author}\n`;
    text += `\n`;
  }

  if (broadcast.poetry.enabled) {
    text += `--- فقرة الشعر ---\n`;
    if (broadcast.poetry.presenterName) text += `(إلقاء الطالب: ${broadcast.poetry.presenterName})\n`;
    text += `${broadcast.poetry.data.verses}\n`;
    if (broadcast.poetry.data.poet) text += `(${broadcast.poetry.data.poet})\n`;
    text += `\n`;
  }

  if (broadcast.quiz.enabled) {
    text += `--- سؤال وجائزة ---\n`;
    if (broadcast.quiz.presenterName) text += `(تقديم الطالب: ${broadcast.quiz.presenterName})\n`;
    text += `السؤال: ${broadcast.quiz.data.question}\n`;
    text += `الإجابة: ${broadcast.quiz.data.answer}\n\n`;
  }

  if (broadcast.supplication.enabled) {
    text += `--- دعاء الصباح ---\n`;
    if (broadcast.supplication.presenterName) text += `(إلقاء الطالب: ${broadcast.supplication.presenterName})\n`;
    text += `${broadcast.supplication.text}\n\n`;
  }

  text += `--- الخاتمة الإذاعية ---\n`;
  if (broadcast.outro.presenterName) text += `(إلقاء الطالب: ${broadcast.outro.presenterName})\n`;
  text += `${broadcast.outro.text}\n\n`;

  text += `مشرف الإذاعة: ${schoolInfo.broadcastSupervisor} | مدير المدرسة: ${schoolInfo.schoolPrincipal}\n`;
  return text;
}
