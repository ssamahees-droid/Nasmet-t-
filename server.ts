import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  app.use(express.json());

  // Gemini AI endpoint for booklet reflection and compassionate guidance
  app.post('/api/ai-reflect', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'مفتاح Gemini API غير متوفر. يرجى التحقق من إعدادات المفاتيح.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-2.5-flash';

      const systemInstruction = `أنت مرشد نفسي واجتماعي لطيف ومحترف وداعم في تطبيق "نسمة الحياة" (دليل مبسط للصحة النفسية). 
هدفك تقديم إرشاد نفسي دافئ، حكيم، غير قضائي، عملي، ومستوحى من محتوى الكتيب.
لا تقدم تشخيصات طبية قاطعة، بل قدم تشجيعاً، تمارين تنفس أو تفكير لطيفة، وتوجيهًا نحو طلب الدعم المتخصص إذا لزم الأمر.
تحدث باللغة العربية الفصحى الدافئة والمطمئنة.`;

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nالسياق الحالي: ${context || 'مستخدم يبحث عن دعم نفسي لطيف'}\n\nسؤال أو تأمل المستخدم: ${prompt}` }] }
        ],
      });

      const text = response.text || 'عذراً، لم أتمكن من توليد الرد. يرجى المحاولة مرة أخرى.';
      res.json({ response: text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'حدث خطأ أثناء الاتصال بالمساعد الذكي.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
