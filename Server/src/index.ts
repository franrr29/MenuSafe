import express from "express";
import cors from "cors";
import { testDataBaseConnection } from "./data/connection";
import chatRouter from "./routes/chat.routes"

const app= express ();
const PORT= 3000;

app.use(express.json());
app.use(cors());

// DEBUG
app.use((req, res, next) => {
    next();
});

app.use("/api/chat", chatRouter);

app.get("/api/health", (req, res)=>{
    res.json({ok:true})
})

app.listen(PORT, async ()=>{
   try { 
     console.log(`Servidor corriendo en puerto ${PORT}`);
    testDataBaseConnection();
   } catch (error){
    console.error ("No se pudo conectar a la base de datos, apagando el servidor..")
    process.exit (1); //Apaga el proceso de node y termina en error
   }
})