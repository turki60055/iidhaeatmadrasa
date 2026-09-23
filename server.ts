import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to generate full school radio broadcast program
app.post('/api/generate-radio', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      gradeLevel = 'متوسط',
      tone = 'فصيح وملهم',
      targetDuration = '5-7 دقائق',
      schoolName = '',
      selectedSections = [
        'intro',
        'quran',
        'hadith',
        'speech',
        'didYouKnow',
        'wisdom',
        'poetry',
        'quiz',
        'supplication',
        'outro'
      ],
      customInstructions = '',
      students = []
    } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'يرجى تحديد موضوع الإذاعة المدرسية' });
    }

    const sectionsPrompt = `
الأقسام المطلوبة في الإذاعة:
${selectedSections.includes('intro') ? '- مقدمة إذاعية فصيحة ومميزة تبدأ بالحمد والثناء والصلاة على النبي والترحيب بالمدير والمعلمين والطلاب.' : ''}
${selectedSections.includes('quran') ? '- فقرة القرآن الكريم (حدد اسم السورة ورقم الآيات ونص الآيات المناسبة بدقة للموضوع مع التشكيل).' : ''}
${selectedSections.includes('hadith') ? '- فقرة الحديث الشريف (نص الحديث النبوي الشريف الصحيح المناسب للموضوع وراويه).' : ''}
${selectedSections.includes('speech') ? '- كلمة الصباح (فقرة بليغة مؤثرة وموجزة تناسب المرحلة الدراسية).' : ''}
${selectedSections.includes('didYouKnow') ? '- فقرة هل تعلم؟ (3 إلى 4 معلومات شيقة وموثوقة مرتبطة بالموضوع أو عامة ثرية).' : ''}
${selectedSections.includes('wisdom') ? '- حكمة اليوم (حكمة خالدة ودرس بليغ مع شرح سريع أو قائلها).' : ''}
${selectedSections.includes('poetry') ? '- فقرة الشعر والأدب (بيتان أو ثلاثة أبيات شعرية فصيحة وجميلة).' : ''}
${selectedSections.includes('quiz') ? '- سؤال وجائزة / مسابقة الصباح (سؤال ذكي مع الإجابة).' : ''}
${selectedSections.includes('supplication') ? '- دعاء الصباح (دعاء طيب جامع للوطن والوالدين والمعلمين والطلاب).' : ''}
${selectedSections.includes('outro') ? '- خاتمة إذاعية راقية وموجزة مع تحية العلم والدعاء بالتوفيق لليوم الدراسي.' : ''}
`;

    const systemPrompt = `
أنت خبير تربوي ومعد برامج إذاعية مدرسية معتمد رفيع المستوى للغة العربية والتربية والتعليم.
مهمتك إعداد برنامج إذاعي مدرسي مكتمل الأركان، غاية في الفصاحة والبلاغة والجمال، مضبوط بالشكل اللغوي السليم ومناسب تماماً للفئة العمرية المحددة.
يرجى صياغة محتوى الإذاعة المدرسية بناءً على الموضوع والخيارات المعطاة وتوليد إخراج منظم بدقة.
`;

    const userPrompt = `
قم بإعداد برنامج إذاعي مدرسي احترافي بالمواصفات التالية:
- الموضوع الرئيسي: ${topic}
- المرحلة التعليمية: ${gradeLevel}
- أسلوب الإلقاء والنبرة: ${tone}
- المدة المستهدفة: ${targetDuration}
- اسم المدرسة: ${schoolName || 'مدرستنا العامرة'}
${customInstructions ? `- توجيهات إضافية من المعلم: ${customInstructions}` : ''}

${sectionsPrompt}

أخرج النتيجة بصيغة JSON تحتوي على:
1. title: عنوان الإذاعة الجذاب
2. topic: الموضوع
3. introduction: نص المقدمة الترحيبية
4. quran: { surah: اسم السورة, verses: أرقام الآيات, text: نص الآيات القرآنية بالتشكيل السليم }
5. hadith: { narrator: راوي الحديث أو تخريجه, text: نص الحديث الشريف }
6. speech: { title: عنوان كلمة الصباح, content: نص كلمة الصباح }
7. didYouKnow: قائمة من 3 إلى 4 نصوص تبدأ بـ "هل تعلم أن..."
8. wisdom: { text: نص الحكمة, author: القائل إن وجد }
9. poetry: { verses: نص الأبيات الشعرية, poet: الشاعر إن وجد }
10. quiz: { question: نص السؤال, answer: الإجابة الصحيحة, hint: تلميح اختياري }
11. supplication: نص دعاء الصباح
12. outro: نص الخاتمة
13. presentingTips: نصائح إلقاء سريعة ومفيدة للطلاب أثناء الطابور
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            topic: { type: Type.STRING },
            introduction: { type: Type.STRING },
            quran: {
              type: Type.OBJECT,
              properties: {
                surah: { type: Type.STRING },
                verses: { type: Type.STRING },
                text: { type: Type.STRING },
              },
              required: ['surah', 'text'],
            },
            hadith: {
              type: Type.OBJECT,
              properties: {
                narrator: { type: Type.STRING },
                text: { type: Type.STRING },
              },
              required: ['text'],
            },
            speech: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
              },
              required: ['title', 'content'],
            },
            didYouKnow: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            wisdom: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                author: { type: Type.STRING },
              },
              required: ['text'],
            },
            poetry: {
              type: Type.OBJECT,
              properties: {
                verses: { type: Type.STRING },
                poet: { type: Type.STRING },
              },
              required: ['verses'],
            },
            quiz: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                hint: { type: Type.STRING },
              },
              required: ['question', 'answer'],
            },
            supplication: { type: Type.STRING },
            outro: { type: Type.STRING },
            presentingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'topic'],
        },
      },
    });

    const generatedJson = JSON.parse(response.text || '{}');
    return res.json({ success: true, broadcast: generatedJson });
  } catch (error: any) {
    console.error('Error generating radio content:', error);
    return res.status(500).json({
      error: 'فشل في توليد البرنامج الإذاعي، يرجى المحاولة مرة أخرى.',
      details: error?.message,
    });
  }
});

// API endpoint to regenerate / rewrite a single section
app.post('/api/regenerate-section', async (req: Request, res: Response) => {
  try {
    const {
      sectionKey,
      topic,
      gradeLevel = 'متوسط',
      tone = 'فصيح',
      currentContent = '',
      action = 'new' // 'new', 'simplify', 'lengthen', 'poetic', 'tashkeel'
    } = req.body;

    const actionDescriptions: Record<string, string> = {
      new: 'قم بتوليد فكرة ومحتوى بديل جديد تماماً ومتميز',
      simplify: 'قم بتبسيط النص وجعله أسهل وأوضح للطلاب الصغار مع الحفاظ على الفصاحة',
      lengthen: 'قم بتوسيع الفكرة وإضافة معانٍ أعمق وأمثلة بلاغية ثرية',
      poetic: 'قم بصياغة النص بأسلوب مسجوع وشاعري رنان وجميل جداً',
      tashkeel: 'قم بضبط أواخر الكلمات والتشكيل بدقة لغوية ونحوية كاملة'
    };

    const prompt = `
