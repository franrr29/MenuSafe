import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, llmDish } from "../types/menu.schema";

export function useChatSession() {
    const [sessionID, setSessionID] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentRecom, setCurrentRecom] = useState<llmDish[]>([]);

    // Guardar en localStorage
    useEffect(() => {
        localStorage.setItem("chatSession", JSON.stringify({
            messages, currentRecom, sessionID
        }));
    }, [messages, currentRecom, sessionID]);

    // Recuperar de localStorage
    useEffect(() => {
        const savedSession = localStorage.getItem("chatSession");
        if (savedSession) {
            const { messages, currentRecom, sessionID } = JSON.parse(savedSession);

            if (messages?.length > 0) {
                setMessages(messages);
                setCurrentRecom(currentRecom);
                setSessionID(sessionID);
            }
        }
    }, []);

    // Sincronización entre tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "chatSession") {
                const nuevaSession = JSON.parse(event.newValue || "{}");
                setMessages(nuevaSession.messages || []);
                setCurrentRecom(nuevaSession.currentRecom || []);
                setSessionID(nuevaSession.sessionID || "");
            }
        };

        window.addEventListener("storage", handleStorageChange);
        
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Generar sessionID
    useEffect(() => {
        if (!sessionID) setSessionID(uuidv4());
    }, [sessionID]);

    return { sessionID, messages, setMessages, currentRecom, setCurrentRecom };
}