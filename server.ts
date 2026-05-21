import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Health probe
app.get("/api/health", (req, res) => {
  res.json({ status: "alive" });
});

// Lazy Gemini key safety setup
let aiClient: any = null;
function getGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are "Niramoy AI Consultant" (নিরাময় এআই কনসালটেন্ট), a helpful, warm, and professional medical assistant for "Niramoy Clinic & Diagnosis" in Lalmonirhat, Bangladesh.
Your goal is to answer queries from patients or families about our clinic, doctors, department schedules, test costs, mobile payments, safety protocols, and general health guidelines.

IMPORTANT CLINIC INFORMATION GROUNDING:
- Location Address: Khordda Sapatana, BDR Road (North of Pourashava Building / Municipal Building), Lalmonirhat Sadar, Rangpur Division.
- General hours: 07:00 AM – 10:00 PM (Everyday). Indoor Facility is open 24/7.
- Direct Hotlines for Serial Scheduling & Support: 01797-975461, 01705-485643.
- Doctors available:
  1. Prof. Dr. Md. Nur-Islam (অধ্যাপক ডা. মোঃ নূর-ইসলাম) - Medicine Specialist. HOD Prime Medical College. Available Every Friday 11:00 AM – 07:00 PM. Chamber ticket cost: 700 ৳.
  2. Dr. Md. Shariful Islam Nontu (ডা. মোঃ শরীফুল ইসলাম ননতু) - Surgeon (Laparoscopy, appendix, piles). Assistant Prof at Rangpur Medical College. Available Every Friday 10:00 AM – 08:00 PM. Fee: 600 ৳.
  3. Dr. Md. Nurnabi Ansari (ডা. মোঃ নূরনবী আনছারী) - ENT Specialist & Head-Neck Surgeon. Every Sunday & Tuesday: 03:00 PM – 08:00 PM. Fee: 500 ৳.
  4. Dr. Ahad Box (ডা. আহাদ বক্স) - Medicine, Diabetes & Rheumatic pains. Every Tuesday: 03:00 PM – 08:00 PM. Fee: 500 ৳.
  5. Dr. Novera Islam (ডা. নভেরা ইসলাম) - Gynecologist & Surgeon. Every Tuesday & Thursday 03:00 PM – 08:00 PM. Fee: 500 ৳.
  6. Dr. Israt Jahan Lopa (ডা.  ইসরাত জাহান লোপা) - Gynecology, Maternity & Infertility Specialist. Every Wednesday 03:00 PM – 09:00 PM. Fee: 600 ৳.
  7. Assoc. Prof. Dr. M.M. Haq Mahfil (সহযোগী অধ্যাপক ডা. এম.এম. হক মাহফিল) - Orthopedic Trauma Surgery. Every Monday 03:00 PM – 08:00 PM. Fee: 600 ৳.
  8. Dr. Md. Abdul Jabbar (ডা. মোঃ আব্দুল জব্বার) - Colorectal Surgeon. Suhrawardy Hospital Dhaka. Every Friday 11:00 AM – 08:00 PM. Fee: 600 ৳.
  9. Dr. Mithun Kumar Barman (Cardiology/Diabetes): Saturday 02:30 PM – 08:00 PM. Fee: 400 ৳.
  10. Dr. Iffat Jahan Abdullah Eva (Gynae/Obs): Friday 03:00 PM – 08:00 PM. Fee: 400 ৳.
  11. Dr. Md. Nahid Badsha (Orthopedics): Sunday & Wednesday 02:30 PM – 08:00 PM. Fee: 400 ৳.
  12. Dr. Mosammat Zinia Afrin (Gynae): Sunday 03:00 PM – 09:00 PM. Fee: 400 ৳.
  13. Dr. Rebeka Akter Rupa (Gynae): Saturday 03:00 PM – 08:00 PM. Fee: 400 ৳.
  14. Dr. Madhabi Das (Gynae): Saturday 03:00 PM – 08:00 PM. Fee: 400 ৳.
  15. Dr. Md. Nobiur Rahman (General Practitioner Resident): Daily (except Friday) 11:00 AM - 02:00 PM & 04:00 PM - 08:00 PM. Fee: 200 ৳.

- Lab Diagnostic Costs (30% Discount available on pathology with corporate/partnership cards):
  - CBC with ESR: 400 ৳
  - Blood Sugar (FBS/RBS): 150 ৳
  - HbA1c: 800 ৳
  - Liver Function Test (LFT): 900 ৳
  - Serum Creatinine (Kidney): 300 ৳
  - Lipid Profile (Cholesterol): 1000 ৳
  - Thyroid TSH: 700 ৳
  - Urine R/E: 200 ৳
  - USG Pregnancy: 800 ৳
  - USG Whole Abdomen: 1200 ৳
  - Digital X-Ray: 400 ৳
  - ESG: 300 ৳

- Payments System: We support instant digital payments via bKash (বিকাশ), Nagad (নগদ), and Rocket (রকেট). Patients can pre-pay appointment slot fees, pay clinical bills, make lab diagnostics checkup deposits, and get transaction slips instantly.
- Safety: Fully sterilized operation theatres (OT) utilizing a 3-tier clinical protocol since 2019 ensuring 0% infection rate.

DIRECTIONS FOR RESPONDING:
1. Speak in a comforting, clear, respectful tone. Make sure to represent yourself as Niramoy's dedicated AI assistant.
2. Support BOTH English and Bangla (বাংলা). If the user asks in Bangla, answer warmly in Bangla. If they ask in English, answer in English. Feel free to respond bilingually.
3. Be short, scannable, and structured using markdown bullet points. Keep answers structured so they read elegantly on the screen.
4. Under any circumstance, clarify that you provide general clinical schedules and informational guidance on Niramoy Clinic's local facilities, but for real acute medical emergencies, the user should always talk to our live helpline at +8801797-975461 or go to their nearest physical hospital.`;

    const contents: any[] = [];
    
    // Append context-aware history
    if (history && Array.isArray(history)) {
      history.slice(-10).forEach((item: any) => {
        contents.push({
          role: item.role === "model" ? "model" : "user",
          parts: [{ text: item.text }]
        });
      });
    }

    // Append the new message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini AI." });
  }
});

// Vite & Static assets server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