أنت خبير في الإذاعة المدرسية واللغة العربية.
المطلوب تعديل أو إعادة توليد فقرة (${sectionKey}) لإذاعة مدرسية بعنوان "${topic}" للمرحلة "${gradeLevel}".
المطلوب بالتحديد: ${actionDescriptions[action] || 'توليد محتوى بديل جذاب'}.
المحتوى الحالي (للاستئناس أو التعديل):
${JSON.stringify(currentContent)}

أخرج النتيجة بصيغة JSON بنفس هيكل الفقرة بدقة وبدون أي نصوص إضافية.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Error regenerating section:', error);
    return res.status(500).json({
      error: 'تعذر تعديل الفقرة حالياً',
      details: error?.message,
    });
  }
});

// API endpoint to suggest radio themes based on occasion/season
app.post('/api/suggest-topics', async (req: Request, res: Response) => {
  try {
    const { gradeLevel = 'الكل', category = 'عام' } = req.body;

    const prompt = `
اقترح قائمة من 8 أفكار ومواضيع مبتكرة ومؤثرة للإذاعة المدرسية للمرحلة (${gradeLevel}) وتصنيف (${category}).
لكل موضوع قدم:
1. title: عنوان الإذاعة الجذاب
2. tag: تصنيف الفكرة (مثل: وطني، علمي، تربوي، أخلاقي، صحي، تقني)
3. description: فكرة الإذاعة في سطر واحد
4. keywords: 3 كلمات مفتاحية

أخرج النتيجة في JSON مصفوفة من العناصر.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              tag: { type: Type.STRING },
              description: { type: Type.STRING },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['title', 'tag', 'description'],
          },
        },
      },
    });

    const topics = JSON.parse(response.text || '[]');
    return res.json({ success: true, topics });
  } catch (error: any) {
    console.error('Error suggesting topics:', error);
    return res.status(500).json({ error: 'تعذر اقتراح المواضيع حالياً' });
  }
});

// In dev mode, attach Vite middleware. In production, serve dist static files.
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
