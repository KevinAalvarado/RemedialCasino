//Array de metodos (C R U D)
const customersController = {};
import customerModel from "../models/Customers.js";

// SELECT
customersController.getCustomers = async (req, res) => {
  const customers = await customerModel.find();
  res.json(customers);
};

// INSERT
customersController.createCustomers = async (req, res) => {
  const { fullName, email, password, age, country } = req.body;
  const newCustomers = new customerModel({ fullName, email, password, age, country});
  await newCustomers.save();
  res.json({ message: "customers save" });
};

// DELETE
customersController.deletedCustomers = async (req, res) => {
const deletedCustomers = await customerModel.findByIdAndDelete(req.params.id);
  if (!deletedCustomers) {
    return res.status(404).json({ message: "customer dont find" });
  }
  res.json({ message: "customer deleted" });
};

// UPDATE
customersController.updateCustomer = async (req, res) => {
  // Solicito todos los valores
  const { fullName, email, password, age, country } = req.body;
  // Actualizo
  await customerModel.findByIdAndUpdate(
    req.params.id,
    {
        fullName,
        email, 
        password, 
        age, 
        country
    },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "customer update" });
};

export default customersController;