const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  app.get("/api/pokemons", auth, (req, res) => {
    if (req.query.name) {
      const name = req.query.name;
      const limit = Number(req.query.limit) || 5; //On peut aussi utiliser parseInt() au lieu de Number()

      if (name.length < 2) {
        const message = `Le terme de recherche doit contenir au moins 2 caractères.`;
        return res.status(400).json({ message });
      }

      return Pokemon.findAndCountAll({
        where: {
          name: {
            //Name est la propriété du modèle pokémon
            [Op.like]: `%${name}%`, //Name est le critère de la recherche
          },
        },
        order: ["name"],
        limit: limit,
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`;
        res.json({ message, data: rows });
      });
    } else {
      Pokemon.findAll({ order: ["name"] })
        .then((pokemons) => {
          const message = "La liste des pokémons a bien été récupérée.";
          res.json({ message, data: pokemons });
        })
        .catch((error) => {
          const message =
            "La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants.";
          res.status(500).json({ message, data: error });
        });
    }
  });
};
