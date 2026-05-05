import { useEffect, useState } from "react";

interface Dish {
    id: number,
    name: string,
    description: string,
    price: number
}

export function ShowMenu() {
    const [platos, setPlatos] = useState<Dish[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function getFullMenu() {
            try {
                setLoading(true);

                const res = await fetch(`${API_URL}/api/chat/menu`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!res.ok) {
                    throw new Error("Error del servidor al tratar de traer platos");
                }

                const data = await res.json();
                setPlatos(data);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getFullMenu();
    }, []);

    return (
        <div>
            <header>
                <h1>Menú</h1>
            </header>

            {loading && (
                <div>
                    <p>Cargando carta...</p>
                </div>
            )}

            {error && (
                <div>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div>
                    {platos.map((dish) => (
                        <div key={dish.id}>
                            <h2>{dish.name}</h2>
                            <p>{dish.description}</p>
                            <span>$ {dish.price}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}