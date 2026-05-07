import { useState } from "react";
import { SendHorizonal } from "lucide-react";
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
    <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex gap-2 rounded-3xl border border-white/10 bg-zinc-950/70 p-2 shadow-inner shadow-black/30">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell us what you are looking for"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#d6c7a1] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#eadfbd] disabled:cursor-not-allowed disabled:opacity-60"
            >
                <SendHorizonal size={17} />
                Ask
            </button>
        </div>

        {inputValido && (
            <p className="mt-2 px-2 text-sm text-red-300">{inputValido}</p>
        )}
    </div>
);
}
