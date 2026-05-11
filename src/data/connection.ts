import mysql from "mysql2/promise";
import "dotenv/config";

// Conexion a la base de datos
export const baseDatos = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testDataBaseConnection() {
  let connection;

  try {
    connection = await baseDatos.getConnection();

    console.log("Base de datos conectada correctamente");

  } catch (errorConnection) {

    console.error(
      "Error al tratar de conectar la base de datos",
      errorConnection
    );

  } finally {
    connection?.release();
  }
}