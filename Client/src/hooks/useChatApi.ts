import { useState } from 'react';
import { llmAnswerSchema } from "../types/menu.schema";
import type { Message, llmDish } from "../types/menu.schema";

export function useChatAPI() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const API_URL: string = import.meta.env.VITE_API_URL || "";

    async function sendMessage(
        userText: string,
        messages: Message[],
        sessionID: string
    ): Promise<{ recommendations: llmDish[], generalAdvice: string } | null> {
        
        if (!userText) {
            return null;
        }

        setLoading(true);
        setError(""); 

        try {
            const res = await fetch(`${API_URL}/api/chat/recommendations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    restrictions: userText,
                    messages: messages,
                    sessionID: sessionID
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error del servidor");
            }

            const validarData = llmAnswerSchema.parse(data);

            return {
                recommendations: validarData.recommendations,
                // Usamos coalescencia nula para asegurar que siempre sea string
                generalAdvice: validarData.generalAdvice ?? ""
            };

        } catch (err: any) {
            setError(err.message || "Error desconocido");
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { sendMessage, loading, error };
}