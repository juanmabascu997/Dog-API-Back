const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('dog', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    weight: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    life_span: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    createdByDB: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
};


// [ ] Raza con las siguientes propiedades:
// ID *
// Nombre *
// Altura *
// Peso *
// Años de vida
// [ ] Temperamento con las siguientes propiedades:
// ID
// Nombre