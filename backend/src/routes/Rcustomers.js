import express from "express";
import customersController from "../controllers/Ccustomers.js";
// Router() nos ayuda a colocar los metodos
// que tendra mi ruta
const router = express.Router();

router
  .route("/")
  .get(customersController.getCustomers)
  .post(customersController.createCustomers);

router
  .route("/:id")
  .put(customersController.updateCustomer)
  .delete(customersController.deletedCustomers);

export default router;