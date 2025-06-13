// Importo todo lo de la libreria de Express
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import gamesRoutes from "./src/routes/Rgames.js";
import customersRoutes from "./src/routes/Rcustomers.js";

// Creo una constante que es igual a la libreria que importé
const app = express();

app.use(cookieParser())  

// Configuración de CORS
app.use(
    cors({
      origin: "https://remedial-casino-eight.vercel.app",
      // Permitir envío de cookies y credenciales
      credentials: true
    })
  );


//Que acepte datos en json
app.use(express.json());

// Definir las rutas de las funciones que tendrá la página web
app.use("/api/games", gamesRoutes);
app.use("/api/customers", customersRoutes);

// Exporto la constante para poder usar express en otros archivos
export default app;