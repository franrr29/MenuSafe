import { queryDataBase, getRecommendationService } from "../services/chat.service";
import { Request, Response } from "express";
import { userMenuRestrictionSchema } from "../schema/menu.schema";
import type { llmAnswer } from "../schema/menu.schema";


export async function getMenu(req: Request, res: Response) {
    try {
        const menu= await queryDataBase();
        res.json (menu)
    } catch (error){
        res.status(500).json ({error: "Error al tratar de traer el menu completo de la base de datos"})
    }
}


//Funcion que trae recomendaciones en base a restricciones para el usuario:

export async function getRecommendation(req: Request, res: Response): Promise<void> {

    try {
        const dataFront= userMenuRestrictionSchema.safeParse(req.body);
        if (!dataFront.success){
            res.status (400).json({
                error: "Datos invalidos",
                detalles:dataFront.error.format()
            });
            return
        }
        const { restrictions, messages, sessionID, recommendations}= dataFront.data;

        //Llamo a la funcion getRecommendationService () de chat.service.ts
        const resultadoLlm= await getRecommendationService (
            restrictions, messages, sessionID, recommendations
        )
        res.json (resultadoLlm)

    } catch (error){
        console.error(error);
        res.status(500).json({
        error: "Error al procesar recomendaciones"
    })
    }
}