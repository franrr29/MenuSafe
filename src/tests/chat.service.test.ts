import { expect, it, vi, describe, beforeEach } from "vitest"
import { getRecommendationService } from "../services/chat.service"

// Mock DB
vi.mock("../data/connection", () => ({
    baseDatos: {
        query: vi.fn().mockResolvedValue([[
            { id: 1, name: "Burger", price: 10, imagen_url: "/burger.jpg" },
            { id: 2, name: "Pizza", price: 12, imagen_url: "/pizza.jpg" }
        ]])
    }
}));

// Mock OpenAI
vi.mock("openai", () => {
    const mockCreate = vi.fn().mockResolvedValue({
        choices: [{
            message: {
                content: JSON.stringify({
                    recommendations: [],
                    generalAdvice: "We currently do not have that dish available in our menu. Please consider exploring our available options which include burgers and pizzas that might suit your taste."
                })
            }
        }]
    });

    return {
        default: class {
            chat = { completions: { create: mockCreate } }
        }
    };
});

describe("getRecommendationService", () => {

    it("retorna array vacío con generalAdvice cuando el plato no existe", async () => {
        const resultado = await getRecommendationService("pavo", [], "session-1");
        expect(resultado.recommendations).toHaveLength(0);
        expect(resultado.generalAdvice).toBeDefined();
    });

    it("lanza error cuando la DB no responde", async () => {
        const { baseDatos } = await import("../data/connection");
        vi.mocked(baseDatos.query).mockRejectedValueOnce(new Error("DB connection failed"));

        await expect(
            getRecommendationService("burger", [], "session-1")
        ).rejects.toThrow();
    });

    it("lanza error cuando el LLM devuelve JSON inválido", async () => {
        const openai = await import("openai");
        const instance = new (openai.default as any)();
        vi.spyOn(instance.chat.completions, "create").mockResolvedValueOnce({
            choices: [{ message: { content: "esto no es json {{{" } }]
        });

        await expect(
            getRecommendationService("burger", [], "session-1")
        ).rejects.toThrow();
    });

    it("retorna recomendaciones válidas cuando el plato existe", async () => {
        const { baseDatos } = await import("../data/connection");
        vi.mocked(baseDatos.query).mockResolvedValueOnce([[
            { id: 1, name: "Burger", price: 10, imagen_url: "/burger.jpg" }
        ]]);

        const resultado = await getRecommendationService("burger", [], "session-1");
        expect(resultado.recommendations).toBeDefined();
        expect(resultado.generalAdvice).toBeDefined();
    });
});