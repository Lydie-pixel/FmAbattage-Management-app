const Client = require("../models/ClientModel");
const sequelize = require("../config/database");

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const clients = await Client.findByPk(req.params.id);
    if (clients) {
      res.json(clients);
    } else {
      res.status(404).json({ error: "Client non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } 
  catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({
        error: "Client non trouvé"
      });
    }
    await client.update(req.body);
    res.json(client);
  } 
  catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const deleted = await Client.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!deleted) {
      return res.status(404).json({
        error: "Client non trouvé"
      });
    }
    res.json({
      message: "Client supprimé"
    });
  } 
  catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};