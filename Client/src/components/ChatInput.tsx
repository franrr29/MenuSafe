import { useState } from "react";
import { validateInput } from "../utils/validators";

interface Props {
    onSubmit: (text: string) => void;
    loading: boolean;
}

export function ChatInput({ onSubmit, loading }: Props) {
    const [input, setInput] = useState("");
    const [inputValido, setInputValido] = useState("");

    function handleSubmit() {
        const errorInput = validateInput(input);
        
        if (errorInput) {
            setInputValido(errorInput);
            return;
        }
        
        onSubmit(input);
        setInput("");
        setInputValido("");
    }

    return (
        <div>
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Contanos que buscas"
            />
            <button onClick={handleSubmit} disabled={loading}>
                Consultar a la IA
            </button>
            
            {inputValido && (
                <p style={{color: "red"}}>{inputValido}</p>
            )}
        </div>
    );
}