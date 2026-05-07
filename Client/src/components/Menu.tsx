import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Flame, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Dish {
    id: number;
    name: string;
    description: string;
    price: number;
    imagen_url?: string;
}

export function ShowMenu() {
    const [platos, setPlatos] = useState<Dish[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showAll, setShowAll] = useState<boolean>(false);

    const API_URL = import.meta.env.VITE_API_URL;

    // Cantidad de platos que se muestran al principio
    const limit = 8;

    // Si showAll es true muestra todos, si no muestra solo algunos
    const visiblePlatos = showAll ? platos : platos.slice(0, limit);

    useEffect(() => {
        async function getFullMenu() {
            try {
                setLoading(true);

                const res = await fetch(`${API_URL}/api/chat/menu`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    throw new Error("error al obtener menu");
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

    }, [API_URL]);

    if (loading) {
        return (
            <div className="relative h-[88vh] overflow-hidden border border-white/10 bg-zinc-950/50 shadow-2xl shadow-black backdrop-blur"
>
                <div className="flex items-center gap-3 border border-white/10 bg-black px-6 py-4 text-[#d6c7a1]">
                    <Loader2 className="animate-spin" />
                    <h1 className="text-sm font-bold uppercase tracking-[0.2em]">
                        Loading menu
                    </h1>
                </div>
            </div>
        );
    }

  return (
    <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative h-[88vh] overflow-hidden border border-white/10 bg-zinc-950/50 shadow-2xl shadow-black backdrop-blur"
    >
        <div className="relative flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-white/10 p-4 md:p-5">
                <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d6c7a1] drop-shadow-[0_0_10px_rgba(214,199,161,0.18)]">
                    <Flame size={14} />
                    Night menu
                </p>

                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <h1 className="font-['Playfair_Display_SC'] text-3xl uppercase text-zinc-100 md:text-4xl">
                            fran&apos;s restaurant
                        </h1>

                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                            american food / since 1964
                        </p>
                    </div>

                    <div className="max-w-md border border-white/10 bg-black/60 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#d6c7a1]">
                            Fast menu decisions
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Browse the menu and ask the assistant for a recommendation based on your craving.
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="lux-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {visiblePlatos.map((dish) => (
                        <motion.article
                            key={dish.id}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="group relative h-[320px] overflow-hidden border border-white/10 bg-black transition-colors hover:border-[#d6c7a1]/60"
                        >
                            {/* Detalles metalicos */}
                            <div className="absolute left-0 top-0 h-px w-14 bg-[#d6c7a1]/80" />
                            <div className="absolute left-0 top-0 h-14 w-px bg-[#d6c7a1]/80" />
                            <div className="absolute bottom-0 right-0 h-px w-16 bg-[#d6c7a1]/80" />
                            <div className="absolute bottom-0 right-0 h-16 w-px bg-[#d6c7a1]/80" />

                            {/* Imagen */}
                            <div className="relative h-[48%] overflow-hidden border-b border-white/10">
                                <img
                                    src={dish.imagen_url ?? "/images/general.jpg"}
                                    alt={dish.name}
                                    className="h-full w-full object-cover grayscale-[40%] contrast-125 group-hover:grayscale-0"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                            </div>

                            {/* Contenido */}
                            <div className="flex h-[52%] flex-col justify-between p-3">
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="h-2 w-2 bg-[#d6c7a1]" />
                                        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#d6c7a1]">
                                            Recommended
                                        </p>
                                    </div>

                                    <h2 className="line-clamp-2 text-base font-black uppercase tracking-[0.14em] text-zinc-100">
                                        {dish.name}
                                    </h2>

                                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                                        {dish.description}
                                    </p>
                                </div>

                                <p className="text-right font-mono text-2xl font-black text-[#d6c7a1] drop-shadow-[0_0_10px_rgba(214,199,161,0.18)]">
                                    ${Number(dish.price).toFixed(2)}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Boton para ver mas comida */}
                {platos.length > limit && (
                    <div className="mt-5 flex justify-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center gap-3 border border-[#d6c7a1] bg-black px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#d6c7a1] transition-colors hover:bg-[#d6c7a1] hover:text-black"
                        >
                            {showAll ? "Show less" : "See more food"}
                            {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-5 flex items-center gap-2 border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                        <AlertCircle size={18} />
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    </motion.section>
);

}
