import type { llmDish } from "../types/menu.schema"; 
interface Props {
    messages: Message[];
    currentRecom: llmDish [];
    loading: boolean
};

export function MessageList({messages, currentRecom, loading}: Props) {   
    return (
        <div>

            {/*Renderizar cada msj entre usuario y LLM:*/}
            {messages.map ((msg, index)=>(
                <div key={index}>
                 <p>{msg.content}</p>
                </div>
            ))}


            {/*Renderizar recomendaciones del LLM en base a busqueda en BD:*/}
            {currentRecom.length >0 && (
                <div>
                    <h1>Recomendaciones</h1>
                        {currentRecom.map ((recom)=>(
                            <div key={recom.name}>
                                <p>Platos recomendados:
                                    {recom.name}
                                </p>
                                <p>Precio:{recom.price}</p>
                                <p>Razon: {recom.reason}</p>
                            </div>
                        ))}                   
                </div>
            )}
            
                         {/* Loading */}
                         {loading && <p>Cargando...</p>}
        </div>
    )
}