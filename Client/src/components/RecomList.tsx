import type { llmDish } from "../types/menu.schema";
import { RecomCard } from "./RecomCard";

interface Props {
    recommendations: llmDish[]
}

export function RecomList({ recommendations }: Props) {
    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="mt-5 border-t border-[#8f6b4a]/20 pt-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[#b08a63]">
                    Selected plates
                </p>

                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7f756b]">
                    {recommendations.length} matches
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {recommendations.map((recom) => (
                    <RecomCard key={recom.id} recommendation={recom} />
                ))}
            </div>
        </div>
    );
}
