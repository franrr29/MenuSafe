import type { llmDish } from "../types/menu.schema"; 
import { RecomCard } from "./RecomCard";

interface Props {
    recommendations: llmDish []
}

export function RecomList ({recommendations}: Props){
    if (recommendations.length ===0){
        return null;
    }

    return (
        <div>
            {recommendations.map ((recom)=> (
                <RecomCard key={recom.name} recommendation={recom} />
            ))}
        </div>
    )
}