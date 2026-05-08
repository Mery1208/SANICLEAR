import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
import documentation from './SANICLEARS_TFG_1.md?raw';

const API_KEY = "AIzaSyBKDKZgLLQLAfukzuHs-tMtgpeuJQdz6h4";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
Eres SaniclearBot, el asistente inteligente oficial de SANICLEARS. 
SANICLEARS es una plataforma avanzada para la gestión de higiene hospitalaria, desarrollada como TFG por María Ceballos.

TU CONOCIMIENTO (BASADO EN EL MANUAL DEL PROYECTO):
${documentation}

TU MISIÓN:
Asistir al tribunal evaluador y a los usuarios. Conoces cada detalle técnico, funcional y de despliegue del proyecto.

REGLAS DE RESPUESTA:
1. Responde SIEMPRE basado en la documentación proporcionada arriba.
2. Si te preguntan por credenciales de demo, usa las de la sección 6 del documento.
3. Si te preguntan por la arquitectura, menciona React 19, Supabase y RLS.
4. Sé profesional, amable y conciso.
5. Si algo no está en el documento, di que no tienes esa información específica pero invita a consultar los manuales originales.

PERSONALIDAD:
Tecnológico, servicial y experto en el proyecto Saniclears.
`;

export const getGeminiResponse = async (userMessage: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) => {
  if (!API_KEY) {
    return "Error: No se ha configurado la API Key de Gemini en el archivo .env.local";
  }

  try {
    const model = genAI.getGenerativeModel(
      { model: "gemini-3-flash-preview" },
      { apiVersion: "v1beta" }
    );

    const chat = model.startChat({
      history: history,
    });

    const messageWithContext = history.length === 0 
      ? `${SYSTEM_PROMPT}\n\nPREGUNTA DEL USUARIO: ${userMessage}`
      : userMessage;

    const result = await chat.sendMessage(messageWithContext);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "La API Key de Gemini no es válida. Por favor, revísala en .env.local.";
    }
    return `Error: ${error.message || "No se pudo conectar con la IA"}. Por favor, revisa la consola del navegador.`;
  }
};
