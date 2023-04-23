const validTypes = [
  "Plante",
  "Poison",
  "Feu",
  "Eau",
  "Insecte",
  "Vol",
  "Normal",
  "Electrik",
  "Fée",
];

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Pokemon",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Le nom est déjà pris.",
        },
        validate: {
          notEmpty: { msg: "Le nom ne peut pas être vide !" },
          notNull: { msg: "Le nom est une propriété requise !" },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres entiers pour les points de vie. 🙄",
          },
          notNull: { msg: "Les points de vie sont une propriété requise. 🤨" },
          max: {
            args: [999],
            msg: "Le Pokémon ne peut pas avoir plus de 999 PDV.",
          },
          min: {
            args: [0],
            msg: "Les points de vie du Pokémon doivent être supérieurs ou égales à 0",
          },
        },
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Utilisez uniquement des nombres entiers pour les dégats. 🙄",
          },
          notNull: { msg: "Les points de vie sont une propriété requise. 🤨" },
          max: {
            args: [99],
            msg: "Le Pokémon ne peut pas avoir plus de 99 Points de dégats.",
          },
          min: {
            args: [0],
            msg: "Les dégats du Pokémon doivent être supérieurs ou égales à 0",
          },
        },
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: { msg: "Utilisez uniquement une URL valide pour l'image!" },
          notNull: { msg: "L'image est une propriété requise." },
        },
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue("types").split(",");
        },
        set(types) {
          this.setDataValue("types", types.join());
        },
        validate: {
          isTypesValid(value) {
            if (!value) {
              throw new Error("Un pokémon doit avoir au moins un type.");
            }
            if (value.split(",").length > 3) {
              throw new Error(
                "Un pokémon ne peut pas avoir plus de trois types."
              );
            }
            value.split(",").forEach((type) => {
              if (!validTypes.includes(type)) {
                throw new Error(
                  `Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes} ‼ Attention à la majuscule sur la première lettre.`
                );
              }
            });
          },
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
};
