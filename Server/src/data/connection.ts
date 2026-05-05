import mysql from "mysql2/promise";
import "dotenv/config";

//Conexion a la base de datos:
export const baseDatos= mysql.createPool ({
    password: process.env.BASEDATOS_KEY,
    host:"localhost",
    user: "root",
    database: process.env.DATA_BASE_MENU,
    
})

export async function testDataBaseConnection() {
    let connection;
    try {
        connection= await baseDatos.getConnection ()
    
    } catch (errorConnection){
        console.error ("Error al tratar de testear la conexion a la base de datos", errorConnection)
    }
     finally {
        connection?.release () //Para limpiar consulta en basedatos y no ocupar espacio innecesario
    }
}


