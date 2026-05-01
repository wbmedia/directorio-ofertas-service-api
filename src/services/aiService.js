import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generarDescripcion(titulo, precio) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const precioTexto = precio ? ` con precio ${precio}` : "";
  const prompt = `Genera una descripción atractiva y breve para una oferta llamada "${titulo}"${precioTexto}.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generarOfertaDesdeImagen(buffer) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Eres un agente experto en crear ofertas atractivas para vendedores informales.
Analiza la imagen y genera:

1. Título atractivo (máximo 6 palabras)
2. Descripción breve (1–3 frases)
3. Categoría sugerida
4. Precio sugerido en MXN (basado en mercado mexicano)
5. Palabras clave relevantes

Responde en JSON válido.
`;

  const imagePart = {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType: "image/jpeg",
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const text = result.response.text();

  return JSON.parse(text);
}