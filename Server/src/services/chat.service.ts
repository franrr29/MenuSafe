import { baseDatos } from "../data/connection";
import { llmAnswerSchema } from "../schema/menu.schema";
import type { Message, llmDish, llmAnswer } from "../schema/menu.schema";
import { franc } from "franc"; //Para que el LLM detecte el idioma de forma automatica
import "dotenv/config";
import OpenAI from "openai";


//Crear conexion con el LLM:
const cliente= new OpenAI ({
    apiKey: process.env.GPT_GROK_API_KEY,
    baseURL: "https://api.groq.com/openai/v1" 
})



export async function queryDataBase() {
    try {
        const [rows]= await baseDatos.query ("SELECT * FROM menus") as any []; //as any le dice a TS que confie que es un array[]
    
    if (rows.length ===0){
        throw new Error ("Error al traer los productos de la base de datos")
    }

    return rows;

    } catch (error){
        throw error //Relanzo el error al controller
    }
};


//Llamar al LLM y que venga con recomendaciones:
//Promise <llmAnswer> lo que espero de la IA.

 export async function getRecommendationService(restrictions: string, messages: Message [],sessionId: string, recommendations?: llmDish[]): Promise <llmAnswer> {

    try {
        const [rows]= await baseDatos.query ("SELECT * FROM menus") as any []
        if (rows.length ===0){
            throw new Error ("Error al traer los platos de la base de datos");
        }

            //Logica para que el LLM detecte el idioma que se le habla en el CHAT de comidas:

            const lastMessage = messages[messages.length - 1]?.content || restrictions;
            const langCode = franc(lastMessage || restrictions);

            const detectedLanguage =
            langCode === "eng"
                ? "English"
                : langCode === "spa"
                ? "Spanish"
                : langCode === "por"
                ? "Portuguese"
                : "English";

                const llMesagges: any[] = [
         {
           role: "system" as const,
           content: `
         Eres un experto en nutrición y gastronomía especializado en restricciones dietarias.
         
         Tu tarea es generar recomendaciones de platos basadas estrictamente en las necesidades del usuario.

         MENÚ DISPONIBLE DEL RESTAURANTE:
         ${JSON.stringify(rows)}
         IMPORTANTE: Solo puedes recomendar platos que existan en ese menú.
         
         IDIOMA OBLIGATORIO:
         - Debes responder EXCLUSIVAMENTE en ${detectedLanguage}.
         - Todo el contenido del JSON debe estar en ${detectedLanguage}.
         - Está prohibido mezclar idiomas.
         - Si el usuario escribe en inglés, jamás respondas en español.
         
         REGLAS CRÍTICAS DE SALIDA:
         1. Responde EXCLUSIVAMENTE con un objeto JSON válido.
         2. NO incluyas texto fuera del JSON bajo ninguna circunstancia.
         3. NO uses markdown, ni backticks, ni explicaciones.
         4. El JSON debe ser perfectamente parseable (sin trailing commas, sin errores de sintaxis).
         5. Los precios deben ser números (float), no strings.
         6. El campo "reason" DEBE tener MÁXIMO 300 caracteres (explicar brevemente por qué el plato cumple con la restricción).
         7. El campo "reason" debe tener al menos 25 caracteres.
         8. El campo "generalAdvice" DEBE tener entre 120 y 300 caracteres (consejo breve sobre la elección).
         9. Genera entre 4 y 5 recomendaciones.
         
         VALIDACIÓN DE CONTEXTO:
         - Si la consulta del usuario no está relacionada con nutrición o recomendaciones de comida, responde igualmente con un JSON válido, pero:
           - "recommendations": []
           - "generalAdvice": explica brevemente que la consulta está fuera del alcance dietario.
         
         ESTRUCTURA OBLIGATORIA DEL JSON:
         {
           "recommendations": [
             {
               "id": number,
               "name": string,
               "price": number,
               "reason": string (máximo 300 caracteres)
             }
           ],
           "generalAdvice": string (máximo 300 caracteres)
         }
         `
         },
         ...messages,
         {
         role: "user" as const,
         content: `
         Generate 3 to 5 dish recommendations based on the user's restrictions: ${restrictions}.
        
         LANGUAGE: Respond EXCLUSIVELY in ${detectedLanguage}. Never mix languages.
        
         RULES:
         - Only recommend dishes that exist in the provided menu.
         - Each "reason" must have between 25 and 300 characters.
         - "generalAdvice" must have between 120 and 300 characters.
         - The "id" field must exactly match the dish id from the menu.
         - Prices must be numbers (float), not strings.
         - Never break the JSON format under any circumstance.
        
         IF THE USER ASKS FOR SOMETHING NOT IN THE MENU OR UNRELATED TO FOOD:
         - Return "recommendations": []
         - "generalAdvice" must explain this in ${detectedLanguage}, minimum 120 characters, maximum 500 characters.
        
         REQUIRED JSON STRUCTURE:
         {
             "recommendations": [
                 {
                     "id": number,
                     "name": string,
                     "price": number,
                     "reason": string
                 }
             ],
             "generalAdvice": string
         }
                 `
             }
         ];
    
    const response= await cliente.chat.completions.create ({
        model: "llama-3.3-70b-versatile",
        messages: llMesagges,
        response_format: {type: "json_object"} //Activo JSON mode 
    });
    
    const content= response.choices[0].message.content;

    if (!content){
        throw new Error ("Respuesta vacia")
    }
    

    //VALIDAR TODOS LOS DATOS QUE TRAE EL LLM:
    let data;

    try {
        data=JSON.parse (content)
    } catch (jsonError){
        throw new Error ("El LLM devolvio JSON invalido")
    }   

    try {
        
        const validateData= llmAnswerSchema.parse (data)

         const ids = validateData.recommendations.map(dish => dish.id);

         if (ids.length === 0) {
            return {
                recommendations: [],
                generalAdvice: validateData.generalAdvice
            };
        }

         const [images] = await baseDatos.query(
        "SELECT id, imagen_url FROM menus WHERE id IN (?)",
        [ids]
    ) as any[];

        const enriched = validateData.recommendations.map(dish => {
        const found = images.find((img: any) => img.id === dish.id);

        return {
            ...dish,
            imagen_url: found?.imagen_url ?? 'http://localhost:5173/images/general.jpg'
        };
    });

    return {
        recommendations: enriched,
        generalAdvice: validateData.generalAdvice
    };

    } catch (schemaError){
         console.error("Schema error:", schemaError)
         throw new Error ("La respuesta del LLM no cumple con la estructura del schema esperado")
    }

    } catch (error){
        console.error (error)
        throw error
    }

}