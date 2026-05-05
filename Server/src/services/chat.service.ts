import { baseDatos } from "../data/connection";
import { llmAnswerSchema } from "../schema/menu.schema";
import type { Message, llmDish, llmAnswer } from "../schema/menu.schema";
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

                const llMesagges: any[] = [
         {
           role: "system" as const,
           content: `
         Eres un experto en nutrición y gastronomía especializado en restricciones dietarias.
         
         Tu tarea es generar recomendaciones de platos basadas estrictamente en las necesidades del usuario.
         
         IDIOMA:
         - Debes responder SIEMPRE en el mismo idioma en el que el usuario escribe (por ejemplo: español, inglés o portugués).
         - Todo el contenido dentro del JSON (name, reason, generalAdvice) debe estar en ese idioma.
         
         REGLAS CRÍTICAS DE SALIDA:
         1. Responde EXCLUSIVAMENTE con un objeto JSON válido.
         2. NO incluyas texto fuera del JSON bajo ninguna circunstancia.
         3. NO uses markdown, ni backticks, ni explicaciones.
         4. El JSON debe ser perfectamente parseable (sin trailing commas, sin errores de sintaxis).
         5. Los precios deben ser números (float), no strings.
         6. El campo "reason" DEBE tener MÁXIMO 300 caracteres (explicar brevemente por qué el plato cumple con la restricción).
         7. El campo "reason" debe tener al menos 25 caracteres.
         8. El campo "generalAdvice" DEBE tener entre 120 y 300 caracteres (consejo breve sobre la elección).
         9. Genera entre 3 y 5 recomendaciones.
         
         VALIDACIÓN DE CONTEXTO:
         - Si la consulta del usuario no está relacionada con nutrición o recomendaciones de comida, responde igualmente con un JSON válido, pero:
           - "recommendations": []
           - "generalAdvice": explica brevemente que la consulta está fuera del alcance dietario.
         
         ESTRUCTURA OBLIGATORIA DEL JSON:
         {
           "recommendations": [
             {
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
         Genera de 3 a 5 recomendaciones para un usuario con estas restricciones: ${restrictions}.
         
         IMPORTANTE:
         - Cada "reason" debe tener MÁXIMO 300 caracteres (sé conciso).
         - "generalAdvice" debe tener MÁXIMO 300 caracteres (sé conciso).
         - Cumple estrictamente el formato JSON requerido.
         - Mantener coherencia con el historial de conversación si aplica.
         - No romper el formato bajo ninguna circunstancia.
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
        return validateData;
    } catch (schemaError){
        throw new Error ("La respuesta del LLM no cumple con la estructura del schema esperado")
    }

    } catch (error){
        console.error (error)
        throw error
    }

}


