//Array de metodos (C R U D)
const gamesController = {};
import gamesModel from "../models/Games.js";

// SELECT
gamesController.getGames = async (req, res) => {
  const games = await gamesModel.find();
  res.json(games);
};

// INSERT
gamesController.createGames = async (req, res) => {
  const { name, category, maximunBet, minimunBet } = req.body;
  const newGames = new gamesModel({ name, category, maximunBet, minimunBet});
  await newGames.save();
  res.json({ message: "game save" });
};

// DELETE
gamesController.deleteGames = async (req, res) => {
const deletedGames = await gamesModel.findByIdAndDelete(req.params.id);
  if (!deletedGames) {
    return res.status(404).json({ message: "games dont find" });
  }
  res.json({ message: "games deleted" });
};

// UPDATE
gamesController.updateGames = async (req, res) => {
  // Solicito todos los valores
  const { name, category, maximunBet, minimunBet } = req.body;
  // Actualizo
  await gamesModel.findByIdAndUpdate(
    req.params.id,
    {
        name, 
        category, 
        maximunBet, 
        minimunBet
    },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "games update" });
};

export default gamesController;

 