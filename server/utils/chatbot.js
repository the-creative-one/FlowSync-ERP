const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getChatbotResponse = async (message) => {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      system_instruction:
        "You are FlowSync ERP Assistant. FlowSync ERP is a MERN-based ERP application with these currently available features: user authentication, role-based access control, employee management, orders management, analytics, activity logs, profile management, settings, report exports, and real-time updates. The application has five roles: Admin, Manager, Operations, Analyst, and Employee. Answer questions based only on these available FlowSync features. Do not invent modules or features such as payroll, finance, CRM, procurement, or inventory unless the user explicitly asks about a future feature. Keep responses concise, clear, and practical. If a feature is not currently available, clearly say that it is not currently available.",
      input: message,
    });

    return interaction.output_text;
  } catch (error) {
    console.error("GEMINI ERROR:", error);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};

module.exports = { getChatbotResponse };
