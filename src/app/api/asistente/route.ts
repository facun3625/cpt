import { NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL } from "@/lib/groq";
import { buildAssistantContext } from "@/lib/assistant-context";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const client = getGroqClient();
  if (!client) {
    return NextResponse.json(
      { error: "El asistente todavía no está configurado. Probá de nuevo más tarde." },
      { status: 503 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "Falta el mensaje." }, { status: 400 });
  }

  const context = await buildAssistantContext();

  const systemPrompt = `Sos el asistente virtual del sitio del Colegio Profesional de Maestros Mayores de Obras y Técnicos de Santa Fe (CPT Santa Fe). Respondé en español, de forma breve y clara, usando ÚNICAMENTE la información institucional provista abajo. Si no sabés la respuesta con esa información, decilo honestamente y sugerí contactar a la secretaría o visitar la página correspondiente del sitio. No inventes datos, montos ni fechas que no figuren en el contexto. No tenés acceso a datos personales de matriculados (estado de cuenta, deudas, etc.) — si preguntan por eso, derivalos a Acceso Gesto o a la secretaría.

Cuando menciones una página del sitio, usá SIEMPRE la ruta relativa tal cual figura abajo (por ejemplo "/matriculacion/requisitos"), nunca inventes un dominio ni antepongas "https://" ni ningún nombre de sitio.

INFORMACIÓN INSTITUCIONAL:
${context}`;

  try {
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.3,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content ?? "No pude generar una respuesta.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Groq error:", err);
    return NextResponse.json({ error: "Ocurrió un error al consultar el asistente." }, { status: 500 });
  }
}
