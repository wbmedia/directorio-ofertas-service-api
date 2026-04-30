import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generarDescripcion(titulo, precio) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const precioTexto = precio ? ` con precio ${precio}` : "";
  const prompt = `Genera una descripción atractiva y breve para una oferta llamada "${titulo}"${precioTexto}.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
