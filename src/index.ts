import express from "express";
import cors from "cors";
import { testDataBaseConnection } from "./data/connection";
import chatRouter from "./routes/chat.routes";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://menusafe.online"
  ]
}));

app.use("/api/chat", chatRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, async () => {
  try {
    console.log(`Servidor corriendo en puerto ${PORT}`);

    await testDataBaseConnection();

  } catch (error) {
    console.error("No se pudo conectar a la base de datos");
    process.exit(1);
  }
});