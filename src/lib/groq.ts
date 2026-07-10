import "server-only";
import Groq from "groq-sdk";

export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
}
