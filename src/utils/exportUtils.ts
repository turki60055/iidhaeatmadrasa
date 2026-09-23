import { RadioBroadcast } from '../types/radio';

export function exportBroadcastToWord(broadcast: RadioBroadcast) {
  const { schoolInfo } = broadcast;

  let contentHtml = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset='utf-8'>
    <title>${broadcast.title}</title>
    <style>
      body { font-family: 'Cairo', 'Traditional Arabic', Arial, sans-serif; direction: rtl; text-align: right; margin: 30px; }
      .header-table { width: 100%; border-bottom: 2px solid #1e3a8a; margin-bottom: 20px; padding-bottom: 10px; }
      .title-box { text-align: center; background-color: #f1f5f9; padding: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px; border-radius: 6px; }
      .title { font-size: 20pt; font-weight: bold; color: #1e3a8a; margin: 0; }
      .subtitle { font-size: 13pt; color: #475569; margin-top: 5px; }
      .section-card { border: 1px solid #e2e8f0; margin-bottom: 16px; padding: 12px 16px; background: #fafafa; }
      .section-title { font-size: 14pt; font-weight: bold; color: #047857; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; }
      .presenter-badge { font-size: 10pt; color: #64748b; font-weight: normal; margin-right: 15px; }
      .section-body { font-size: 12pt; line-height: 1.8; color: #1e293b; }
      .quran-box { background-color: #f0fdf4; border-right: 4px solid #16a34a; padding: 10px; font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 14pt; }
      .hadith-box { background-color: #fefce8; border-right: 4px solid #ca8a04; padding: 10px; }
      .signatures-table { width: 100%; margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 20px; text-align: center; font-size: 11pt; font-weight: bold; }
    </style>
  </head>
  <body>
    <table class="header-table">
      <tr>
        <td style="width: 35%; text-align: right; vertical-align: top; font-size: 10pt; line-height: 1.5;">
          <strong>${schoolInfo.countryMinistry}</strong><br/>
          ${schoolInfo.educationDirectorate}<br/>
          <strong>${schoolInfo.schoolName}</strong>
        </td>
        <td style="width: 30%; text-align: center; vertical-align: middle;">
          <h2 style="color: #1e3a8a; margin: 0;">البرنامج الإذاعي المدرسي</h2>
          <span style="font-size: 10pt; color: #64748b;">${schoolInfo.semester} - ${schoolInfo.academicYear}</span>
        </td>
        <td style="width: 35%; text-align: left; vertical-align: top; font-size: 10pt; line-height: 1.5; direction: rtl;">
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
        ${broadcast.introduction.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.introduction.presenterName}</strong> (${broadcast.introduction.presenterGrade || ''})</span>` : ''}
      </div>
      <div class="section-body">${broadcast.introduction.text.replace(/\n/g, '<br/>')}</div>
    </div>

    ${
      broadcast.quran.enabled
        ? `
    <div class="section-card">
      <div class="section-title">
        📖 القرآن الكريم [${broadcast.quran.data.surah} - الآيات: ${broadcast.quran.data.verses}]
        ${broadcast.quran.presenterName ? `<span class="presenter-badge">تلاوة الطالب: <strong>${broadcast.quran.presenterName}</strong> (${broadcast.quran.presenterGrade || ''})</span>` : ''}
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
        ${broadcast.hadith.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.hadith.presenterName}</strong> (${broadcast.hadith.presenterGrade || ''})</span>` : ''}
      </div>
      <div class="section-body hadith-box">
        ${broadcast.hadith.data.text.replace(/\n/g, '<br/>')}
        <div style="font-size: 10pt; color: #854d0e; margin-top: 6px;">(${broadcast.hadith.data.narrator})</div>
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
        ${broadcast.speech.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.speech.presenterName}</strong> (${broadcast.speech.presenterGrade || ''})</span>` : ''}
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
        ${broadcast.didYouKnow.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.didYouKnow.presenterName}</strong> (${broadcast.didYouKnow.presenterGrade || ''})</span>` : ''}
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
        ${broadcast.wisdom.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.wisdom.presenterName}</strong> (${broadcast.wisdom.presenterGrade || ''})</span>` : ''}
      </div>
      <div class="section-body">
        <blockquote>« ${broadcast.wisdom.data.text} »</blockquote>
        ${broadcast.wisdom.data.author ? `<div style="font-size: 10pt; color: #64748b;">- ${broadcast.wisdom.data.author}</div>` : ''}
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
        ${broadcast.poetry.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.poetry.presenterName}</strong> (${broadcast.poetry.presenterGrade || ''})</span>` : ''}
      </div>
      <div class="section-body" style="text-align: center; font-style: italic; white-space: pre-line;">
        ${broadcast.poetry.data.verses}
        ${broadcast.poetry.data.poet ? `<div style="font-size: 10pt; color: #64748b; margin-top: 6px;">(${broadcast.poetry.data.poet})</div>` : ''}
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
        ${broadcast.quiz.presenterName ? `<span class="presenter-badge">تقديم الطالب: <strong>${broadcast.quiz.presenterName}</strong> (${broadcast.quiz.presenterGrade || ''})</span>` : ''}
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
        ${broadcast.supplication.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.supplication.presenterName}</strong> (${broadcast.supplication.presenterGrade || ''})</span>` : ''}
      </div>
      <div class="section-body">${broadcast.supplication.text.replace(/\n/g, '<br/>')}</div>
    </div>`
        : ''
    }

    <!-- Outro -->
    <div class="section-card">
      <div class="section-title">
        🏁 الخاتمة الإذاعية
        ${broadcast.outro.presenterName ? `<span class="presenter-badge">إلقاء الطالب: <strong>${broadcast.outro.presenterName}</strong> (${broadcast.outro.presenterGrade || ''})</span>` : ''}
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
