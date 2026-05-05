import type { llmDish } from "../types/menu.schema"; 

interface Props {
    recommendation: llmDish
}

export function RecomCard ({recommendation}: Props){
    return (
        <div>
            <p>Name: {recommendation.name}</p>
            <p>Price: {recommendation.price}</p>
            <p>Reason: {recommendation.reason}</p>
        </div>
    )
}