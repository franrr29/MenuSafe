import { MessageBubble } from './MessageBubble';
import type { Message } from "../types/menu.schema";


interface Props {
    messages: Message[];
    loading: boolean;
}

export function ChatHistory({ messages, loading }: Props) {
   
    return (
    <div>
        {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
        ))}

        {loading && <p>Cargando...</p>}
    </div>
    
)
}