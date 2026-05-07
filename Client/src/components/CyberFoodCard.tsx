import { motion } from "framer-motion";

interface Props {
    name: string;
    description: string;
    price: number;
    image?: string;
    label?: string;
}

export function CyberFoodCard({ name, description, price, image, label = "RECOMMENDED" }: Props) {
    return (
        <motion.article
            whileHover={{ y: -6 }}
            transition={{ duration: 0.18 }}
            className="group relative h-[420px] overflow-hidden border border-white/10 bg-[#050505]/90 shadow-2xl shadow-black transition-colors hover:border-[#d6c7a1]/60"
        >
            {/* Metal border details */}
            <div className="absolute left-0 top-0 h-px w-20 bg-[#d6c7a1]/80" />
            <div className="absolute left-0 top-0 h-20 w-px bg-[#d6c7a1]/80" />
            <div className="absolute bottom-0 right-0 h-px w-24 bg-[#d6c7a1]/80" />
            <div className="absolute bottom-0 right-0 h-24 w-px bg-[#d6c7a1]/80" />

            {/* Image */}
            <div className="relative h-[52%] overflow-hidden border-b border-white/10">
                <img
                    src={image ?? "/images/general.jpg"}
                    alt={name}
                    className="h-full w-full object-cover grayscale-[45%] contrast-125 group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-[48%] flex-col p-4">
                <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 bg-[#d6c7a1]" />
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#d6c7a1]">
                            {label}
                        </p>
                    </div>

                    <h3 className="text-xl font-black uppercase leading-6 tracking-[0.12em] text-zinc-100">
                        {name}
                    </h3>

                    
                </div>

                <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                        A.I chef pick
                    </p>

                    <p className="font-mono text-2xl font-black text-[#d6c7a1] drop-shadow-[0_0_10px_rgba(214,199,161,0.18)]">
                        ${Number(price).toFixed(2)}
                    </p>
                </div>
            </div>
        </motion.article>
    );
}
