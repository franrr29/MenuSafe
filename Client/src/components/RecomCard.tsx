import type { llmDish } from "../types/menu.schema"; 

interface Props {
    recommendation: llmDish
}

export function RecomCard ({recommendation}: Props){
    return (
        <div>
             <img 
                src={recommendation.imagen_url ?? '/images/general.jpg'} 
                alt={recommendation.name}
            />
            <p>Name: {recommendation.name}</p>
            <p>Price: {recommendation.price}</p>
            <p>Reason: {recommendation.reason}</p>
            <img  src={recommendation.imagen_url ?? '/images/general.jpg'}
            alt={recommendation.name}/>
        </div>
    )
}