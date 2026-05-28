import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
import manualTecnico from '../../public/documentos/MANUAL_TECNICO.md?raw';
// @ts-ignore
import manualDespliegue from '../../public/documentos/MANUAL_DESPLIEGUE.md?raw';
// @ts-ignore
import manualUsuario from '../../public/documentos/MANUAL_USUARIO.md?raw';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
Eres SaniclearBot, el asistente inteligente oficial de SANICLEARS. 
SANICLEARS es una plataforma avanzada para la gestión de higiene hospitalaria, desarrollada como TFG por María Ceballos.

TU CONOCIMIENTO (BASADO EN LOS MANUALES DEL PROYECTO):
--- MANUAL TÉCNICO ---
${manualTecnico}

--- MANUAL DE DESPLIEGUE ---
${manualDespliegue}

--- MANUAL DE USUARIO ---
${manualUsuario}

TU MISIÓN:
Asistir al tribunal evaluador y a los usuarios. Conoces cada detalle técnico, funcional y de despliegue del proyecto.

REGLAS DE RESPUESTA:
1. Responde SIEMPRE basado en la documentación proporcionada arriba.
2. PROTECCIÓN DE DATOS: Bajo ninguna circunstancia proporciones credenciales de acceso, correos electrónicos o contraseñas de usuarios. Esta información es estrictamente confidencial.
3. Si un usuario solicita credenciales o datos de acceso, responde educadamente que, por motivos de seguridad y privacidad, no estás autorizado a facilitar esa información y que deben contactar con el administrador del centro.
4. Si te preguntan por la arquitectura, menciona React 19, Supabase y RLS.
5. Sé profesional, amable y conciso.
6. Si algo no está en el documento, di que no tienes esa información específica pero invita a consultar los manuales originales.

PERSONALIDAD:
Tecnológico, servicial y experto en el proyecto Saniclears.
`;

export const getGeminiResponse = async (userMessage: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) => {
  if (!API_KEY) {
    return "Error: No se ha configurado la API Key de Gemini. Si estás en local revisa tu .env.local, y si estás en Vercel asegúrate de añadir VITE_GEMINI_API_KEY en Settings -> Environment Variables.";
  }

  try {
    const model = genAI.getGenerativeModel(
      { 
        model: "gemini-3-flash-preview", // Volvemos a la versión anterior más estable para cuentas gratuitas
        systemInstruction: SYSTEM_PROMPT
      },
      { apiVersion: "v1beta" }
    );

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(userMessage);
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
