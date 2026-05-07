import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../types/menu.schema";

interface Props {
    messages: Message[];
    loading: boolean;
}

export function ChatHistory({ messages, loading }: Props) {
    return (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 && (
                <div className="rounded-3xl border border-amber-100/10 bg-stone-900/50 p-5 text-sm leading-6 text-stone-300">
                    Try writing something like: "I want a burger, but something light".
                </div>
            )}

            {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
            ))}

            {loading && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-amber-200"
                >
                    <Loader2 size={17} className="animate-spin" />
                    Loading recommendation..
                </motion.div>
            )}
        </div>
    );
}
