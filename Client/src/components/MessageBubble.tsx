import type { Message } from "../types/menu.schema";

interface Props {
    message: Message;
}

export function MessageBubble({ message }: Props) {
    return (
        <div>
            <p>{message.content}</p>
        </div>
    )
}