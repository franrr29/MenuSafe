import { motion } from "framer-motion";
import { User, BotMessageSquare } from "lucide-react";
import type { Message } from "../types/menu.schema";

interface Props {
    message: Message;
}

export function MessageBubble({ message }: Props) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`flex items-end gap-3 mb-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* avatar circular */}
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-lg ${
                isUser 
                    ? "border-[#d6c7a1]/50 bg-[#d6c7a1] text-black" 
                    : "border-white/10 bg-[#1a1a1a] text-[#d6c7a1]"
            }`}>
                {isUser ? <User size={20} strokeWidth={1.5} /> : <BotMessageSquare size={20} strokeWidth={1.5} />}
            </div>

            {/* globo de texto redondeado */}
            <div
                className={`relative max-w-[75%] px-5 py-3.5 text-sm leading-6 shadow-xl shadow-black/40 ${
                    isUser
                        ? "rounded-t-[20px] rounded-bl-[20px] bg-[#d6c7a1] text-black"
                        : "rounded-t-[20px] rounded-br-[20px] border border-white/10 bg-[#111111]/90 text-stone-200 backdrop-blur-sm"
                }`}
            >
                {/* metadatos monoespaciados */}
                <p className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] opacity-60">
                    {isUser ? "Cliente" : "Asistente AI"}
                </p>

                {/* cuerpo del mensaje */}
                <div className="text-[13px] tracking-tight">
                    {message.content}
                </div>
            </div>
        </motion.div>
    );
}