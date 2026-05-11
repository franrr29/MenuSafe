import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ChatInput } from "./ChatInput";
import { ChatHistory } from "./ChatHistory";
import { RecomList } from "./RecomList";
import { useChatSession } from "../hooks/useChatSession";
import { useChatAPI } from "../hooks/useChatApi";

export function UserChat() {
    const { sessionID, messages, setMessages, currentRecom, setCurrentRecom } = useChatSession();
    const { sendMessage, loading, error } = useChatAPI();

    async function handleSubmit(userText: string) {
        setMessages([...messages, { role: "user", content: userText }]);

        const result = await sendMessage(userText, messages, sessionID);

        if (result) {
            setCurrentRecom(result.recommendations);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: result.generalAdvice
            }]);
        }
    }
    
    return (
    <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative flex flex-col overflow-hidden border border-[#8f6b4a]/25 bg-[#080606]/80 p-5 shadow-2xl shadow-black/60 backdrop-blur-2xl md:p-6 ${
        currentRecom.length > 0 ? "min-h-[88vh]" : "h-[44vh] min-h-[420px]"}`}
    >
        {/* Fondo */}
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 bg-[#4b1018]/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 bg-[#8f6b4a]/10 blur-3xl" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            {/* Header */}
            <div className="mb-5 border-b border-[#8f6b4a]/20 pb-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[#b08a63]">
                        MenuSafe × AI
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <h1 className="font-['Playfair_Display_SC'] text-4xl leading-none text-[#eee6dc] md:text-5xl">
                            Smart Selection
                        </h1>

                        <p className="mt-3 max-w-md text-sm leading-6 text-[#a89d91]">
                            Type what you want and let AI find your next favorite dish.
                        </p>
                    </div>
                </div>
            </div>

            <ChatHistory messages={messages} loading={loading} />
            <ChatInput onSubmit={handleSubmit} loading={loading} />
            <RecomList recommendations={currentRecom} />

            {error && (
                <div className="mt-4 flex items-center gap-2 border border-red-400/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}
        </div>
    </motion.section>
);

}
