import type { llmDish } from "../types/menu.schema";
import { CyberFoodCard } from "./CyberFoodCard";

interface Props {
    recommendation: llmDish
}

export function RecomCard({ recommendation }: Props) {
    return (
        <CyberFoodCard
            name={recommendation.name}
            description={recommendation.reason}
            price={recommendation.price}
            image={recommendation.imagen_url}
        />
    );
}
