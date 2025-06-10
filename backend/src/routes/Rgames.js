import express from "express";
import gamesController from "../controllers/Cgames.js";
// Router() nos ayuda a colocar los metodos
// que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(gamesController.getGames)
  .post(gamesController.createGames);

router
  .route("/:id")
  .put(gamesController.updateGames)
  .delete(gamesController.deleteGames);

export default router;