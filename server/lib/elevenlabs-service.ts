import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export interface AudioGenerationOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
}

export async function generateNewsAudio(options: AudioGenerationOptions): Promise<Buffer> {
  const {
    text,
    voiceId = "21m00Tcm4TlvDq8ikWAM", // Rachel - Professional news anchor voice
    modelId = "eleven_multilingual_v2",
  } = options;

  try {
    const audio = await elevenlabs.generate({
      voice: voiceId,
      text: text,
      model_id: modelId,
    });

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    console.error("ElevenLabs audio generation error:", error);
    throw new Error("Failed to generate audio");
  }
}

export async function generatePodcastStyleAudio(
  title: string,
  summary: string,
  content: string
): Promise<Buffer> {
  // Create podcast-style script
  const script = `
    ${title}.
    
    ${summary}
    
    ${stripHtmlTags(content)}
  `.trim();

  return generateNewsAudio({
    text: script,
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Professional Spanish news voice
  });
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const AVAILABLE_VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel - Profesional News", language: "es" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi - Energética", language: "es" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella - Cálida", language: "es" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni - Autoritativa", language: "es" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli - Versátil", language: "es" },
];
