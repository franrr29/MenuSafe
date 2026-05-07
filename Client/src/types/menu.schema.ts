import { z } from "zod";

//Esquema del input del usuario enviando su consulta al LLM y respuesta del LLM:

export const llmDishSchema= z.object ({
    id: z.number().int().positive(),
    name: z.string ().max(100),
    price: z.number ().positive(),
    reason: z.string ().min(25).max(300),
    imagen_url: z.string().optional()
});

export const userMenuRestrictionSchema = z.object({
    restrictions: z.string().trim().toLowerCase().max(250),
    recommendations: z.array(llmDishSchema).optional(),
    messages: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string()
    })),
    sessionID: z.string()
});


export const llmAnswerSchema= z.object ({
    recommendations: z.array (llmDishSchema).min (0).max(5),
    generalAdvice: z.string().min(120).max (500).optional(),
    

});


export const messageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
});

//Exportar typos:
export type userMenuRestriction= z.infer <typeof userMenuRestrictionSchema>;
export type llmAnswer= z.infer <typeof llmAnswerSchema >;
export type Message = z.infer<typeof messageSchema>;
export type llmDish= z.infer <typeof llmDishSchema>;