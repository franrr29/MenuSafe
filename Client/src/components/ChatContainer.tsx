import { ChatInput } from './ChatInput';
import { ChatHistory } from './ChatHistory';
import { RecomList } from './RecomList';
import { useChatSession } from '../hooks/useChatSession';
import { useChatAPI } from '../hooks/useChatAPI';
import type { Message } from "../types/menu.schema";

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
        <>
            <ChatInput onSubmit={handleSubmit} loading={loading} />
            <ChatHistory messages={messages} loading={loading} />
            <RecomList recommendations={currentRecom} />
            {error && <div style={{color: "red"}}>{error}</div>}
        </>
    );
}